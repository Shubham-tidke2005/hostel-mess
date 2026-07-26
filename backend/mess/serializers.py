from rest_framework import serializers
from .models import MessMenu


class MessMenuSerializer(serializers.ModelSerializer):

    class Meta:
        model = MessMenu
        fields = [
            "id",
            "menu_date",
            "breakfast",
            "lunch",
            "dinner",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]