from django.urls import path
from . import views

'''
BASE ENDPOINT
api/friend/
'''


urlpatterns = [
    path('request/send/', views.send_friend_request, name='send_friend_request'),
    path('request/accept/', views.accept_friend_request, name='accept_friend_request'),
    path('remove/', views.remove_friend, name='remove_friend'),
    path('request/decline/', views.decline_friend_request, name='decline_friend_request'),
    path('request/cancel/', views.cancel_friend_request, name='cancel_friend_request'),


]

