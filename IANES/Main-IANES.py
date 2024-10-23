import json
import google.generativeai as genai
import os
import time
from google.api_core import exceptions as google_exceptions
from googletrans import Translator
import re
import requests

def obter_cotacao_dolar():
    url = 'https://economia.awesomeapi.com.br/json/last/USD-BRL'
    response = requests.get(url)

    if response.status_code == 200:
        dados = response.json()
        cotacao = dados['USDBRL']['bid']
        return float(cotacao)  # Retorna o valor da cotação como um número
    else:
        print("Não foi possível obter a cotação do dólar.")
        return None  # Retorna None se a cotação não puder ser obtida

# Configuração da chave da API
api_key = 'AIzaSyCdUc8hHD_Uf6yior7ujtW5wvPYMepoh5I'  # Substitua pela sua chave de API
os.environ["API_KEY"] = api_key
genai.configure(api_key=os.environ["API_KEY"])

# Inicializando o tradutor
translator = Translator()

# Função para escolher o idioma
def escolher_idioma():
    idiomas = {'pt': 'Português', 'en': 'Inglês', 'es': 'Espanhol', 'zh-cn': 'Mandarim'}
    print("Escolha um idioma:")
    for codigo, nome in idiomas.items():
        print(f"{codigo}: {nome}")

    while True:
        idioma_escolhido = input("Digite o código do idioma: ").lower()
        if idioma_escolhido in idiomas:
            return idioma_escolhido
        else:
            idiomas = {'pt': 'Português', 'en': 'Inglês', 'es': 'Espanhol', 'zh-cn': 'Mandarim'}
            print("Escolha um idioma valido:")
            for codigo, nome in idiomas.items():
                print(f"{codigo}: {nome}")

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
                print(f"Erro de codificação ao ler o arquivo {arquivo}. Tentando com ISO-8859-1.")
                with open(caminho_completo, 'r', encoding='ISO-8859-1') as f:
                    conteudo = json.load(f)
                    todos_conteudos.append({"arquivo": arquivo, "conteudo": conteudo})
            except json.JSONDecodeError:
                print(f"Erro ao decodificar JSON do arquivo {arquivo}. Pulando...")
    return todos_conteudos

# Função para verificar se a língua é válida
def lingua_valida(lingua):
    valid_languages = ['en', 'pt', 'es', 'zh-cn']
    return lingua in valid_languages

# Função para obter inputs do usuário com tratamento de erro
def obter_parametros_usuario(lingua):
    respostas = {}

    # Obtém a cotação do dólar
    cotacao_dolar = obter_cotacao_dolar()
    if cotacao_dolar is None:
        print("Não foi possível obter a cotação do dólar. Usando valor padrão.")
        cotacao_dolar = 5.00  # Valor padrão se a cotação não for obtida

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

    # Verificação inicial da tradução
    if not hasattr(translator, 'translate'):
        print("O objeto translator não possui o método translate. Verifique a inicialização.")
        return {}

    for chave, pergunta_original in perguntas.items():
        pergunta_traduzida = ""

        # Tentamos traduzir uma única vez
        try:
            pergunta_traduzida = translator.translate(pergunta_original, dest=lingua).text
        except AttributeError:
            print(f"Erro ao traduzir a pergunta original: {pergunta_original}")

        # Se não conseguirmos traduzir, usamos a versão em português
        if not pergunta_traduzida:
            print(f"Usando versão em português para '{pergunta_original}'")
            pergunta_traduzida = pergunta_original

        while True:
            resposta = input(f"{pergunta_traduzida} ")
            try:
                if chave in ["nome", "projeto", "tema", "area"]:
                    if resposta.strip():
                        respostas[chave] = resposta
                        break
                    else:
                        print("Por favor, insira um valor válido. Este campo não pode ficar em branco.")
                        continue
                elif chave == "orcamento":
                    respostas[chave] = float(resposta)
                elif chave == "extensao":
                    if resposta in ("Regional", "Nacional", "Mundial", "regional", "nacional", "mundial"):
                        respostas[chave] = resposta
                        break
                    else:
                        print("Extensão inválida. Por favor, escolha entre Regional, Nacional ou Mundial.")
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
                        print("CNPJ inválido. Por favor, insira no formato XX.XXX.XXX/XXXX-XX ou digite 'Não/No'.")
                        continue
                elif chave in ["lfreembolso", "itensfianciaveis"]:
                    resposta = resposta.strip().lower()
                    if resposta in ["sim", "não", "yes", "no"]:
                        respostas[chave] = resposta in ["sim", "yes"]
                        break
                    else:
                        print("Por favor, responda com 'Sim/Yes' ou 'Não/No'.")
                        continue
                else:
                    respostas[chave] = resposta
                break
            except ValueError as e:
                print(f"Erro: {e}")

    return respostas


# Função para obter análise da API Gemini
def get_gemini_analysis_with_retry(content, user_inputs, max_retries=5, initial_delay=1):
    for attempt in range(max_retries):
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"Analise o seguinte conteúdo com base nas seguintes entradas do usuário:\n\nConteúdo: {content}\n\nEntradas do usuário: {user_inputs}\n\nForneça uma pontuação de relevância entre 0 e 10 e uma breve descrição da relevância."
            response = model.generate_content(prompt)
            return response.text
        except google_exceptions.ResourceExhausted:
            if attempt == max_retries - 1:
                print(f"Falha após {max_retries} tentativas. Retornando análise padrão.")
                return "0\nNão foi possível analisar devido a limitações da API."
            delay = initial_delay * (2 ** attempt)
            print(f"Limite de recursos atingido. Tentando novamente em {delay} segundos...")
            time.sleep(delay)
        except Exception as e:
            print(f"Erro inesperado: {e}")
            return "0\nErro na análise."

def analise_page(content, inputs):
    analysis = get_gemini_analysis_with_retry(content, inputs)

    try:
        analysis_lines = analysis.split('\n')
        score = float(analysis_lines[0].split(':')[1].strip()) if ':' in analysis_lines[0] else float(analysis_lines[0])
        description = analysis_lines[1].strip()
    except Exception as e:
        print(f"Erro ao processar a análise: {e}")
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
        print(f"Arquivo: {arquivo} - Score: {score}.")

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
        print(f"A pasta '{pasta_dados}' não foi encontrada. Certifique-se de que ela existe e contém arquivos JSON.")
        return

    dados_paginas = carregar_conteudo(pasta_dados)

    lingua = escolher_idioma()  # Usa a função que já retorna o código do idioma

    if not lingua_valida(lingua):
        print("Língua inválida. Por favor, use uma das seguintes: 'en', 'pt', 'es', 'zh-cn'.")
        return

    inputs_usuario = obter_parametros_usuario(lingua)

    if not inputs_usuario:
        print("Nenhuma entrada do usuário foi fornecida. Encerrando o programa.")
        return

    melhor_opcao, melhor_url = recomenda_investimento(dados_paginas, inputs_usuario)

    if melhor_opcao:
        print(f"\nA melhor opção para investimento é '{melhor_opcao}'. Confira mais detalhes na URL: {melhor_url}.")
    else:
        print("Nenhuma opção relevante foi encontrada.")

if __name__ == "__main__":
    main()