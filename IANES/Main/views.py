from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
import google.generativeai as genai
from Main.models import ChatMessage

# @csrf_exempt
# def auth(request):
#     if request.user.is_authenticated:
#         return redirect('index')
#     if request.method == "POST":
#         username = request.POST['username']
#         password = request.POST['password']
#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             login(request, user)
#             return redirect('index')
#         else:
#             return render(request, 'auth.html')
#     return render(request, 'auth.html')

# @csrf_exempt
# def index(request):
#     return render(request, 'index.html')

# @csrf_exempt
# def chat(request):
#     return render(request, 'chatIAnes.html')

def send_messages(request):  #Teste
    if request.method == 'POST':
        genai.configure(api_key='AIzaSyCdUc8hHD_Uf6yior7ujtW5wvPYMepoh5I')
        model = genai.GenerativeModel('gemini-1.5-flash')

        user_message = request.POST.get('user_message')
        try:
            bot_response = model.generate_content(user_message)
            bot_response_text = bot_response.text if hasattr(bot_response, 'text') else 'Erro ao gerar a resposta'    
        except Exception as e:
            bot_response_text = f"Erro: {str(e)}"


        ChatMessage.objects.create(
            user_message = user_message,
            bot_response = bot_response_text
        )
    return redirect('list_messages')


def list_messages(request):  #Teste
    messages = ChatMessage.objects.all()
    return render(request, 'chatIAnes.html', {
        'messages': messages
    })