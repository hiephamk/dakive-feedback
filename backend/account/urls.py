from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from . import views


urlpatterns = [
    path('accounts/', views.AccountListView.as_view(), name='account-list'),
    path('accounts/update/<int:pk>/', views.AccountDetailView.as_view(), name='account-update'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)