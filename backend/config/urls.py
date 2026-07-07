from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import CustomTokenObtainPairView
from email_campaigns.views import GenerateEmailContentView
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
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include(router.urls)),
    path("api/assistant/", include("assistant.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("api/email-campaigns/", include("email_campaigns.urls")),
]
