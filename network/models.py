from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "followers": Follow.objects.filter(follow_to=self).count(),
            "following": Follow.objects.filter(follow_from=self).count(),
        }


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    edited = models.BooleanField(default=False)
    
    def serialize(self):
        return {
            "id": self.id,
            "author": self.author.username,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%d %b %Y %H:%M%p"),
            "edited": self.edited,
            "post_like": Like.objects.filter(post=self).count(),
        }

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='like')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_like')

    def __str__(self):
        return self.user.username + " " + str(self.post.id)
    
    def serialize(self):
        return {
            "id": self.id,
            "user_from": self.user.username,
            "post_to": self.post.id,
        }


class Follow(models.Model):
    follow_from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follow_from')
    follow_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follow_to')

    def serialize(self):
        return {
            "from": {
                "id": self.follow_from.id,
                "username": self.follow_from.username,
            },
            "to": {
                "id": self.follow_to.id,
                "username": self.follow_to.username,
            }
        }
