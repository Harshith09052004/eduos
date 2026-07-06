from django.urls import path
from . import views

urlpatterns = [
    path("chat/", views.ChatStreamView.as_view(), name="chat"),
    path("conversations/", views.ConversationListView.as_view(), name="conversation-list"),
    path("conversations/<int:conversation_id>/", views.ConversationDetailView.as_view(), name="conversation-detail"),
    path("conversations/<int:conversation_id>/delete/", views.ConversationDeleteView.as_view(), name="conversation-delete"),
]
