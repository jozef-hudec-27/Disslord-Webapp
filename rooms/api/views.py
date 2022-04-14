from rest_framework.response import Response
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from django.db.models import Q
from django.contrib.auth.models import User

from ..models import Room, RoomMessage
from ..serializers import RoomSerializer, CreateRoomSerializer


def get_paginated_queryset_response(qs, request, serializer_class, page_size, context={}):
    paginator = PageNumberPagination()
    paginator.page_size = page_size
    paginated_qs = paginator.paginate_queryset(qs, request)
    serializer = serializer_class(instance=paginated_qs, many=True, context=context)
    return paginator.get_paginated_response(serializer.data)


class RoomListView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


@api_view(['GET'])
def room_list_view(request):
    qs = Room.objects.all()
    return get_paginated_queryset_response(qs, request, RoomSerializer, 10)


@api_view(['GET'])
def room_details_view(request, id):

    rooms_qs = Room.objects.filter(id=id)

    if not rooms_qs.exists():
        return Response({'message': 'Room not found!'}, status=404)
    
    room = rooms_qs.first()
    serializer = RoomSerializer(instance=room, context={'request': request})

    return Response(serializer.data, status=200)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def create_room_view(request):
    serializer = CreateRoomSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        new_room = serializer.save(admin=request.user)
        new_room.participants.add(request.user.profile)
        new_room.save()
        return Response(RoomSerializer(new_room, context={'request': request}).data, status=201)

    return Response(serializer.errors, status=400)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def create_room_message_view(request):

    if not request.data:
        return Response({'error': 'Invalid data!'}, status=400)
    
    room_id = request.data.get('room_id')
    if room_id[-1] == '/':
        room_id = room_id[:-1]
    message_body = request.data.get('message_body')

    if not room_id or not message_body:
        return Response({'error': 'Invalid data!'}, status=400)
    
    room_qs = Room.objects.filter(id=room_id)
    if not room_qs:
        return Response({'error': 'Room not found!'}, status=404)

    room = room_qs.first()

    new_message = RoomMessage.objects.create(
        user=request.user, room=room, body=message_body
    )

    room_serializer_data = RoomSerializer(new_message.room, context={'request': request}).data

    return Response({
        'body': new_message.body, 'user': request.user.username,
        'room':room_serializer_data, 'created_at': new_message.created_at,
        'profile_pic': 'http://127.0.0.1:8000' + request.user.profile.profile_pic.url
    }, status=201)
 


@api_view(['POST', 'GET'])
def search_room_view(request):
    
    if not request.data or request.data.get('key') is None:
        return Response({'error': 'Invalid data!'}, status=400)
    
    key = request.data.get('key').lower()

    if key == '':
        return Response([], status=200)

    room_qs = Room.objects.filter(
        Q(name__icontains=key) |
        Q(description__icontains=key))

    serializer = RoomSerializer(instance=room_qs, many=True, context={'request': request})
    return Response(serializer.data, status=200)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def join_leave_room_view(request, id):

    if not request.data or not request.data.get('action'):
        return Response({'error': 'Invalid data!'}, status=400)

    rooms_qs = Room.objects.filter(id=id)
    if not rooms_qs.exists():
        return Response({'error': 'Room not found!'}, status=404)
    
    room = rooms_qs.first()
    action = request.data.get('action').lower()
    profile = request.user.profile

    if action == 'join':
        room.participants.add(profile)
    elif action == 'leave':
        room.participants.remove(profile)

    serializer = RoomSerializer(instance=room, context={'request': request})
    return Response(serializer.data, status=200)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def update_room_view(request):
    response = {}
    status = None

    room_id = request.data.get('id')

    room_qs = Room.objects.filter(id=room_id)

    if not room_qs.exists():
        response['response'] = 'Room not found.'
        status = 404
    
    else:
        room = room_qs.first()

        if not room.admin == request.user:
            response['response'] = 'You can only edit your own rooms.'
            status = 401
        
        else:
            room_name = request.data.get('name')
            room_description = request.data.get('description')

            if not len(room_name) or room_description == None:
                response['response'] = 'Invalid data.'
                status = 400
            
            else:
                room.name = room_name
                room.description = room_description
                room.save()
                response['response'] = 'Successfully updated room.'
                status = 200
    
    return Response(response, status=status)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def kick_room_participant_view(request):
    response = {}
    status = None

    room_id = request.data.get('room_id')
    room_qs = Room.objects.filter(id=room_id)

    if not room_qs.exists():
        response['response'] = 'Room not found.'
        status = 404

    else:
        room = room_qs.first()

        kicked_user_id = request.data.get('kicked_user_id')
        user_qs = User.objects.filter(id=kicked_user_id)

        if not user_qs.exists():
            response['response'] = 'User not found.'
            status = 404
        
        else:
            kicked_user = user_qs.first()

            if room.admin != request.user:
                response['response'] = 'You can only kick participants from your rooms.'
                status = 401
            
            else:
                room.participants.remove(kicked_user.profile)
                response = {
                    'participants': [{'username': participant.user.username, 'profile_pic': 'http://127.0.0.1:8000' + participant.profile_pic.url} for participant in room.participants.all()],
                    'response': 'Successfully removed participant from room.'                    
                    }
                status = 200
    
    return Response(response, status=status)