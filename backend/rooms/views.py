from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Room
from .serializers import RoomSerializer


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.select_related("hostel").all().order_by("hostel", "room_number")
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]