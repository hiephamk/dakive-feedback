from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import User
from .models import Account
from Building.models import Organization

# automatically add user related info such as first_name, last_name, email to account
@receiver(post_save, sender=User)
def create_user_account(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(
            user=instance,
            first_name=instance.first_name,
            last_name=instance.last_name,
            email=instance.email,
        )
    else:
        # update the account if user is updated
        account, _ = Account.objects.get_or_create(user=instance)
        account.first_name = instance.first_name
        account.last_name = instance.last_name
        account.email = instance.email
        account.save()