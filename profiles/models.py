from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save


class FriendRelation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile = models.ForeignKey('Profile', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=100, null=True, blank=True)
    bio = models.TextField(max_length=500, null=True, blank=True)
    profile_pic = models.ImageField(null=True, default="avatar.svg")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.user.username}'s Profile"

    class Meta:
        ordering = ['user__username']

def user_did_save(sender, instance, created, *args, **kwargs):

    if created:
        Profile.objects.get_or_create(user=instance)

post_save.connect(user_did_save, sender=User)