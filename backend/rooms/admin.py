from django.contrib import admin
from .models import Room


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):

    list_display = (
        "room_number",
        "hostel",
        "floor",
        "capacity",
        "occupied_beds",
        "status",
    )

    search_fields = (
        "room_number",
        "hostel__hostel_name",
    )

    list_filter = (
        "hostel",
        "status",
        "floor",
    )