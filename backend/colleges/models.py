from django.db import models


class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    hod = models.CharField(max_length=100)
    total_students = models.PositiveIntegerField(default=0)
    total_faculty = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name