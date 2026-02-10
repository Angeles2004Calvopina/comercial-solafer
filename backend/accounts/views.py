import random
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Order

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        try:
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password']
            )
            profile = user.profile
            profile.telefono = data.get('phone', '')
            profile.save()
            return Response({"message": "Usuario creado"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserDataView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "profile": {
                "phone": user.profile.telefono,
                "cedula": user.profile.cedula_ruc,
                "direccion": user.profile.direccion
            }
        })

class UserOrdersView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if not request.user.is_authenticated:
             return Response({"error": "Debes estar logueado para ver tu historial"}, status=status.HTTP_401_UNAUTHORIZED)
        
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        return Response([{
            "id": o.id, "created_at": o.created_at, "total_amount": o.total_amount, "status": o.status
        } for o in orders], status=status.HTTP_200_OK)

    def post(self, request):
        try:
            data = request.data
            # Si es invitado, user_obj será None
            user_obj = request.user if request.user.is_authenticated else None
            
            # Limpiamos el monto por si viene con "$", "," o espacios
            raw_amount = data.get('total_amount')
            if isinstance(raw_amount, str):
                raw_amount = raw_amount.replace('$', '').replace(',', '').strip()

            nuevo_pedido = Order.objects.create(
                user=user_obj,
                total_amount=raw_amount,
                status=data.get('status', 'Pagado')
            )
            return Response({"message": "Pedido guardado con éxito", "id": nuevo_pedido.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Revisa la terminal donde corre Django para ver este mensaje:
            print(f"DEBUG ERROR: {str(e)}") 
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DeleteAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        try:
            request.user.delete()
            return Response({"message": "Cuenta eliminada"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RecoverAccountView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email) 
            pin = str(random.randint(100000, 999999))
            profile = user.profile
            profile.recovery_pin = pin
            profile.pin_created_at = timezone.now()
            profile.save()
            print(f"--- PIN DE RECUPERACIÓN PARA {email}: {pin} ---")
            return Response({"message": "PIN generado con éxito", "debug_pin": pin}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        pin = request.data.get('pin')
        new_password = request.data.get('password')
        try:
            user = User.objects.get(email=email)
            if user.profile.recovery_pin == pin:
                user.set_password(new_password)
                user.save()
                user.profile.recovery_pin = None 
                user.profile.save()
                return Response({"message": "Contraseña actualizada"}, status=status.HTTP_200_OK)
            return Response({"error": "PIN incorrecto"}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_400_BAD_REQUEST)