from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Create your views here.

@login_required
def home_page(request):
    return render(request, 'pages/home.html', {'username': request.user.username})

@login_required
def all_rooms_page_my(request):
    return render(request, 'pages/all-rooms.html', {'path': '/my-rooms-all', 'username': request.user.username})

@login_required
def all_rooms_page_search(request, key):
    return render(request, 'pages/all-rooms.html', {'path': f'/search-rooms-all/{key}', 'username': request.user.username})

@login_required
def room_detail_page(request, room_id):

    return render(request, 'pages/room-detail.html', {'path': f'/room-{room_id}', 'username': request.user.username})

@login_required
def profile_detail_page(request, username):
    return render(request, 'pages/profile-detail.html', {'me': request.user.username, 'path': f'/profile-{username}'})

@login_required
def create_room_page(request):
    return render(request, 'pages/create-room.html', {'username': request.user.username, 'path': f'/create-room'})

@login_required
def edit_room_page(request, room_id):
    return render(request, 'pages/edit-room.html', {'username': request.user.username, 'path': f'/edit-room-{room_id}'})