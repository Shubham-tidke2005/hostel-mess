from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


class User(AbstractUser):
    ROLE_CHOICES = (
        ("student", "Student"),
        ("hosteller", "Hosteller"),
        ("admin", "Admin"),
    )
    role = models.CharField(
        max_length=20,
        default='student'
    )

    phone = models.CharField(
        max_length=15,
        blank=True
    )

    profile_pic = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True
    )


class Complaint(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=100)

    description = models.TextField()

    status = models.CharField(
        max_length=20,
        default='Pending'
    )