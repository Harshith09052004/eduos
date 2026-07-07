from django.urls import path
from . import views

urlpatterns = [
    path("campaigns/", views.CampaignListView.as_view(), name="campaign-list"),
    path("campaigns/create/", views.CampaignCreateView.as_view(), name="campaign-create"),
    path("campaigns/<int:campaign_id>/", views.CampaignDetailView.as_view(), name="campaign-detail"),
    path("campaigns/<int:campaign_id>/send/", views.CampaignSendView.as_view(), name="campaign-send"),
    path("campaigns/generate-content/", views.GenerateEmailContentView.as_view(), name="campaign-generate"),
]
