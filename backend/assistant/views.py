import json

from django.http import JsonResponse, StreamingHttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import Conversation, ChatMessage
from .serializers import ChatInputSerializer
from .services import ContextBuilder, AIService


class ChatStreamView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChatInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        prompt = serializer.validated_data["prompt"]
        conversation_id = serializer.validated_data.get("conversation_id")

        if conversation_id:
            try:
                conversation = Conversation.objects.get(
                    id=conversation_id, user=request.user
                )
            except Conversation.DoesNotExist:
                conversation = Conversation.objects.create(
                    user=request.user, title=prompt[:100]
                )
        else:
            conversation = Conversation.objects.create(
                user=request.user, title=prompt[:100]
            )

        ChatMessage.objects.create(
            conversation=conversation, role="user", content=prompt
        )

        context = ContextBuilder().build(prompt)

        history = list(
            conversation.messages.values("role", "content")[:-1]
        )

        ai_service = AIService()

        def event_stream():
            full_response = []
            for token in ai_service.stream_chat(prompt, context, history):
                full_response.append(token)
                yield f"data: {json.dumps({'token': token})}\n\n"

            assistant_content = "".join(full_response)
            ChatMessage.objects.create(
                conversation=conversation,
                role="assistant",
                content=assistant_content,
            )

            yield f"data: {json.dumps({'done': True, 'conversation_id': conversation.id})}\n\n"

        return StreamingHttpResponse(
            event_stream(),
            content_type="text/event-stream",
        )


class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversations = Conversation.objects.filter(user=request.user)
        data = [
            {
                "id": c.id,
                "title": c.title or f"Conversation {c.id}",
                "created_at": c.created_at.isoformat(),
                "message_count": c.messages.count(),
            }
            for c in conversations
        ]
        return JsonResponse(data, safe=False)


class ConversationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(
                id=conversation_id, user=request.user
            )
        except Conversation.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)

        messages = conversation.messages.values("id", "role", "content", "created_at")
        return JsonResponse(list(messages), safe=False)


class ConversationDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(
                id=conversation_id, user=request.user
            )
            conversation.delete()
            return JsonResponse({"deleted": True})
        except Conversation.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)
