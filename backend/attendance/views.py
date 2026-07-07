from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Attendance
from .serializers import AttendanceSerializer
from accounts.permissions import IsAdminOrReadOnly


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().select_related("student")
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
