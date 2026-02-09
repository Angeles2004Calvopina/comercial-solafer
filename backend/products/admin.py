# backend/products/admin.py

from django.contrib import admin
from .models import Category, Subcategory, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category']
    list_filter = ['category']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'subcategory', 'price', 'stock', 'available']
    list_filter = ['available', 'subcategory']
    search_fields = ['name', 'description']