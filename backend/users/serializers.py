from djoser.serializers import UserCreateSerializer, UserSerializer
from rest_framework import serializers
from .models import User


class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = '__all__'


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
