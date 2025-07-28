from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from .management import CustomUserManager
from Building.models import Organization

class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_("First Name"), max_length=100)
    last_name = models.CharField(_("Last Name"), max_length=100)
    email = models.EmailField(_("Email Address"), max_length=254, unique=True)
    organizationid = models.ForeignKey(Organization, blank=True, null=True, on_delete=models.CASCADE) # used to set roles for users
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    created = models.DateTimeField(auto_now_add=True)
    # use email for login
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"] # fist name, last name fields are required

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.get_full_name # get_full_name is property, not a method, no parentheses needed

    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"