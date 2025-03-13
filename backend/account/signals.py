from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import User
from .models import Account

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    account, _ = Account.objects.get_or_create(user=instance)
    account = instance.account
    account.first_name = instance.first_name
    account.last_name = instance.last_name
    account.email = instance.email
    account.save()