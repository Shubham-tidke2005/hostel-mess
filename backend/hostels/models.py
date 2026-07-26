from django.db import models


class Hostel(models.Model):

    HOSTEL_TYPE_CHOICES = [
        ("Boys", "Boys"),
        ("Girls", "Girls"),
    ]

    hostel_name = models.CharField(max_length=100, unique=True)

    hostel_type = models.CharField(
        max_length=10,
        choices=HOSTEL_TYPE_CHOICES
    )

    address = models.TextField()

    total_rooms = models.PositiveIntegerField()

    hostel_image = models.ImageField(
        upload_to="hostels/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.hostel_name