# backend/products/models.py

from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Categoría")
    slug = models.SlugField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    category = models.ForeignKey(
        Category,
        related_name="subcategories",
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100, verbose_name="Subcategoría")
    slug = models.SlugField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Subcategorías"

    def __str__(self):
        return f"{self.category.name} > {self.name}"


class Product(models.Model):
    subcategory = models.ForeignKey(
        Subcategory,
        related_name="products",
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.URLField(blank=True)
    stock = models.IntegerField(default=0)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name