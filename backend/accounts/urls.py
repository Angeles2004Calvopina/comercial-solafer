# backend/accounts/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, UserDataView, RecoverAccountView, 
    ResetPasswordView, DeleteAccountView, UserOrdersView
)

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserDataView.as_view(), name='user_data'),
    
    path('my-orders/', UserOrdersView.as_view(), name='user_orders'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete_account'),
    
    path('recover-account/', RecoverAccountView.as_view(), name='recover_account'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
]