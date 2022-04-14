from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.response import Response

from ..models import PrivateChatMessage, PrivateChat
from ..serializers import PrivateChatMessageSerializer


@api_view(['GET'])
def get_private_messages(request, their_id):
    response = {}
    status = None
    serializer = None

    user = request.user
    them = User.objects.get(id=their_id) 

    user_a, user_b = sorted([user, them], key=lambda usr: usr.username)
    try:
        private_chat = PrivateChat.objects.get(user_a=user_a, user_b=user_b, is_active=True)
        status = 200
        messages = PrivateChatMessage.objects.filter(chat=private_chat)
        serializer = PrivateChatMessageSerializer(instance=messages[::-1], many=True)
    except PrivateChat.DoesNotExist:
        response['response'] = 'No chat found.'
        status = 404

    return Response(response if serializer is None else serializer.data, status=status)