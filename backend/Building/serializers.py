from rest_framework import serializers
from .models import Room, Building, Organization


class RoomSerializer(serializers.ModelSerializer):
    room_owner_name = serializers.SerializerMethodField()
    building_name = serializers.SerializerMethodField()
    class Meta:
        model = Room
        fields = '__all__'
    def get_room_owner_name(self, obj):
        return obj.owner.get_full_name
    def get_building_name(self, obj):
        return obj.building.name

class BuildingSerializer(serializers.ModelSerializer):
    organization_name = serializers.SerializerMethodField()
    class Meta:
        model = Building
        fields = "__all__"
    def get_organization_name(self, obj):
        return f"{obj.organization.name}"

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = "__all__"
