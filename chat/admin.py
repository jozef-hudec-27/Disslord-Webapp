from django.contrib import admin

from .models import PrivateChat, PrivateChatMessage


admin.site.register(PrivateChat)
admin.site.register(PrivateChatMessage)