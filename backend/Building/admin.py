from django.contrib import admin

from Building.models import Organization, Building, Room

# Register your models here.
admin.site.register(Organization)
# admin.site.register(Address)
admin.site.register(Building)
admin.site.register(Room)