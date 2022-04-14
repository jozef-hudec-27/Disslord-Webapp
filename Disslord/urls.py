"""Disslord URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

from accounts.views import login_view, logout_view, register_view
from rooms.views import home_page, all_rooms_page_my, all_rooms_page_search, room_detail_page, profile_detail_page, create_room_page, edit_room_page
from chat.views import private_chat_page

from django.shortcuts import render
def react_complete_view1(request):
    return render(request, 'react_complete.html')

def react_complete_view2(request, x):
    return render(request, 'react_complete.html')

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/rooms/', include('rooms.api.urls')),
    path('api/profiles/', include('profiles.api.urls')),
    path('api/friend/', include('friend.api.urls')),
    path('api/chat/', include('chat.api.urls')),

    path('login/', login_view),
    path('logout/', logout_view),
    path('register/', register_view),

    re_path(r'profiles?/', include('profiles.urls')),

    path('', home_page),
    path('room-<str:room_id>/', room_detail_page),
    path('my-rooms-all/', all_rooms_page_my),
    path('search-rooms-all/<str:key>/', all_rooms_page_search),
    path('profile-<str:username>/', profile_detail_page, name='profile-detail'),
    path('create-room/', create_room_page),
    path('chat-<str:their_id>/', private_chat_page),
    path('edit-room-<str:room_id>/', edit_room_page)

]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)