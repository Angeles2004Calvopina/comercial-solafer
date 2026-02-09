# backend/products/serializers.py

from rest_framework import serializers
from .models import Product, Subcategory, Category

# 🔹 Subcategoría simple (para meterla dentro de Category)
class SubcategorySimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = ["id", "name", "slug"]

# 🔹 Categoría CON sus subcategorías
class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubcategorySimpleSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "subcategories"]

# 🔹 Subcategoría completa (para productos)
class SubcategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Subcategory
        fields = ["id", "name", "slug", "category"]

# 🔹 Producto
class ProductSerializer(serializers.ModelSerializer):
    subcategory = SubcategorySerializer()

    class Meta:
        model = Product
        fields = "__all__"