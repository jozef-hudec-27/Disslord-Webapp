from django.urls import path

from .views import profile_update_view

urlpatterns = [
    path('edit/', profile_update_view),
]

