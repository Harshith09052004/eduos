import json

from django.http import JsonResponse, StreamingHttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from students.models import Student
from faculty.models import Faculty
from colleges.models import Department
from attendance.models import Attendance
from placements.models import Placement

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

        recent_messages = list(
            conversation.messages.values("role", "content")[-20:]
        )
        history = recent_messages[:-1]

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

    def delete(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(
                id=conversation_id, user=request.user
            )
            conversation.delete()
            return JsonResponse({"deleted": True})
        except Conversation.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)


class SchoolPulseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_students = Student.objects.count()
        total_faculty = Faculty.objects.count()
        total_depts = Department.objects.count()

        placements = Placement.objects.all()
        total_placements = placements.count()
        placed_students = len(set(p.student_id for p in placements))

        attendance_records = Attendance.objects.all()
        avg_attendance = (
            sum(float(a.attendance_percentage) for a in attendance_records) / attendance_records.count()
            if attendance_records.exists() else 0
        )

        students = Student.objects.all()
        avg_cgpa = sum(s.cgpa for s in students) / total_students if total_students else 0

        faculty_list = Faculty.objects.all()
        avg_experience = sum(f.experience for f in faculty_list) / total_faculty if total_faculty else 0

        placement_rate = (placed_students / total_students * 100) if total_students else 0
        student_faculty_ratio = round(total_students / total_faculty, 1) if total_faculty else 0

        at_risk_students = []
        for s in students:
            try:
                att = s.attendance_record
                if float(att.attendance_percentage) < 75 or s.cgpa < 7.0:
                    at_risk_students.append({
                        "name": f"{s.first_name} {s.last_name}",
                        "roll_no": s.roll_no,
                        "department": s.department,
                        "attendance": float(att.attendance_percentage),
                        "cgpa": s.cgpa,
                        "risk_reason": "Low attendance" if float(att.attendance_percentage) < 75 else "Low CGPA" if s.cgpa < 7.0 else "Both",
                    })
            except Attendance.DoesNotExist:
                pass

        placed_student_ids = set(p.student_id for p in placements)
        unplaced_seniors = Student.objects.filter(year__gte=3).exclude(id__in=placed_student_ids).count()

        dept_stats = []
        for dept in Department.objects.all():
            dept_students = students.filter(department=dept.code)
            dept_placements = placements.filter(student__department=dept.code)
            dept_placed = len(set(p.student_id for p in dept_placements))
            dept_stats.append({
                "name": dept.name,
                "code": dept.code,
                "student_count": dept_students.count(),
                "placement_count": dept_placed,
                "placement_rate": round(dept_placed / dept_students.count() * 100, 1) if dept_students.exists() else 0,
            })

        attendance_weight = min(avg_attendance / 100 * 30, 30)
        placement_weight = placement_rate / 100 * 25
        ratio_score = max(0, 30 - abs(student_faculty_ratio - 15) * 2)
        ratio_weight = min(ratio_score / 30 * 15, 15)
        cgpa_weight = min(avg_cgpa / 10 * 15, 15)
        exp_weight = min(avg_experience / 20 * 15, 15)
        health_score = round(attendance_weight + placement_weight + ratio_weight + cgpa_weight + exp_weight, 1)

        return JsonResponse({
            "health_score": health_score,
            "total_students": total_students,
            "total_faculty": total_faculty,
            "total_departments": total_depts,
            "avg_attendance": round(avg_attendance, 1),
            "avg_cgpa": round(avg_cgpa, 2),
            "avg_experience": round(avg_experience, 1),
            "placement_rate": round(placement_rate, 1),
            "student_faculty_ratio": student_faculty_ratio,
            "at_risk_count": len(at_risk_students),
            "at_risk_students": at_risk_students[:20],
            "unplaced_seniors": unplaced_seniors,
            "dept_stats": dept_stats,
        })


class SchoolPulseReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        context_builder = ContextBuilder()
        context = context_builder._get_summary_context()

        context += "\n\n" + context_builder._get_attendance_context()
        context += "\n\n" + context_builder._get_placement_context()

        prompt = (
            "You are a school intelligence analyst. Based on the data below, generate:\n"
            "1. A school health summary (2-3 sentences)\n"
            "2. Top 3 strengths\n"
            "3. Top 3 areas needing improvement\n"
            "4. 3 actionable recommendations for the college administration\n"
            "5. A prediction for next semester trends\n\n"
            "Format with clear headings and bullet points.\n\n"
            f"### DATA ###\n{context}\n### END ###"
        )

        ai_service = AIService()

        def event_stream():
            for token in ai_service.stream_chat(prompt, "", []):
                yield f"data: {json.dumps({'token': token})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"

        return StreamingHttpResponse(
            event_stream(),
            content_type="text/event-stream",
        )



