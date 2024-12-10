import io
import uuid
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as login_django
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse, Http404
import google.generativeai as genai  # type: ignore
from django.contrib.auth import login
from Main.models import Room, UserMessage, BotResponse
from django.views.generic.detail import DetailView
import json
import os
import re
import time
from django.utils import timezone
from django.conf import settings
from google.api_core import exceptions as google_exceptions  # type: ignore
from deep_translator import GoogleTranslator  # type: ignore
from django.urls import reverse
from itertools import zip_longest
from django.contrib import messages
import urllib
import logging
import requests  # type: ignore
from django.contrib.auth import logout as auth_logout
from itertools import zip_longest
from .forms import SignUpForm
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from collections import OrderedDict
from django.core import serializers
from gtts import gTTS
from django.http import FileResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
import io
from datetime import datetime
from django.http import FileResponse
import random
from io import BytesIO

logger = logging.getLogger(__name__)

GOOGLE_API_KEY = 'AIzaSyCdUc8hHD_Uf6yior7ujtW5wvPYMepoh5I'

global email_destino
email_destino = 'none@gmail.com'
global pasta_dados
pasta_dados = './IANES/Main/DADOS'
verificacao = os.access(f'{pasta_dados}', os.F_OK)
print(f'Pasta de dados carregada: {verificacao}')

def catch_error_404(request, exception):
    return render(request, 'errors_template.html', {'error_message': 'URL não encontrada. | URL not found.'}, status=404)

def converter_markdown_para_html(texto):
    # Converter negrito
    texto = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', texto)
    # Converter itálico
    texto = re.sub(r'\*(.*?)\*', r'<em>\1</em>', texto)
    # Adicionar outras conversões conforme necessário
    return texto

def salvar_conversa_em_json(room_id, current_user, user_message_text, bot_response_text):
    current_user_str = str(current_user)
    # Define o caminho para o arquivo JSON
    caminho_arquivo = 'conversas.json'
    # Verifica se o arquivo já existe
    if os.path.exists(caminho_arquivo):
        # Se existir, abre para ler os dados existentes
        with open(caminho_arquivo, 'r', encoding='utf-8') as file:
            try:
                conversas = json.load(file)
            except json.JSONDecodeError:
                conversas = []  # Se o arquivo estiver vazio ou corrompido
    else:
        conversas = []  # Se o arquivo não existir, inicia uma lista vazia
    print(current_user)
    # Cria um dicionário para a nova conversa

    print('user_msg: ', user_message_text)
    if user_message_text == 'ianes':
        print('old_bot: ', bot_response_text)
        bot_response_text = 'iniciando a consulta...'
        print('new_bot: ', bot_response_text)

    nova_conversa = {
        'room_id': room_id,
        'timestamp': timezone.now().isoformat(),
        'current_user': current_user_str,
        'user_message': user_message_text,
        'bot_response': bot_response_text
    }

    # Adiciona a nova conversa à lista
    conversas.append(nova_conversa)

    # Salva a lista de conversas de volta no arquivo JSON
    with open(caminho_arquivo, 'w', encoding='utf-8') as file:
        json.dump(conversas, file, indent=5, ensure_ascii=False)


@csrf_exempt
def auth(request):
    # Se o usuário já está autenticado, redireciona para o índice
    if request.user.is_authenticated:
        return redirect('index')

    if request.method == 'GET':
        # Renderiza a página de autenticação/cadastro sem error_message por padrão
        return render(request, 'auth.html', {'current_page': 'auth'})

    else:
        # Determina a ação: login ou cadastro
        action = request.POST.get('action')

        error_message = None  # Inicializa a variável com None ou vazio

        if action == 'login':
            # Ação de Login
            usernameOrEmail_login = request.POST.get('username')
            password_login = request.POST.get('password')

            user = None

            # Verifica se o login é por e-mail ou username
            if '@' in usernameOrEmail_login:
                try:
                    # Tenta encontrar o usuário pelo e-mail
                    user_instance = User.objects.get(email=usernameOrEmail_login)
                    usernameOrEmail_login = user_instance.username  # Substitui pelo username correspondente
                except User.DoesNotExist:
                    error_message = 'errorAuth_emailNotFind'
            else:
                # Verifica pelo username
                if not User.objects.filter(username=usernameOrEmail_login).exists():
                    error_message = 'errorAuth_userDontExists'

            # Só continua a autenticação se não houve erro na etapa anterior
            if not error_message:
                # Autentica o usuário
                user = authenticate(username=usernameOrEmail_login, password=password_login)

                if user:
                    login_django(request, user) 
                    return redirect('index')
                else:
                    error_message = 'errorAuth_invalidCredentials'

        elif action == 'signup':
            # Ação de Cadastro
            username = request.POST.get('username_create')
            email = request.POST.get('email')
            password1 = request.POST.get('password')
            password2 = request.POST.get('confirm_password')

            if not username or not password1:
                error_message = 'errorAuth_mandatoryCredentials'
            elif password1 != password2:
                error_message = 'errorAuth_passwordDontMatch'
            elif User.objects.filter(username=username).exists():
                error_message = 'errorAuth_userAlreadyExists'
            elif User.objects.filter(email=email).exists():
                error_message = 'errorAuth_emailAlreadyUsed'
            else:
                # Criação do novo usuário
                user = User.objects.create_user(username=username, email=email, password=password1)
                user.save()

                # Autentica e loga o novo usuário
                user = authenticate(username=username, password=password1)
                if user:
                    login_django(request, user)
                    return redirect('index')

        if error_message:  # Se houver erro, passamos a mensagem para o template
            return render(request, 'auth.html', {'error_message': error_message, 'current_page': 'auth'})

        return render(request, 'auth.html', {'current_page': 'auth'})

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
            # Certifique-se de configurar a chave de API
            genai.configure(api_key=GOOGLE_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = (
                f"Analise o seguinte conteúdo com base nas entradas do usuário fornecidas:"
                f"\n\nConteúdo: {content}\n\n"
                f"Entradas do usuário:\n"
                f"- Nome do Projeto: {user_inputs.get('projeto', 'N/A')}\n"
                f"- faixa de lucro da empresa: {user_inputs.get('lucro', 'N/A')}\n "
                f"- Orçamento em reais (R$): {user_inputs.get('orcamento', 'N/A')}\n"
                f"- Número de Colaboradores: {user_inputs.get('numero_colaboradores', 'N/A')}\n"
                f"- Extensão Geográfica: {user_inputs.get('extensao', 'N/A')}\n"
                f"- Duração do Projeto: {user_inputs.get('tempo', 'N/A')} meses\n"
                f"- Setor: {user_inputs.get('tema', 'N/A')}\n"
                f"- Vertente ou Subtema do projeto: {user_inputs.get('vertente', 'N/A')}\n"
                f"- Itens Financiáveis: {user_inputs.get('itensfinanciaveis', 'N/A')}\n"
                f"- Público-Alvo do Projeto: {user_inputs.get('publicoalvo', 'N/A')}\n"
                f"- Cotação Atual do Dólar: R$ {user_inputs.get('cotacao_dolar', 'N/A')}\n\n"
                f"Com base nesses dados, forneça:\n"
                f"- Uma pontuação de relevância de 0 a 10, onde 10 indica máxima adequação ao projeto e 0 irrelevância, dê essa nota apenas com números inteiros.\n"
                f"- Uma breve justificativa explicando a adequação e como o conteúdo pode contribuir para o projeto, além de forncer pontos positivos e negativos."
            )
            response = model.generate_content(prompt)
            print(response.text)

            # Processar a resposta da IA para extrair a pontuação e a justificativa
            analysis_text = response.text.strip()
            lines = analysis_text.split('\n', 1)
            score_str = lines[0].strip()
            descricao = lines[1].strip() if len(lines) > 1 else "Justificativa não fornecida."
            
            return score_str, descricao
            

        except Exception as e:
            if attempt == max_retries - 1:
                logger.error(f"Erro na análise Gemini: {e}")
                return "0", "Erro na análise"
            time.sleep(10 ** attempt)
    return "0", "Erro após várias tentativas"


def processar_respostas_finais(respostas):
    try:
        dados_paginas = carregar_conteudo(pasta_dados)
        resultados = []

        for pagina in dados_paginas:
            content_str = json.dumps(pagina['conteudo'])
            score_str, descricao = get_gemini_analysis(content_str, respostas)

            try:
                score = float(score_str.replace(',', '.'))
            except ValueError:
                # Se a pontuação não é um número válido, registra o erro e continua
                logger.error(f"Pontuação inválida recebida: '{score_str}'")
                continue

            if score > 0:
                resultado = {
                    'programa': pagina['arquivo'],
                    'pontuacao': score,
                    'justificativa': descricao.strip()
                }
                resultados.append(resultado)
            else:
                logger.info(f"Programa '{pagina['arquivo']}' recebeu pontuação 0 e será ignorado.")

        # Ordena os resultados pela pontuação, do maior para o menor
        resultados_ordenados = sorted(resultados, key=lambda x: x['pontuacao'], reverse=True)

        # Filtra apenas os que têm pontuação maior que 0
        resultados_relevantes = [res for res in resultados_ordenados if res['pontuacao'] > 0]

        if resultados_ordenados:
            num_resultados = len(resultados_relevantes)
            top_n = max(3, num_resultados)
            melhores_resultados = resultados_relevantes[:top_n]

            mensagem = "Com base nas suas respostas, recomendo as seguintes opções:\n\n"

            for idx, res in enumerate(melhores_resultados, start=1):
                mensagem += (
                    f"🔹 **Opção {idx}:**\n"
                    f"**Programa:** {res['programa']}\n"
                    f"**Pontuação de adequação:** {res['pontuacao']:.1f}/10\n"
                    f"**Justificativa:** {res['justificativa']}\n\n"
                )

            if num_resultados < 3:
                mensagem += f"Observação: Apenas {num_resultados} opção(ões) foram relevantes para o seu projeto."

            return mensagem
        else:
            return "Não foi possível encontrar uma recomendação adequada para o seu projeto."

    except Exception as e:
        logger.error(f"Erro no processamento final: {e}")
        return f"Ocorreu um erro ao processar suas respostas: {str(e)}"




@csrf_exempt
def send_message(request, pk):
    temas = {
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

    vertentes_dict = {
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

    current_room = get_object_or_404(Room, id=pk)

    if request.method == 'POST':
        user_message_text = request.POST.get('user_message')

        if user_message_text:
            user_message_instance = UserMessage.objects.create(
                text=user_message_text,
                user=current_room.user
            )
            current_room.user_message.add(user_message_instance)

            bot_response_text = None  # Inicializar como None

            if request.session.get('collecting_parameters', False):
                if user_message_text.strip().lower() == 'sair':
                    # Limpa as variáveis de sessão
                    request.session.pop('collecting_parameters', None)
                    request.session.pop('parameter_index', None)
                    request.session.pop('responses', None)
                    request.session.pop('perguntas', None)

                    bot_response_text = "Processo encerrado. Se precisar de assistência novamente, digite 'IANES'."

                    # Salva a resposta do bot como uma mensagem
                    bot_response_instance = BotResponse.objects.create(
                        text=bot_response_text
                    )
                    current_room.bot_response.add(bot_response_instance)

                    return redirect('list_messages', pk=current_room.id)

            if not request.session.get('collecting_parameters') and user_message_text.upper() == "IANES":
                request.session['collecting_parameters'] = True
                request.session['parameter_index'] = 0
                request.session['responses'] = {}
                
                global aleatorio
                aleatorio = random.randint(1000, 9999)
                
                perguntas = OrderedDict([
                    ("comecar", f"Para inciar, digite o código de segurança ({aleatorio}) ou 'sair' para cancelar:"),
                    ("nome", "Por favor, insira o nome da pessoa responsável:"),
                    ("nome_empresa", "Por favor, insira o nome da empresa responsável:"),
                    ("lucro", "Qual é a faixa de lucro da empresa? (EP, EPP, D+):"),
                    ("numero_colaboradores", "Por favor, insira o número de colaboradores do projeto:"),
                    ("CNPJ", "Por favor, forneça o CNPJ da empresa (se não possuir, informe 'Não'):"),
                    ("Email", "Por favor, insira o e-mail do responsável pelo projeto:"),
                    ("projeto", "Por favor, informe o nome do projeto:"),
                    ("orcamento", "Qual é o orçamento previsto para o projeto em reais (R$)?"),
                    ("extensao", "Qual é a extensão geográfica do projeto? (Regional, Nacional ou Global):"),
                    ("tempo", "Qual é a duração prevista do projeto em meses?"),
                    ("publicoalvo", "Quem é o público-alvo do projeto?"),
                    ("itensfinanciaveis", "Os itens do projeto podem ser financiados? (Sim ou Não):"),
                    ("tema", f"Escolha o tema do projeto (1-{len(temas)}):\n" + "\n".join([f"{k}: {v}" for k, v in temas.items()])),
                    # A pergunta 'vertente' será adicionada dinamicamente após a escolha do tema
                ])
                request.session['perguntas'] = perguntas
                request.session['perguntas_keys'] = list(perguntas.keys())
                bot_response_text = perguntas["comecar"]
                bot_response_instance = BotResponse.objects.create(
                    text=bot_response_text
                )
                current_room.bot_response.add(bot_response_instance)
                current_user_text = str(current_room.user)
                salvar_conversa_em_json(
                    room_id=current_room.id,
                    current_user=current_user_text,
                    user_message_text=user_message_text,
                    bot_response_text=bot_response_text
                )
                return redirect('list_messages', pk=current_room.id)

            # Processo de coleta de respostas
            if request.session.get('collecting_parameters'):
                codSeguranca = aleatorio
                perguntas = request.session['perguntas']
                parameter_index = request.session['parameter_index']
                respostas = request.session['responses']

                perguntas_keys = list(perguntas.keys())
                current_question_key = perguntas_keys[parameter_index]

                bot_response_text = None

                # Validação de respostas com base na pergunta
                if current_question_key in ["nome", "nome_empresa", "projeto", "publicoalvo"]:
                    if not user_message_text:
                        bot_response_text = "O campo não pode estar vazio. Por favor, insira novamente."
                    else:
                        respostas[current_question_key] = user_message_text

                elif current_question_key == "lucro":
                    if user_message_text.upper() in ['EP', 'EPP', 'D+']:
                        respostas[current_question_key] = user_message_text.upper()
                    else:
                        bot_response_text = "Por favor, insira uma faixa de lucro válida: EP, EPP ou D+."

                elif current_question_key == "comecar":
                    if user_message_text.isdigit():
                        if int(user_message_text) == codSeguranca:
                            respostas[current_question_key] = f'Código de segurança {user_message_text}'
                        else:
                            bot_response_text = f"Por favor, insira o código {codSeguranca} ou então 'sair' para cancelar."
                    else:
                        bot_response_text = "Por favor, insira apenas números."

                elif current_question_key == "numero_colaboradores":
                    try:
                        respostas[current_question_key] = int(user_message_text)
                    except ValueError:
                        bot_response_text = "Por favor, insira um número válido para os colaboradores."

                elif current_question_key == "CNPJ":
                    if user_message_text.lower() in ['não', 'nao'] or re.match(r'\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}', user_message_text):
                        respostas[current_question_key] = user_message_text
                    else:
                        bot_response_text = "CNPJ inválido. Insira no formato XX.XXX.XXX/XXXX-XX ou 'Não'."

                elif current_question_key == "Email":
                    if "@" in user_message_text and "." in user_message_text:
                        respostas[current_question_key] = user_message_text
                        email_destino = user_message_text
                    else:
                        bot_response_text = "Por favor, insira um e-mail válido."

                elif current_question_key == "orcamento":
                    try:
                        respostas[current_question_key] = float(user_message_text.replace(",", "."))
                    except ValueError:
                        bot_response_text = "Por favor, insira um valor válido para o orçamento."

                elif current_question_key == "extensao":
                    if user_message_text.strip().lower() in ["regional", "nacional", "global"]:
                        respostas[current_question_key] = user_message_text.strip()
                    else:
                        bot_response_text = "Extensão inválida. Por favor, escolha entre Regional, Nacional ou Global."
                
                elif current_question_key == "tempo":
                    try:
                        respostas[current_question_key] = int(user_message_text)
                    except ValueError:
                        bot_response_text = "Por favor, insira um número inteiro para a duração do projeto."
                elif current_question_key == "itensfinanciaveis":
                    if user_message_text.strip().lower() in ["sim", "não", "nao"]:
                        respostas[current_question_key] = user_message_text.strip()
                    else:
                        bot_response_text = "Por favor, responda com 'sim' ou 'não'."
                elif current_question_key == "tema":
                    try:
                        tema_escolhido = int(user_message_text)
                        if tema_escolhido in temas:
                            respostas[current_question_key] = temas[tema_escolhido]
                            # Obtém a lista de vertentes para o tema escolhido
                            vertentes_list = vertentes_dict.get(tema_escolhido, [])
                            # Adiciona a pergunta de vertente ao dicionário de perguntas
                            perguntas["vertente"] = "Escolha a vertente:\n" + "\n".join(
                                [f"{i+1}: {v}" for i, v in enumerate(vertentes_list)]
                            )
                            # Insere 'vertente' em 'perguntas_keys' após a posição atual
                            perguntas_keys = request.session.get('perguntas_keys')
                            perguntas_keys.insert(parameter_index + 1, "vertente")
                            # Atualiza as perguntas e chaves na sessão
                            request.session['perguntas'] = perguntas
                            request.session['perguntas_keys'] = perguntas_keys
                        else:
                            bot_response_text = f"Por favor, escolha um número entre 1 e {len(temas)}."
                    except ValueError:
                        bot_response_text = "Por favor, insira um número válido para o tema."
                elif current_question_key == "vertente":
                    tema_escolhido = list(temas.keys())[list(temas.values()).index(respostas['tema'])]
                    vertentes_list = vertentes_dict.get(tema_escolhido, [])
                    try:
                        escolha_vertente = int(user_message_text)
                        if 1 <= escolha_vertente <= len(vertentes_list):
                            respostas[current_question_key] = vertentes_list[escolha_vertente - 1]
                        else:
                            bot_response_text = f"Escolha um número entre 1 e {len(vertentes_list)}."
                    except ValueError:
                        bot_response_text = "Por favor, insira um número válido para a vertente."

                # Continua para próxima pergunta
                if not bot_response_text:
                    parameter_index += 1
                    request.session['parameter_index'] = parameter_index
                    request.session['responses'] = respostas

                    if parameter_index < len(perguntas_keys):
                        bot_response_text = perguntas[perguntas_keys[parameter_index]]
                    else:
                        bot_response_text = "Coleta de dados concluída, sua resposta está sendo gerada. Obrigado!"
                        respostas_finais = request.session.get('responses', {})
                        bot_response_text = processar_respostas_finais(respostas_finais)
                        # Finaliza o processo
                        request.session.pop('collecting_parameters', None)
                        request.session.pop('parameter_index', None)
                        request.session.pop('responses', None)
                        request.session.pop('perguntas', None)

                # Salva a resposta do bot como uma mensagem
                bot_response_instance = BotResponse.objects.create(
                    text=bot_response_text
                )
                user_message_instance = UserMessage.objects.create(
                    user=current_room.user,
                    text=user_message_text,
                    created_at=None
                )
                current_room.bot_response.add(bot_response_instance)
                current_user_text = str(current_room.user)
                salvar_conversa_em_json(room_id=current_room.id,
                                current_user = current_user_text,
                                user_message_text=user_message_text,
                                bot_response_text=bot_response_text)
                
                print('usr_txt: ', user_message_text)
                print('bot_txt: ', bot_response_text)
                print('crnt_usr: ', current_room.user)
                print('prmt_indx: ', parameter_index)
                print('penultimo bloco')

                return redirect('list_messages', pk=current_room.id)
            
            elif user_message_text.strip().upper() != "IANES":
                # Processamento normal da mensagem usando a IA
                try:
                    genai.configure(api_key=GOOGLE_API_KEY)
                    model = genai.GenerativeModel('gemini-1.5-flash')
                    bot_response = model.generate_content(user_message_text)
                    bot_response_text = bot_response.text if hasattr(bot_response, 'text') else 'Erro ao gerar a resposta'
                except Exception as e:
                    logger.error(f"Erro no processamento da IA: {e}")
                    bot_response_text = f"Erro: {str(e)}"

                # Salva a resposta do bot como uma mensagem
                user_message_instance = UserMessage.objects.create(
                    user=current_room.user,
                    text=user_message_text,
                    created_at=None
                )
                # Salva a resposta do bot como uma mensagem
                bot_response_instance = BotResponse.objects.create(
                    text=bot_response_text
                )
                current_room.bot_response.add(bot_response_instance)               
                current_user_text = str(current_room.user)
                salvar_conversa_em_json(room_id=current_room.id,
                                current_user = current_user_text,
                                user_message_text=user_message_text,
                                bot_response_text=bot_response_text)
            else:
                # Resposta padrão para mensagens que não iniciam o processo
                bot_response_text = "Desculpe, não entendi. Por favor, digite 'IANES' para iniciar o processo."

                # Salva a resposta do bot como uma mensagem
                bot_response_instance = BotResponse.objects.create(
                    text=bot_response_text
                )
                current_room.bot_response.add(bot_response_instance)

                return redirect('list_messages', pk=current_room.id)         
        else:
            # Se user_message_text estiver vazio
            return redirect('list_messages', pk=current_room.id)
    return redirect('list_messages', pk=pk)


@csrf_exempt
def create_room(request):
    room_title = request.POST.get('title')
    room = listar_ultima_sala()
    room += 1
    if not room_title:
        room_title = f'Sala Nova - {room}'
    try:
        room = Room.objects.create(user=request.user, title=room_title)
        return redirect('list_messages', room.id )
    except Exception as e:
        logger.error(f"Erro inesperado {e}")
        return render(request, 'errors_template.html', {'error_message': "Erro ao criar sala | Error creating room."})

    return render(request, 'create_room.html')
    # return render(request, 'room.html', {
    #     'r': room
    # })

# 
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
        rooms = Room.objects.filter(user=request.user.id)
        messages = []
        user_messages = []
        bot_responses = []
        room = None

        if pk:
            room = get_object_or_404(Room, pk=pk)
            user_messages = room.user_message.all().order_by('created_at')
            bot_responses = room.bot_response.all().order_by('created_at')
            message_pairs = list(zip_longest(user_messages, bot_responses, fillvalue=None))

            new_bot_response_id = request.session.get('new_bot_response_id')

            for i, (user_message, bot_response) in enumerate(message_pairs):
                is_new_bot_response = False
                if bot_response and bot_response.id == new_bot_response_id:
                    is_new_bot_response = True
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
        logger.error(f"1 Erro ao acessar atributos de Sala com PK {pk}. Detalhes: {str(e)}")
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
    print('room:', room)
    return render(request, 'chatIAnes.html', {
        'user_messages': user_messages,
        'bot_responses': bot_responses,
        'room': room,
        'rooms': rooms,
        'messages': messages,
        'current_page': 'ianes'
    })

@csrf_exempt

def delete_room(request, pk):
    room_to_delete = get_object_or_404(Room, pk=pk)
    room_to_delete.delete()

    # with open('conversas.json', 'r') as file:
    #     data = json.load(file)

    try:
        data = [x for x in data if x['room_id'] != pk]
    except Exception as e:
        pass

    # with open('conversas.json', 'w') as file:
    #     json.dump(data, file, indent=5)

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

    if isinstance(relatorio, str):
        relatorio = [relatorio]  
    elif not isinstance(relatorio, (list, tuple)):
        relatorio = [str(relatorio)]
        

    c = canvas.Canvas(nome_arquivo, pagesize=A4)

    c.setFillColor(colors.red)              
    c.setFont("Helvetica-Bold", 20)          
    c.drawString(100, 800, "Relatório em PDF - IAnes")

    imgGet = requests.get('https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/3932a9bcb74c20bdb3c85f4d80c678a24184cef4/_midia/_logotipos/ianesFavicon_PretaA.png')
    imagemIanes = ImageReader(BytesIO(imgGet.content))
    c.drawImage(imagemIanes, 450, 750, 80, 80)

    # Voltar para cor preta e tamanho padrão para as informações abaixo
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 12)

    data_atual = datetime.now().strftime("%d/%m/%Y - %H:%M")
    current_room = get_object_or_404(Room, id=pk)
    current_user_text = str(current_room.user)
    c.drawString(100, 780, f"Data: {data_atual}")
    c.drawString(100, 760, f"ID da sala: {pk}")
    c.drawString(100, 740, f"Usuário da Sala: {current_user_text}")
    c.line(50, 730, 550, 730)

    c.drawString(100, 700, "Relatório da Consulta:")
    text = c.beginText(100, 680)
    text.setFont("Helvetica", 12)
    text.setLeading(14)
    larguraMaxLinha = 450

    def verifica_paginacao():
        """ Verifica se atingimos o rodapé da página, caso sim, cria uma nova página. """
        if text.getY() < 100:
            # Finaliza a página atual
            c.drawText(text)
            c.showPage()

            # Inicia novo objeto de texto na nova página
            # Caso queira repetir o título ou cabeçalho a cada página, faça aqui novamente
            new_text = c.beginText(100, 800)
            new_text.setFont('Helvetica', 12)
            new_text.setLeading(14)
            return new_text
        return text

    for linha in relatorio:
        if ':' in linha:
            emissor, mensagem = linha.split(':', 1)
            emissor = emissor.strip()
            mensagem = mensagem.strip()
        else:
            emissor = "Anônimo"
            mensagem = linha.strip()

        # Cor do emissor
        if emissor == "Ianes":
            text.setFillColor(colors.red)
        else:
            text.setFillColor(colors.blue)

        # Imprime o emissor + ":" na mesma linha
        text.textOut(emissor + ": ")

        # Volta para o preto
        text.setFillColor(colors.black)

        # Quebra de linha para mensagem
        text.textLine("")
        text = verifica_paginacao()

        # Quebra de linha manual da mensagem
        palavras = mensagem.split()
        linha_atual = ""
        for p in palavras:
            test_line = (linha_atual + " " + p).strip()
            # Medir largura da linha
            if c.stringWidth(test_line, 'Helvetica', 12) > larguraMaxLinha:
                # Imprime a linha atual e começa uma nova
                text.textLine(linha_atual)
                text = verifica_paginacao()
                linha_atual = p
            else:
                linha_atual = test_line

        # Imprime a última linha da mensagem se existir
        if linha_atual:
            text.textLine(linha_atual)
            text = verifica_paginacao()

        # Linha em branco após a mensagem (opcional)
        text.textLine("")
        text = verifica_paginacao()

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
        server.login(com_remetente, "cmxsuikbljgunnzy")  # Substitua pela sua senha de aplicativo
        server.sendmail(com_remetente, para_destinatario, msg.as_string())
        server.quit()
        print("E-mail enviado com sucesso.")
    except Exception as e:
        print(f"Erro ao enviar o e-mail: {e}")

def acessar_ultima_conversa_json(pk):
    with open('conversas.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
        print(data)
        result = []
        for x in data:
            if x['room_id'] == pk:
                usuario = f"{x['current_user']}: {x['user_message']}"
                bot = f"Ianes: {x['bot_response']}"
                result.append(usuario)
                result.append(bot)
        return result  
        
        
# Função principal para gerar PDF e enviar e-mail
def processar_e_enviar_pdf(request, pk):

    nome_arquivo_pdf = "relatorio_analise.pdf"
    email_remetente = "ianesbr8@gmail.com"
    if email_destino != 'none@gmail.com':
        print(email_destino)
        email_destinatario = email_destino
    else:
        email_destinatario = 'pedrosiqueirarp@gmail.com'
    gerar_pdf(nome_arquivo_pdf, pk=pk)
    try:
        enviar_email(email_remetente, email_destinatario, nome_arquivo_pdf)
        return redirect(request.META.get('HTTP_REFERER', '/'))
    except Exception as e:
        logger.error(f"Erro inesperado. Detalhes: {str(e)}")
        return render(request, 'errors_template.html', {'error_message': "Erro Inesperado", 'error_description': str(e)})
    
def processar_audio_ianes(request, pk):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            texto = data.get('texto', '')
            print('texto: ', texto)
            if not texto:
                return JsonResponse({'success': False, 'error': 'Texto não fornecido'})
            mp3_fp = io.BytesIO()
            tts = gTTS(text=texto, lang_check=True, lang='pt', slow=False)
            tts.write_to_fp(mp3_fp)
            mp3_fp.seek(0)

            return HttpResponse(
                mp3_fp.getvalue(), 
                content_type='audio/mpeg'
            )
            # save_dir = os.path.join(settings.MEDIA_ROOT, 'audio_files')
            # os.makedirs(save_dir, exist_ok=True)
            # filename = f'audio_ianes_{uuid.uuid4()}.mp3'
            # file_path = os.path.join(save_dir, filename)
            # tts = gTTS(text=texto, lang='pt', slow=False, timeout=None)
            # # tts.save(file_path)
            # file_url = request.build_absolute_uri(f'{settings.MEDIA_URL}audio_files/{filename}')
            # return JsonResponse({'success': True, })
                
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
        
    return JsonResponse({'success': False, 'error': 'Método não permitido'}, status=405)
    
def download_pdf(request, pk):
    print(pk)
    relatorio = acessar_ultima_conversa_json(pk)
    print(relatorio)
    if not relatorio:
        return HttpResponse("No conversation found.", status=404)

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = styles['Title']
    title_style.textColor = colors.darkblue
    title = Paragraph("Conversation Report", title_style)
    story.append(title)
    story.append(Spacer(1, 12))

    # Content
    normal_style = styles['Normal']
    for line in relatorio:
        paragraph = Paragraph(line, normal_style)
        story.append(paragraph)
        story.append(Spacer(1, 12))

    doc.build(story)
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename='conversation_report.pdf')
