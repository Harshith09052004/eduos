from rest_framework import serializers
from .models import Placement


class PlacementSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    roll_no = serializers.SerializerMethodField()

    class Meta:
        model = Placement
        fields = "__all__"

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"

    def get_roll_no(self, obj):
        return obj.student.roll_no