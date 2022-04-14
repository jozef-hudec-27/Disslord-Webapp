import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import User

from rooms.models import Room, RoomMessage
from .models import PrivateChatMessage, PrivateChat

class RoomChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = 'chat_%s' % self.room_id

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.room = Room.objects.get(id=self.room_id)
    
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data): 
        text_data_json = json.loads(text_data)

        print('RECEIVED DATA', text_data_json)

        message = text_data_json['message']
        name = text_data_json['name']

        user = User.objects.get(username=name)
        new_msg = RoomMessage.objects.create(user=user, body=message, room=self.room)

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'name': name,
                'created_at': new_msg.created_at,
                'profile_pic': 'http://127.0.0.1:8000' + new_msg.user.profile.profile_pic.url
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        name = event['name']
        created_at = event['created_at']
        profile_pic = event['profile_pic']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'name': name,
            'created_at': str(created_at),
            'profile_pic': profile_pic,
            'type': 'room_chat_message'
        }))




class PrivateChatConsumer(WebsocketConsumer):
    def connect(self):
        self.chat_code = self.scope['url_route']['kwargs']['chat_code']

        id1, id2 = self.chat_code.split('w')
        user1, user2 = User.objects.get(id=id1), User.objects.get(id=id2)
        user_a, user_b = sorted([user1, user2], key=lambda usr: usr.username)

        self.room_group_name = 'chat_%s' % f'{user_a.id}w{user_b.id}'
        
        private_chat_qs = PrivateChat.objects.filter(user_a=user_a, user_b=user_b, is_active=True)
        if not private_chat_qs.exists():
            return self.disconnect('newiem')
        
        self.private_chat = private_chat_qs.first()
        
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        
        print(f'*** PRIVATE CHAT SOCKET {self.room_group_name} CONNECTED ***')
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data): 
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        name = text_data_json['name']

        new_msg = PrivateChatMessage.objects.create(chat=self.private_chat, body=message, user=User.objects.get(username=name))

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'name': name,
                'created_at': new_msg.created_at,
                'user_id': new_msg.user.id,
                'user_pfp_url': new_msg.user.profile.profile_pic.url
            }
        )

    def chat_message(self, event):
        message = event['message']
        name = event['name']
        created_at = event['created_at']
        user_id = event['user_id']
        user_pfp_url = event['user_pfp_url']

       
        self.send(text_data=json.dumps({
            'message': message,
            'name': name,
            'created_at': str(created_at),
            'user_id': user_id,
            'user_pfp_url': user_pfp_url,
            'type': 'private_chat_message'
        }))
