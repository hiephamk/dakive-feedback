from djoser.serializers import UserCreateSerializer
from django.contrib.auth.models import User
from rest_framework import serializers

class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'username')
