from rest_framework.generics import ListAPIView
from .models import Product
from .serializers import ProductSerializer

class ProductListView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(available=True)