from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):

    list_display = (
        "student",
        "room",
        "status",
        "booking_date",
        "approved_date",
    )

    list_filter = (
        "status",
        "booking_date",
    )

    search_fields = (
        "student__full_name",
        "room__room_number",
    )