from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json

from datetime import datetime

from django.core.paginator import Paginator

from .models import User, Post, Follow, Like

NUM_PAGINATOR = 10

def index(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))

    return render(request, "network/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@login_required
def posts(request, page_number):
    if request.method == "GET":
        try:
            queryset = Post.objects.order_by('-timestamp').all()
        except:
            return JsonResponse({"error": "An error ocurred. Try later"})

        p = Paginator(queryset, NUM_PAGINATOR)

        try:
            page = p.page(page_number)
            current_page = page_number
        except:
            page = p.page(1)
            current_page = 1

        has_next = page.has_next()
        has_previous = page.has_previous()

        posts = [post.serialize() for post in page]
        posts_ids = [post.id for post in page]

        likes = Like.objects.filter(post_id__in=posts_ids).all()
        likes_serialized = [like.serialize() for like in likes]

        return JsonResponse([ {"has_next": has_next, "has_previous": has_previous, "current_page": current_page}, posts, likes_serialized ], safe=False)


@csrf_exempt
@login_required
def compose(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    content = data.get("body", )
    
    if len(content) < 1:
        return JsonResponse({"error": "Must have some text"})

    post = Post(body=content, author=request.user)

    post.save()

    return JsonResponse({"message": "Post created."}, status=201)

    
@csrf_exempt
@login_required
def get_user_data(request, username, page_number):
    
    if request.method != "GET":
        return JsonResponse({"error": "Only get allowed"})

    try:
        user_data = User.objects.get(username=username)
        posts = Post.objects.filter(author=user_data).order_by("-timestamp").all()
        followers = Follow.objects.filter(follow_from=request.user).all()
    except:
        return JsonResponse({"error": "User with that name does not exits"})
    
    p = Paginator(posts, NUM_PAGINATOR)

    try:
        page = p.page(page_number)
        current_page = page_number
    except:
        page = p.page(1)
        current_page = 1
    
    has_next = page.has_next()
    has_previous = page.has_previous()

    posts = [post.serialize() for post in page]
    posts_ids = [post.id for post in page]
    likes = Like.objects.filter(post_id__in=posts_ids).all()
    likes_serialized = [like.serialize() for like in likes]

    return JsonResponse([{"has_next": has_next, "has_previous": has_previous, "current_page": current_page}, [user_data.serialize() ], posts, [ follow.serialize() for follow in followers], likes_serialized ], safe=False)

@csrf_exempt
@login_required
def unfollow(request):

    if request.method != "POST":
        return JsonResponse({"error": "Only post request allowed"})

    data = json.loads(request.body)
    to = data.get("to", )

    user_unfollow = User.objects.get(username=to)
    try:
        item = Follow.objects.filter(follow_from=request.user, follow_to=user_unfollow).all().delete()
        return JsonResponse("Item deleted")

    except:
        return JsonResponse({"error": "An error has ocurred. Try later"})

@csrf_exempt
@login_required
def follow(request):

    if request.method != "POST":
        return JsonResponse({"error": "Only post request allowed"})

    data = json.loads(request.body)
    to = data.get("to", )

    user_follow = User.objects.get(username=to)
    try:
        item = Follow(follow_from=request.user, follow_to=user_follow)
        item.save()
        return JsonResponse("Item created")
    except:
        return JsonResponse({"error": "An error has ocurred. Try later"})

@csrf_exempt
@login_required
def following(request, page_number):
    if request.method != "GET":
        return JsonResponse({"error": "Only get request allowed"})
    try:
        following_users = Follow.objects.filter(follow_from=request.user).all()
        following_ids = [follow.follow_to.id for follow in following_users]
        posts = Post.objects.filter(author_id__in=following_ids)
    except:
        return JsonResponse({"error": "An error has ocurred. Try later"})

    p = Paginator(posts, NUM_PAGINATOR)

    try:
        page = p.page(page_number)
        current_page = page_number
    except:
        page = p.page(1)
        current_page = 1
    
    has_next = page.has_next()
    has_previous = page.has_previous()

    posts = [post.serialize() for post in page]
    posts_ids = [post.id for post in page]
    likes = Like.objects.filter(post_id__in=posts_ids).all()
    likes_serialized = [like.serialize() for like in likes]

    return JsonResponse([ {"has_next": has_next, "has_previous": has_previous, "current_page": current_page}, posts, likes_serialized], safe=False)
    
@csrf_exempt
@login_required
def edit_post(request):
    if request.method != "PUT":
        return JsonResponse({"error": "only PUT requests allowed"})

    data = json.loads(request.body)
    new_body = data.get("new_body", )
    id = data.get("id", )

    try:
        post = Post.objects.get(id=id)
    except:
        return JsonResponse({"error": "An error has ocurred. Try later"})

    if post.author != request.user:
        return JsonResponse({"error": "You don't have permission for editing this kinda of posts"})

    post.body = new_body
    post.edited = True
    post.save()
    return JsonResponse(post.serialize(), safe=False)

@csrf_exempt
@login_required
def like(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST request allowed"})
    
    data = json.loads(request.body)
    id_post = data.get("id_post", )
    post = Post.objects.get(id=id_post)
    
    try:
        item_like = Like.objects.get(post_id=id_post,user=request.user)
        print(item_like)
        item_like.delete()
        user_like_post = False
    except: 
        print("Except")
        item_like = Like(
            user = request.user,
            post = post,
        )
        item_like.save()
        user_like_post = True
    
    likes_count = Like.objects.filter(post=post).count()
    return JsonResponse({"post": post.serialize(), "post_likes_count": likes_count, "user_like_post": user_like_post})



    



        




# @csrf_exempt
# @login_required
# def get_comments(request, id):
#     if request.method == "GET":
#         try:
#             queryset = Comment.objects.filter(post=id).order_by('-timestamp').all()
#             return JsonResponse([comment.serialize() for comment in queryset], safe=False)
#         except:
#             return JsonResponse({
#                 "error": f"Post with id {id} does not exist."
#             }, status=400)
    