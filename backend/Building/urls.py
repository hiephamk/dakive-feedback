from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

urlpatterns = [
    path('buildings/create/', views.BuildingListView.as_view(), name='building-create'),
    path('buildings/lists/', views.BuildingListView.as_view(), name='building-list'),
    path('rooms/create/', views.RoomListView.as_view(), name='room-create'),
    path('rooms/lists/', views.RoomListView.as_view(), name='room-list'),
    path('organizations/create/', views.OrganizationListView.as_view(), name='organization-list'),
    # path('addresses/create/', views.AddressListView.as_view(), name='address-list'),
    path('rooms/update/<int:pk>/', views.RoomDetailView.as_view(), name='room-update'),
    path('rooms/owner/list/<int:pk>/', views.RoomDetailView.as_view(), name='room-update'),
    path('buildings/update/<int:pk>/', views.BuildingDetailView.as_view(), name='building-update'),
    path('organizations/update/<int:pk>/', views.OrganizationDetailView.as_view(), name='organization-update'),
    # path('addresses/update/<int:pk>/', views.AddressDetailView.as_view(), name='address-update'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

