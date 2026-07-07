from rest_framework import serializers
from .models import EmailCampaign, EmailLog


class EmailCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailCampaign
        fields = [
            "id", "purpose", "subject", "body", "recipient_filter",
            "total_recipients", "sent_count", "failed_count",
            "status", "created_by", "created_at", "sent_at",
        ]
        read_only_fields = ["id", "created_by", "created_at", "sent_at", "status", "sent_count", "failed_count", "total_recipients"]


class EmailCampaignListSerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source="created_by.email", read_only=True)

    class Meta:
        model = EmailCampaign
        fields = [
            "id", "purpose", "subject", "status",
            "total_recipients", "sent_count", "failed_count",
            "created_by_email", "created_at", "sent_at",
        ]


class EmailLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailLog
        fields = ["id", "campaign", "student_email", "student_name", "sent_at", "success", "error_message"]
