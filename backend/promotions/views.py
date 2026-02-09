#backend/promotions/views.py

from rest_framework.generics import ListAPIView
from .models import Promotion
from .serializers import PromotionSerializer

class ActivePromotionListView(ListAPIView):
    queryset = Promotion.objects.filter(active=True)
    serializer_class = PromotionSerializer