from django.db import models


class MessMenu(models.Model):

    menu_date = models.DateField(unique=True)

    breakfast = models.TextField()

    lunch = models.TextField()

    dinner = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-menu_date"]
        verbose_name = "Mess Menu"
        verbose_name_plural = "Mess Menus"

    def __str__(self):
        return f"Menu - {self.menu_date}"