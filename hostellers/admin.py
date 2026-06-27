from django.contrib import admin
from .models import Hosteller


@admin.register(Hosteller)
class HostellerAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "hostel",
        "designation",
        "joined_date",
    )

    list_filter = (
        "hostel",
        "designation",
    )

    search_fields = (
        "user__username",
        "hostel__hostel_name",
    )