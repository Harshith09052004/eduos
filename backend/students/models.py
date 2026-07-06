from django.db import models


class Student(models.Model):
    roll_no = models.CharField(max_length=20, unique=True)

    first_name = models.CharField(max_length=100)

    last_name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=15)

    department = models.CharField(max_length=100)

    year = models.IntegerField()

    section = models.CharField(max_length=10)

    attendance = models.FloatField(default=100)

    cgpa = models.FloatField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.roll_no} - {self.first_name}"