from django.urls import path

from . import views


'''
BASE ENDPOINT
api/rooms/
'''

urlpatterns = [
    path('search/', views.search_room_view, name='search-room-view'),
    path('create/', views.create_room_view, name='create-room-view'),
    path('message/', views.create_room_message_view, name='create-room-message-view'),
    path('update/', views.update_room_view, name='update-room-view'),
    path('kick-participant/', views.kick_room_participant_view, name='kick-room-participant-view'),
    path('all/', views.room_list_view, name='room-list-view'),
    path('<str:id>/', views.room_details_view, name='room-details-view'),
    path('<str:id>/action/', views.join_leave_room_view, name='room-join-leave-view'),

]


