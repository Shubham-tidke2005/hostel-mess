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