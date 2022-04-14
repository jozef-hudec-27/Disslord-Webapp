from rest_framework import serializers

from .models import Room, RoomMessage

from profiles.serializers import ProfileSerializer



class RoomMessageSerializer(serializers.ModelSerializer):

    user = serializers.SerializerMethodField(read_only=True)
    profile_pic = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = RoomMessage
        fields = ['user', 'body', 'created_at', 'profile_pic']

    def get_user(self, obj):
        return obj.user.username

    def get_profile_pic(self, obj):
        return 'http://127.0.0.1:8000' + obj.user.profile.profile_pic.url


class RoomSerializer(serializers.ModelSerializer):

    admin = ProfileSerializer(source='admin.profile', read_only=True)
    participants = ProfileSerializer(many=True, read_only=True)
    messages = RoomMessageSerializer(source='room_messages', many=True, read_only=True)
    is_member = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Room
        fields = ['admin', 'id', 'name', 'description','participants', 'created_at', 'messages', 'is_member']
    
    def get_is_member(self, obj):
        context = self.context
        request = context.get('request')
        profile = None if not request else request.user.profile 
        return profile in obj.participants.all() if profile else False



class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['name', 'description']



