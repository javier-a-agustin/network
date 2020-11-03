
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API

    path("api/posts/", views.posts, name="get posts"),
    path("api/comments/<int:id>/", views.get_comments, name="get comments"),
]
