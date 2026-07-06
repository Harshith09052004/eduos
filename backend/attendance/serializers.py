from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source="student.first_name",
        read_only=True,
    )

    roll_no = serializers.CharField(
        source="student.roll_no",
        read_only=True,
    )

    class Meta:
        model = Attendance
        fields = "__all__"