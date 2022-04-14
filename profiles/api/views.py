from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User

from ..models import Profile
from ..serializers import ProfileSerializer


@api_view(['GET'])
def profile_list_view(request):

    profiles = Profile.objects.all()
    serializer = ProfileSerializer(instance=profiles, many=True, context={'request': request})

    return Response(serializer.data, status=200)


@api_view(['GET'])
def profile_details_view(request, username):

    user_qs = User.objects.filter(username=username) if not username.isnumeric() else User.objects.filter(id=username)

    if not user_qs.exists():
        return Response({'error': 'User not found!'}, status=404)
    
    profile = user_qs.first().profile
    serializer = ProfileSerializer(instance=profile, context={'request': request})

    return Response(serializer.data, status=200)


