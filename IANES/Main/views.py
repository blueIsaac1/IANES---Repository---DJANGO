from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

@csrf_exempt
def auth(request):
    if request.user.is_authenticated:
        return redirect('index')
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            return render(request, 'auth.html')
    return render(request, 'auth.html')

@csrf_exempt
def index(request):
    return render(request, 'index.html')

@csrf_exempt
def chat(request):
    return render(request, 'chatIAnes.html')