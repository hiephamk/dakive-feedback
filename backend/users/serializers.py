from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from .models import User
from Building.models import Organization


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'organizationid', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class CreateUserSerializer(UserCreateSerializer):
    # Define organizationid as PrimaryKeyRelatedField for proper handling
    organizationid = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        required=False,
        allow_null=True,
        write_only=False  # Allow it to be read as well
    )
    
    # Explicitly define is_active
    is_active = serializers.BooleanField(required=False, default=False)
    
    # Keep re_password for validation
    re_password = serializers.CharField(write_only=True)

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = [
            'id',
            'first_name', 
            'last_name', 
            'email', 
            'password',
            're_password',
            'organizationid',
            'is_active'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'required': False}
        }

    def validate(self, data):
        # Check password confirmation
        if data.get('password') != data.get('re_password'):
            raise serializers.ValidationError({
                "re_password": "Passwords do not match"
            })
        
        # Debug logging
        print(f"Validation - is_active: {data.get('is_active')}")
        print(f"Validation - organizationid: {data.get('organizationid')}")
        
        return data

    def create(self, validated_data):
        # Debug: Print what we received
        print(f"Creating user with validated_data: {validated_data}")
        
        # Remove re_password as it's not a model field
        validated_data.pop('re_password', None)
        
        # Extract is_active before calling super()
        is_active = validated_data.get('is_active', False)
        print(f"Extracted is_active: {is_active}")
        
        # Create the user using the parent create method
        user = super().create(validated_data)
        
        # Explicitly set is_active after creation
        if user.is_active != is_active:
            user.is_active = is_active
            user.save(update_fields=['is_active'])
            print(f"Updated user.is_active to: {user.is_active}")
        
        print(f"Final user.is_active: {user.is_active}")
        return user
