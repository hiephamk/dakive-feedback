from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin, GroupAdmin
from django.contrib.auth.models import Group
# from .forms import CustomUserChangeForm, CustomUserCreationForm
from rest_framework.authtoken.models import Token
from .models import User
from django.utils.translation import gettext_lazy as _


class CustomAdminSite(admin.AdminSite):
    site_header = 'DakiVe-Feedback Admin Page'
    site_title = 'DakiVe-Feedback Administration'
    index_title = 'Welcome to My Admin Portal'
admin.site = CustomAdminSite()

class UserAdmin(BaseUserAdmin):
    ordering = ["email"]
    # add_form = CustomUserCreationForm
    # form = CustomUserChangeForm
    model = User
    list_display = ["email", "first_name", "last_name", "is_staff", "is_active", "organizationid"]
    list_display_links = ["email"]
    list_filter = ["email", "first_name", "last_name", "is_staff", "is_active", "organizationid"]
    search_fields = ["email", "first_name", "last_name"]
    fieldsets = (
        (
            _("Login Credentials"), {
                "fields": ("email", "password",)
            },
        ),
        (
            _("Personal Information"),
            {
                "fields": ('first_name', 'last_name', "organizationid")
            },
        ),
        (
            _("Permissions and Groups"),
            {
                "fields": ("is_active", "is_staff","is_superuser", "groups", "user_permissions")
            },
        ),
        (
            _("Important Dates"),
            {
                "fields": ("last_login",)
            },
        ),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "password1", "password2","organizationid", "is_staff", "is_active",),
        },),
    )
admin.site.register(User, UserAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Token)
