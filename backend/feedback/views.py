from rest_framework import generics, permissions, viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Avg, Q

from .serializers import RoomReportSerializer
from .models import Room_Report


# Create your views here.
class RoomReportCreateView(generics.CreateAPIView):
    serializer_class = RoomReportSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]
    queryset = Room_Report.objects.all()

class RoomReportListView(generics.ListAPIView):
    queryset = Room_Report.objects.all()
    serializer_class = RoomReportSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    # def get_queryset(self):
    #     user = self.request.user
    #     return Room_Report.objects.filter(building__owner=user)

class RoomReportAnalyticsView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reports = Room_Report.objects.filter(building__owner=request.user)

        if not reports.exists():
            return Response({"error": "No reports found"}, status=404)

        # Group by room and get the latest report for each room
        room_data = []
        unique_rooms = reports.values('room').distinct()

        for room in unique_rooms:
            room_id = room['room']
            latest_report = reports.filter(room__id=room_id).order_by('-created_at').first()
            room_data.append({
                'room_id': room_id,
                'room_name': latest_report.room.name,
                'building_name': latest_report.building.name,
                'created_at': latest_report.created_at.isoformat(),
                'temperature': latest_report.temperature_rating if latest_report.temperature_rating is not None else 0,
                'air_quality': latest_report.air_quality_rating if latest_report.air_quality_rating is not None else 0,
                'draft': latest_report.draft_rating if latest_report.draft_rating is not None else 0,
                'odor': latest_report.odor_rating if latest_report.odor_rating is not None else 0,
                'lighting': latest_report.lighting_rating if latest_report.lighting_rating is not None else 0,
                'structural': latest_report.structural_change_rating if latest_report.structural_change_rating is not None else 0,
                'cleanliness': latest_report.cleanliness_rating if latest_report.cleanliness_rating is not None else 0,
            })

        return Response(room_data)