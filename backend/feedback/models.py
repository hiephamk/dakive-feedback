from django.db import models
from Building.models import Building, Room
# Create your models here.
# class Room_Report(models.Model):
#     room = models.ForeignKey(Room, on_delete=models.CASCADE)
#     building = models.ForeignKey(Building, on_delete=models.CASCADE)
#     room_status = models.CharField(max_length=255, blank=True, null=True)
#     heat_status = models.CharField(max_length=255, blank=True, null=True)
#     electric_status = models.CharField(max_length=255, blank=True, null=True)
#     internet_status = models.CharField(max_length=255, blank=True, null=True)
#     noise_status = models.CharField(max_length=255, blank=True, null=True)
#     air_status = models.CharField(max_length=255, blank=True, null=True)
#     neighborhood_status = models.CharField(max_length=255, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     def __str__(self):
#         return f"Report of {self.room.name }"

class Room_Report(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
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



