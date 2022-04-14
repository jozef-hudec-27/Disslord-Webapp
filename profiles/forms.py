from django import forms

from .models import Profile



class ProfileForm(forms.ModelForm):

    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email = forms.CharField(required=False)
    
    class Meta:
        model = Profile
        fields = ['location', 'bio', 'profile_pic']