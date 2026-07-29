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
        student = data["student"]

        # Check if room is full
        if room.occupied_beds >= room.capacity:
            raise serializers.ValidationError(
                "This room is already full."
            )

        # Check room availability
        if room.status != "Available":
            raise serializers.ValidationError(
                "This room is not available for booking."
            )

        # Prevent duplicate active booking for the same student
        queryset = Booking.objects.filter(
            student=student,
            status__in=["Pending", "Approved"]
        )

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "This student already has an active booking."
            )

        return data