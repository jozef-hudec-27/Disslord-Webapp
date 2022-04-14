from rest_framework import serializers

from .models import PrivateChatMessage


class PrivateChatMessageSerializer(serializers.ModelSerializer):
    user_id = serializers.SerializerMethodField(read_only=True)
    user_username = serializers.SerializerMethodField(read_only=True)
    user_profile_pic = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PrivateChatMessage
        fields = ['id', 'body', 'created_at', 'user_id', 'user_username', 'user_profile_pic']
    
    def get_user_id(self, obj):
        return obj.user.id
    
    def get_user_username(self, obj):
        return obj.user.username

    def get_user_profile_pic(self, obj):
        return 'http://127.0.0.1:8000' + obj.user.profile.profile_pic.url




