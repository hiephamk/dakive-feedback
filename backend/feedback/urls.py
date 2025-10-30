from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import (
    SensorReportUserView, 
    RoomReportAnalyticsView, 
    RoomReportCreateView, 
    RoomReportListView, 
    SensorReportCreateView, 
    SensorReportDetailView, 
    SensorDataSearchView
    )

urlpatterns = [
    path('rooms/reports/create/<int:pk>/', RoomReportCreateView.as_view(), name='room-create'),
    path('rooms/reports/list/', RoomReportListView.as_view(), name='room-list'),
    
    path('rooms/reports/analytics/', RoomReportAnalyticsView.as_view(), name='room-analytics'),
    
    path('rooms/reports/sync-data/create/', SensorReportCreateView.as_view(), name='sync-data-create'),
    path('rooms/reports/sync-data/list-report/', SensorReportCreateView.as_view(), name='sync-data-list'),
    
    path('rooms/reports/sync-data/search-report/', SensorDataSearchView.as_view(), name='sync-data-search'),
    path('rooms/reports/sync-data/user-view/', SensorReportUserView.as_view(), name='sync-data-user-view'),
    
    path('rooms/reports/sync-data/update/<int:pk>/', SensorReportDetailView.as_view(), name='sync-data-update'),
    path('rooms/reports/sync-data/delete/<int:pk>/', SensorReportDetailView.as_view(), name='sync-data-delete'),
    
    # path('rooms/reports/optional-manager-feedback/', OptionalFeedbackManagerView.as_view(), name='sync-data-delete'),
    # path('rooms/reports/optional-user-feedback/<int:pk>/', OptionFeedbackUserView.as_view(), name='sync-data-delete'),
    

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)