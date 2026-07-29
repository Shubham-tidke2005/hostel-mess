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

    def validate_menu_date(self, value):
        """
        Prevent duplicate menu for the same date.
        """

        queryset = MessMenu.objects.filter(menu_date=value)

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "Menu for this date already exists."
            )

        return value

    def validate_breakfast(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Breakfast menu cannot be empty."
            )
        return value

    def validate_lunch(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Lunch menu cannot be empty."
            )
        return value

    def validate_dinner(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Dinner menu cannot be empty."
            )
        return value