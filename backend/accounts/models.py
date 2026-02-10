from django.db import models
from django.contrib.auth.models import User

class Order(models.Model):
    # ESTA LÍNEA ES LA QUE PERMITE INVITADOS. DEBE TENER null=True y blank=True
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='Pagado')

    def __str__(self):
        return f"Pedido {self.id} - {self.user.username if self.user else 'Invitado'}"