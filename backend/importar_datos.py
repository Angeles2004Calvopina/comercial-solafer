# backend/importar_datos.py

import os
import csv
import django

# Configuración de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Category, Subcategory, Product

def importar_todo():
    try:
        # 1. Cargar Categorías Padre
        print("--- 1. Cargando Categorías Padre ---")
        cat_map = {}
        with open('Categorías_Padre.csv', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                nombre = row['name'].strip()
                cat, _ = Category.objects.get_or_create(name=nombre)
                cat_map[nombre] = cat
                print(f"Creada: {nombre}")

        # 2. Cargar Subcategorías
        print("\n--- 2. Cargando Subcategorías ---")
        sub_map = {}
        with open('Categorías_Hijas.csv', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                nombre_sub = row['name'].strip()
                nombre_padre = row['parent'].strip()
                
                padre_obj = cat_map.get(nombre_padre)
                if padre_obj:
                    sub, _ = Subcategory.objects.get_or_create(
                        name=nombre_sub, 
                        category=padre_obj
                    )
                    sub_map[nombre_sub] = sub
                    print(f"Sub: {nombre_sub} -> {nombre_padre}")

        # 3. Cargar Productos masivamente
        print("\n--- 3. Cargando Productos (+1400) ---")
        productos_para_crear = []
        with open('Productos.csv', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                nombre_prod = row['name'].strip()
                nombre_sub = row['category'].strip()
                precio = float(row['price'].replace(',', '.'))
                
                sub_obj = sub_map.get(nombre_sub)
                
                # Si el nombre de la subcategoría no existe en el mapa, 
                # lo enviamos a una subcategoría por defecto o la primera que encuentre
                if not sub_obj:
                    # Intento de búsqueda si no estaba en el mapa (por si hay "Interiores" vs "Interiores y medias")
                    sub_obj = Subcategory.objects.filter(name__icontains=nombre_sub).first()

                if sub_obj:
                    productos_para_crear.append(Product(
                        name=nombre_prod,
                        price=precio,
                        subcategory=sub_obj,
                        stock=10,
                        available=True
                    ))

        # El método bulk_create es el más rápido para cargar miles de datos
        if productos_para_crear:
            Product.objects.bulk_create(productos_para_crear)
            print(f"✅ ¡ÉXITO! Se crearon {len(productos_para_crear)} productos.")
        else:
            print("❌ No se encontraron productos válidos para cargar.")

    except Exception as e:
        print(f"❌ ERROR CRÍTICO: {e}")

if __name__ == '__main__':
    importar_todo()