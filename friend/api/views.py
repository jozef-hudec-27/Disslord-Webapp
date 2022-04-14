from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.decorators import api_view

from ..models import FriendList, FriendRequest


@api_view(['POST', 'GET'])
def send_friend_request(request):
    user = request.user
    response = {}
    status = None

    if request.method == 'POST' and user.is_authenticated:
        receiver_user_id = request.data.get('receiver_user_id')
        if receiver_user_id:
            try:
                receiver = User.objects.get(id=receiver_user_id)
                active_friend_requests = FriendRequest.objects.filter(sender=user, receiver=receiver, is_active=True)

                if active_friend_requests.exists():
                    response['response'] = 'You already sent them a friend request.'
                    status = 400
                else:
                    FriendRequest.objects.create(sender=user, receiver=receiver)
                    response['response'] = 'Friend request sent.'
                    status = 201
                
            except:
                response['response'] = 'User not found.'
                status = 404   
            
            if response['response'] == None:
                response['response'] = "Something went wrong."
                status = 400
        
        else:
            response['response'] = "Invalid data."
            status = 400
    else:
        response['response'] = "You must be authenticated to send a friend request."
        status = 401

    return Response(response, status=status)


@api_view(['POST', 'GET'])
def accept_friend_request(request):
    response = {}
    status = None
    user = request.user

    if not user.is_authenticated or request.method != 'POST':
        response['response'] ='You must be authenticated to accept a friend request.'
        status = 401
    
    else:
        friend_request_id = request.data.get('friend_request_id')

        if not friend_request_id:
            response['response'] = 'No sender found.'
            status = 404
        else:
            try:
                friend_request = FriendRequest.objects.get(id=friend_request_id)
                print(friend_request)
                if friend_request.receiver != user:
                    response['response'] = 'Bad request.'
                    status = 400
                else:
                    sender = friend_request.sender
                    try:
                        friend_request = FriendRequest.objects.get(sender=sender, receiver=user, is_active=True)
                        friend_request.accept()
                        response['response'] = f"Successfully accepted {sender.username}'s friend request."
                        status = 200
                    except:
                        response['response'] = 'No request found.'
                        status = 404
            except:
                response['response'] = 'No request found.'
                status = 404

    return Response(response, status=status)


@api_view(['POST', 'GET'])
def remove_friend(request):
    user = request.user
    response = {}
    status = None

    if request.method == 'POST' and user.is_authenticated:
        removee_id = request.data.get('removee_id')

        try:
            removee = User.objects.get(id=removee_id)
            user_friendlist = user.my_friendlist or FriendList.objects.create(user=user)
            removee_friendlist = removee.my_friendlist or FriendList.objects.create(user=removee)

            if not (removee in user_friendlist.friends.all() and user in removee_friendlist.friends.all()):
                response['response'] = 'This user must be your friend.'
                status = 400
            
            else:
                user_friendlist.unfriend(removee)
                response['response'] = f"Successfully removed ${removee.username} from friends."
                status = 200

        except:
            response['response'] = 'User not found.'
            status = 404
    
    else:
       response['response'] = 'You must be authenticated to remove a friend.'
       status = 401

    return Response(response, status=status)



@api_view(['POST', 'GET'])
def decline_friend_request(request):
    response = {}
    user = request.user
    status = None

    if not user.is_authenticated or request.method != 'POST':
        response['response'] = 'You must be authenticated to decline a friend request.'
        status = 401
    
    else:
        friend_request_id = request.data.get('friend_request_id')

        if not friend_request_id:
            response['response'] = 'No sender found.'
            status = 404
        
        else:
            try:
                friend_request = FriendRequest.objects.get(id=friend_request_id)
                if friend_request.receiver != user:
                    response['response'] = 'Bad friend request.'
                    status = 404
                else:
                    sender = friend_request.sender
                    try:
                        friend_request = FriendRequest.objects.get(sender=sender, receiver=user, is_active=True)	
                        friend_request.decline()
                        response['response'] = f"Successfully declined {sender.username}'s friend request."
                        status = 200

                    except:
                        response['response'] = 'No request found.'
                        status = 404
            except:
                response['response'] = 'No request found.'
                status = 404
    
    return Response(response, status=status)
	

@api_view(['POST', 'GET'])
def cancel_friend_request(request):
    response = {}
    user = request.user
    status = None
    
    if not request.user.is_authenticated or request.method != 'POST':
        response['response'] = 'You must be authenticated to cancel a friend request.'
        status = 401
    
    else:
        their_id = request.data.get('user_id')
        print(their_id)

        try:
            them = User.objects.get(id=their_id)
            friend_requests_qs = FriendRequest.objects.filter(sender=user, receiver=them, is_active=True)

            if not friend_requests_qs.exists():
                response['response'] = 'No friend request found.'
                status = 404

            else:
                for friend_request in friend_requests_qs:
                    friend_request.cancel()
                response['response'] = f'Successfully canceled friend request to {user.username}.'
                status = 200

        except:
            response['response'] = 'User not found.'
            status = 404

    return Response(response, status=status)
