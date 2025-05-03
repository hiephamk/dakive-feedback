from rest_framework import serializers
from .models import Room, Building, Organization


class RoomSerializer(serializers.ModelSerializer):
    building_name = serializers.SerializerMethodField()
    class Meta:
        model = Room
        fields = '__all__'
    def get_building_name(self, obj):
        return obj.building.name if obj.building else None

class BuildingSerializer(serializers.ModelSerializer):
    organization_name = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()
    class Meta:
        model = Building
        fields = "__all__"
    def get_organization_name(self, obj):
        return obj.organization.name if obj.organization else None
    def get_owner_name(self, obj):
        return obj.owner.get_full_name if obj.owner else None


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = "__all__"
