from django.contrib import admin
from .models import MessMenu


@admin.register(MessMenu)
class MessMenuAdmin(admin.ModelAdmin):

    list_display = (
        "menu_date",
        "breakfast",
        "lunch",
        "dinner",
    )

    search_fields = (
        "menu_date",
    )

    ordering = (
        "-menu_date",
    )