from django.db import models
from students.models import Student


class Attendance(models.Model):
    student = models.OneToOneField(
        Student,
        on_delete=models.CASCADE,
        related_name="attendance_record",
    )

    attendance_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
    )

    total_classes = models.PositiveIntegerField(default=0)

    classes_attended = models.PositiveIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student.roll_no} - {self.attendance_percentage}%"