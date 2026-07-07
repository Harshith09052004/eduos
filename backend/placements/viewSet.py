from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Placement
from .serializers import PlacementSerializer
from accounts.permissions import IsAdminOrReadOnly


class PlacementViewSet(viewsets.ModelViewSet):
    queryset = Placement.objects.select_related("student")
    serializer_class = PlacementSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
