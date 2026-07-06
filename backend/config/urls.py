from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from students.views import StudentViewSet
from faculty.views import FacultyViewSet
from colleges.viewSet import DepartmentViewSet
from attendance.views import AttendanceViewSet
from placements.viewSet import PlacementViewSet

router = DefaultRouter()

router.register(r"students", StudentViewSet, basename="students")
router.register(r"faculty", FacultyViewSet, basename="faculty")
router.register(r"departments", DepartmentViewSet, basename="departments")
router.register(r"attendance", AttendanceViewSet, basename="attendance")
router.register(r"placements", PlacementViewSet, basename="placements")

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT Authentication
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    # API
    path("api/", include(router.urls)),

    # AI Assistant
    path("api/assistant/", include("assistant.urls")),
]