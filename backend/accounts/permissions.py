from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "SUPER_ADMIN"


class IsCollegeAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["SUPER_ADMIN", "COLLEGE_ADMIN"]


class IsFaculty(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY"]


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY", "STUDENT"]


class IsAdminOrFaculty(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY"]


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return request.user.is_authenticated
        return request.user.role in ["SUPER_ADMIN", "COLLEGE_ADMIN"]
