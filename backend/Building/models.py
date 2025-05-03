from django.conf import settings
from django.db import models


class Organization(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    def __str__(self):
        return f"{self.name}"
    @property
    def get_name(self):
        return self.name

class Building(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    building_size = models.CharField(max_length=50, default="N/A")
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    building_img = models.ImageField(upload_to='building', null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    def __str__(self):
        return f"{self.name} {self.organization}"

class Room(models.Model):
    #owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    room_size = models.CharField(max_length=50, default="N/A")
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    floor = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    def __str__(self):
        return f"{self.name} - {self.building}"
