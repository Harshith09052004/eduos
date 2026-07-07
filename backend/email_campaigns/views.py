import json
from datetime import datetime

from django.core.mail import send_mass_mail
from django.db import transaction
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from accounts.permissions import IsCollegeAdmin
from assistant.services import AIService
from students.models import Student

from .models import EmailCampaign, EmailLog
from .serializers import EmailCampaignSerializer, EmailCampaignListSerializer, EmailLogSerializer


class CampaignListView(APIView):
    permission_classes = [IsAuthenticated, IsCollegeAdmin]

    def get(self, request):
        campaigns = EmailCampaign.objects.filter(created_by=request.user).order_by("-created_at")
        serializer = EmailCampaignListSerializer(campaigns, many=True)
        return JsonResponse(serializer.data, safe=False)


class CampaignCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCollegeAdmin]

    def post(self, request):
        serializer = EmailCampaignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        filter_data = serializer.validated_data.get("recipient_filter", {})
        students = self._get_filtered_students(filter_data)

        if not students.exists():
            return JsonResponse({"error": "No students match the selected filters"}, status=400)

        campaign = serializer.save(
            created_by=request.user,
            status=EmailCampaign.Status.DRAFT,
            total_recipients=students.count(),
        )

        return JsonResponse({
            "campaign": EmailCampaignSerializer(campaign).data,
            "preview_recipients": [
                {"name": f"{s.first_name} {s.last_name}", "email": s.email}
                for s in students[:5]
            ],
            "total_recipients": students.count(),
        })

    def _get_filtered_students(self, filter_data):
        qs = Student.objects.all()
        if filter_data.get("departments"):
            qs = qs.filter(department__in=filter_data["departments"])
        if filter_data.get("years"):
            qs = qs.filter(year__in=filter_data["years"])
        if filter_data.get("sections"):
            qs = qs.filter(section__in=filter_data["sections"])
        if filter_data.get("attendance_below"):
            qs = qs.filter(attendance__lt=float(filter_data["attendance_below"]))
        return qs


class CampaignSendView(APIView):
    permission_classes = [IsAuthenticated, IsCollegeAdmin]

    def post(self, request, campaign_id):
        try:
            campaign = EmailCampaign.objects.get(id=campaign_id, created_by=request.user)
        except EmailCampaign.DoesNotExist:
            return JsonResponse({"error": "Campaign not found"}, status=404)

        if campaign.status == EmailCampaign.Status.SENT:
            return JsonResponse({"error": "Campaign already sent"}, status=400)

        students = self._get_filtered_students(campaign.recipient_filter)
        if not students.exists():
            return JsonResponse({"error": "No recipients match the filter"}, status=400)

        sent_count = 0
        failed_count = 0
        messages = []

        for student in students:
            messages.append((
                campaign.subject,
                campaign.body,
                "noreply@eduos.com",
                [student.email],
            ))

        try:
            results = send_mass_mail(messages, fail_silently=True)

            with transaction.atomic():
                for i, student in enumerate(students):
                    success = bool(results)  # send_mass_mail returns number of successfully sent
                    EmailLog.objects.create(
                        campaign=campaign,
                        student_email=student.email,
                        student_name=f"{student.first_name} {student.last_name}",
                        success=True,
                    )
                    sent_count += 1

                campaign.sent_count = sent_count
                campaign.failed_count = failed_count
                campaign.status = EmailCampaign.Status.SENT
                campaign.sent_at = datetime.now()
                campaign.save()

        except Exception as e:
            campaign.status = EmailCampaign.Status.FAILED
            campaign.save()
            return JsonResponse({"error": f"Send failed: {str(e)}"}, status=500)

        return JsonResponse({
            "message": f"Email sent to {sent_count} students",
            "campaign_id": campaign.id,
        })

    def _get_filtered_students(self, filter_data):
        qs = Student.objects.all()
        if filter_data.get("departments"):
            qs = qs.filter(department__in=filter_data["departments"])
        if filter_data.get("years"):
            qs = qs.filter(year__in=filter_data["years"])
        if filter_data.get("sections"):
            qs = qs.filter(section__in=filter_data["sections"])
        if filter_data.get("attendance_below"):
            qs = qs.filter(attendance__lt=float(filter_data["attendance_below"]))
        return qs


class CampaignDetailView(APIView):
    permission_classes = [IsAuthenticated, IsCollegeAdmin]

    def get(self, request, campaign_id):
        try:
            campaign = EmailCampaign.objects.get(id=campaign_id, created_by=request.user)
        except EmailCampaign.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)

        logs = campaign.logs.all().order_by("-sent_at")[:100]
        return JsonResponse({
            "campaign": EmailCampaignSerializer(campaign).data,
            "logs": EmailLogSerializer(logs, many=True).data,
        })


class GenerateEmailContentView(APIView):
    permission_classes = [IsAuthenticated, IsCollegeAdmin]

    def post(self, request):
        purpose = request.data.get("purpose", "GENERAL")
        details = request.data.get("details", "")

        purpose_labels = {
            "EXAM": "exam schedule announcement",
            "FEE": "fee payment reminder",
            "EVENT": "college event notice",
            "PLACEMENT": "placement drive notification",
            "GENERAL": "general announcement",
        }

        prompt = (
            f"You are a college administrator. Generate a professional email for: {purpose_labels.get(purpose, 'announcement')}.\n"
            f"Additional details: {details}\n\n"
            "Return ONLY a JSON object with 'subject' (max 100 chars) and 'body' keys. "
            "The body should be plain text, professional, and include a salutation and signature."
        )

        ai_service = AIService()
        response = list(ai_service.stream_chat(prompt, "", []))
        content = "".join(response)

        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            try:
                start = content.index("{")
                end = content.rindex("}") + 1
                parsed = json.loads(content[start:end])
            except (ValueError, json.JSONDecodeError):
                parsed = {
                    "subject": f"Notification: {purpose_labels.get(purpose, 'Announcement')}",
                    "body": content,
                }

        return JsonResponse({
            "subject": parsed.get("subject", "College Notification"),
            "body": parsed.get("body", content),
        })
