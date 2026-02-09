#backend/promotions/models.py

from django.db import models
from products.models import Product

class Promotion(models.Model):
    name = models.CharField(max_length=100)
    discount_percentage = models.PositiveIntegerField()
    active = models.BooleanField(default=True)
    products = models.ManyToManyField(Product, related_name="promotions")

    def __str__(self):
        return self.name