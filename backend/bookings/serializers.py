from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = [
            "id",
            "student",
            "room",
            "booking_date",
            "approved_date",
            "status",
            "remarks",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "booking_date",
            "approved_date",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):

        room = data["room"]

        if room.occupied_beds >= room.capacity:
            raise serializers.ValidationError(
                "This room is already full."
            )

        return data