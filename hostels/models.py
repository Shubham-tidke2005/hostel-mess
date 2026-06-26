from django.db import models
from django.conf import settings


class Hostel(models.Model):
    hostel_name = models.CharField(max_length=100)
    hostel_type = models.CharField(max_length=20)

    def __str__(self):
        return self.hostel_name


class Room(models.Model):
    hostel = models.ForeignKey(
        Hostel,
        on_delete=models.CASCADE
    )

    room_number = models.CharField(max_length=10)
    room_type = models.CharField(max_length=20,default="Double")
    capacity = models.IntegerField()

    def __str__(self):
        return self.room_number


class RoomBooking(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE
    )

    status = models.CharField(
        max_length=20,
        default='Pending'
    )