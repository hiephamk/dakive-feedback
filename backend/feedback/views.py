from rest_framework import generics, permissions, viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Avg, Q
from django.db.models.functions import Round

from .serializers import RoomReportSerializer, SensorReportSerializer
from .models import Room_Report, Sensor_Report


class SensorReportUserView(generics.ListCreateAPIView):
    serializer_class = SensorReportSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [JWTAuthentication]
    queryset = Sensor_Report.objects.all()
    
class SensorReportCreateView(generics.ListCreateAPIView):
    serializer_class = SensorReportSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Sensor_Report.objects.all().order_by('-created_at')

class SensorReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SensorReportSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Sensor_Report.objects.all()

    # def get_queryset(self):
    #     # user = self.request.user
    #     return Sensor_Report.objects.all().order_by('-created_at')
    
class RoomReportCreateView(generics.CreateAPIView):
    serializer_class = RoomReportSerializer
    permission_classes = [AllowAny]
    # authentication_classes = [JWTAuthentication]
    queryset = Room_Report.objects.all()

class RoomReportListView(generics.ListAPIView):
    # queryset = Room_Report.objects.all()
    serializer_class = RoomReportSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        return Room_Report.objects.all().order_by('-created_at')

class RoomReportAnalyticsView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class= RoomReportSerializer
    # queryset = Room_Report.objects.all()

    def get(self, request):
        reports = Room_Report.objects.all()

        if not reports.exists():
            return Response({"error": "No reports found"}, status=404)

        # Group by room and process reports
        room_data = []
        unique_rooms = reports.values('room').distinct()

        for room in unique_rooms:
            room_id = room['room']
            # Get all reports for this room, sorted by latest first
            all_reports = reports.filter(room__id=room_id).order_by('-created_at')
            # Get the latest report for basic details
            latest_report = all_reports.first()

            if latest_report:  # Ensure at least one report exists
                # Calculate average ratings across all reports for this room
                avg_ratings = all_reports.aggregate(
                    avg_temperature=Round(Avg('temperature_rating'), 1),
                    avg_air_quality=Round(Avg('air_quality_rating'), 1),
                    avg_draft=Round(Avg('draft_rating'), 1),
                    avg_odor=Round(Avg('odor_rating'), 1),
                    avg_lighting=Round(Avg('lighting_rating'), 1),
                    avg_structural=Round(Avg('structural_change_rating'), 1),
                    avg_cleanliness=Round(Avg('cleanliness_rating'), 1)
                )
                room_avg_ratings = []
                for report in all_reports:
                    room_avg_ratings.append(report.average_rating)
                overall_avg_rating = round(sum(room_avg_ratings) / len(room_avg_ratings), 2) if room_avg_ratings else 0
                # Build the response dictionary
                room_data.append({
                    'room_id': room_id,
                    'room_name': latest_report.room.name,
                    'building_id': latest_report.building.id,
                    'organization_id': latest_report.organization.id,
                    'organization_name': latest_report.organization.name,
                    'building_name': latest_report.building.name,
                    'created_at': latest_report.created_at.isoformat(),  # Latest report timestamp
                    'temperature': latest_report.temperature_rating if latest_report.temperature_rating is not None else 0,
                    'air_quality': latest_report.air_quality_rating if latest_report.air_quality_rating is not None else 0,
                    'draft': latest_report.draft_rating if latest_report.draft_rating is not None else 0,
                    'odor': latest_report.odor_rating if latest_report.odor_rating is not None else 0,
                    'lighting': latest_report.lighting_rating if latest_report.lighting_rating is not None else 0,
                    'structural': latest_report.structural_change_rating if latest_report.structural_change_rating is not None else 0,
                    'cleanliness': latest_report.cleanliness_rating if latest_report.cleanliness_rating is not None else 0,
                    # 'average_rating':latest_report.average_rating if latest_report.average_rating is not None else 0,
                    # Add average ratings
                    'avg_temperature': avg_ratings['avg_temperature'] if avg_ratings['avg_temperature'] is not None else 0,
                    'avg_air_quality': avg_ratings['avg_air_quality'] if avg_ratings['avg_air_quality'] is not None else 0,
                    'avg_draft': avg_ratings['avg_draft'] if avg_ratings['avg_draft'] is not None else 0,
                    'avg_odor': avg_ratings['avg_odor'] if avg_ratings['avg_odor'] is not None else 0,
                    'avg_lighting': avg_ratings['avg_lighting'] if avg_ratings['avg_lighting'] is not None else 0,
                    'avg_structural': avg_ratings['avg_structural'] if avg_ratings['avg_structural'] is not None else 0,
                    'avg_cleanliness': avg_ratings['avg_cleanliness'] if avg_ratings['avg_cleanliness'] is not None else 0,
                    'overall_avg_rating': overall_avg_rating,
                })

        return Response(room_data)
    
class SensorDataSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SensorReportSerializer 
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        keyword = self.request.GET.get('keyword', '').strip()
        if not keyword:
            return Sensor_Report.objects.none()

        keywords = keyword.split()
        query = Q()
        for word in keywords:
            query |= (
                Q(temperature__icontains=word) |
                Q(humidity__icontains=word) |
                Q(co2__icontains=word) |
                Q(light__icontains=word) |
                Q(motion__icontains=word) |
                Q(created_at__icontains=word) |
                Q(updated_at__icontains=word)
            )
        return Sensor_Report.objects.filter(query).order_by('-created_at')