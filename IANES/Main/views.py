from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as login_django
from django.http import JsonResponse, Http404
import google.generativeai as genai
from Main.models import Room, UserMessage, BotResponse
from django.views.generic.detail import DetailView
import json
import google.generativeai as genai
import os
from django.utils import timezone
import time
from google.api_core import exceptions as google_exceptions
from deep_translator import GoogleTranslator 
import re
import requests
from itertools import zip_longest
from django.contrib import messages 
import urllib
import logging
from django.contrib.auth import logout as auth_logout 
logger = logging.getLogger(__name__)    

# api_key='AIzaSyCdUc8hHD_Uf6yior7ujtW5wvPYMepoh5I'
pasta_dados = 'DADOS'

def catch_error_404(request, exception):
    return render(request, '404.html', {'error_message': 'URL não encontrada.'}, status=404)

def salvar_conversa_em_json(room_id, user_message_text, bot_response_text):
    # Define o caminho para o arquivo JSON
    caminho_arquivo = 'conversas.json'

    # Verifica se o arquivo já existe
    if os.path.exists(caminho_arquivo):
        # Se existir, abre para ler os dados existentes
        with open(caminho_arquivo, 'r') as file:
            try:
                conversas = json.load(file)
            except json.JSONDecodeError:
                conversas = []  # Se o arquivo estiver vazio ou corrompido
    else:
        conversas = []  # Se o arquivo não existir, inicia uma lista vazia

    # Cria um dicionário para a nova conversa
    nova_conversa = {
        'room_id': room_id,
        'timestamp': timezone.now().isoformat(),
        'user_message': user_message_text,
        'bot_response': bot_response_text
    }

    # Adiciona a nova conversa à lista
    conversas.append(nova_conversa)

    # Salva a lista de conversas de volta no arquivo JSON
    with open(caminho_arquivo, 'w') as file:
        json.dump(conversas, file, indent=4, ensure_ascii=False)

@csrf_exempt
def auth(request):
    if request.user.is_authenticated:
        return redirect('index')
    if request.method == 'GET':
        return render(request, 'auth.html', {'current_page': 'auth'})
    
    # elif request.method == 'POST':
    #     username_create = request.POST.get('username_create')
    #     email_create = request.POST.get('email_confirm')
    #     password_create = request.POST.get('password_create')
    #     password_confirm = request.POST.get('password_confirm')
    #     form = SignupForm(request.POST)
    #     if form.is_valid():
    #         form.save()
    #         return redirect('login')
    # else:
    #     form = SignupForm()
    # return render(request, 'signup.html', {'form': form})

    else:
        username = request.POST.get('username')
        password = request.POST.get('password')
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return render(request, 'auth.html', {'error_message': 'E-mail ou senha incorretos!'})

        user = authenticate(username=user.username, password=password)
        if user:
            login_django(request, user)
            return redirect(index)
        else:
            return render(request, 'auth.html', {'error_message': 'E-mail ou senha incorretos!'})

@login_required(login_url='auth')
@csrf_exempt
def index(request):
    rooms = Room.objects.all().order_by('-created_at')
    return render(request, 'index.html', {
        'rooms': rooms,
        'current_page': 'index'
    })
 
class RoomDetailView(DetailView):
    model = Room
    template_name = 'list-messages.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

def send_message_obter_parametros(request, pk):
    current_room = get_object_or_404(Room, id=pk)
    perguntas = {
        "nome": "Por favor, insira o nome da pessoa responsável: ",
        "nome_empresa": "Por favor, insira o nome da empresa responsável: ",
        "numero_colaboradores": "Por favor, insira o número de colaboradores: ",
        "projeto": "Por favor, informe o nome do projeto: ",
        "orcamento": f"Cotação atual do dólar: R$ teste \n Qual é o orçamento previsto para o projeto em reais (R$)?",
        "extensao": "Qual é a extensão geográfica do projeto? (Regional, Nacional, Mundial): ",
        "tempo": "Qual é a duração prevista do projeto em meses? ",
        "lucro": f"Qual é o lucro bruto da empresa em reais (R$)?",
        "CNPJ": "Por favor, forneça o CNPJ da empresa (se não possuir, informe 'Não'): ",
        "publicoalvo": "Quem é o público-alvo do projeto? ",
        "itensfianciaveis": "Os itens do projeto podem ser financiados? (Sim ou Não): "
    }

    # Inicializa a sessão para armazenar as respostas, se ainda não estiver
    if 'respostas' not in request.session:
        request.session['respostas'] = {}
        request.session['pergunta_index'] = 0

    respostas = request.session['respostas']
    pergunta_index = request.session['pergunta_index']

    if request.method == 'POST':
        user_message_text = request.POST.get('user_message')

        if user_message_text:
            # Salva a resposta do usuário na sessão
            if pergunta_index < len(perguntas):
                chave_atual = list(perguntas.keys())[pergunta_index]
                respostas[chave_atual] = user_message_text

                # Atualiza o índice da pergunta
                pergunta_index += 1
                request.session['pergunta_index'] = pergunta_index
                
                # Se ainda houver perguntas, mostra a próxima
                if pergunta_index < len(perguntas):
                    proxima_pergunta = perguntas[list(perguntas.keys())[pergunta_index]]
                    bot_response_text = proxima_pergunta
                else:
                    bot_response_text = dict(request.session.items())
                    # Limpa a sessão após todas as perguntas
                    del request.session['respostas']
                    del request.session['pergunta_index']
            else:
                bot_response_text = "Você já respondeu todas as perguntas."

            user_message = UserMessage.objects.create(
                user=current_room.user,
                text=user_message_text,
                created_at=None
            )

            bot_response_instance = BotResponse.objects.create(
                text=bot_response_text
            )

            current_room.user_message.add(user_message)
            current_room.bot_response.add(bot_response_instance)

            # salvar_conversa_em_json(current_room.id, user_message_text, bot_response_text)

            return redirect('list_messages', pk=pk)

    # Se for um GET, exibe a primeira pergunta ou a próxima
    if pergunta_index < len(perguntas):
        bot_response_text = perguntas[list(perguntas.keys())[pergunta_index]]
    else:
        bot_response_text = "Obrigado por responder todas as perguntas!"

    return render(request, 'template.html', {'bot_response_text': bot_response_text})

@login_required(login_url='auth')
@csrf_exempt
def send_message(request, pk):
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

            if user_message.text == "IANES":
                bot_response_text = send_message_obter_parametros(request, pk=current_room.get_id())


            bot_response_instance = BotResponse.objects.create(
                text=bot_response_text
            )

            current_room.user_message.add(user_message)
            current_room.bot_response.add(bot_response_instance)

            # salvar_conversa_em_json(current_room.id, user_message_text, bot_response_text)

            return redirect('list_messages', pk=pk)
    return redirect('home')

@login_required(login_url='auth')
@csrf_exempt
def create_room(request):
    room_title = request.POST.get('title')
    if not room_title:
        room_title = 'Valor Padrão'
    try:
        room = Room.objects.create(user=request.user, title=room_title)
        return redirect('list_messages', room.id )
    except Exception as e:
        logger.error(f"Erro inesperado {e}")
        return render(request, '404.html', {'error_message': "Erro "})

    return render(request, 'create_room.html')
    # return render(request, 'room.html', {
    #     'r': room
    # })

@login_required(login_url='auth')
@csrf_exempt
def list_messages(request, pk):
    try:
        room = get_object_or_404(Room, pk=pk)
        user_messages = room.user_message.all().order_by('created_at')
        bot_responses = room.bot_response.all().order_by('created_at')
        rooms = Room.objects.all().order_by('-created_at')
        messages = list(zip_longest(user_messages, bot_responses, fillvalue=None))

    except Http404 as e:
        logger.error(f"Room {pk} não encontrada")
        return render(request, '404.html', {'error_message': "Sala não encontrada", "error_description": e})
    except AttributeError as e:
        logger.error(f"Erro de atributo ao acessar mensages da Sala: {pk}")
        return render(request, '404.html', {'error_message': "Mensagens não encotradas"})
    except Exception as e:
        logger.error(f"Erro inesperado: {e}")
        return render(request, '404.html', {'error_message': 'Erro inesperado'})

    if request.method == 'PUT':
        body = request.body.decode('utf-8')
        parsed_data = urllib.parse.parse_qs(body)

        room_id_from_request = parsed_data.get('room_id', [None])[0]
        name_text = parsed_data.get('name_text', [None])[0]

        # room_id = request.PUT.get('room_id')
        # new_name_room = request.PUT.get('name_text')  
        if room_id_from_request and name_text:
            print(room_id_from_request, name_text)
            try:
                room = Room.objects.get(id=room_id_from_request)
                room.title = name_text
                room.save()
                return JsonResponse({'success': True})  # Retorna uma resposta JSON de sucesso
            except Room.DoesNotExist:
                return JsonResponse({'success': False, 'error': 'Room not found.'})
            except Exception as e:
                return JsonResponse({'success': False, 'error': str(e)})
    
    return render(request, 'chatIAnes.html', {
        'user_messages': user_messages,
        'bot_responses': bot_responses,
        'room': room,
        'rooms': rooms,
        'messages': messages,
        'current_page': 'ianes',
        
    })

@csrf_exempt
@login_required(login_url='auth')
def delete_room(request, id):
    last_room = Room.objects.order_by('-id').first()
    last_room_id = last_room.id
    print('last', last_room)
    print('last', last_room_id)
    room_delete = get_object_or_404(Room, pk=id)
    try:
        room_delete.delete()
        return redirect('list_messages', pk=last_room_id)
    except Exception as e:
        logger.error(f"Erro ao deletar a sala com ID {id}: {e}")
        return render(request, '404.html', {'error_message': 'Erro ao tentar deletar a sala.'})

def some_view(request):
    raise Exception("Erro intencional para teste de página 500")

@csrf_exempt
@login_required(login_url='auth')
def logout(request):
    auth_logout(request)
    return redirect('auth')
