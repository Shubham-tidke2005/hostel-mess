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
            "student",
            "booking_date",
            "approved_date",
            "status",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):
        room = data.get("room")

        if not room:
            raise serializers.ValidationError({
                "room": "Room is required."
            })

        # Room cannot be booked if under maintenance
        if room.status == "Maintenance":
            raise serializers.ValidationError({
                "room": "This room is under maintenance."
            })

        # Room cannot be booked if full
        if room.occupied_beds >= room.capacity:
            raise serializers.ValidationError({
                "room": "This room is already full."
            })

        # Check student only when available in serializer context.
        # During normal student creation, views.py supplies it.
        student = data.get("student")

        if student:
            queryset = Booking.objects.filter(
                student=student,
                status__in=[
                    "Pending",
                    "Approved",
                ],
            )

            if self.instance:
                queryset = queryset.exclude(
                    pk=self.instance.pk
                )

            if queryset.exists():
                raise serializers.ValidationError({
                    "student": (
                        "This student already has "
                        "an active booking."
                    )
                })

        return data