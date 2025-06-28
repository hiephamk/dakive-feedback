from django.db import models
from Building.models import Building, Room, Organization

class Room_Report(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='room_report')
    temperature_rating = models.IntegerField()
    temperature_notes = models.TextField(blank=True, null=True)
    air_quality_rating = models.IntegerField()
    air_quality_notes = models.TextField(blank=True, null=True)
    draft_rating = models.IntegerField()
    draft_notes = models.TextField(blank=True, null=True)
    odor_rating = models.IntegerField()
    odor_notes = models.TextField(blank=True, null=True)
    lighting_rating = models.IntegerField()
    lighting_notes = models.TextField(blank=True, null=True)
    structural_change_rating = models.IntegerField()
    structural_change_notes = models.TextField(blank=True, null=True)
    cleanliness_rating = models.IntegerField()
    cleanliness_notes = models.TextField(blank=True, null=True)
    maintenance_notes = models.TextField(blank=True, null=True)
    general_notes = models.TextField(blank=True, null=True)
    feedback_status = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    hasViewed = models.BooleanField(default=False)
    def __str__(self):
        return f"room Report for {self.room.name} in {self.building} - (roomId: {self.room})"

class Sensor_Report(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    temperature = models.FloatField(null=True, blank=True)
    humidity = models.FloatField(null=True, blank=True)
    co2 = models.FloatField(null=True, blank=True)
    light= models.IntegerField(null=True, blank=True, default=False)
    motion = models.BooleanField(default=False, null=True, blank=True) 
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f" {self.room.name} in {self.building.name}"

