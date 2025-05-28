from django.db.models.signals import post_save
from django.dispatch import receiver
from Building.models import Organization
from users.models import User
from .models import Organization_membership

@receiver(post_save, sender=Organization)
def create_owner_membership(sender, instance, created, **kwargs):
    if created:
        Organization_membership.objects.create(
            organization=instance,
            user=instance.owner,
            role='editor',
            is_admin=True,
            is_active=True
        )
    else:
        # Optional: update the membership if organization is updated
            membership, _ = Organization_membership.objects.get_or_create(organization=instance, user=instance.owner)
            membership.role = 'editor'
            membership.is_admin = True
            membership.is_active = True
            membership.save()
            
@receiver(post_save, sender=User)
def create_or_update_user_membership(sender, instance, created, **kwargs):
    organization = instance.organizationid
    if organization is None:
        return  # No organization, skip creating/updating membership

    # If membership exists, update it. Otherwise, create it.
    membership, _ = Organization_membership.objects.get_or_create(
        user=instance,
        organization=organization,
        defaults={
            'role': 'viewer',
            'is_admin': False,
            'is_active': True
        }
    )

    # If already exists, ensure it’s synced
    membership.role = 'viewer'
    membership.is_admin = False
    membership.is_active = True
    membership.save()