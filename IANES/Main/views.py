from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as login_django
from django.http import JsonResponse, Http404
import google.generativeai as genai # type: ignore
from django.contrib.auth import login
from Main.models import Room, UserMessage, BotResponse
from django.views.generic.detail import DetailView
import json
import google.generativeai as genai # type: ignore
import os
from django.utils import timezone
import time
from google.api_core import exceptions as google_exceptions # type: ignore
from deep_translator import GoogleTranslator  # type: ignore
from django.urls import reverse
from itertools import zip_longest
from django.contrib import messages 
import urllib
import logging
from django.contrib.auth import logout as auth_logout 
from itertools import zip_longest
from .forms import SignUpForm
logger = logging.getLogger(__name__)    

# api_key='AIzaSyCdUc8hHD_Uf6yior7ujtW5wvPYMepoh5I'
pasta_dados = 'DADOS'

def catch_error_404(request, exception):
    return render(request, 'errors_template.html', {'error_message': 'URL não encontrada.'}, status=404)

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
    # Se o usuário já está autenticado, redireciona para o índice
    if request.user.is_authenticated:
        return redirect('index')

    if request.method == 'GET':
        # Renderiza a página de autenticação/cadastro
        return render(request, 'auth.html', {'current_page': 'auth'})

    else:
        # Determina a ação: login ou cadastro
        action = request.POST.get('action')

        if action == 'login':
            # Ação de Login
            username_login = request.POST.get('username')
            password_login = request.POST.get('password')
            print(username_login, password_login)

            # Verifica se o usuário existe e autentica
            try:
                user = User.objects.get(username=username_login)
            except User.DoesNotExist:
                return render(request, 'auth.html', {'error_message': 'Usuário ou senha incorretos!'})

            user = authenticate(username=username_login, password=password_login)
            if user:
                login_django(request, user) 
                return redirect('index')
            else:
                return render(request, 'auth.html', {'error_message': 'Usuário ou senha incorretos!'})

        elif action == 'signup':
            # Ação de Cadastro
            username=None

            username = request.POST.get('username_create')
            email = request.POST.get('email')
            password1 = request.POST.get('password')
            password2 = request.POST.get('confirm_password')
            print('content:', username, email, password1, password2)

            # Valida o formulário de cadastro
            if not username or not password1:
                return render(request, 'auth.html', {'error_message': 'Nome de usuário e senha são obrigatórios!', 'current_page': 'auth'})
            if password1 != password2:
                return render(request, 'auth.html', {'error_message': 'As senhas não coincidem!'})

            if User.objects.filter(username=username).exists():
                return render(request, 'auth.html', {'error_message': 'Nome de usuário já existe!'})

            if User.objects.filter(email=email).exists():
                return render(request, 'auth.html', {'error_message': 'O e-mail já está em uso!'})

            # Cria o novo usuário
            user = User.objects.create_user(username=username, email=email, password=password1)
            user.save()

            # Autentica e loga o novo usuário
            user = authenticate(username=username, password=password1)
            if user:
                login_django(request, user)
                return redirect('index')

        # Se a ação não for reconhecida, renderiza a página com uma mensagem de erro
        return render(request, 'auth.html', {'error_message': 'Ação inválida!'})
        
@csrf_exempt
def sign_up(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            sign_up = form.save()
            login(request, sign_up)
            return redirect('auth')
    else:
        form = SignUpForm()
    return redirect('auth')


@login_required(login_url='auth')
@csrf_exempt
def index(request):
    last_room_id = listar_ultima_sala()
    rooms = Room.objects.all().order_by('-created_at')
    if last_room_id:
        print(last_room_id)
        last_room_url = reverse('list_messages', args=[last_room_id])
        print(last_room_url)
    return render(request, 'index.html', {
        'rooms': rooms,
        'current_page': 'index',
        # 'last_room_url': last_room_url
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
        "nome": "Por favor, insira o nome da pessoa responsável.",
        "nome_empresa": "Por favor, insira o nome da empresa responsável.",
        "lucro": "Qual é o lucro bruto da empresa em reais (R$)?",
        "numero_colaboradores": "Por favor, insira o número de colaboradores do projeto.",
        "CNPJ": "Por favor, forneça o CNPJ da empresa (se não possuir, informe 'Não').",
        "Email": "Por favor, insira o e-mail do responsável pelo projeto."
    }

    # adicionar os outros prompts e tratamento de erro.

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

            # AVISO PARA FRANCISCO
            # FAZER A IA GERAR O AUDIO DELA DE ACORDO COM O 'bot_response_text'

            current_room.user_message.add(user_message)
            current_room.bot_response.add(bot_response_instance)

            # salvar_conversa_em_json(current_room.id, user_message_text, bot_response_text)

            return redirect('list_messages', pk=pk)

    # Se for um GET, exibe a primeira pergunta ou a próxima
    if pergunta_index < len(perguntas):
        bot_response_text = perguntas[list(perguntas.keys())[pergunta_index]]
    else:
        bot_response_text = "Obrigado por responder todas as perguntas!"


@login_required(login_url='auth')
@csrf_exempt
def send_message(request, pk):
    current_room = get_object_or_404(Room, id=pk)
    if request.method == 'POST':
        user_message_text = request.POST.get('user_message')

        if user_message_text:
            if request.session.get('collecting_parameters', False):
                try:
                    parameter_index = request.session.get('parameter_index', 0)
                    respostas = request.session.get('responses', {})
                    perguntas = request.session.get('perguntas', {})
                    perguntas_keys = list(perguntas.keys())

                    # Armazena a resposta do usuário
                    if 0 <= parameter_index - 1 < len(perguntas_keys):
                        current_question_key = perguntas_keys[parameter_index - 1]
                        respostas[current_question_key] = user_message_text
                        request.session['responses'] = respostas

                    if parameter_index < len(perguntas_keys):
                        # Faz a próxima pergunta
                        next_question_key = perguntas_keys[parameter_index]
                        bot_response_text = perguntas[next_question_key]
                        parameter_index += 1
                        request.session['parameter_index'] = parameter_index
                    else:
                        # Todas as perguntas foram respondidas
                        bot_response_text = "Obrigado por fornecer todas as informações!"
                        # Processar as respostas coletadas aqui
                        # Limpa as variáveis de sessão
                        request.session.pop('collecting_parameters')
                        request.session.pop('parameter_index')
                        request.session.pop('responses')
                        request.session.pop('perguntas')

                    # Salva a mensagem do usuário
                    user_message = UserMessage.objects.create(
                        user=current_room.user,
                        text=user_message_text,
                        created_at=None
                    )
                    current_room.user_message.add(user_message)

                    # Salva a resposta do bot
                    bot_response_instance = BotResponse.objects.create(
                        text=bot_response_text
                    )
                    current_room.bot_response.add(bot_response_instance)

                    # Armazenar o ID da nova resposta do bot na sessão
                    request.session['new_bot_response_id'] = bot_response_instance.id

                    return redirect('list_messages', pk=pk)
                except Exception as e:
                    # Registre a exceção
                    print(f"Ocorreu um erro na coleta de parâmetros: {e}")
                    # Envie uma mensagem de erro ao usuário
                    bot_response_text = "Desculpe, ocorreu um erro ao processar suas respostas."
                    # Limpa as variáveis de sessão
            
                    request.session.pop('collecting_parameters', None)
                    request.session.pop('parameter_index', None)
                    request.session.pop('responses', None)
                    request.session.pop('perguntas', None)
                    # Salva a resposta do bot e redireciona
                    bot_response_instance = BotResponse.objects.create(
                        text=bot_response_text
                    )
                    current_room.bot_response.add(bot_response_instance)
                    return redirect('list_messages', pk=pk)

            else:
                # Não está no modo de coleta de parâmetros
                if user_message_text.strip().upper() == "IANES":
                    # Inicia a coleta de parâmetros
                    request.session['collecting_parameters'] = True
                    request.session['parameter_index'] = 1  # Inicia do índice 1
                    request.session['responses'] = {}
                    # Define as perguntas
                    perguntas = {
                        "nome": "Por favor, insira o nome da pessoa responsável: ",
                        "nome_empresa": "Por favor, insira o nome da empresa responsável: ",
                        "numero_colaboradores": "Por favor, insira o número de colaboradores: ",
                        "projeto": "Por favor, informe o nome do projeto: ",
                        "orcamento": f"Cotação atual do dólar: R$ teste \nQual é o orçamento previsto para o projeto em reais (R$)?",
                        "extensao": "Qual é a extensão geográfica do projeto? (Regional, Nacional, Mundial): ",
                        "tempo": "Qual é a duração prevista do projeto em meses? ",
                        "lucro": f"Qual é o lucro bruto da empresa em reais (R$)?",
                        "CNPJ": "Por favor, forneça o CNPJ da empresa (se não possuir, informe 'Não'): ",
                        "publicoalvo": "Quem é o público-alvo do projeto? ",
                        "itensfianciaveis": "Os itens do projeto podem ser financiados? (Sim ou Não): "
                    }
                    request.session['perguntas'] = perguntas
                    # Pega a primeira pergunta
                    first_question_key = list(perguntas.keys())[0]
                    bot_response_text = perguntas[first_question_key]
                    # Salva a mensagem do usuário
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
                    request.session['new_bot_response_id'] = bot_response_instance.id
                    return redirect('list_messages', pk=pk)
                else:
                    # Processamento normal da mensagem usando a IA
                    try:
                        genai.configure(api_key='AIzaSyCAGX1oGtPn2xCJpcp-GZQlZVTbGUhPhho')
                        model = genai.GenerativeModel('gemini-1.5-flash')
                        bot_response = model.generate_content(user_message_text)
                        bot_response_text = bot_response.text if hasattr(bot_response, 'text') else 'Erro ao gerar a resposta'
                    except Exception as e:
                        print(f"Ocorreu um erro no processamento da IA: {e}")
                        bot_response_text = f"Erro: {str(e)}"
                    # Salva a mensagem do usuário e a resposta do bot
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

                    # **Aqui, armazenamos o ID da nova resposta do bot na sessão**
                    request.session['new_bot_response_id'] = bot_response_instance.id

                    return redirect('list_messages', pk=pk)
        return redirect('index')

@login_required(login_url='auth')
@csrf_exempt
def create_room(request):
    room_title = request.POST.get('title')
    room = listar_ultima_sala()
    room += 1
    if not room_title:
        room_title = f'Sala nova - {room}'
    try:
        room = Room.objects.create(user=request.user, title=room_title)
        return redirect('list_messages', room.id )
    except Exception as e:
        logger.error(f"Erro inesperado {e}")
        return render(request, 'errors_template.html', {'error_message': "Erro "})

    return render(request, 'create_room.html')
    # return render(request, 'room.html', {
    #     'r': room
    # })

@login_required(login_url='auth')
@csrf_exempt
def list_messages(request, pk=None):
    last_room = Room.objects.order_by('-created_at').first()

    if not last_room:
        room = Room.objects.create(user=request.user)
        room.title = f"Sala Nova - {room.id}"
        room.save()
        print(room)
        return redirect('list_messages', pk=room.id)

    try:
        room = get_object_or_404(Room, pk=pk if pk else last_room.id)
        user_messages = room.user_message.all().order_by('created_at')
        bot_responses = room.bot_response.all().order_by('created_at')
        rooms = Room.objects.all().order_by('-created_at')

        # Preparar as mensagens com o indicador 'is_new_bot_response'
        messages = []
        message_pairs = list(zip_longest(user_messages, bot_responses, fillvalue=None))

        # Obter o ID da nova resposta do bot armazenado na sessão
        new_bot_response_id = request.session.get('new_bot_response_id')

        for i, (user_message, bot_response) in enumerate(message_pairs):
            is_new_bot_response = False
            if bot_response:
                if bot_response.id == new_bot_response_id:
                    is_new_bot_response = True
                    # Remover o ID da sessão após identificar a mensagem como nova
                    del request.session['new_bot_response_id']
            messages.append({
                'user_message': user_message,
                'bot_response': bot_response,
                'is_new_bot_response': is_new_bot_response,
            })
        
    except Http404 as e:
        logger.error(f"Sala com PK {pk} não encontrada.")
        return render(request, 'errors_template.html', {'error_message': "Sala não encontrada", 'error_description': 'Objeto Sala não encontrado.'})
    except AttributeError as e:
        logger.error(f"Erro de atributo ao acessar mensages da Sala: {pk}")
        return render(request, 'errors_template.html', {'error_message': "Mensagens não encotradas", "error_description": str(e)})
    except Exception as e:
        logger.error(f"Erro ao acessar atributos de Sala com PK {pk}. Detalhes: {str(e)}")
        return render(request, 'errors_template.html', {'error_message': "Erro ao acessar mensagens da sala", 'error_description': str(e)})

    if request.method == 'POST':
        body = request.body.decode('utf-8')
        print("Corpo da Requisição Recebido:", body)  # Exibe o corpo da requisição

        parsed_data = urllib.parse.parse_qs(body)
        room_id_from_request = parsed_data.get('room_id', [None])[0]
        name_text = parsed_data.get('name_text', [None])[0]

        print("room_id_from_request:", room_id_from_request)
        print("name_text:", name_text)
        
        # room_id = request.PUT.get('room_id')
        # new_name_room = request.PUT.get('name_text')  
        if room_id_from_request and name_text:
            print(room_id_from_request, name_text)
            try:
                room = Room.objects.get(id=room_id_from_request)
                room.title = name_text
                room.save()
                return JsonResponse({'success': True})  # Retorna uma resposta JSON de sucesso
            except Room.DoesNotExist as e:
                logger.error(f"Erro ao acessar atributos de Sala com PK {pk}. Detalhes: {str(e)}")
                return render(request, 'errors_template.html', {'error_message': "Erro ao acessar a sala", 'error_description': str(e)})
            except Exception as e:
                logger.error(f"Erro inesperado. Detalhes: {str(e)}")
                return render(request, 'errors_template.html', {'error_message': "Erro Inesperado", 'error_description': str(e)})

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
    room_to_delete = get_object_or_404(Room, id=id)
    room_to_delete.delete()
    last_room = Room.objects.order_by('-created_at').first()
    if not last_room:
        return redirect('index')
    else:
        last_room = Room.objects.order_by('-created_at').first()
        return redirect('list_messages', pk=last_room.id)
    
    # else:   
    #     logger.error(f"Erro ao deletar a sala com ID {id}: {e}")
    #     return render(request, 'errors_template.html', {'error_message': 'Erro ao tentar deletar a sala.', "error_description": {e}})
    # except Exception as e:
    #     logger.error(f"Erro ao deletar a sala com ID {id}: {e}")
    #     return render(request, 'errors_template.html', {'error_message': 'Erro ao tentar deletar a sala. (Erro Inesperado)', "error_description": {e}})

def some_view(request):
    raise Exception("Erro intencional para teste de página 500")

@csrf_exempt
@login_required(login_url='auth')
def logout(request):
    if User.is_authenticated:
        auth_logout(request)
        return redirect('auth')
    else:
        pass

def listar_ultima_sala():
    last_room = Room.objects.order_by('-id').first()
    return last_room.id if last_room else None