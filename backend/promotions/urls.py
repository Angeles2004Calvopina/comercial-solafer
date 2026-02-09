#backend/promotions/urls.py

from django.urls import path
from .views import ActivePromotionListView

urlpatterns = [
    path("active/", ActivePromotionListView.as_view(), name="active-promotions"),
]