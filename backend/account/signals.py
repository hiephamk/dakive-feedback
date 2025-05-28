from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import User
from .models import Account
from Building.models import Organization

# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     account, _ = Account.objects.get_or_create(user=instance)
#     account.first_name = instance.first_name
#     account.last_name = instance.last_name
#     account.organization = instance.organization.name if instance.orgainization else None
#     account.save()

@receiver(post_save, sender=User)
def create_user_account(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(
            user=instance,
            first_name=instance.first_name,
            last_name=instance.last_name,
            email=instance.email,
            # organization=instance.organizationid.name if instance.organizationid else None
        )
    else:
        # Optional: update the account if user is updated
        account, _ = Account.objects.get_or_create(user=instance)
        account.first_name = instance.first_name
        account.last_name = instance.last_name
        account.email = instance.email
        # account.organization = instance.organizationid.name if instance.organizationid else None
        account.save()