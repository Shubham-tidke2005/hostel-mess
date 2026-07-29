from rest_framework import serializers
from .models import Hostel


class HostelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Hostel
        fields = [
            "id",
            "hostel_name",
            "hostel_type",
            "address",
            "total_rooms",
            "hostel_image",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_hostel_name(self, value):
        """
        Validate hostel name.
        """
        if len(value.strip()) < 3:
            raise serializers.ValidationError(
                "Hostel name must be at least 3 characters long."
            )

        return value

    def validate_total_rooms(self, value):
        """
        Validate total number of rooms.
        """
        if value <= 0:
            raise serializers.ValidationError(
                "Total rooms must be greater than 0."
            )

        return value

    def validate(self, data):
        """
        Check for duplicate hostel name and type.
        """
        queryset = Hostel.objects.filter(
            hostel_name=data["hostel_name"],
            hostel_type=data["hostel_type"]
        )

        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "A hostel with this name and hostel type already exists."
            )

        return data