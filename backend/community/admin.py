from django.contrib import admin

from .models import Group, Post, Comment, Circle_Notification, Circles, Like, Group_Members

# Register your models here.a
admin.site.register(Circles)
admin.site.register(Circle_Notification)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Group)
admin.site.register(Group_Members)