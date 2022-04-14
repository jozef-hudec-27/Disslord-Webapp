from rest_framework import serializers

from .models import Profile
from friend.models import FriendRequest


class ProfileSerializer(serializers.ModelSerializer):

    is_self = serializers.SerializerMethodField(read_only=True)
    first_name = serializers.SerializerMethodField(read_only=True)
    last_name = serializers.SerializerMethodField(read_only=True)
    username = serializers.SerializerMethodField(read_only=True)
    friend_list = serializers.SerializerMethodField(read_only=True)
    is_friend = serializers.SerializerMethodField(read_only=True)
    member_rooms = serializers.SerializerMethodField(read_only=True)
    owned_rooms = serializers.SerializerMethodField(read_only=True)
    messages = serializers.SerializerMethodField(read_only=True)
    request_status = serializers.SerializerMethodField(read_only=True)
    request_id_from_them = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = [
            'first_name', 'last_name', 'id', 'bio', 'location', 'friend_list', 
            'username', 'is_friend', 'profile_pic', 'member_rooms', 'owned_rooms',
            'messages', 'is_self', 'request_status', 'request_id_from_them'
        ]
    
    def get_is_friend(self, obj):
        context = self.context
        request = context.get('request')
        if request:
            user = request.user
            self.is_friend = user in obj.user.my_friendlist.friends.all()
            return self.is_friend

        return False
        

    def get_is_self(self, obj):
        usera = None if not self.context.get('request') else self.context.get('request').user
        userb = False if not obj else obj.user
        return usera == userb

    # them_sent_you => 1
    # you_sent_them => 2
    # no_requests_sent => 3
    def get_request_status(self, obj):
        if not self.context.get('request').user == obj.user:
            me = self.context.get('request').user
            user = obj.user

            them_sent_you_qs = FriendRequest.objects.filter(sender=user, receiver=me, is_active=True)
            if them_sent_you_qs.exists():
                self.inbox_request = them_sent_you_qs.first()
                self.request_status = 1
                return 1
            
            you_sent_them_qs = FriendRequest.objects.filter(sender=me, receiver=user, is_active=True)
            if you_sent_them_qs.exists():
                self.request_status = 2
                return 2
            
            self.request_status = 3
            return 3

        self.request_status = None
        return None
    
    def get_request_id_from_them(self, obj):
        if self.request_status == 1:
            return self.inbox_request.id
        
        return None

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name

    def get_username(self, obj):
        return obj.user.username

    def get_friend_list(self, obj):
        return [{'username': user.username, 'profile_pic': 'http://127.0.0.1:8000' + user.profile.profile_pic.url} for user in obj.user.my_friendlist.friends.all()]

    def get_member_rooms(self, obj):
        return [{'id': room.id, 'name': room.name, 'admin_username': room.admin.username,
        'description': room.description, 'participants_count': room.participants.count()} for room in obj.my_rooms.all()]

    def get_owned_rooms(self, obj):
        return [{'id': room.id, 'name': room.name, 'description': room.description, 'is_member': obj in room.participants.all(), 'admin_username': obj.user.username} for room in obj.user.owned_rooms.all()]

    def get_messages(self, obj):
        return [{'room_id': mes.room.id, 'room_name': mes.room.name, 'body': mes.body, 'created_at': mes.created_at} for mes in obj.user.my_messages.all()[:50]]

