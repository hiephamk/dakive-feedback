from rest_framework import serializers
from .models import Room, Building, Organization
from organization.models import Organization_membership
from feedback.models import Room_Report

class RoomSerializer(serializers.ModelSerializer):
    building_name = serializers.SerializerMethodField(read_only=True)
    organization = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Room
        fields = '__all__'
    def get_building_name(self, obj):
        return obj.building.name if obj.building else None
    
    def get_organization(self, obj):
        # Fix: Return serializable data instead of model instance
        org = obj.get_organization
        if org:
            return {
                'id': org.id,
                'name': org.name,
            }
        return None
    
    def validate(self, data):
        name = data.get('name')
        building = data.get('building')
        external_id = data.get('external_id')

        # For create a new room
        if self.instance is None:
            if Room.objects.filter(name__iexact=name, external_id__iexact=external_id, building=building).exists():
                raise serializers.ValidationError("The name already exists in this building.")
        else:
            # For update, exclude current room
            if Room.objects.filter(name__iexact=name, external_id__iexact=external_id, building=building).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("The name already exists in this building.")
        
        return data

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
    
    def validate(self, data):
        name = data.get('name')
        organization= data.get('organization')
        external_id = data.get('external_id')

        # For create a new building
        if self.instance is None:
            if Building.objects.filter(name__iexact=name, external_id__iexact=external_id, organization=organization).exists():
                raise serializers.ValidationError("This name already exists")
        else:
            # For update, exclude current building
            if Building.objects.filter(name__iexact=name, external_id__iexact=external_id, organization=organization).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("This name already exists")
        
        return data

class OrganizationSerializer(serializers.ModelSerializer):
    building_count = serializers.SerializerMethodField()
    totalRoom_count = serializers.SerializerMethodField()
    report_count = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()
    class Meta:
        model = Organization
        fields = "__all__"
    def validate(self, data):
        name = data.get('name')
        owner= data.get('owner')

        # For create a new building
        if self.instance is None:
            if Organization.objects.filter(name__iexact=name, owner=owner).exists():
                raise serializers.ValidationError("This name already exists")
        else:
            # For update, exclude current Organization
            if Organization.objects.filter(name__iexact=name, owner=owner).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("This name already exists")
        
        return data
    def get_building_count(self, obj):
        return obj.buildings.count()
    
    def get_report_count(self, obj):
        # return Room_Report.objects.filter(building__organization=obj).count()
        return obj.room_report.count()
    
    def get_totalRoom_count(self, obj):
        return Room.objects.filter(building__organization=obj).count()
    
    def get_member_count(self, obj):
        return obj.memberships.count()