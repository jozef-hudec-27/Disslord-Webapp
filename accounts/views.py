from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.decorators import login_required


def login_view_old(request, *args, **kwargs):
    form = AuthenticationForm(request, data=request.POST or None)
    if form.is_valid():
        user_ = form.get_user()
        login(request, user_)
        return redirect('/')
    context = {
        'form': form, 'btn_label': 'Login', 'title': 'Login'
    }
    return render(request, 'accounts/auth.html', context)


def login_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        return redirect('/')

    form = AuthenticationForm(request, data=request.POST or None)
    if form.is_valid():
        user_ = form.get_user()
        login(request, user_)
        return redirect('/')
    context = {
        'form': form
    }
    return render(request, 'accounts/login.html', context)


def logout_view_old(request, *args, **kwargs):
    if request.method == 'POST':
        logout(request)
        return redirect('/login')
    context = {
        'form': None, 'btn_label': 'Click to Confirm', 'title': 'Logout',
        'description': 'Are you sure you want to log out?'
    }
    return render(request, 'accounts/auth.html', context)

@login_required
def logout_view(request, *args, **kwargs):
    if request.method == 'POST':
        logout(request)
        return redirect('/login')
    return render(request, 'accounts/logout.html')

def register_view_old(request, *args, **kwargs):
    form = UserCreationForm(request.POST or None)
    if form.is_valid():
        user = form.save(commit=True)
        user.set_password(form.cleaned_data.get('password1'))
        login(request, user)
        return redirect('/')
    context = {
        'form': form, 'btn_label': 'Register', 'title': 'Register'
    }
    return render(request, 'accounts/auth.html', context)


def register_view(request, *args, **kwargs):
    if request.user.is_authenticated:
        return redirect('/')

    form = UserCreationForm(request.POST or None)
    if form.is_valid():
        if '-' in form.cleaned_data.get('username'):
            return redirect('/register')
        user = form.save(commit=True)
        user.set_password(form.cleaned_data.get('password1'))
        login(request, user)
        return redirect('/')
    context = {
        'form': form
    }
    return render(request, 'accounts/register.html', context)



