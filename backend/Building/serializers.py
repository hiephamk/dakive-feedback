from rest_framework import serializers
from .models import Room, Building, Organization

class RoomSerializer(serializers.ModelSerializer):
    building_name = serializers.SerializerMethodField()
    class Meta:
        model = Room
        fields = '__all__'
    def get_building_name(self, obj):
        return obj.building.name if obj.building else None
    def validate(self, data):
        name = data.get('name')
        building = data.get('building')

        # For create a new room
        if self.instance is None:
            if Room.objects.filter(name__iexact=name, building=building).exists():
                raise serializers.ValidationError("The name already exists in this building.")
        else:
            # For update, exclude current room
            if Room.objects.filter(name__iexact=name, building=building).exclude(pk=self.instance.pk).exists():
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

        # For create a new building
        if self.instance is None:
            if Building.objects.filter(name__iexact=name, organization=organization).exists():
                raise serializers.ValidationError("This name already exists")
        else:
            # For update, exclude current building
            if Building.objects.filter(name__iexact=name, organization=organization).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("This name already exists")
        
        return data

class OrganizationSerializer(serializers.ModelSerializer):
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