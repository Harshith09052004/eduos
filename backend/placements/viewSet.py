from rest_framework import viewsets

from .models import Placement
from .serializers import PlacementSerializer


class PlacementViewSet(viewsets.ModelViewSet):
    queryset = Placement.objects.select_related("student")
    serializer_class = PlacementSerializer