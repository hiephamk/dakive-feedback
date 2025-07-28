from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path('buildings/create/', views.BuildingListView.as_view(), name='building-create'),
    path('buildings/lists/', views.BuildingListView.as_view(), name='building-list'),
    path('buildings/search_building/', views.BuildingSearchView.as_view(), name='building-list'),
    path('buildings/update/<int:pk>/', views.BuildingDetailView.as_view(), name='building-update'),
    
    path('organizations/create/', views.OrganizationCreateView.as_view(), name='organization-create'),
    path('organizations/list/', views.OrganizationListView.as_view(), name='organization-list'),
    path('organizations/update/<int:pk>/', views.OrganizationDetailView.as_view(), name='organization-update'),
    path('organizations/delete/<int:pk>/', views.OrganizationDetailView.as_view(), name='organization-delete'),
    path('organizations/building-avg-rating/<int:organization_id>/', views.organization_detail_with_buildings, name='building-avg-rating'),
    path('organizations/search_organization/', views.OrganizationSearchView.as_view(), name='search_building'),


    path('rooms/lists-feedback/', views.RoomListViewFeedback.as_view(), name='room-list-feedback'),
    path('rooms/lists/', views.RoomListView.as_view(), name='room-list'),
    path('rooms/create/', views.RoomListView.as_view(), name='room-create'),
    path('rooms/update/<int:pk>/', views.RoomDetailView.as_view(), name='room-update'),
    path('rooms/owner/list/<int:pk>/', views.RoomDetailView.as_view(), name='room-update'),
    path('rooms/search_rooms/', views.RoomSearchView.as_view(), name='search-rooms'),
    
    path('rooms/by-external/', views.RoomByExternalIDView.as_view(), name='room-by-external'),
    path('buildings/by-external/', views.BuildingByExternalIDView.as_view(), name='building-by-external'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

