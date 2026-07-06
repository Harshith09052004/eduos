from django.contrib import admin
from .models import Placement


@admin.register(Placement)
class PlacementAdmin(admin.ModelAdmin):
    list_display = (
        "student",
        "company",
        "role",
        "package",
        "placement_date",
    )

    search_fields = (
        "student__first_name",
        "student__last_name",
        "company",
    )