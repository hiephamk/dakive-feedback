from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomUserSerializer, CreateUserSerializer
from .models import User
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q

# Create your views here.
class CustomUserView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
class CustomUserViewDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]