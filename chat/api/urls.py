from django.urls import path

from . import views


'''
BASE URL
/api/chat/
'''

urlpatterns = [
    path('messages/<str:their_id>/', views.get_private_messages, name='get_private_messages')
]