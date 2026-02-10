# backend/orders/serializers.py

from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["product", "quantity", "price"]

class OrderSerializer(serializers.ModelSerializer):
    # Usamos source='items' para que coincida con el related_name del modelo
    items = OrderItemSerializer(many=True)
    customer = serializers.JSONField(write_only=True)
    create_account = serializers.BooleanField(write_only=True, default=False)

    class Meta:
        model = Order
        fields = [
            "customer",
            "items",
            "total",
            "payment_method",
            "create_account",
        ]

    def create(self, validated_data):
        customer_data = validated_data.pop("customer")
        items_data = validated_data.pop("items")
        create_account = validated_data.pop("create_account", False)

        # Usamos una transacción para que si algo falla, no se cree nada a medias
        with transaction.atomic():
            user = None
            email = customer_data.get("email")

            # Lógica de creación de usuario
            if create_account and email:
                user = User.objects.filter(username=email).first()
                if not user:
                    user = User.objects.create_user(
                        username=email,
                        email=email,
                        first_name=customer_data.get("nombres", ""),
                        last_name=customer_data.get("apellidos", ""),
                        password=customer_data.get("cedula"), # O la lógica de password que prefieras
                    )

            # Crear la Orden
            order = Order.objects.create(
                user=user,
                email=email,
                cedula_ruc=customer_data.get("cedula"),
                nombres=customer_data.get("nombres"),
                apellidos=customer_data.get("apellidos"),
                telefono=customer_data.get("phone"),
                direccion=customer_data.get("address"),
                referencia=customer_data.get("reference"),
                fecha_entrega=customer_data.get("delivery_date"),
                observaciones=customer_data.get("observations"),
                total=validated_data.get("total"),
                payment_method=validated_data.get("payment_method", "online"),
            )

            # Crear los items de la orden
            for item in items_data:
                OrderItem.objects.create(
                    order=order,
                    product=item["product"],
                    quantity=item["quantity"],
                    price=item["price"],
                )

        return order