from django.db import models


class Placement(models.Model):
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        related_name="placements",
    )

    company = models.CharField(max_length=200)
    role = models.CharField(max_length=150)
    package = models.DecimalField(max_digits=6, decimal_places=2)
    placement_date = models.DateField()

    def __str__(self):
        return f"{self.student.first_name} - {self.company}"