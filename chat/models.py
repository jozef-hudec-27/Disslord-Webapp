from django.db import models
from django.contrib.auth.models import User


class PrivateChat(models.Model):
    user_a = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_private_chats_a')
    user_b = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_private_chats_b')
    is_active = models.BooleanField(default=True, null=False, blank=False)

    def __str__(self) -> str:
        return f'Private chat between {self.user_a} and {self.user_b}'

class PrivateChatMessage(models.Model):
    chat = models.ForeignKey(PrivateChat, on_delete=models.CASCADE, related_name='chat_messages', null=False, blank=False)
    body = models.CharField(max_length=500, null=False, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False, related_name='my_private_chat_messages')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    
    def __str__(self) -> str:
        return f"{self.user}: {self.body[:50]}"