from rest_framework import generics, permissions, viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Avg, Q
from django.db.models.functions import Round

from .serializers import RoomReportSerializer
from .models import Room_Report


# Create your views here.
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
        return Room_Report.objects.filter(building__owner=user)

# class RoomReportAnalyticsView(generics.RetrieveAPIView):
#     permission_classes = [IsAuthenticated]
#     authentication_classes = [JWTAuthentication]

#     def get(self, request):
#         reports = Room_Report.objects.filter(building__owner=request.user)

#         if not reports.exists():
#             return Response({"error": "No reports found"}, status=404)

#         # Group by room and get the latest report for each room
#         room_data = []
#         unique_rooms = reports.values('room').distinct()

#         for room in unique_rooms:
#             room_id = room['room']
#             latest_report = reports.filter(room__id=room_id).order_by('-created_at').first()
#             #all_report = reports.filter(room__id=room_id).order_by('-created_at')
#             if latest_report:
#                 ratings = [
#                         latest_report.temperature_rating if latest_report.temperature_rating is not None else 0,
#                         latest_report.air_quality_rating if latest_report.air_quality_rating is not None else 0,
#                         latest_report.draft_rating if latest_report.draft_rating is not None else 0,
#                         latest_report.odor_rating if latest_report.odor_rating is not None else 0,
#                         latest_report.lighting_rating if latest_report.lighting_rating is not None else 0,
#                         latest_report.structural_change_rating if latest_report.structural_change_rating is not None else 0,
#                         latest_report.cleanliness_rating if latest_report.cleanliness_rating is not None else 0,
#                     ]
#                     # Calculate average rating: sum of ratings divided by 50
#                 total_rating = sum(ratings)
#                 average_rating = total_rating / 7
#                 room_data.append({
#                     'room_id': room_id,
#                     'room_name': latest_report.room.name,
#                     'building_name': latest_report.building.name,
#                     'created_at': latest_report.created_at.isoformat(),
#                     'temperature': latest_report.temperature_rating if latest_report.temperature_rating is not None else 0,
#                     'air_quality': latest_report.air_quality_rating if latest_report.air_quality_rating is not None else 0,
#                     'draft': latest_report.draft_rating if latest_report.draft_rating is not None else 0,
#                     'odor': latest_report.odor_rating if latest_report.odor_rating is not None else 0,
#                     'lighting': latest_report.lighting_rating if latest_report.lighting_rating is not None else 0,
#                     'structural': latest_report.structural_change_rating if latest_report.structural_change_rating is not None else 0,
#                     'cleanliness': latest_report.cleanliness_rating if latest_report.cleanliness_rating is not None else 0,
#                     'average_rating': round(average_rating, 1)
#                 })

#         return Response(room_data)



class RoomReportAnalyticsView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        reports = Room_Report.objects.filter(building__owner=request.user)

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

                # Build the response dictionary
                room_data.append({
                    'room_id': room_id,
                    'room_name': latest_report.room.name,
                    'building_name': latest_report.building.name,
                    'created_at': latest_report.created_at.isoformat(),  # Latest report timestamp
                    'temperature': latest_report.temperature_rating if latest_report.temperature_rating is not None else 0,
                    'air_quality': latest_report.air_quality_rating if latest_report.air_quality_rating is not None else 0,
                    'draft': latest_report.draft_rating if latest_report.draft_rating is not None else 0,
                    'odor': latest_report.odor_rating if latest_report.odor_rating is not None else 0,
                    'lighting': latest_report.lighting_rating if latest_report.lighting_rating is not None else 0,
                    'structural': latest_report.structural_change_rating if latest_report.structural_change_rating is not None else 0,
                    'cleanliness': latest_report.cleanliness_rating if latest_report.cleanliness_rating is not None else 0,
                    # Add average ratings
                    'avg_temperature': avg_ratings['avg_temperature'] if avg_ratings['avg_temperature'] is not None else 0,
                    'avg_air_quality': avg_ratings['avg_air_quality'] if avg_ratings['avg_air_quality'] is not None else 0,
                    'avg_draft': avg_ratings['avg_draft'] if avg_ratings['avg_draft'] is not None else 0,
                    'avg_odor': avg_ratings['avg_odor'] if avg_ratings['avg_odor'] is not None else 0,
                    'avg_lighting': avg_ratings['avg_lighting'] if avg_ratings['avg_lighting'] is not None else 0,
                    'avg_structural': avg_ratings['avg_structural'] if avg_ratings['avg_structural'] is not None else 0,
                    'avg_cleanliness': avg_ratings['avg_cleanliness'] if avg_ratings['avg_cleanliness'] is not None else 0,
                })

        return Response(room_data)