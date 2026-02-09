from rest_framework import serializers
from .models import Product, Subcategory, Category

# 🔹 Categoría simple
class CategorySimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]

# 🔹 Subcategoría simple (para productos)
class SubcategorySimpleSerializer(serializers.ModelSerializer):
    category = CategorySimpleSerializer()

    class Meta:
        model = Subcategory
        fields = ["id", "name", "slug", "category"]

# 🔹 Categoría CON subcategorías (solo para /categories/)
class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "subcategories"]

    def get_subcategories(self, obj):
        return [
            {
                "id": sub.id,
                "name": sub.name,
                "slug": sub.slug
            }
            for sub in obj.subcategories.all()
        ]

# 🔹 Producto (SIN recursión)
class ProductSerializer(serializers.ModelSerializer):
    subcategory = SubcategorySimpleSerializer()

    class Meta:
        model = Product
        fields = "__all__"