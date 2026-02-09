#backend/products/views.py

from rest_framework.generics import ListAPIView
from django.db.models import Q
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class ProductListView(ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = None

    def get_queryset(self):
        queryset = Product.objects.filter(available=True).order_by('-id')

        category_slug = self.request.query_params.get('category_slug')
        search_query = self.request.query_params.get('search')

        if category_slug:
            queryset = queryset.filter(
                Q(subcategory__slug=category_slug) |
                Q(subcategory__category__slug=category_slug)
            ).distinct()

        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(subcategory__name__icontains=search_query)
            ).distinct()

        return queryset

class CategoryListView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer