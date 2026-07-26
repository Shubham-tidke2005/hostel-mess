from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):

    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]

    YEAR_CHOICES = [
        (1, 'First Year'),
        (2, 'Second Year'),
        (3, 'Third Year'),
        (4, 'Final Year'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )

    roll_no = models.CharField(max_length=20, unique=True)

    full_name = models.CharField(max_length=100)

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES
    )

    phone = models.CharField(max_length=15)

    department = models.CharField(max_length=100)

    year = models.PositiveSmallIntegerField(
        choices=YEAR_CHOICES
    )

    address = models.TextField()

    profile_image = models.ImageField(
        upload_to='students/',
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.roll_no} - {self.full_name}"