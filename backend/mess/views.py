from rest_framework import viewsets

from .models import MessMenu
from .serializers import MessMenuSerializer
from permissions import IsAdminOrReadOnly


class MessMenuViewSet(viewsets.ModelViewSet):
    queryset = MessMenu.objects.all().order_by("-menu_date")
    serializer_class = MessMenuSerializer
    permission_classes = [IsAdminOrReadOnly]