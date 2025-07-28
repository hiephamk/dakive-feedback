from django.conf import settings
from django.utils import timezone
from django.db import models
from django.core.exceptions import ValidationError
from Building.models import Organization

# for setting user roles and granding permissions to edit or view data
class Organization_membership(models.Model): 
    ROLE_CHOICES = (
        ('editor', 'Editor'),
        ('viewer', 'Viewer'),
    )

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='organization_memberships'
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='viewer')
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name} - {self.organization} ({self.role})"

    def clean(self):
        # Ensure owner is always is_admin=True and has editor role
        if self.organization.owner == self.user:
            if not self.is_admin:
                raise ValidationError("The organization owner must have is_admin=True.")
            if self.role != 'editor':
                raise ValidationError("The organization owner must have the 'editor' role.")
        # Ensure admin has editor role
        if self.is_admin and self.role != 'editor':
            raise ValidationError("Admins must have the 'editor' role.")
        # Ensure organization is active (if applicable)
        if hasattr(self.organization, 'is_active') and not self.organization.is_active:
            raise ValidationError("Cannot add members to an inactive organization.")

    def save(self, *args, **kwargs):
        # Automatically set is_admin=True and role='editor' for the owner
        if self.organization.owner == self.user:
            self.is_admin = True
            self.role = 'editor'
        self.full_clean()  # Run validation before saving
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Organization Membership'
        verbose_name_plural = 'Organization Memberships'
        ordering = ['-created_at']
        # constraints = [
        #     UniqueConstraint(fields=['user', 'organization'], name='unique_user_organization')
        # ]
        