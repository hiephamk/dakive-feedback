from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [

    path('posts/list_posts/', views.PostListCreateView.as_view(), name='post-list'),
    path('posts/create_posts/', views.PostListCreateView.as_view(), name='post-create'),
    path('posts/edit_posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/like/<int:post_id>/', views.like_post, name='post-like'),
    path('posts/share/<int:post_id>/', views.share_post_with_circle, name='post-share'),

    path('comments/list_comments/', views.CommentListCreateView.as_view(), name='comment-list'),
    path('comments/create_comments/', views.CommentListCreateView.as_view(), name='comment-create'),
    path('comments/edit/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),

    path('circles/list_circles/', views.CircleListView.as_view(), name='circle-list'),
    path('circles/create_circles/', views.CircleListView.as_view(), name='circle-create'),
    path('circles/edit/<int:pk>/', views.CircleDetailView.as_view(), name='circle-list'),
    path('circles/notifications/', views.CircleNotificationView.as_view(), name='circle-notification'),
    path('circles/notifications/actions/<str:action>/', views.CircleNotificationAcction.as_view(), name='circle-notification'),
    path('circles/search-members/', views.SearchCircleMember.as_view(), name='circle-search-members'),
    
    path('group/group_list/', views.GroupViewSet.as_view(), name='view_group'),
    path('group/create_group/', views.GroupViewSet.as_view(), name='create_group'),
    path('group/edit_group/<int:pk>/', views.GroupViewDetails.as_view(), name='edit_group'),
    
    path('group-members/list-member/', views.Group_Member_View.as_view(), name='list-group-member'),
    path('group-members/add-member/', views.Group_Member_View.as_view(), name='add-group-member'),
    path('group-members/edit/<int:pk>/', views.Group_Member_View_Details.as_view(), name='edit_group'),
    

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
