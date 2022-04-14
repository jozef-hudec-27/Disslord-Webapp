from re import T
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User

from .models import FriendList, FriendRequest

import json



def friendlist_view(request, user_id):
	context = {}
	user = request.user
	if user.is_authenticated:
		try:
			this_user = User.objects.get(id=user_id)
			context['this_user'] = this_user
		except User.DoesNotExist:
			return HttpResponse('User does not exist.')
		
		try:
			friend_list = FriendList.objects.get(user=this_user)
		except FriendList.DoesNotExist:
			return HttpResponse(f'Could not find friendlist for {this_user.username}')

		if user != this_user:
			if user not in friend_list.friends.all():
				return HttpResponse('You must be friends to view their friendlist.')
		
		auth_user_friend_list = FriendList.objects.get(user=user)
		friends = [(friend, auth_user_friend_list.is_mutual_friend(friend)) for friend in friend_list.friends.all()]
		context['friends'] = friends
	
	else:
		return HttpResponse('You must be friends to view their friendlist.')
	
	return render(request, 'friend/friendlist.html', context)


def friend_requests_view(request, user_id):
	context = {}
	user = request.user	
	if user.is_authenticated:
		User = User.objects.get(id=user_id)
		if User == user:
			friend_requests = FriendRequest.objects.filter(receiver=User, is_active=True)
			context['friend_requests'] = friend_requests
		else:
			return HttpResponse("You cannot view other users' friend requests!")
	
	else:
		return redirect('login')
	
	return render(request, 'friend/friend_requests.html', context)



def send_friend_request(request):
    user = request.user
    payload = {}

    if request.method == 'POST' and user.is_authenticated:
        receiver_user_id = request.POST.get('receiver_user_id')
        if receiver_user_id:
            try:
                receiver = User.objects.get(id=receiver_user_id)
                active_friend_requests = FriendRequest.objects.filter(sender=user, receiver=receiver, is_active=True)
                try:
                    if active_friend_requests.exists():
                        raise Exception('You already sent them a friend request.')
                    else:
                        FriendRequest.objects.create(sender=user, receiver=receiver)
                        payload['response'] = 'Friend request sent.'
                except Exception as e:
                    payload['response'] = str(e)
            except Exception as e:
                payload['response'] = str(e)   
            
            if payload['response'] == None:
                payload['response'] = "Something went wrong."
        
        else:
            payload['response'] = "Unable to sent a friend request."
    
    else:
        payload['response'] = "You must be authenticated to send a friend request."

    return HttpResponse(json.dumps(payload), content_type='application/json')





def accept_friend_request(request):
	payload = {}
	user = request.user

	if not request.user.is_authenticated or request.method != 'POST':
		payload['status'] = 'error'
		payload['response'] = 'You must be authenticated to accept a friend request.'
	
	else:
		friend_request_id = request.POST.get('friend_request_id')

		if not friend_request_id:
			payload['status'] = 'error'
			payload['response'] = 'No sender found.'
		
		else:
			try:
				friend_request = FriendRequest.objects.get(id=friend_request_id)
				if friend_request.receiver != user:
					payload['status'] = 'error'
					payload['response'] = 'Bad friend request.'
				else:
					sender = friend_request.sender
					try:
						friend_request = FriendRequest.objects.get(sender=sender, receiver=user, is_active=True)	
						friend_request.accept()
						payload['status'] = 'success'
						payload['response'] = f"Successfully accepted {sender.username}'s friend request."

					except:
						payload['status'] = 'error'
						payload['response'] = 'No request found.'
			except:
				payload['status'] = 'error'
				payload['response'] = 'No request found.'
	
	return HttpResponse(json.dumps(payload), content_type='application/json')





def remove_friend(request):
	user = request.user
	payload = {}

	if request.method == 'POST' and user.is_authenticated:
		removee_id = request.POST.get('removee_id')

		try:
			removee = User.objects.get(id=removee_id)
			user_friendlist = user.my_friendlist or FriendList.objects.create(user=user)
			removee_friendlist = removee.my_friendlist or FriendList.objects.create(user=removee)

			if not (removee in user_friendlist.friends.all() and user in removee_friendlist.friends.all()):
				payload['status'] = 'error'; payload['response'] = 'This user must be your friend.'
			
			else:
				user_friendlist.unfriend(removee)
				payload['status'] = 'success'; payload['response'] = f"Successfully removed ${removee.username} from friends."

		except:
			payload['status'] = 'error'; payload['response'] = 'User not found.'
	
	else:
		payload['status'] = 'error'; payload['response'] = 'You must be authenticated to remove a friend.'

	return HttpResponse(json.dumps(payload), content_type='application/json')




def decline_friend_request(request):
	payload = {}
	user = request.user

	if not request.user.is_authenticated or request.method != 'POST':
		payload['status'] = 'error'; payload['response'] = 'You must be authenticated to decline a friend request.'
	
	else:
		friend_request_id = request.POST.get('friend_request_id')
 
		if not friend_request_id:
			payload['status'] = 'error'; payload['response'] = 'No sender found.'
		
		else:
			try:
				friend_request = FriendRequest.objects.get(id=friend_request_id)
				if friend_request.receiver != user:
					payload['status'] = 'error'; payload['response'] = 'Bad friend request.'
				else:
					sender = friend_request.sender
					try:
						friend_request = FriendRequest.objects.get(sender=sender, receiver=user, is_active=True)	
						friend_request.decline()
						payload['status'] = 'success'; payload['response'] = f"Successfully declined {sender.username}'s friend request."

					except:
						payload['status'] = 'error'; payload['response'] = 'No request found.'
			except:
				payload['status'] = 'error'; payload['response'] = 'No request found.'
	
	return HttpResponse(json.dumps(payload), content_type='application/json')
	




def cancel_friend_request(request):
	payload = {}
	user = request.user

	if not request.user.is_authenticated or request.method != 'POST':
		payload['status'] = 'error'; payload['response'] = 'You must be authenticated to cancel a friend request.'
	
	else:
		User_id = request.POST.get('User_id')

		try:
			User = User.objects.get(id=User_id)
			friend_requests_qs = FriendRequest.objects.filter(sender=user, receiver=User, is_active=True)

			if not friend_requests_qs.exists():
				payload['status'] = 'error'; payload['response'] = 'No friend request found.'

			else:
				for friend_request in friend_requests_qs:
					friend_request.cancel()
				payload['status'] = 'success'; payload['response'] = f'Successfully canceled friend request to {User.username}.'

		except:
			payload['status'] = 'error'; payload['response'] = 'User not found.'

	return HttpResponse(json.dumps(payload), content_type='application/json')