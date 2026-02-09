from django.core.management.base import BaseCommand
from products.models import Product, Category


class Command(BaseCommand):
    help = "Reduce productos por subcategoría sin usar slice en delete()"

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=12,
            help='Cantidad máxima de productos por subcategoría'
        )

    def handle(self, *args, **options):
        limit = options['limit']

        self.stdout.write(self.style.WARNING(
            f"\nReduciendo productos a máximo {limit} por subcategoría...\n"
        ))

        categories = Category.objects.all()

        for category in categories:
            subcategories = category.subcategories.all()

            if not subcategories.exists():
                continue

            for sub in subcategories:
                qs = Product.objects.filter(
                    subcategory=sub
                ).order_by('-id')

                total = qs.count()

                if total > limit:
                    ids_to_delete = list(
                        qs.values_list('id', flat=True)[limit:]
                    )

                    deleted_count, _ = Product.objects.filter(
                        id__in=ids_to_delete
                    ).delete()

                    self.stdout.write(
                        f"✔ {category.name} > {sub.name}: {total} → {total - deleted_count}"
                    )
                else:
                    self.stdout.write(
                        f"• {category.name} > {sub.name}: {total} (sin cambios)"
                    )

        self.stdout.write(self.style.SUCCESS("\n✅ Limpieza terminada\n"))
