from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
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

class SearchUser(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomUserSerializer
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        keyword = self.request.GET.get('keyword', '').strip()
        if not keyword:
            return User.objects.none()

        keywords = keyword.split()
        query = Q()
        for word in keywords:
            query |= (
                Q(first_name__icontains=word) |
                Q(last_name__icontains=word) |
                Q(email__icontains=word)
            )

        return User.objects.filter(query).order_by('first_name')