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
import re
import time
from django.utils import timezone
import time
from django.conf import settings
from google.api_core import exceptions as google_exceptions # type: ignore
from deep_translator import GoogleTranslator  # type: ignore
from django.urls import reverse
from itertools import zip_longest
from django.contrib import messages 
import urllib
import logging
import requests # type: ignore
from django.contrib.auth import logout as auth_logout 
from itertools import zip_longest
from .forms import SignUpForm
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
logger = logging.getLogger(__name__)    

GOOGLE_API_KEY = 'AIzaSyCdUc8hHD_Uf6yior7ujtW5wvPYMepoh5I'

pasta_dados = 'DADOS'
TEMAS = {
    1: "Tecnologia da Informação (TI)",
    2: "Indústria",
    3: "Engenharia Civil e Infraestrutura",
    4: "Meio Ambiente",
    5: "Educação",
    6: "Saúde",
    7: "Finanças e Investimentos",
    8: "Agropecuária e Agroindústria",
    9: "Marketing e Comunicação",
    10: "Desenvolvimento Social e Humano",
    11: "Setor Público e Governança",
    12: "Entretenimento e Cultura"
}

VERTENTES = {
    1: ["Desenvolvimento de Software", "Infraestrutura de TI", "Segurança da Informação", "Inteligência Artificial"],
    2: ["Automação Industrial", "Manufatura", "Logística", "Gestão da Produção"],
    3: ["Construção Civil", "Infraestrutura Urbana", "Saneamento", "Transportes"],
    4: ["Sustentabilidade", "Energia Renovável", "Gestão de Resíduos", "Conservação"],
    5: ["Educação Básica", "Ensino Superior", "Educação Profissional", "Tecnologia Educacional"],
    6: ["Saúde Pública", "Pesquisa Médica", "Equipamentos Médicos", "Telemedicina"],
    7: ["Mercado Financeiro", "Investimentos", "Fintechs", "Gestão Financeira"],
    8: ["Agricultura", "Pecuária", "Agroindústria", "Agricultura de Precisão"],
    9: ["Marketing Digital", "Publicidade", "Relações Públicas", "Mídias Sociais"],
    10: ["Desenvolvimento Comunitário", "Inclusão Social", "Capacitação Profissional", "Economia Solidária"],
    11: ["Administração Pública", "Políticas Públicas", "Governança Digital", "Transparência"],
    12: ["Produção Cultural", "Eventos", "Mídia e Entretenimento", "Economia Criativa"]
}

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
def obter_cotacao_dolar():
    url = 'https://economia.awesomeapi.com.br/json/last/USD-BRL'
    response = requests.get(url)
    if response.status_code == 200:
        dados = response.json()
        cotacao = dados['USDBRL']['bid']
        return float(cotacao)
    return 5.00

def translate_text(text, target_lang='pt'):
    try:
        translator = GoogleTranslator(source='auto', target=target_lang)
        return translator.translate(text)
    except Exception as e:
        logger.error(f"Erro na tradução: {e}")
        return text

def carregar_conteudo(pasta):
    todos_conteudos = []
    for arquivo in os.listdir(pasta):
        caminho_completo = os.path.join(pasta, arquivo)
        if arquivo == 'membros.json':
            continue
        if os.path.isfile(caminho_completo):
            try:
                with open(caminho_completo, 'r', encoding='utf-8') as f:
                    conteudo = json.load(f)
                    todos_conteudos.append({"arquivo": arquivo, "conteudo": conteudo})
            except Exception as e:
                logger.error(f"Erro ao carregar arquivo {arquivo}: {e}")
    return todos_conteudos

def get_gemini_analysis(content, user_inputs, max_retries=3):
    for attempt in range(max_retries):
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = (
                f"Analise o seguinte conteúdo com base nas entradas do usuário:"
                f"\n\nConteúdo: {content}\n\n"
                f"Entradas do usuário:\n"
                f"- Projeto: {user_inputs.get('projeto', 'N/A')}\n"
                f"- Orçamento: R$ {user_inputs.get('orcamento', 'N/A')}\n"
                f"- Extensão: {user_inputs.get('extensao', 'N/A')}\n"
                f"- Duração: {user_inputs.get('tempo', 'N/A')} meses\n"
                f"- Tema: {user_inputs.get('tema', 'N/A')}\n"
                f"- Vertente: {user_inputs.get('vertente', 'N/A')}\n"
                f"- Itens Financiáveis: {user_inputs.get('itensfinanciaveis', 'N/A')}\n"
                f"- Público-Alvo: {user_inputs.get('publicoalvo', 'N/A')}\n\n"
                f"Forneça:\n"
                f"1. Pontuação de 0 a 10 para adequação ao projeto\n"
                f"2. Breve justificativa da pontuação"
            )
            response = model.generate_content(prompt)
            print(response)
            return response.text
        except Exception as e:
            if attempt == max_retries - 1:
                logger.error(f"Erro na análise Gemini: {e}")
                return "0\nErro na análise"
            time.sleep(2 ** attempt)
    return "0\nErro após várias tentativas"

def processar_respostas_finais(respostas):
    try:
        pasta_dados = os.path.join(settings.BASE_DIR, 'Main', 'DADOS')
        if pasta_dados:
            print('achei os dados')
        if not os.path.exists(pasta_dados):
            return "Erro: Diretório de dados não encontrado."

        dados_paginas = carregar_conteudo(pasta_dados)
        
        melhor_score = 0
        melhor_opcao = None
        melhor_descricao = None

        for pagina in dados_paginas:
            content_str = json.dumps(pagina['conteudo'])
            analysis = get_gemini_analysis(content_str, respostas)
            
            try:
                score_str, descricao = analysis.split('\n', 1)
                score = float(score_str)
                if score > melhor_score:
                    melhor_score = score
                    melhor_opcao = pagina['arquivo']
                    melhor_descricao = descricao.strip()
            except Exception as e:
                logger.error(f"Erro ao processar análise: {e}")
                continue

        if melhor_opcao:
            return (
                f"Com base nas suas respostas, recomendo a seguinte opção:\n\n"
                f"Programa: {melhor_opcao}\n"
                f"Pontuação de adequação: {melhor_score:.1f}/10\n"
                f"Justificativa: {melhor_descricao}"
            )
        return "Não foi possível encontrar uma recomendação adequada para o seu projeto."

    except Exception as e:
        logger.error(f"Erro no processamento final: {e}")
        return f"Ocorreu um erro ao processar suas respostas: {str(e)}"

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

                    # Validação da resposta atual
                    if 0 <= parameter_index - 1 < len(perguntas_keys):
                        current_question_key = perguntas_keys[parameter_index - 1]
                        
                        # Validação específica para cada tipo de resposta
                        if current_question_key == "orcamento":
                            try:
                                resposta_limpa = re.sub(r'[^0-9,\.]', '', user_message_text)
                                respostas[current_question_key] = float(resposta_limpa.replace(",", "."))
                            except ValueError:
                                bot_response_text = "Por favor, insira um valor numérico válido para o orçamento."
                                raise ValueError(bot_response_text)
                        elif current_question_key == "extensao":
                            if user_message_text.lower() not in ["regional", "nacional", "global"]:
                                bot_response_text = "Por favor, escolha entre Regional, Nacional ou Global."
                                raise ValueError(bot_response_text)
                            respostas[current_question_key] = user_message_text
                        elif current_question_key == "tempo":
                            try:
                                respostas[current_question_key] = int(user_message_text)
                            except ValueError:
                                bot_response_text = "Por favor, insira um número inteiro para a duração do projeto."
                                raise ValueError(bot_response_text)
                        elif current_question_key == "tema":
                            try:
                                tema_escolhido = int(user_message_text)
                                if tema_escolhido not in TEMAS:
                                    raise ValueError()
                                respostas[current_question_key] = TEMAS[tema_escolhido]
                                # Atualiza a próxima pergunta com as vertentes do tema escolhido
                                perguntas['vertente'] = "Escolha a vertente:\n" + "\n".join(
                                    [f"{i+1}: {v}" for i, v in enumerate(VERTENTES[tema_escolhido])]
                                )
                                request.session['perguntas'] = perguntas
                            except ValueError:
                                bot_response_text = f"Por favor, escolha um número entre 1 e {len(TEMAS)}."
                                raise ValueError(bot_response_text)
                        elif current_question_key == "itensfinanciaveis":
                            if user_message_text.lower() not in ["sim", "não", "nao"]:
                                bot_response_text = "Por favor, responda com 'sim' ou 'não'."
                                raise ValueError(bot_response_text)
                            respostas[current_question_key] = user_message_text
                        else:
                            respostas[current_question_key] = user_message_text

                        request.session['responses'] = respostas

                    # Próxima pergunta ou finalização
                    if parameter_index < len(perguntas_keys):
                        next_question_key = perguntas_keys[parameter_index]
                        if next_question_key == "orcamento":
                            cotacao = obter_cotacao_dolar()
                            bot_response_text = f"Cotação atual do dólar: R$ {cotacao:.2f}\n" + perguntas[next_question_key]
                        else:
                            bot_response_text = perguntas[next_question_key]
                        parameter_index += 1
                        request.session['parameter_index'] = parameter_index
                    else:
                        # Processamento final das respostas
                        respostas_finais = request.session.get('responses', {})
                        bot_response_text = processar_respostas_finais(respostas_finais)
                        
                        # Limpa as variáveis de sessão
                        request.session.pop('collecting_parameters', None)
                        request.session.pop('parameter_index', None)
                        request.session.pop('responses', None)
                        request.session.pop('perguntas', None)

                except Exception as e:
                    logger.error(f"Erro na coleta de parâmetros: {e}")
                    bot_response_text = f"Erro: {str(e)}"
                    request.session.pop('collecting_parameters', None)
                    request.session.pop('parameter_index', None)
                    request.session.pop('responses', None)
                    request.session.pop('perguntas', None)

            elif user_message_text.strip().upper() == "IANES":
                # Inicia o processo de coleta de dados
                request.session['collecting_parameters'] = True
                request.session['parameter_index'] = 1
                request.session['responses'] = {}
                
                # Define as perguntas iniciais
                perguntas = {
                    "projeto": "Por favor, informe o nome do projeto:",
                    "orcamento": "Qual é o orçamento previsto para o projeto em reais (R$)?",
                    "extensao": "Qual é a extensão geográfica do projeto? (Regional, Nacional ou Global)",
                    "tempo": "Qual é a duração prevista do projeto em meses?",
                    "tema": f"Escolha o tema do projeto (1-{len(TEMAS)}):\n" + "\n".join([f"{k}: {v}" for k,v in TEMAS.items()]),
                    "vertente": "A vertente será solicitada após a escolha do tema",
                    "publicoalvo": "Quem é o público-alvo do projeto?",
                    "itensfinanciaveis": "Os itens do projeto podem ser financiados? (Sim/Não)"
                }
                request.session['perguntas'] = perguntas
                bot_response_text = perguntas["projeto"]

            else:
                # Processamento normal da mensagem usando a IA
                try:
                    
                    genai.configure(api_key=GOOGLE_API_KEY)
                    model = genai.GenerativeModel('gemini-1.5-flash')
                    bot_response = model.generate_content(user_message_text)
                    bot_response_text = bot_response.text if hasattr(bot_response, 'text') else 'Erro ao gerar a resposta'
                except Exception as e:
                    logger.error(f"Erro no processamento da IA: {e}")
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

            salvar_conversa_em_json(room_id=current_room.id,
                                    user_message_text=user_message_text,
                                    bot_response_text=bot_response_text)

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

# @login_required(login_url='auth')
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
        'pk': pk or (room.id if room else None),
        
        
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


def gerar_pdf(nome_arquivo="relatorio.pdf", pk=None): # atribuir o response da ia ao "relatorio"
    relatorio = acessar_ultima_conversa_json(pk)
    c = canvas.Canvas(nome_arquivo, pagesize=A4)
    c.drawString(100, 800, "Descrição do Projeto:")

    if isinstance(relatorio, str):
        relatorio = [relatorio]  
    elif not isinstance(relatorio, (list, tuple)):
        relatorio = [str(relatorio)]

    text = c.beginText(100, 780)
    text.setFont("Helvetica", 12)
    text.setLeading(14)
    text.textLines(relatorio)
    c.drawText(text)
    c.save()
    print("PDF gerado com sucesso.")
    


# Função para enviar e-mail com anexo PDF
def enviar_email(com_remetente, para_destinatario, nome_arquivo):
    msg = MIMEMultipart()
    msg["From"] = com_remetente
    msg["To"] = para_destinatario
    msg["Subject"] = "Relatório do Projeto"

    with open(nome_arquivo, "rb") as file:
        part = MIMEApplication(file.read(), Name=nome_arquivo)
        part["Content-Disposition"] = f"attachment; filename={nome_arquivo}"
        msg.attach(part)

    body = "Segue em anexo o relatório do projeto em PDF."
    msg.attach(MIMEText(body, "plain"))

    # Configura o servidor SMTP
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(com_remetente, "swxumxhmbhiorqvq")  # Substitua pela sua senha de aplicativo
        server.sendmail(com_remetente, para_destinatario, msg.as_string())
        server.quit()
        print("E-mail enviado com sucesso.")
    except Exception as e:
        print(f"Erro ao enviar o e-mail: {e}")

def acessar_ultima_conversa_json(pk):
    with open('conversas.json', 'r') as file:
        data = json.load(file)
        result = []
        for x in data:
            if x['room_id'] == pk:
                result.append(x['user_message'])
                result.append(x['bot_response'])
        return result

# Função principal para gerar PDF e enviar e-mail
def processar_e_enviar_pdf(request, pk):
    nome_arquivo_pdf = "descricao_projeto.pdf"
    email_remetente = "ianesbr8@gmail.com"
    email_destinatario = "isaaccleitondasilva@gmail.com"
    gerar_pdf(nome_arquivo_pdf, pk=pk)
    try:
        enviar_email(email_remetente, email_destinatario, nome_arquivo_pdf)
        return redirect('list_messages') 
    except Exception as e:
        logger.error(f"Erro inesperado. Detalhes: {str(e)}")
        return render(request, 'errors_template.html', {'error_message': "Erro Inesperado", 'error_description': str(e)})

