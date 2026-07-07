from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Faculty

User = get_user_model()


class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = "__all__"
        read_only_fields = ["user"]

    def create(self, validated_data):
        faculty = super().create(validated_data)
        self._ensure_user(faculty)
        return faculty

    def update(self, instance, validated_data):
        faculty = super().update(instance, validated_data)
        if "email" in validated_data and faculty.user:
            faculty.user.email = validated_data["email"]
            faculty.user.save()
        return faculty

    def _ensure_user(self, faculty):
        if faculty.user:
            return
        login_email = f"{faculty.employee_id.lower()}@eduos.com"
        user, created = User.objects.get_or_create(
            email=login_email,
            defaults={"role": "FACULTY"},
        )
        if created:
            user.set_password("faculty123")
            user.save()
        faculty.user = user
        faculty.save(update_fields=["user"])
