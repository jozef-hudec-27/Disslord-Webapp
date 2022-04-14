from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def private_chat_page(request, their_id):
    return render(request, 'pages/private-chat.html', {'username': request.user.username, 'id': request.user.id, 'path': f'/chat-{their_id}'})