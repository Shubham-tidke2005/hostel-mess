from rest_framework import viewsets
from permissions import IsStudentOrAdmin

from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsStudentOrAdmin]