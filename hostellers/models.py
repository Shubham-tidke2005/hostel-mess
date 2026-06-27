from django.db import models
from accounts.models import User
from hostels.models import Hostel


class Hosteller(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="hosteller_profile"
    )

    hostel = models.ForeignKey(
        Hostel,
        on_delete=models.CASCADE,
        related_name="hostellers"
    )

    designation = models.CharField(
        max_length=100,
        default="Hostel Manager"
    )

    joined_date = models.DateField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.hostel.hostel_name}"