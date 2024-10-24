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
import google.generativeai as genai
import os
from django.utils import timezone
import time
from google.api_core import exceptions as google_exceptions
from googletrans import Translator
import re
import requests

pasta_dados = 'DADOS'


def obter_cotacao_dolar():
    url = 'https://economia.awesomeapi.com.br/json/last/USD-BRL'
    response = requests.get(url)

    if response.status_code == 200:
        dados = response.json()
        cotacao = dados['USDBRL']['bid']
        return float(cotacao)  # Retorna o valor da cotação como um número
    else:
        return "Não foi possível obter a cotação do dólar."
    
    translator = Translator()

# Função para carregar o conteúdo das páginas a partir de um arquivo JSON
def carregar_conteudo(pasta):
    todos_conteudos = []
    for arquivo in os.listdir(pasta):
        caminho_completo = os.path.join(pasta, arquivo)
        if os.path.isfile(caminho_completo):
            try:
                with open(caminho_completo, 'r', encoding='utf-8') as f:
                    conteudo = json.load(f)
                    todos_conteudos.append({"arquivo": arquivo, "conteudo": conteudo})
            except UnicodeDecodeError:
                return f"Erro de codificação ao ler o arquivo {arquivo}. Tentando com ISO-8859-1."
                with open(caminho_completo, 'r', encoding='ISO-8859-1') as f:
                    conteudo = json.load(f)
                    todos_conteudos.append({"arquivo": arquivo, "conteudo": conteudo})
            except json.JSONDecodeError:
                return f"Erro ao decodificar JSON do arquivo {arquivo}. Pulando..."
    return todos_conteudos

# Função para obter inputs do usuário com tratamento de erro
def obter_parametros_usuario():
    respostas = {}
    cotacao_dolar = obter_cotacao_dolar()
    if cotacao_dolar is None:
        return"Não foi possível obter a cotação do dólar. Usando valor padrão."  # Valor padrão se a cotação não for obtida

    perguntas = {
        "nome": "Por favor, insira o nome da pessoa responsável: ",
        "projeto": "Por favor, informe o nome do projeto: ",
        "tema": "Qual é o tema do projeto? ",
        "area": "Em qual área de atuação o projeto se insere? ",
        "esboco": "Descreva brevemente o esboço do projeto: ",
        "orcamento": f"Cotação atual do dólar: R$ {cotacao_dolar:.2f} \n Qual é o orçamento previsto para o projeto em reais (R$)?",
        "extensao": "Qual é a extensão geográfica do projeto? (Regional, Nacional, Mundial): ",
        "tempo": "Qual é a duração prevista do projeto em meses? ",
        "lucro": f"Cotação atual do dólar: R$ {cotacao_dolar:.2f} \n Qual é o lucro estimado do projeto em reais (R$)?",
        "CNPJ": "Por favor, forneça o CNPJ da empresa (se não possuir, informe 'Não'): ",
        "publicoalvo": "Quem é o público-alvo do projeto? ",
        "lfreembolso": "A linha de fomento requer reembolso? (Sim ou Não): ",
        "itensfianciaveis": "Os itens do projeto podem ser financiados? (Sim ou Não): "
    }

    for chave, pergunta_original in perguntas.items():
        pergunta_traduzida = ""

        # Se não conseguirmos traduzir, usamos a versão em português
        if not pergunta_traduzida:
            return f"Usando versão em português para '{pergunta_original}'"
            pergunta_traduzida = pergunta_original

        while True:
            resposta = input(f"{pergunta_traduzida} ")
            try:
                if chave in ["nome", "projeto", "tema", "area"]:
                    if resposta.strip():
                        respostas[chave] = resposta
                        break
                    else:
                        return "Por favor, insira um valor válido. Este campo não pode ficar em branco."
                        continue
                elif chave == "orcamento":
                    respostas[chave] = float(resposta)
                elif chave == "extensao":
                    if resposta in ("Regional", "Nacional", "Mundial", "regional", "nacional", "mundial"):
                        respostas[chave] = resposta
                        break
                    else:
                        return "Extensão inválida. Por favor, escolha entre Regional, Nacional ou Mundial."
                        continue
                elif chave == "tempo":
                    respostas[chave] = int(resposta)
                elif chave == "lucro":
                    respostas[chave] = float(resposta)
                elif chave == "CNPJ":
                    if resposta.lower() == 'não' or resposta.lower() == 'no':
                        respostas[chave] = resposta
                        break
                    elif re.match(r'\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}', resposta):
                        respostas[chave] = resposta
                    else:
                        return "CNP'J inválido. Por favor, insira no formato XX.XXX.XXX/XXXX-XX ou digite 'Não/No'."
                        continue
                elif chave in ["lfreembolso", "itensfianciaveis"]:
                    resposta = resposta.strip().lower()
                    if resposta in ["sim", "não", "yes", "no"]:
                        respostas[chave] = resposta in ["sim", "yes"]
                        break
                    else:
                        return "Por favor, responda com 'Sim/Yes' ou 'Não/No'."
                        continu
                else:
                    respostas[chave] = resposta
                break
            except ValueError as e:
                return f"Erro: {e}"
    return respostas


# Função para obter análise da API Gemin
def get_gemini_analysis_with_retry(content, user_inputs, max_retries=5, initial_delay=1):
    for attempt in range(max_retries):
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"Analise o seguinte conteúdo com base nas seguintes entradas do usuário:\n\nConteúdo: {content}\n\nEntradas do usuário: {user_inputs}\n\nForneça uma pontuação de relevância entre 0 e 10 e uma breve descrição da relevância."
            response = model.generate_content(prompt)
            return response.text
        except google_exceptions.ResourceExhausted:
            if attempt == max_retries - 1:
                return f"Falha após {max_retries} tentativas. Retornando análise padrão."
                return "0\nNão foi possível analisar devido a limitações da API."
            delay = initial_delay * (2 ** attempt)
            return f"Limite de recursos atingido. Tentando novamente em {delay} segundos..."
            time.sleep(delay)
        except Exception as e:
            return f"Erro inesperado: {e}"
            return "Erro na análise."

def analise_page(content, inputs):
    analysis = get_gemini_analysis_with_retry(content, inputs)

    try:
        analysis_lines = analysis.split('\n')
        score = float(analysis_lines[0].split(':')[1].strip()) if ':' in analysis_lines[0] else float(analysis_lines[0])
        description = analysis_lines[1].strip()
    except Exception as e:
        return f"Erro ao processar a análise: {e}"
        score = 0
        description = "Descrição não disponível"

    return score, description

def recomenda_investimento(conteudos, inputs):
    best_option = None
    best_score = 0
    best_url = None

    for pagina in conteudos:
        arquivo = pagina['arquivo']
        content = pagina['conteudo']

        if isinstance(content, list) and len(content) > 0:
            item = content[0]
        else:
            item = content

        content_str = json.dumps(item) if isinstance(item, dict) else str(item)

        score, description = analise_page(content_str, inputs)
        return f"Arquivo: {arquivo} - Score: {score}."

        if score > best_score:
            best_score = score
            best_option = arquivo
            best_url = item.get('url', 'URL não encontrada') if isinstance(item, dict) else 'URL não encontrada'

        time.sleep(1)  # Pequeno delay entre as chamadas para evitar sobrecarga

    return best_option, best_url

def main():
    pasta_dados = 'DADOS'  # Nome da pasta contendo os arquivos JSON

    # Verifica se a pasta existe
    if not os.path.exists(pasta_dados):
        return f"A pasta '{pasta_dados}' não foi encontrada. Certifique-se de que ela existe e contém arquivos JSON."
        return

    dados_paginas = carregar_conteudo(pasta_dados)

    inputs_usuario = obter_parametros_usuario(lingua)

    if not inputs_usuario:
        return "Nenhuma entrada do usuário foi fornecida. Encerrando o programa."
        return

    melhor_opcao, melhor_url = recomenda_investimento(dados_paginas, inputs_usuario)

    if melhor_opcao:
        return f"\nA melhor opção para investimento é '{melhor_opcao}'. Confira mais detalhes na URL: {melhor_url}."
    else:
        return "Nenhuma opção relevante foi encontrada."

if __name__ == "__main__":
    main()

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

            salvar_conversa_em_json(current_room.id, user_message_text, bot_response_text)

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
