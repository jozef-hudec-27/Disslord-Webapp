from django.urls import path
from . import views

'''
BASE ENDPOINT
api/profiles/
'''

urlpatterns = [
    path('all/', views.profile_list_view, name='profile-list-view'),
    path('<str:username>/', views.profile_details_view, name='profile-details-view')
]


