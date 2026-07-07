from django.db import models
from django.conf import settings


class EmailCampaign(models.Model):
    class Purpose(models.TextChoices):
        EXAM = "EXAM", "Exam Schedule"
        FEE = "FEE", "Fee Reminder"
        EVENT = "EVENT", "Event Notice"
        PLACEMENT = "PLACEMENT", "Placement Drive"
        GENERAL = "GENERAL", "General Announcement"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        SENT = "SENT", "Sent"
        PARTIAL = "PARTIAL", "Partially Sent"
        FAILED = "FAILED", "Failed"

    purpose = models.CharField(max_length=20, choices=Purpose.choices, default=Purpose.GENERAL)
    subject = models.CharField(max_length=300)
    body = models.TextField()
    recipient_filter = models.JSONField(default=dict, blank=True)
    total_recipients = models.PositiveIntegerField(default=0)
    sent_count = models.PositiveIntegerField(default=0)
    failed_count = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.get_purpose_display()}: {self.subject[:60]}"


class EmailLog(models.Model):
    campaign = models.ForeignKey(EmailCampaign, on_delete=models.CASCADE, related_name="logs")
    student_email = models.EmailField()
    student_name = models.CharField(max_length=200)
    sent_at = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)

    def __str__(self):
        return f"{self.student_email} - {'OK' if self.success else 'FAIL'}"
