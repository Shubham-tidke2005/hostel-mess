from rest_framework import viewsets

from .models import Hostel
from .serializers import HostelSerializer
from permissions import IsAdminOrReadOnly


class HostelViewSet(viewsets.ModelViewSet):
    queryset = Hostel.objects.all()
    serializer_class = HostelSerializer
    permission_classes = [IsAdminOrReadOnly]