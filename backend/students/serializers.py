from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Student
        fields = [
            "id",
            "user",
            "roll_no",
            "full_name",
            "gender",
            "phone",
            "department",
            "year",
            "address",
            "profile_image",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_phone(self, value):
        """
        Validate phone number.
        """
        if not value.isdigit():
            raise serializers.ValidationError(
                "Phone number should contain only digits."
            )

        if len(value) != 10:
            raise serializers.ValidationError(
                "Phone number must be exactly 10 digits."
            )

        return value

    def validate_year(self, value):
        """
        Validate academic year.
        """
        if value < 1 or value > 4:
            raise serializers.ValidationError(
                "Year must be between 1 and 4."
            )

        return value