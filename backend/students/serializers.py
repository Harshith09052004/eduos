from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Student

User = get_user_model()


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"
        read_only_fields = ["user"]

    def create(self, validated_data):
        student = super().create(validated_data)
        self._ensure_user(student)
        return student

    def update(self, instance, validated_data):
        student = super().update(instance, validated_data)
        if "email" in validated_data and student.user:
            student.user.email = validated_data["email"]
            student.user.save()
        return student

    def _ensure_user(self, student):
        if student.user:
            return
        login_email = f"{student.roll_no.lower()}@eduos.com"
        user, created = User.objects.get_or_create(
            email=login_email,
            defaults={"role": "STUDENT"},
        )
        if created:
            user.set_password("student123")
            user.save()
        student.user = user
        student.save(update_fields=["user"])
