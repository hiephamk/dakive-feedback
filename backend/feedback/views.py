from rest_framework import generics, permissions, viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import RoomReportSerializer
from .models import Room_Report


# Create your views here.
class RoomReportCreateView(generics.CreateAPIView):
    serializer_class = RoomReportSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Room_Report.objects.all()



class RoomReportListView(generics.ListAPIView):
    queryset = Room_Report.objects.all()
    serializer_class = RoomReportSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        return Room_Report.objects.filter(building__owner=user)
