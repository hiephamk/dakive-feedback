# membership/urls.py
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('organization-membership/list/members/', views.OrganizationMembershipView.as_view(), name='list-organization-members'),
    path('organization-membership/create/', views.OrganizationMembershipView.as_view(), name='create-organization'),
    path('organization-membership/update-member/<int:pk>/', views.OrganizationMemberDetailView.as_view(), name='aupdate-organization-member'),
    path('organization-membership/delete-member/<int:pk>/', views.OrganizationMemberDetailView.as_view(), name='delete-organization-member'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
