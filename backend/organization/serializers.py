from rest_framework import serializers
from .models import Organization_membership
from users.models import User
from Building.models import Organization
from django.db import IntegrityError

class MemberSerializer(serializers.ModelSerializer):
    members_full_name = serializers.SerializerMethodField()
    members_email = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'members_full_name', 'members_email']

    def get_members_full_name(self, obj):
        return obj.get_full_name # get_full_name is a property, no parenthese needed

    def get_members_email(self, obj):
        return obj.email

class OrganizationManagerSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all()) 
    members_full_name = serializers.SerializerMethodField()
    members_email = serializers.SerializerMethodField()
    members_owner = serializers.SerializerMethodField()
    organization_name = serializers.SerializerMethodField()

    class Meta:
        model = Organization_membership
        fields = "__all__"
        read_only_fields = ['created_at', 'updated_at', 'members_full_name', 'members_email', 'members_owner']
   
    def get_organization_name(self, obj):
        return obj.organization.name if obj.organization else None
    def get_members_full_name(self, obj):
        return obj.user.get_full_name if obj.user else None
    def get_members_email(self, obj):
        return obj.user.email if obj.user else None
    def get_members_owner(self, obj):
        owner = obj.organization.owner
        if owner:
            return MemberSerializer(owner).data
        return None
    # ensure unique members within organizations
    def validate(self, data):
        organization = data.get('organization')
        user= data.get('user')

        # For create a new building
        if self.instance is None:
            if Organization_membership.objects.filter(organization__exact=organization, user=user).exists():
                raise serializers.ValidationError("This user is already a member of this organization.")

        else:
            # For update, exclude current Organization
            if Organization_membership.objects.filter(organization__exact=organization, user=user).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("This user is already a member of this organization.")

        return data