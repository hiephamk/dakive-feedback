from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from Building.models import Organization
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from users.models import User
from .models import Organization_membership
from .serializers import OrganizationManagerSerializer  # Import the serializer

class OrganizationMembershipView(generics.ListCreateAPIView):
    serializer_class = OrganizationManagerSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Organization_membership.objects.all()
    
    
class OrganizationMemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrganizationManagerSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]  # Adjust as needed
    queryset = Organization_membership.objects.all()