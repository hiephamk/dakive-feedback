from django.contrib import admin
from .models import Account
from users.admin import admin
# Register your models here.
admin.site.register(Account)