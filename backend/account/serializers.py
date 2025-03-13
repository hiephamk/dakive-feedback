from rest_framework import serializers
from .models import Account

class AccountSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    full_name = serializers.SerializerMethodField()
    birth_date = serializers.DateField(format='%Y-%m-%d', required=False)
    class Meta:
        model = Account
        fields = '__all__'
    def get_full_name(self, obj):
        return obj.user.get_full_name