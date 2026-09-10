from django.db import transaction
from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.response import Response

from .models import Booking
from .serializers import BookingSerializer

from rooms.models import Room
from students.models import Student

from permissions import IsBookingOwnerOrAdmin


class BookingViewSet(viewsets.ModelViewSet):
    """
    Booking Management

    Student:
        - Create a booking for themselves
        - View their own bookings
        - Request cancellation
        - Cannot approve, reject, or directly cancel

    Admin:
        - View all bookings
        - Create bookings
        - Approve bookings
        - Reject bookings
        - Process cancellation requests
        - Add remarks
        - Delete bookings if required
    """

    serializer_class = BookingSerializer
    permission_classes = [IsBookingOwnerOrAdmin]

    # ==========================================================
    # QUERYSET
    # ==========================================================

    def get_queryset(self):
        """
        Admin:
            Can view all bookings.

        Student:
            Can view only their own bookings.
        """

        user = self.request.user

        queryset = Booking.objects.select_related(
            "student",
            "student__user",
            "room",
            "room__hostel",
        )

        if user.is_staff:
            return queryset.all()

        return queryset.filter(
            student__user=user
        )

    # ==========================================================
    # CREATE
    # ==========================================================

    def create(self, request, *args, **kwargs):
        """
        Create a new booking.

        Student:
            Student is automatically taken from
            the authenticated user.

        Admin:
            Can create a booking for a student.

        New bookings always start as Pending.
        """

        # ------------------------------------------------------
        # STUDENT
        # ------------------------------------------------------

        if not request.user.is_staff:

            try:
                student = Student.objects.get(
                    user=request.user
                )
            except Student.DoesNotExist:
                return Response(
                    {
                        "detail": (
                            "Student profile not found "
                            "for the logged-in user."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validate only fields coming from frontend.
            serializer = self.get_serializer(
                data=request.data
            )

            serializer.is_valid(
                raise_exception=True
            )

            # Save authenticated student.
            booking = serializer.save(
                student=student,
                status="Pending",
            )

            return Response(
                self.get_serializer(
                    booking
                ).data,
                status=status.HTTP_201_CREATED,
            )

        # ------------------------------------------------------
        # ADMIN
        # ------------------------------------------------------

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        booking = serializer.save(
            status="Pending"
        )

        return Response(
            self.get_serializer(
                booking
            ).data,
            status=status.HTTP_201_CREATED,
        )

    # ==========================================================
    # UPDATE
    # ==========================================================

    def update(
        self,
        request,
        *args,
        **kwargs,
    ):
        """
        Route updates according to role.
        """

        booking = self.get_object()

        if request.user.is_staff:
            return self.admin_update(
                booking,
                request,
            )

        return self.student_update(
            booking,
            request,
        )

    # ==========================================================
    # PARTIAL UPDATE
    # ==========================================================

    def partial_update(
        self,
        request,
        *args,
        **kwargs,
    ):
        return self.update(
            request,
            *args,
            **kwargs,
        )

    # ==========================================================
    # STUDENT UPDATE
    # ==========================================================

    def student_update(
        self,
        booking,
        request,
    ):
        """
        Student can only request cancellation.

        Allowed:

            Pending
                ↓
            Cancellation Requested

            Approved
                ↓
            Cancellation Requested
        """

        requested_status = request.data.get(
            "status"
        )

        # ------------------------------------------------------
        # REQUEST CANCELLATION
        # ------------------------------------------------------

        if requested_status == "Cancellation Requested":

            if booking.status not in [
                "Pending",
                "Approved",
            ]:
                return Response(
                    {
                        "detail": (
                            "Cancellation can only be "
                            "requested for pending or "
                            "approved bookings."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            booking.status = (
                "Cancellation Requested"
            )

            booking.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

            return Response(
                self.get_serializer(
                    booking
                ).data,
                status=status.HTTP_200_OK,
            )

        # ------------------------------------------------------
        # BLOCK ALL OTHER STUDENT CHANGES
        # ------------------------------------------------------

        return Response(
            {
                "detail": (
                    "Students can only request "
                    "booking cancellation."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    # ==========================================================
    # ADMIN UPDATE
    # ==========================================================

    @transaction.atomic
    def admin_update(
        self,
        booking,
        request,
    ):
        """
        Admin status transitions:

            Pending
                ├── Approved
                └── Rejected

            Cancellation Requested
                └── Cancelled
        """

        requested_status = request.data.get(
            "status"
        )

        remarks = request.data.get(
            "remarks",
            booking.remarks,
        )

        # ======================================================
        # APPROVE BOOKING
        # ======================================================

        if requested_status == "Approved":

            # Only pending bookings can be approved.
            if booking.status != "Pending":
                return Response(
                    {
                        "detail": (
                            "Only pending bookings "
                            "can be approved."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Lock the room so simultaneous requests
            # cannot overbook the last available bed.
            room = (
                Room.objects
                .select_for_update()
                .get(
                    pk=booking.room_id
                )
            )

            # Room under maintenance
            if room.status == "Maintenance":
                return Response(
                    {
                        "detail": (
                            "This room is under "
                            "maintenance."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Room full
            if (
                room.occupied_beds
                >= room.capacity
            ):
                return Response(
                    {
                        "detail": (
                            "This room is already full."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # --------------------------------------------------
            # UPDATE ROOM OCCUPANCY
            # --------------------------------------------------

            room.occupied_beds += 1

            if (
                room.occupied_beds
                >= room.capacity
            ):
                room.status = "Full"
            else:
                room.status = "Available"

            room.save(
                update_fields=[
                    "occupied_beds",
                    "status",
                ]
            )

            # --------------------------------------------------
            # UPDATE BOOKING
            # --------------------------------------------------

            booking.status = "Approved"
            booking.approved_date = timezone.now()
            booking.remarks = remarks

            booking.save(
                update_fields=[
                    "status",
                    "approved_date",
                    "remarks",
                    "updated_at",
                ]
            )

            return Response(
                self.get_serializer(
                    booking
                ).data,
                status=status.HTTP_200_OK,
            )

        # ======================================================
        # REJECT BOOKING
        # ======================================================

        if requested_status == "Rejected":

            if booking.status != "Pending":
                return Response(
                    {
                        "detail": (
                            "Only pending bookings "
                            "can be rejected."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            booking.status = "Rejected"
            booking.remarks = remarks

            booking.save(
                update_fields=[
                    "status",
                    "remarks",
                    "updated_at",
                ]
            )

            return Response(
                self.get_serializer(
                    booking
                ).data,
                status=status.HTTP_200_OK,
            )

        # ======================================================
        # CANCEL BOOKING
        # ======================================================

        if requested_status == "Cancelled":

            if (
                booking.status
                != "Cancellation Requested"
            ):
                return Response(
                    {
                        "detail": (
                            "Only bookings with a "
                            "cancellation request "
                            "can be cancelled."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Lock room while changing occupancy.
            room = (
                Room.objects
                .select_for_update()
                .get(
                    pk=booking.room_id
                )
            )

            # --------------------------------------------------
            # RELEASE BED ONLY IF BOOKING WAS APPROVED
            # --------------------------------------------------

            if booking.approved_date is not None:

                if room.occupied_beds > 0:
                    room.occupied_beds -= 1

                # Do not overwrite Maintenance status.
                if room.status != "Maintenance":

                    if (
                        room.occupied_beds
                        >= room.capacity
                    ):
                        room.status = "Full"
                    else:
                        room.status = "Available"

                    room.save(
                        update_fields=[
                            "occupied_beds",
                            "status",
                        ]
                    )

                else:
                    room.save(
                        update_fields=[
                            "occupied_beds"
                        ]
                    )

            # --------------------------------------------------
            # UPDATE BOOKING
            # --------------------------------------------------

            booking.status = "Cancelled"
            booking.remarks = remarks

            booking.save(
                update_fields=[
                    "status",
                    "remarks",
                    "updated_at",
                ]
            )

            return Response(
                self.get_serializer(
                    booking
                ).data,
                status=status.HTTP_200_OK,
            )

        # ======================================================
        # ADMIN REMARKS ONLY
        # ======================================================

        if (
            requested_status is None
            and "remarks" in request.data
        ):

            booking.remarks = remarks

            booking.save(
                update_fields=[
                    "remarks",
                    "updated_at",
                ]
            )

            return Response(
                self.get_serializer(
                    booking
                ).data,
                status=status.HTTP_200_OK,
            )

        # ======================================================
        # INVALID STATUS
        # ======================================================

        return Response(
            {
                "detail": (
                    "Invalid booking status "
                    "transition."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ==========================================================
    # DELETE
    # ==========================================================

    def destroy(
        self,
        request,
        *args,
        **kwargs,
    ):
        """
        Students cannot directly delete bookings.

        Admin can delete bookings.

        If an approved booking is deleted,
        release the occupied bed first.
        """

        if not request.user.is_staff:
            return Response(
                {
                    "detail": (
                        "Students cannot directly "
                        "delete bookings."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        booking = self.get_object()

        # ------------------------------------------------------
        # DELETE APPROVED BOOKING
        # ------------------------------------------------------

        if (
            booking.status == "Approved"
            and booking.approved_date is not None
        ):

            with transaction.atomic():

                room = (
                    Room.objects
                    .select_for_update()
                    .get(
                        pk=booking.room_id
                    )
                )

                if room.occupied_beds > 0:
                    room.occupied_beds -= 1

                if room.status != "Maintenance":

                    if (
                        room.occupied_beds
                        >= room.capacity
                    ):
                        room.status = "Full"
                    else:
                        room.status = "Available"

                    room.save(
                        update_fields=[
                            "occupied_beds",
                            "status",
                        ]
                    )

                else:
                    room.save(
                        update_fields=[
                            "occupied_beds"
                        ]
                    )

                booking.delete()

        else:
            booking.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )