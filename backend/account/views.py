from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import AccountSerializer
from .models import Account
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q

# Create your views here.
class AccountListView(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
class AccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]

class AccountSearchView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        keyword = self.request.GET.get('keyword', '').strip()
        if not keyword:
            return Account.objects.none()

        keywords = keyword.split()
        query = Q()
        for word in keywords:
            query |= (
                Q(first_name__icontains=word) |
                Q(last_name__icontains=word) |
                Q(email__icontains=word) |
                Q(phone_number__icontains=word) |
                Q(birth_date__icontains=word) |
                Q(bio__icontains=word)
            )

        return Account.objects.filter(query).order_by('-email')