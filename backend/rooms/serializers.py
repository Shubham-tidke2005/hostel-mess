from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Room
        fields = [
            "id",
            "hostel",
            "room_number",
            "floor",
            "capacity",
            "occupied_beds",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_room_number(self, value):
        """
        Validate room number.
        """
        if len(value.strip()) < 2:
            raise serializers.ValidationError(
                "Room number must be at least 2 characters long."
            )

        return value

    def validate_capacity(self, value):
        """
        Validate room capacity.
        """
        if value <= 0:
            raise serializers.ValidationError(
                "Room capacity must be greater than 0."
            )

        return value

    def validate_occupied_beds(self, value):
        """
        Validate occupied beds.
        """
        if value < 0:
            raise serializers.ValidationError(
                "Occupied beds cannot be negative."
            )

        return value

    def validate(self, data):
        """
        Validate room details.
        """

        capacity = data.get("capacity", getattr(self.instance, "capacity", 0))
        occupied_beds = data.get(
            "occupied_beds",
            getattr(self.instance, "occupied_beds", 0)
        )

        if occupied_beds > capacity:
            raise serializers.ValidationError(
                "Occupied beds cannot exceed room capacity."
            )

        queryset = Room.objects.filter(
            hostel=data.get("hostel", getattr(self.instance, "hostel", None)),
            room_number=data.get(
                "room_number",
                getattr(self.instance, "room_number", None)
            )
        )

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "This room number already exists in the selected hostel."
            )

        return data