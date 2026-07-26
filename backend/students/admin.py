from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        "roll_no",
        "full_name",
        "department",
        "year",
        "phone",
    )

    search_fields = (
        "roll_no",
        "full_name",
        "department",
    )

    list_filter = (
        "department",
        "year",
        "gender",
    )