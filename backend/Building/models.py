from django.conf import settings
from django.db import models


class Organization(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, default="Finland")
    postal_code = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    isView = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.name}"
    @property
    def get_name(self):
        return self.name
    # @property
    # def room_count(self):
    #     return Room.objects.filter(building__organization=self).count()

class Building(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, related_name='buildings', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    building_size = models.CharField(max_length=50, null=True, blank=True)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, default="Finland")
    postal_code = models.CharField(max_length=20)
    building_img = models.ImageField(upload_to='building', null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    external_id = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.id}"

class Room(models.Model):
    name = models.CharField(max_length=255)
    room_size = models.CharField(max_length=50, null=True, blank=True)
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='rooms_building')
    # organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='room_organization')
    floor = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    external_id = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.building.name} {self.id}"
    @property
    def get_organization(self):
        return self.building.organization