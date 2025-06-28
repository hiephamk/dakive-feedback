from http.client import responses

from django.db.models import Q
from rest_framework import generics, permissions, status, viewsets
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
# from zope.event import notify
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Post, Comment, Like, Circles, Circle_Notification, Group, Group_Members
from users.models import User
from .serializers import PostSerializer, CommentSerializer, CirclesSerializer, CircleNotificationSerializer,Group_Member_Serializers, GroupSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required
import logging
from rest_framework.decorators import action
from django.http import JsonResponse

class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    queryset = Post.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        visibility = self.request.data.get('visibility')

        # If visibility is 'circles', associate the post with the user's circle
        if visibility == 'circles':
            user_circle = Circles.objects.filter(owner=user).first()
            if user_circle:
                post = serializer.save(author=user, circle=user_circle)
                logging.info(f"Post created with visibility 'circles' and circle: {user_circle}")
            else:
                logging.error("User does not belong to any circle.")
                raise ValueError("User does not belong to any circle.")
        elif visibility == 'groups':
            user_group = Group.objects.filter(owner = user).first()
            if user_group:
                post = serializer.save(author=user, group=user_group)
            else:
                logging.error("User does not belong to any group.")
                raise ValueError("User does not belong to any circle.")
        else:
            # Default for posts with 'onlyme' or 'public'
            serializer.save(author=self.request.user)
            logging.info(f"Post created with visibility '{visibility}'")

    def get_queryset(self):
        visibility = self.request.query_params.get('visibility')
        queryset = Post.objects.all()

        user = self.request.user
        return (queryset.filter(visibility='public') |
                queryset.filter(visibility='circles', circle__members=user)|
                queryset.filter(visibility='circles', author=user)|
                queryset.filter(visibility='circles', shared_owner=user)|
                queryset.filter(visibility='group', group__members=user)|
                queryset.filter(visibility='group', author=user)|
                queryset.filter(visibility='group', shared_owner=user)|
                queryset.filter(visibility='onlyme', author=user)).distinct()

    def create_post(request):
        if request.FILES:
            logging.info("Files received: %s", request.FILES)
        else:
            logging.warning("No files received.")
        return Response(status=status.HTTP_201_CREATED)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    def get_object(self):
        post = super().get_object()
        if not post.is_visible_to(self.request.user):
            raise HttpResponseForbidden("You do not have permission to view this post.")
        return post

    def update(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)

        if post.author != request.user and post.shared_owner != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        file = request.FILES.get('file', None)
        if 'file' in request.FILES:
                post.file = file
        post.save()
        
        serializer = self.get_serializer(post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        print(request.data)
        print(request.FILES)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        post = get_object_or_404(Post, pk=pk)

        # Check if the post is shared, and the user is either the author or shared_owner
        if post.shared:
            if post.shared_owner != request.user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            # Delete the shared post, not the original post
            post.delete()
            return Response({'message': 'Shared post deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        # If the post is not shared, check if the user is the author
        if post.author != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        # Delete the original post if the user is the author
        post.delete()
        return Response({'message': 'Original post deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


# Comment Views
class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, pk=None):
        comment = get_object_or_404(Post, pk=pk)
        user = request.user
        if comment.author != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(comment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        comment = get_object_or_404(Comment, pk=pk)
        # If the post is not shared, check if the user is the author
        if comment.post.author != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        # Delete the original post if the user is the author
        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class CircleListView(generics.ListCreateAPIView):
    queryset = Circles.objects.all()
    serializer_class = CirclesSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    def get_queryset(self):
        user = self.request.user
        return Circles.objects.filter(owner=user)

    def create_circle(request):
        notify = Circle_Notification.objects.filter(
            receiver=request.user, status='approved'
        ).first()  # Ensure you fetch the correct notification
        if notify:
            circle, created = Circles.objects.get_or_create(owner=notify.sender)
            circle.members.add(notify.receiver)
            return Response({"detail": "Circle created successfully."})
        return Response({"detail": "No approved notification found."}, status=status.HTTP_404_NOT_FOUND)

class CircleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Circles.objects.all()
    serializer_class = CirclesSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class CircleNotificationView(generics.ListCreateAPIView):
    queryset = Circle_Notification.objects.all()
    serializer_class = CircleNotificationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class CircleNotificationAcction(generics.RetrieveUpdateDestroyAPIView):
    queryset = Circle_Notification.objects.all()
    serializer_class = CircleNotificationSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, action=None):
        # Retrieve all notifications for the logged-in user (receiver)
        notifications = Circle_Notification.objects.filter(receiver=request.user, is_handled=False)

        if not notifications.exists():
            return Response({"detail": "No unhandled notifications found for this user."}, status=status.HTTP_404_NOT_FOUND)

        if action not in ["approve", "reject"]:
            return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        # Process each notification
        with transaction.atomic():  # Use atomic transaction to ensure data integrity
            for notification in notifications:
                if action == "approve":
                    # Approve the notification
                    notification.status = Circle_Notification.APPROVED
                    notification.is_read = True
                    notification.is_handled = True
                    notification.save()

                    # Ensure the receiver has a circle and add the sender as a member
                    receiver_circle, _ = Circles.objects.get_or_create(owner=notification.receiver)
                    if notification.sender not in receiver_circle.members.all():
                        receiver_circle.members.add(notification.sender)

                    # Ensure the sender has a circle and add the receiver as a member
                    sender_circle, _ = Circles.objects.get_or_create(owner=notification.sender)
                    if notification.receiver not in sender_circle.members.all():
                        sender_circle.members.add(notification.receiver)

                elif action == "reject":
                    notification.status = Circle_Notification.REJECTED
                    notification.is_read = True
                    notification.is_handled = True
                    notification.save()

            return Response({
                "detail": f"Notifications have been {action}ed and mutual memberships established.",
                "notifications_count": len(notifications),
            })

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_post(request, post_id):
    user = request.user  # Ensure this is the authenticated user
    post = get_object_or_404(Post, id=post_id)
    post.like_count += 1
    post.save()
    return Response({'like_count': post.like_count})

import json
# @login_required
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
# @csrf_exempt
def share_post_with_circle(request, post_id):
    if request.method == 'POST':
        user = request.user
        original_post = get_object_or_404(Post, id=post_id)
        # Check if the user is part of any circle
        circles = Circles.objects.filter(owner=user)
        try:
            data = json.loads(request.body)
            content_shared = data.get('content_shared', None)
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON input.'}, status=400)
        if not circles.exists():
            return JsonResponse({'detail': 'You are not a member of any circle.'}, status=400)

        # If the user belongs to multiple circles, decide how to handle it
        if circles.count() > 1:
            # Handle the case where the user is in multiple circles (e.g., pick the first one)
            circle = circles.first()
        else:
            circle = circles.first()

        # Create a new post by copying the original post's content, file, and other details
        new_post = Post.objects.create(
            content=original_post.content,
            content_shared=content_shared if content_shared else f"{user.get_full_name} shared the post.",
            file=original_post.file,
            author=original_post.author,  # The new post is authored by the user
            visibility='circles',  # Visibility is set to 'circles'
            circle=circle,  # Assign the circle to the new post
            shared = True,
            shared_owner=user,
        )
        new_post.created_at = original_post.created_at
        new_post.updated_at = original_post.updated_at
        new_post.save(update_fields=['created_at', 'updated_at', 'content_shared','content', 'file', 'file_shared'])
        for member in circle.members.exclude(id=user.id):
            # notification_message = f"{user.get_full_name} has shared a post with your circle."
            # notification = Circle_Notification.objects.create(
            #     sender=user,
            #     receiver=member,
            #     #message=notification_message,
            #     #status=Circle_Notification.PENDING
            # )
            return JsonResponse({'detail': 'Post shared successfully with your circle.'}, status=200)
    return JsonResponse({'detail': 'Invalid request.'}, status=400)

class GroupViewSet(generics.ListCreateAPIView):
    # queryset = Group.object.all()
    serializer_class=GroupSerializer
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]
    def get_queryset(self):
        owner = self.request.user
        return Group.objects.filter(owner = owner)
class GroupViewDetails(generics.RetrieveUpdateDestroyAPIView):
    serializer_class=GroupSerializer
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]
    def get_queryset(self):
        owner = self.request.user
        return Group.objects.filter(owner = owner)
class SearchCircleMember(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CirclesSerializer
    # authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        keyword = self.request.GET.get('keyword', '').strip()
        if not keyword:
            return Circles.objects.none()

        keywords = keyword.split()
        query = Q()
        for word in keywords:
            query |= (
                Q(members__first_name__icontains=word) |
                Q(members__last_name__icontains=word) |
                Q(members__email__icontains=word)

            )

        return Circles.objects.filter(query)
class Group_Member_View(generics.ListCreateAPIView):
    serializer_class = Group_Member_Serializers
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    # queryset = Group_Members.objects.all()
    
    def get_queryset(self):
        owner = self.request.user
        return Group_Members.objects.filter(group__owner=owner)
    
class Group_Member_View_Details(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = Group_Member_Serializers
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Group_Members.objects.all()