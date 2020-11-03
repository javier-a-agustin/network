from django.contrib import admin

from .models import User, Post, Comment, Like, Unlike

admin.site.register(Post)
admin.site.register(User)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Unlike)



