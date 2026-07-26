from django.db import models
from hostels.models import Hostel


class Room(models.Model):

    ROOM_STATUS_CHOICES = [
        ("Available", "Available"),
        ("Full", "Full"),
        ("Maintenance", "Maintenance"),
    ]

    hostel = models.ForeignKey(
        Hostel,
        on_delete=models.CASCADE,
        related_name="rooms"
    )

    room_number = models.CharField(max_length=10)

    floor = models.PositiveIntegerField()

    capacity = models.PositiveIntegerField(default=3)

    occupied_beds = models.PositiveIntegerField(default=0)

    status = models.CharField(
        max_length=20,
        choices=ROOM_STATUS_CHOICES,
        default="Available"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("hostel", "room_number")
        ordering = ["hostel", "room_number"]

    def __str__(self):
        return f"{self.hostel.hostel_name} - Room {self.room_number}"