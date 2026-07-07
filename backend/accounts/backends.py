from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class RollNumberBackend(ModelBackend):
    """Allow login via student roll_no or faculty employee_id instead of email."""

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)
        if password is None:
            password = kwargs.get("password")

        if not username or not password:
            return None

        # Try student roll number (case-insensitive)
        from students.models import Student
        student = Student.objects.filter(roll_no__iexact=username).first()
        if student and student.user and student.user.check_password(password):
            return student.user

        # Try faculty employee ID (case-insensitive)
        from faculty.models import Faculty
        faculty = Faculty.objects.filter(employee_id__iexact=username).first()
        if faculty and faculty.user and faculty.user.check_password(password):
            return faculty.user

        # Fallback to direct email lookup
        try:
            user = User.objects.get(email__iexact=username)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            pass

        return None
