from django.urls import path
from . import views

urlpatterns = [
    path("chat/", views.ChatStreamView.as_view(), name="chat"),
    path("conversations/", views.ConversationListView.as_view(), name="conversation-list"),
    path("conversations/<int:conversation_id>/", views.ConversationDetailView.as_view(), name="conversation-detail"),
    path("school-pulse/", views.SchoolPulseView.as_view(), name="school-pulse"),
    path("school-pulse/report/", views.SchoolPulseReportView.as_view(), name="school-pulse-report"),
]
