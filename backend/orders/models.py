# backend/orders/models.py

from django.db import models
from django.contrib.auth.models import User
from products.models import Product

class Order(models.Model):
    # Si el usuario está logueado lo vinculamos, si no, queda en blanco (invitado)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Datos que pedía tu código antiguo
    email = models.EmailField()
    cedula_ruc = models.CharField(max_length=13)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15)
    direccion = models.TextField()
    referencia = models.TextField(blank=True, null=True)
    fecha_entrega = models.DateField()
    observaciones = models.TextField(blank=True, null=True)
    
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Pendiente')

    def __str__(self):
        return f"Orden {self.id} - {self.nombres}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Precio al momento de la compra