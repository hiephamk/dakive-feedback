
from rest_framework import serializers
from .models import Post, Comment, Like, Circles, Circle_Notification, Group, Group_Members
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()
class CommentSerializer(serializers.ModelSerializer):
    author_profile_img = serializers.ReadOnlyField()
    author_name = serializers.SerializerMethodField()
    accountId = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = '__all__'
    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}" if obj.author else None

    def get_author_profile_img(self, obj):
        if obj.author.account and obj.author.account.profile_img:
            return obj.author.account.profile_img.url  # Get the image URL
        return None
    def get_accountId(self, obj):
        if obj.author.account and obj.author.account.id:
            return obj.author.account.id  # Get the userId
        return None
    def get_profile(self, obj):
        if obj.author.account and obj.author.account.profile:
            return obj.author.account.profile  # Get the userId
        return None

    def get_author_lookup_key(self, obj):
        return obj.author.account.lookup_key

class PostSerializer(serializers.ModelSerializer):
    author_profile_img = serializers.ReadOnlyField()
    author_name = serializers.SerializerMethodField()
    shared_owner_name = serializers.SerializerMethodField()
    shared_owner_profile_img = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    circle_members = serializers.SerializerMethodField()
    group_members = serializers.SerializerMethodField()
    file = serializers.FileField(required=False)
    class Meta:
        model = Post
        fields = '__all__'

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}" if obj.author else None
    def get_shared_owner_name(self, obj):
        return f"{obj.shared_owner.first_name} {obj.shared_owner.last_name}" if obj.shared_owner else None

    def get_author_profile_img(self, obj):
        if obj.author.account and obj.author.account.profile_img:
            return obj.author.account.profile_img.url  # Get the image URL
        return None
    def get_shared_owner_profile_img(self, obj):
        if obj.shared_owner and hasattr(obj.shared_owner, 'account') and obj.shared_owner.account.profile_img:
            return obj.shared_owner.account.profile_img.url  # Get the image URL
        return None

    def get_profile(self, obj):
        if obj.author.account and obj.author.account.profile:
            return obj.author.account.profile  # Get the userId
        return None

    def get_circle_members(self, obj):

        try:
            author_circle = Circles.objects.filter(owner=obj.author).first()
            if author_circle:
                return [
                    {"id": member.id, "name": f"{member.first_name} {member.last_name}"}
                    for member in author_circle.members.all()
                ]
        except Circles.DoesNotExist:
            return []
        return []
    def get_group_members(self, obj):
        try:
            author_group = Circles.objects.filter(owner=obj.author).first()
            if author_group:
                return [
                    {"id": member.id, "name": f"{member.first_name} {member.last_name}"}
                    for member in author_group.members.all()
                ]
        except Circles.DoesNotExist:
            return []
        return []

    def validate_visibility(self, value):
        allowed_values = [choice[0] for choice in Post.VISIBILITY_CHOICES]
        if value not in allowed_values:
            raise serializers.ValidationError(f"{value} is not a valid choice for visibility.")
        return value

    def validate(self, attrs):
        # Ensure 'circle' is provided if 'visibility' is 'circles'
        if attrs.get('visibility') == 'circles' and not attrs.get('circle'):
            raise serializers.ValidationError({'circle': 'Circle is required when visibility is "circles".'})
        return attrs

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = Like
        fields = ['user', 'post', 'created_at']

class CirclesSerializer(serializers.ModelSerializer):
    member_name = serializers.SerializerMethodField()
    member_email = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()
    class Meta:
        model = Circles
        fields = '__all__'

    def get_member_name(self, obj):
        return f"{obj.members.get_full_name}"
    def get_owner_name(self, obj):
        return f"{obj.owner.get_full_name}"
    def get_member_email(self, obj):
        return f"{obj.members.email}"
    
class CircleNotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    receiver_name = serializers.CharField(source='receiver.get_full_name', read_only=True)
    class Meta:
        model = Circle_Notification
        fields = '__all__'

    def approve(self):
        notification = self.instance
        if notification.status == Circle_Notification.PENDING:
            notification.approve_membership()

class GroupSerializer(serializers.ModelSerializer):
    owner_full_name = serializers.SerializerMethodField()
    class Meta:
        model = Group
        fields = '__all__'

    def get_owner_full_name(self, obj):
        return f"{obj.owner.get_full_name}"
    
    def validate(self, data):
        name = data.get('name')
        owner= data.get('owner')

        # For create a new building
        if self.instance is None:
            if Group.objects.filter(name__iexact=name, owner=owner).exists():
                raise serializers.ValidationError("This group name already exists")
        else:
            # For update, exclude current Organization
            if Group.objects.filter(name__iexact=name, owner=owner).exclude(pk=self.instance.pk).exists():
                raise serializers.ValidationError("This group name already exists")
        return data
    
class Group_Member_Serializers(serializers.ModelSerializer):
    member_name = serializers.SerializerMethodField()
    member_email = serializers.SerializerMethodField()
    class Meta:
        model = Group_Members
        fields = '__all__'
    def get_member_name(self, obj):
        return f"{obj.member.get_full_name}"
    def get_member_email(self, obj):
        return f"{obj.member.email}"
