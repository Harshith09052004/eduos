from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "roll_no",
        "first_name",
        "last_name",
        "department",
        "year",
        "email",
    )

    search_fields = (
        "roll_no",
        "first_name",
        "last_name",
        "email",
    )

    list_filter = (
        "department",
        "year",
    )