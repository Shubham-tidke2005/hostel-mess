from django.contrib import admin
from .models import Hostel


@admin.register(Hostel)
class HostelAdmin(admin.ModelAdmin):
    list_display = (
        "hostel_name",
        "hostel_type",
        "total_rooms",
    )

    search_fields = (
        "hostel_name",
        "address",
    )

    list_filter = (
        "hostel_type",
    )