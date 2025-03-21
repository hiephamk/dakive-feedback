from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views
from .views import RoomReportAnalyticsView

urlpatterns = [
    path('rooms/reports/create/<int:pk>/', views.RoomReportCreateView.as_view(), name='room-list'),
    path('rooms/reports/list/', views.RoomReportListView.as_view(), name='room-list'),
    path('rooms/reports/analytics/', views.RoomReportAnalyticsView.as_view(), name='room-list'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)