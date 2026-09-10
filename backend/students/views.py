
from django.contrib.auth.models import User
from django.db import transaction

from rest_framework import status, viewsets
from rest_framework.response import Response

from permissions import IsAdminOrOwnStudent

from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):

    serializer_class = StudentSerializer
    permission_classes = [IsAdminOrOwnStudent]

    def get_queryset(self):
        """
        Admin:
            Can view all students.

        Student:
            Can view only their own student record.
        """

        user = self.request.user

        # Admin can see all students
        if user.is_staff:
            return Student.objects.all()

        # Student can see only their own record
        return Student.objects.filter(user=user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Only administrators can create students.
        """

        if not request.user.is_staff:
            return Response(
                {
                    "detail": "Only administrators can add students."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        student_data = serializer.validated_data

        roll_no = student_data["roll_no"]
        full_name = student_data["full_name"]

        # Check if username already exists
        if User.objects.filter(username=roll_no).exists():
            return Response(
                {
                    "roll_no": [
                        "A user with this roll number already exists."
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create Django User
        user = User.objects.create_user(
            username=roll_no,
            first_name=full_name,
        )

        # Create Student
        student = Student.objects.create(
            user=user,
            **student_data
        )

        response_serializer = self.get_serializer(student)

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        """
        Admin:
            Can update any student.

        Student:
            Can update only their own profile.

            Students can update:
            - phone
            - address
            - profile_image
        """

        instance = self.get_object()

        # Admin can update everything
        if request.user.is_staff:
            return super().update(
                request,
                *args,
                **kwargs
            )

        # Student can update only their own record
        if instance.user != request.user:
            return Response(
                {
                    "detail": "You can only update your own profile."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Fields students are allowed to edit
        allowed_fields = {
            "phone",
            "address",
            "profile_image",
        }

        submitted_fields = set(request.data.keys())

        forbidden_fields = submitted_fields - allowed_fields

        if forbidden_fields:
            return Response(
                {
                    "detail": (
                        "Students can only update phone, "
                        "address and profile image."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().update(
            request,
            *args,
            **kwargs
        )

    def partial_update(self, request, *args, **kwargs):
        """
        Handle PATCH requests.
        """

        return self.update(
            request,
            *args,
            **kwargs
        )

    def destroy(self, request, *args, **kwargs):
        """
        Only administrators can delete students.
        """

        if not request.user.is_staff:
            return Response(
                {
                    "detail": "Only administrators can delete students."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        return super().destroy(
            request,
            *args,
            **kwargs
        )

