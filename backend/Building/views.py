from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q, Value

from .serializers import RoomSerializer, BuildingSerializer, OrganizationSerializer
from .models import Room, Building, Organization


# Create your views here.

class RoomListViewFeedback(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    
class RoomListView(generics.ListCreateAPIView):
    # queryset = Room.objects.all()
    serializer_class = RoomSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        user = self.request.user
        return Room.objects.filter(building__owner=user)
    
class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class BuildingListView(generics.ListCreateAPIView):
    # queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        user = self.request.user
        return Building.objects.filter(owner=user)
    
class BuildingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class OrganizationListView(generics.ListCreateAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]
class OrganizationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class RoomSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]  # Typo: should be "permission_classes"
    serializer_class = RoomSerializer       # Typo: should be "serializer_class"
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        keyword = self.request.GET.get('keyword', '').strip()
        if not keyword:
            return Room.objects.none()

        keywords = keyword.split()
        query = Q()
        for word in keywords:
            query &= (
                Q(name__icontains=word) |
                Q(room_size__icontains=word) |
                Q(floor__icontains=word) |
                Q(building__name__icontains=word) |
                Q(description__icontains=word)
            )

        return Room.objects.select_related('building').filter(query).order_by('-name')

class RoomSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated] 
    serializer_class = RoomSerializer 
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        keyword = self.request.GET.get('keyword', '').strip()
        if not keyword:
            return Room.objects.none()

        keywords = keyword.split()
        query = Q()
        for word in keywords:
            query &= (
                Q(name__icontains=word) |
                Q(room_size__icontains=word) |
                Q(floor__icontains=word) |
                Q(building__name__icontains=word) |
                Q(description__icontains=word)
            )

        return Room.objects.select_related('building').filter(query).order_by('-name')

class BuildingSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BuildingSerializer 
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        keyword = self.request.GET.get('keyword', '').strip()
        if not keyword:
            return Building.objects.none()

        keywords = keyword.split()
        query = Q()
        for word in keywords:
            query &= (
                Q(name__icontains=word) |
                Q(building_size__icontains=word) |
                Q(organization__name__icontains=word) |
                Q(street__icontains=word) |
                Q(city__icontains=word) |
                Q(state__icontains=word) |
                Q(country__icontains=word) |
                Q(postal_code__icontains=word) |
                Q(description__icontains=word)
            )

        return Building.objects.filter(query).order_by('-name')