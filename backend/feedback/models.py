from django.db import models
from Building.models import Building, Room
# Create your models here.
class Room_Report(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    room_status = models.CharField(max_length=255, blank=True, null=True)
    heat_status = models.CharField(max_length=255, blank=True, null=True)
    electric_status = models.CharField(max_length=255, blank=True, null=True)
    internet_status = models.CharField(max_length=255, blank=True, null=True)
    noise_status = models.CharField(max_length=255, blank=True, null=True)
    air_status = models.CharField(max_length=255, blank=True, null=True)
    neighborhood_status = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"Report of {self.room.name }"