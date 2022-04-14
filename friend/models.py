from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save

from chat.models import PrivateChat

class FriendList(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='my_friendlist')
    friends = models.ManyToManyField(User, blank=True, related_name='friends')

    def __str__(self) -> str:
        return f"{self.user.username}'s friendlist"

    def add_friend(self, User):
        if User not in self.friends.all():
            self.friends.add(User)

    def remove_friend(self, User):
        if User in self.friends.all():
            self.friends.remove(User)
    
    def unfriend(self, removee):
        user_a, user_b = sorted([self.user, removee], key=lambda usr: usr.username)
        try:
            private_chat = PrivateChat.objects.get(user_a=user_a, user_b=user_b, is_active=True)
            private_chat.is_active = False
            private_chat.save()
        except:
            pass

        self.remove_friend(removee)
        removee.my_friendlist.remove_friend(self.user)

    def is_mutual_friend(self, friend):
        return friend in self.friends.all()


def user_did_save(sender, instance, created, *args, **kwargs):

    if created:
        FriendList.objects.get_or_create(user=instance)

post_save.connect(user_did_save, sender=User)


class FriendRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_friend_requests') 
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inbox_friend_requests') 
    is_active = models.BooleanField(blank=True, null=False, default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.sender.username}'s request to {self.receiver.username}"
    
    def accept(self):
        receiver_friendlist = FriendList.objects.get(user=self.receiver)
        if receiver_friendlist:
            receiver_friendlist.add_friend(self.sender)
            sender_friendlist = FriendList.objects.get(user=self.sender)
            if sender_friendlist:     

                user_a, user_b = sorted([self.receiver, self.sender], key=lambda usr: usr.username)
                private_chat_qs = PrivateChat.objects.filter(user_a=user_a, user_b=user_b, is_active=False)
                if private_chat_qs.exists():
                    private_chat = private_chat_qs.first()
                    private_chat.is_active = True
                    private_chat.save()
                else:
                    private_chat = PrivateChat.objects.create(user_a=user_a, user_b=user_b)

                sender_friendlist.add_friend(self.receiver)
                self.is_active = False
                self.save()
            
            else:
                FriendList.objects.create(user=self.sender)
                return self.accept()
        
        else:
            FriendList.objects.create(user=self.receiver)
            return self.accept()

    def decline(self):
        self.is_active = False
        self.save()

    def cancel(self):
        self.is_active = False
        self.save()