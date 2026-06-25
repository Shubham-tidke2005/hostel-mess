from django.db import models
from hostels.models import Hostel
######################################################################################

class Menu(models.Model):

    hostel = models.ForeignKey(
        Hostel,
        on_delete=models.CASCADE
    )

    date = models.DateField()

    breakfast = models.CharField(max_length=200)
    lunch = models.CharField(max_length=200)
    dinner = models.CharField(max_length=200)

    image = models.ImageField(
        upload_to='food_images/'
    )