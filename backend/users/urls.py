from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from . import views


urlpatterns = [
    path('users/create/', views.CustomUserView.as_view(), name='user-create'),
    path('users/list/', views.CustomUserView.as_view(), name='user-list'),
    path('users/update/<int:pk>/', views.CustomUserViewDetails.as_view(), name='user-update'),
    path('users/delete/<int:pk>/', views.CustomUserViewDetails.as_view(), name='user-delete'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)