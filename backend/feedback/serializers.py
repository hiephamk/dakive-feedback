from rest_framework import serializers
from .models import Room_Report

class RoomReportSerializer(serializers.ModelSerializer):
    room_name = serializers.SerializerMethodField()
    building_name = serializers.SerializerMethodField()
    class Meta:
        model = Room_Report
        fields = '__all__'

    def get_room_name(self, obj):
        return obj.room.name

    def get_building_name(self, obj):
        return obj.building.name
