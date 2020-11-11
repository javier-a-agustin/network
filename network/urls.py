from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API
    path("api/user/<str:username>/<int:page_number>/", views.get_user_data, name="get user data"),
    path("api/posts/<int:page_number>/", views.posts, name="get posts"),
    path("api/create-post/", views.compose, name="create-post"),
    path("api/unfollow/", views.unfollow, name="unfollow"),
    path("api/follow/", views.follow, name="follow"),
    path("api/following/<int:page_number>/", views.following, name="following"),

]
