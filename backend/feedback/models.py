from django.db import models
from Building.models import Building, Room, Organization

class Room_Report(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="room_report")
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='room_report')
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='room_report') # use this related_name in organization serializers
    temperature_rating = models.IntegerField(default=0)
    temperature_notes = models.TextField(blank=True, null=True)
    air_quality_rating = models.IntegerField(default=0)
    air_quality_notes = models.TextField(blank=True, null=True)
    draft_rating = models.IntegerField(default=0)
    draft_notes = models.TextField(blank=True, null=True)
    odor_rating = models.IntegerField(default=0)
    odor_notes = models.TextField(blank=True, null=True)
    lighting_rating = models.IntegerField(default=0)
    lighting_notes = models.TextField(blank=True, null=True)
    structural_change_rating = models.IntegerField(default=0)
    structural_change_notes = models.TextField(blank=True, null=True)
    cleanliness_rating = models.IntegerField(default=0)
    cleanliness_notes = models.TextField(blank=True, null=True)
    maintenance_notes = models.TextField(blank=True, null=True)
    general_notes = models.TextField(blank=True, null=True)
    feedback_status = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    hasViewed = models.BooleanField(default=False) # no longer needed
    def __str__(self):
        return f"room Report for {self.room.name} in {self.building} - (roomId: {self.room})"
    
# calculate average rating for room
    @property
    def average_rating(self):
        ratings = [
            self.temperature_rating,
            self.air_quality_rating,
            self.draft_rating,
            self.odor_rating,
            self.lighting_rating,
            self.structural_change_rating,
            self.cleanliness_rating,
        ]
        return round(sum(ratings) / len(ratings),2)
# create db to store synced data from IoT devices
class Sensor_Report(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='sensor_report')
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='sensor_report')
    temperature = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)
    co2 = models.FloatField(null=True, blank=True)
    light= models.IntegerField(null=True, blank=True, default=False)
    motion = models.BooleanField(default=False, null=True, blank=True) 
    created_at = models.DateTimeField(unique=True) # as time variable of IoT
    updated_at = models.DateTimeField(auto_now_add=True, unique=True)

    def __str__(self):
        return f" {self.room.name} in {self.building.name}"

class OptionalFeedback(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="optional_feedback")
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="optional_feedback")
    food_rating = models.IntegerField(blank=True, null=True)
    cleaning_rating = models.IntegerField(blank=True, null=True)
    support_rating = models.IntegerField(blank=True, null=True)