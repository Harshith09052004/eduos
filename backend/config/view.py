from django.http import JsonResponse


def home(request):
    return JsonResponse({
        "project": "EduOS AI",
        "version": "1.0.0",
        "status": "Running",
        "message": "Welcome to EduOS AI Backend 🚀"
    })