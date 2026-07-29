from rest_framework import viewsets

from .models import Booking
from .serializers import BookingSerializer
from permissions import IsStudentOrAdmin


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related(
        "student",
        "student__user",
        "room",
        "room__hostel"
    ).all()

    serializer_class = BookingSerializer
    permission_classes = [IsStudentOrAdmin]