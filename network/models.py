from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # profile_picture = models.ImageField(upload_to="images/profile/", default="images/default-profile.png")
    # portada_picture = models.ImageField(upload_to="images/profile/", default="images/default-portada.png")

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
    
    def get_comments(self):
        try:
            comments = self.comments.all().order_by('-timestamp')
        except:
            comments = None
        return comments
    
    @property
    def comment_count(self):
        return Comment.objects.filter(post=self).count()


    def serialize(self):
        return {
            "id": self.id,
            "author": self.author.username,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%d %b %Y %H:%M%p"),
            "post_like": Like.objects.filter(post=self).count(),
            "post_unlike": Unlike.objects.filter(post=self).count(),
        }

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='like')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_like')

class Unlike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='unlike')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_unlike')


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


# class Comment(models.Model):
#     author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='users')
#     post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
#     body = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def serialize(self):
#         return {
#             "id": self.id,
#             "author": self.author.username,
#             "body": self.body,
#             "timestamp": self.timestamp.strftime("%d %b %Y %H:%M%p"),
#         }