from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
import google.generativeai as genai
from Main.models import Room, UserMessage, BotResponse
from django.views.generic.detail import DetailView
import json

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
#     return render(request, 'chatIAnes.html') api_key='AIzaSyCdUc8hHD_Uf6yior7ujtW5wvPYMepoh5I'

def home(request):
    rooms = Room.objects.all().order_by('-created_at')
    return render(request, 'home.html', {
        'rooms': rooms,
    })

class RoomDetailView(DetailView):
    model = Room
    template_name = 'list-messages.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

def send_message(request, pk):  #Teste
    current_room = get_object_or_404(Room, id=pk)
    if request.method == 'POST':
        user_message_text = request.POST.get('user_message')

        if user_message_text: 
            genai.configure(api_key='AIzaSyCdUc8hHD_Uf6yior7ujtW5wvPYMepoh5I')
            model = genai.GenerativeModel('gemini-1.5-flash')

            user_message = request.POST.get('user_message')
            try:
                bot_response = model.generate_content(user_message_text)
                bot_response_text = bot_response.text if hasattr(bot_response, 'text') else 'Erro ao gerar a resposta'    
            except Exception as e:
                bot_response_text = f"Erro: {str(e)}"
            
            user_message = UserMessage.objects.create(
                user = current_room.user,
                text = user_message_text,
                created_at = None
            )

            bot_response_instance = BotResponse.objects.create(
                text=bot_response_text
            )

            current_room.user_message.add(user_message)
            current_room.bot_response.add(bot_response_instance)

            return redirect('list_messages', pk=pk)
    return redirect('home')


def create_room(request):
    if request.method == 'POST':
        room_title = request.POST.get('title')
        room = Room.objects.create(user=request.user, title=room_title)
        return JsonResponse({'room_id': room.id, 'room_title': room_title})
    else:
        return render(request, 'create_room.html')
    # return render(request, 'room.html', {
    #     'r': room
    # })

def list_messages(request, pk):
    room = get_object_or_404(Room, id=pk)
    user_messages = room.user_message.all().order_by('-created_at')
    bot_responses = room.bot_response.all().order_by('-created_at')

    return render(request, 'list_messages.html', {
        'user_messages': user_messages,
        'bot_responses': bot_responses,
        'room': room
    })
