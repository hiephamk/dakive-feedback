from rest_framework import serializers
from .models import Room_Report, Sensor_Report

class RoomReportSerializer(serializers.ModelSerializer):
    room_name = serializers.SerializerMethodField(read_only=True)
    building_name = serializers.SerializerMethodField(read_only=True)
    organization_name = serializers.SerializerMethodField(read_only=True)
    room_external_id = serializers.SerializerMethodField(read_only=True)
    average_rating = serializers.SerializerMethodField(read_only=True) #calculate the average_rating of report in the room
    
    class Meta:
        model = Room_Report
        fields = '__all__'

    def get_room_name(self, obj):
        return obj.room.name

    def get_building_name(self, obj):
        return obj.building.name
    def get_organization_name(self, obj):
        return obj.organization.name
    def get_room_external_id(self, obj):
        return obj.room.external_id
    
    def get_average_rating(self,obj):
        return obj.average_rating

class SensorReportSerializer(serializers.ModelSerializer):
    room_name = serializers.SerializerMethodField(read_only=True)
    building_name = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model =  Sensor_Report
        fields = '__all__'
    
    def validate(self, data): #validate rooms in the building
        room = data.get("room")
        building = data.get("building")

        if room and building and room.building != building:
            raise serializers.ValidationError("The selected room does not belong to the specified building.")
        
        return data

    def get_room_name(self, obj):
        return obj.room.name

    def get_building_name(self, obj):
        return obj.building.name
    
# class OptionalFeedbackSerializer(serializers.Serializer):
#     room_name = serializers.SerializerMethodField(read_only=True)
#     building_name = serializers.SerializerMethodField(read_only=True)
    
#     class Meta:
#         model =  OptionalFeedback
#         fields = '__all__'
    
#     def validate(self, data): #validate rooms in the building
#         room = data.get("room")
#         building = data.get("building")

#         if room and building and room.building != building:
#             raise serializers.ValidationError("The selected room does not belong to the specified building.")
        
#         return data

#     def get_room_name(self, obj):
#         return obj.room.name

#     def get_building_name(self, obj):
#         return obj.building.name