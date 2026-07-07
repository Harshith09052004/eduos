from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "role", "phone"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "email", "role", "phone", "profile"]

    def get_profile(self, obj):
        if obj.role == "STUDENT":
            student = getattr(obj, "student_profile", None)
            if student:
                return {
                    "type": "student",
                    "name": f"{student.first_name} {student.last_name}",
                    "roll_no": student.roll_no,
                    "department": student.department,
                    "year": student.year,
                    "section": student.section,
                }
        elif obj.role == "FACULTY":
            faculty = getattr(obj, "faculty_profile", None)
            if faculty:
                return {
                    "type": "faculty",
                    "name": f"{faculty.first_name} {faculty.last_name}",
                    "employee_id": faculty.employee_id,
                    "department": faculty.department,
                    "designation": faculty.designation,
                }
        return None
