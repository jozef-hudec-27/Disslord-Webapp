from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_id>\w+)/$', consumers.RoomChatConsumer.as_asgi()),
    re_path(r'ws/chat/private/(?P<chat_code>\w+)/$', consumers.PrivateChatConsumer.as_asgi()),

]