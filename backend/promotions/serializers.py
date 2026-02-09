#backend/promotions/serializers.py

from rest_framework import serializers
from .models import Promotion

class PromotionSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Promotion
        fields = ["id", "name", "discount_percentage", "products", "active"]