from django.contrib import admin
from .models import Room, RoomMessage, ParticipantRelation



admin.site.register(Room)
admin.site.register(RoomMessage)
admin.site.register(ParticipantRelation)

