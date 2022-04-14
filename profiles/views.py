from django.shortcuts import render, redirect

from .forms import ProfileForm


def profile_update_view(request, *args, **kwargs):
    
    if not request.user.is_authenticated:
        return redirect('/login')

    user = request.user

    user_data = {
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
    }

    my_profile = user.profile
    form = ProfileForm(request.POST or None, request.FILES or None, instance=my_profile, initial=user_data)

    if form.is_valid():
        profile_obj = form.save(commit=False)
        first_name = form.cleaned_data.get('first_name')
        last_name = form.cleaned_data.get('last_name')
        email = form.cleaned_data.get('email')

        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()

        profile_obj.save()

        return redirect('profile-detail', request.user.username)

    return render(request, 'profiles/edit.html', {'form': form})