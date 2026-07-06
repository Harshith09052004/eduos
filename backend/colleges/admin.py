from django.contrib import admin
from .models import Department


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "code",
        "hod",
        "total_students",
        "total_faculty",
    )

    search_fields = (
        "name",
        "code",
        "hod",
    )

    ordering = ("name",)