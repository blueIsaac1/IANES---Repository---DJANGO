from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class SignUpForm(UserCreationForm):
    class meta:
        model=User
        fields = ['username_create','email_confirm','password_create','password_confirm'] 