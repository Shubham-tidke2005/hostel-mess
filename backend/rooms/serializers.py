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