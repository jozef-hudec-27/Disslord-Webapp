from django.db import models
from django.contrib.auth.models import User

from profiles.models import Profile
# Create your models here.


class ParticipantRelation(models.Model):
    participant = models.ForeignKey(Profile, on_delete=models.CASCADE)
    room = models.ForeignKey('Room', on_delete=models.CASCADE)
    time_joined = models.DateTimeField(auto_now_add=True)

class Room(models.Model):
    admin = models.ForeignKey(User, related_name='owned_rooms', on_delete=models.PROTECT)
    name = models.CharField(max_length=120, unique=True)
    description = models.CharField(max_length=300, null=True, blank=True)
    participants = models.ManyToManyField(Profile, related_name='my_rooms', blank=True, through=ParticipantRelation)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.name} (id: {self.id})'

    class Meta:
        ordering = ['-created_at']


class RoomMessage(models.Model):
    user = models.ForeignKey(User, related_name='my_messages', on_delete=models.CASCADE)
    room = models.ForeignKey(Room, related_name='room_messages', on_delete=models.CASCADE)
    body = models.TextField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Message by '{self.user.username}' in '{self.room.name}' -> {self.body[:50]}"

    class Meta:
        ordering = ['-created_at']




