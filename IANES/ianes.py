import json
import google.generativeai as genai
import os
import time
from google.api_core import exceptions as google_exceptions
from deep_translator import GoogleTranslator 
import re 
import requests
import locale 

vazio = ' ' # Teste
# Função para obter a cotação do dólar
def obter_cotacao_dolar():
    url = 'https://economia.awesomeapi.com.br/json/last/USD-BRL'
    response = requests.get(url)

    if response.status_code == 200:
        dados = response.json()
        cotacao = dados['USDBRL']['bid']
        return float(cotacao)
    else:
        print("Não foi possível obter a cotação do dólar.")
        return None

# Configuração da chave da API
api_key = 'AIzaSyCdUc8hHD_Uf6yior7ujtW5wvPYMepoh5I'  # Substitua pela sua chave de API
os.environ["API_KEY"] = api_key
genai.configure(api_key=os.environ["API_KEY"])

# Inicializando o tradutor
def translate_text(text, target_lang):
    try:
        translator = GoogleTranslator(source='auto', target=target_lang)
        return translator.translate(text)
    except Exception as e:
        print(f"Erro na tradução: {e}")
        return text

# Função para escolher o idioma
def escolher_idioma():
    idioma_atual, encoding = locale.getlocale() # Captura o idioma do sistema local
    idiomas = {'pt': 'Português', 'en': 'Inglês', 'es': 'Espanhol', 'zh-cn': 'Mandarim', 'fr': 'Francês'}

    if idioma_atual.startswith('en'):  # Detecta se o idioma do sistema local é português
        print("Idioma detectado automaticamente: Português")
        idioma_escolhido = 'pt'
        return idioma_escolhido
    else:
        print("Escolha um idioma:")
        for codigo, nome in idiomas.items():
            print(f"{codigo}: {nome}")
        while True:
            idioma_escolhido = input("Digite o código do idioma: ").lower()
            if idioma_escolhido in idiomas:
                return idioma_escolhido
            elif idioma_escolhido in idiomas and idioma_escolhido == 'pt':
                idioma_escolhido = None
                return idioma_escolhido
            else:
                print("Escolha um idioma válido.")
                for codigo, nome in idiomas.items():
                    return(f"{codigo}: {nome}")

# Função para carregar o conteúdo das páginas a partir de um arquivo JSON
def carregar_conteudo(pasta):
    todos_conteudos = []
    for arquivo in os.listdir(pasta):
        caminho_completo = os.path.join(pasta, arquivo)

        # Verifica se o arquivo é 'membros.json' e pula ele
        if arquivo == 'membros.json':
            continue

        if os.path.isfile(caminho_completo):
            try:
                with open(caminho_completo, 'r', encoding='utf-8') as f:
                    conteudo = json.load(f)
                    todos_conteudos.append({"arquivo": arquivo, "conteudo": conteudo})
            except UnicodeDecodeError:
                erro = (f"Erro de codificação ao ler o arquivo {arquivo}. Tentando com ISO-8859-1.")
                with open(caminho_completo, 'r', encoding='ISO-8859-1') as f:
                    conteudo = json.load(f)
                    todos_conteudos.append({"arquivo": arquivo, "conteudo": conteudo})
                return erro
            except json.JSONDecodeError:
                print(f"Erro ao decodificar JSON do arquivo {arquivo}. Pulando...")
    return todos_conteudos

# Função para verificar se a língua é válida
def lingua_valida(lingua):
    valid_languages = ['en', 'pt', 'es', 'zh-cn', 'fr']
    return lingua in valid_languages

# Função para obter os parâmetros do usuário com seleção de tema e vertente (subtema)
def obter_parametros_usuario(lingua):
    respostas = {}

    # Obtém a cotação do dólar
    cotacao_dolar = obter_cotacao_dolar()
    if cotacao_dolar is None:
        cotacao_dolar = 5.00
        return(translate_text("Não foi possível obter a cotação do dólar. Usando valor padrão.", lingua))

    # Perguntas relacionadas à empresa
    perguntas_empresa = {
        "nome": "Por favor, insira o nome da pessoa responsável:",
        "nome_empresa": "Por favor, insira o nome da empresa responsável:",
        "lucro": "Qual é a faixa de lucro da empresa? (EP, EPP, D+)",
        "numero_colaboradores": "Por favor, insira o número de colaboradores do projeto:  ",
        "CNPJ": "Por favor, forneça o CNPJ da empresa (se não possuir, informe 'Não'):  ",
        "Email": "Por favor, insira o e-mail do responsável pelo projeto:  "
    }

    # Descrição das faixas de lucro
    faixas_lucro = {
        "EP": "EP (Empreendedor Individual): R$ 0 a R$ 81.000,00 anuais.",
        "EPP": "EPP (Empresa de Pequeno Porte): R$ 81.000,01 a R$ 4.800.000,00 anuais.",
        "D+": "D+ (Empresa de Médio Porte ou Maior): Acima de R$ 4.800.000,00 anuais."
    }

    # Perguntar os dados da empresa
    for chave, pergunta in perguntas_empresa.items():
        # Verificando tradução
        pergunta_traduzida = ""

        try:
            pergunta_traduzida = translate_text(pergunta, lingua)
        except AttributeError:
            return (f"Erro ao traduzir a pergunta original: {pergunta}")

        # Se não conseguirmos traduzir, usamos a versão em português
        if not pergunta_traduzida:
            pergunta_traduzida = pergunta
            return (f"Usando versão em português para '{pergunta}'")

        # Início do campo das perguntas
        while True:
            if chave == "lucro":
                # Exibe as faixas de lucro e suas respectivas descrições
                print(translate_text("\nAs faixas de lucro são as seguintes:", lingua))
                for faixa, descricao in faixas_lucro.items():
                    print(translate_text(f"{faixa}: {descricao}", lingua))

            resposta = input(pergunta_traduzida + ' ')
            try:
                if chave in ["nome", "nome_empresa"]:
                    if resposta.strip():
                        respostas[chave] = resposta
                        break
                    else:
                        print(translate_text(
                            "Por favor, preencha o campo corretamente. Este campo não pode ficar em branco.", lingua))
                elif chave == "lucro":
                    # Validando as faixas de lucro
                    if resposta.strip().upper() in ['EP', 'EPP', 'D+']:
                        respostas[chave] = resposta.strip().upper()
                        break
                    else:
                        print(
                            translate_text("Por favor, insira uma faixa de lucro válida: 'EP', 'EPP' ou 'D+'.", lingua))
                elif chave == "numero_colaboradores":
                    try:
                        resposta_limpa = re.sub(r'[^0-9]', '', resposta)
                        respostas[chave] = int(resposta_limpa)
                        break
                    except ValueError:
                        print(translate_text("Erro! Por favor, insira apenas números sem decimais", lingua))
                elif chave == "CNPJ":
                    if resposta.lower() == translate_text('não', lingua):
                        respostas[chave] = resposta
                        break
                    elif re.match(r'\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}', resposta):
                        respostas[chave] = resposta
                        break
                    else:
                        print(translate_text(
                            "CNPJ inválido. Por favor, insira no formato XX.XXX.XXX/XXXX-XX ou digite 'Não'.", lingua))
                elif chave == "Email":
                    if "@" in resposta and "." in resposta:
                        if resposta.strip():
                            respostas[chave] = resposta
                            break
                    else:
                        print(translate_text(
                            "E-mail inválido. Por favor, insira um e-mail válido e que contenha '@' e '.'.", lingua))
                else:
                    respostas[chave] = resposta
                    break
            except ValueError as e:
                print(translate_text(f"Erro no sistema: {e}", lingua))

    # Perguntar a área de atuação da empresa (essa parte não foi alterada, permanece a mesma)
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
    print(translate_text("Escolha a área de atuação da empresa:", lingua))
    for codigo, nome in temas.items():

        # Verificando tradução
        nome_traduzido = ""

        try:
            nome_traduzido = translate_text(nome, lingua)
        except AttributeError:
            print(f"Erro ao traduzir a nome original: {nome}")

        # Se não conseguirmos traduzir, usamos a versão em português
        if not nome_traduzido:
            nome_traduzido = nome
            print(f"Usando versão em português para '{nome}'")

        print(f"{codigo}: {nome_traduzido}")

    while True:
        try:
            escolha_area = int(input(translate_text("Digite o número da área escolhida: ", lingua) + ' '))

            if escolha_area in temas:
                respostas["area_atuacao"] = temas[escolha_area]
                break
            else:
                print(translate_text("Escolha um número válido para a área de atuação.", lingua))
        except ValueError as e:
            return (
                translate_text(f"Por favor, insira um número válido. Se este não for o problema, verifique o erro: {e}",
                               lingua))

    # Perguntas relacionadas ao projeto
    perguntas_projeto = {
        "projeto": "Por favor, informe o nome do projeto: ",
        "orcamento": f"Cotação atual do dólar: R$ {cotacao_dolar:.2f} \nQual é o orçamento previsto para o projeto em reais (R$)?  ",
        "extensao": "Qual é a extensão geográfica do projeto? (Regional, Nacional, Global):  ",
        "tempo": "Qual é a duração prevista do projeto em meses?  ",
        "publicoalvo": "Quem é o público-alvo do projeto?  ",
        "itensfinanciaveis": "Os itens do projeto podem ser financiados? (Sim ou Não):  "
    }

    # Perguntar o nome do projeto
    for chave, pergunta in perguntas_projeto.items():
        # Verificando tradução
        pergunta_traduzida = ""

        try:
            pergunta_traduzida = translate_text(pergunta, lingua)
        except AttributeError:
            print(f"Erro ao traduzir a pergunta original: {pergunta}")

        # Se não conseguirmos traduzir, usamos a versão em português
        if not pergunta_traduzida:
            pergunta_traduzida = pergunta
            print(f"Usando versão em português para '{pergunta}'")

        while True:
            try:
                resposta = input(pergunta_traduzida + ' ')
                if chave in ["projeto", "publicoalvo"]:
                    if resposta.strip():
                        respostas[chave] = resposta
                        break
                    else:
                        print(translate_text(
                            "Por favor, preencha o campo corretamente. Este campo não pode ficar em branco.", lingua))
                elif chave == "orcamento":
                    resposta_limpa = re.sub(r'[^0-9,\.]', '', resposta)

                    respostas[chave] = float(resposta_limpa.replace(",", "."))
                    break
                elif chave == "extensao":
                    if resposta.lower() in (translate_text("regional, nacional, global", lingua)):
                        if resposta.strip():
                            respostas[chave] = resposta
                            break
                    else:
                        print(
                            translate_text("Extensão inválida. Por favor, escolha entre Regional, Nacional ou Global.",
                                           lingua))
                elif chave == "tempo":
                    respostas[chave] = int(resposta)
                    break
                elif chave == "itensfinanciaveis":
                    if resposta.lower() in (translate_text("sim, não", lingua)):
                        respostas[chave] = resposta
                        break
                    else:
                        print(translate_text("Por favor, responda com 'sim' ou 'não'", lingua))
                else:
                    respostas[chave] = resposta
            except ValueError as e:
                return (translate_text(
                    f"Por favor, insira uma resposta válida. Caso esse não seja o problema, verifique o erro: {e}",
                    lingua))

    # Perguntar o tema do projeto
    print(translate_text("\nEscolha o tema do projeto:", lingua))
    for codigo, nome in temas.items():
        # Verificando tradução
        nome_traduzido = ""

        try:
            nome_traduzido = translate_text(nome, lingua)
        except AttributeError:
            return (f"Erro ao traduzir a nome original: {nome}")

        # Se não conseguirmos traduzir, usamos a versão em português
        if not nome_traduzido:
            nome_traduzido = nome
            return (f"Usando versão em português para '{nome}'")

        print(f"{codigo}: {nome_traduzido}")

    while True:
        try:
            escolha_tema = int(input(translate_text("Digite o número do tema escolhido: ", lingua) + ' '))
            if escolha_tema in temas:
                respostas["tema"] = temas[escolha_tema]
                break
            else:
                print(translate_text("Escolha um número válido para o tema.", lingua))
        except ValueError as e:
            return (f"Por favor, insira um número válido. Se este não for o erro, verifique-o aqui: {e}")

    # Perguntar a vertente (subtema) do tema escolhido
    vertentes = {
        1: ["Desenvolvimento de Software", "Infraestrutura de TI", "Segurança da Informação", "Transformação Digital",
            "Computação em Nuvem"],
        2: ["Manufatura", "Logística e Cadeia de Suprimentos", "Energia", "Engenharia de Produto"],
        3: ["Construção Civil", "Urbanismo", "Saneamento Básico", "Infraestrutura de Transportes"],
        4: ["Gestão de Resíduos", "Conservação de Recursos Naturais", "Energias Renováveis", "Sustentabilidade"],
        5: ["Educação a Distância (EAD)", "Capacitação e Treinamento", "Desenvolvimento de Currículo",
            "Inovação Educacional"],
        6: ["Infraestrutura de Saúde", "Tecnologia em Saúde (HealthTech)", "Pesquisa Biomédica",
            "Gestão de Saúde Pública"],
        7: ["Finanças Corporativas", "Gestão de Ativos", "Finanças Sustentáveis", "Criptomoedas e Blockchain"],
        8: ["Agricultura de Precisão", "Pecuária", "Agroindústria", "Desenvolvimento Rural Sustentável"],
        9: ["Marketing Digital", "Branding e Posicionamento de Marca", "Comunicação Corporativa",
            "Análise de Dados de Mercado"],
        10: ["Programas de Inclusão Social", "Empreendedorismo Social", "Direitos Humanos e Igualdade de Gênero",
             "Segurança Alimentar"],
        11: ["Políticas Públicas", "Modernização Administrativa", "Transparência e Compliance",
             "Planejamento Urbano e Regional"],
        12: ["Produção Audiovisual", "Artes Cênicas e Performáticas", "Indústria de Jogos",
             "Preservação do Patrimônio Cultural"]
    }

    print(translate_text(f"\nVocê escolheu o tema '{temas[escolha_tema]}'. Agora escolha uma vertente (subtema):",
                         lingua))
    for i, vertente in enumerate(vertentes[escolha_tema], 1):
        # Verificando tradução
        vertente_traduzida = ""

        try:
            vertente_traduzida = translate_text(vertente, lingua)
        except AttributeError:
            print(f"Erro ao traduzir a vertente original: {vertente}")

        # Se não conseguirmos traduzir, usamos a versão em português
        if not vertente_traduzida:
            vertente_traduzida = vertente
            print(f"Usando versão em português para '{vertente}'")

        print(f"{i}: {vertente_traduzida}")

    while True:
        try:
            escolha_vertente = int(input(translate_text("Digite o número da vertente escolhida: ", lingua) + ' '))
            if 1 <= escolha_vertente <= len(vertentes[escolha_tema]):
                respostas["vertente"] = vertentes[escolha_tema][escolha_vertente - 1]
                break
            else:
                print(translate_text(f"Escolha um número entre 1 e {len(vertentes[escolha_tema])}.", lingua))
        except ValueError as e:
            return (f"Por favor, insira um número válido. Caso este não seja o problema, verifique o erro aqui: {e}")

    return respostas


# Função para obter análise da API Gemini
def get_gemini_analysis_with_retry(content, user_inputs, max_retries=5, initial_delay=1):
    for attempt in range(max_retries):
        try:
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
                f"- Uma breve justificativa explicando a adequação e como o conteúdo pode contribuir para o projeto."
            )
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
        # Verifique se a linha contém um valor numérico válido antes de tentar convertê-lo
        if ':' in analysis_lines[0]:
            score_str = analysis_lines[0].split(':')[1].strip()
        else:
            score_str = analysis_lines[0].strip()

        # Verifica se o score_str não está vazio ou não contém apenas espaços antes de converter
        if score_str and score_str.replace('.', '', 1).isdigit():  # Verifica se é um número
            score = float(score_str)
        else:
            score = 0  # Caso o valor não seja um número válido
        description = analysis_lines[1].strip()
    except Exception as e:
        print(f"Erro ao processar a análise: {e}")
        score = 0
        description = "Descrição não disponível"

    return score, description

def analise_melhor_json(melhor_conteudo, inputs):
    best_index = None
    best_score = 0
    best_url = None

    num_indices = len(melhor_conteudo)
    print(f"Número de índices presentes no JSON: {num_indices}")

    for index, item in enumerate(melhor_conteudo):
        content_str = json.dumps(item) if isinstance(item, dict) else str(item)
        score, _ = analise_page(content_str, inputs)
        print(f"Analisando index {index} de {num_indices}")

        if score > best_score:
            best_score = score
            best_index = index
            best_url = item.get('url', 'URL não encontrada') if isinstance(item, dict) else 'URL não encontrada'

        time.sleep(1)

    return best_index, best_score, best_url

def recomenda_investimento(conteudos, inputs):
    best_option = None
    best_score = 0
    best_content = None

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
            best_content = content

        time.sleep(1.6)

    return best_option, best_score, best_content

class perguntasIanes:
    def main():
        pasta_dados = './DADOS'

        if not os.path.exists(pasta_dados):
            print(f"A pasta '{pasta_dados}' não foi encontrada. Certifique-se de que ela existe e contém arquivos JSON.")
            return

        dados_paginas = carregar_conteudo(pasta_dados)

        lingua = escolher_idioma()

        if not lingua_valida(lingua):
            print("Língua inválida. Por favor, use uma das seguintes: 'en', 'pt', 'es', 'zh-cn'.")
            return

        inputs_usuario = obter_parametros_usuario(lingua)

        if not inputs_usuario:
            print("Nenhuma entrada do usuário foi fornecida. Encerrando o programa.")
            return

        melhor_opcao, melhor_score, melhor_conteudo = recomenda_investimento(dados_paginas, inputs_usuario)

        if melhor_opcao:
            print(f"\nA melhor opção para investimento é '{melhor_opcao}' com score {melhor_score:.2f}.")
            print("\nAnalisando os índices do melhor JSON...")
            melhor_index, melhor_index_score, melhor_url = analise_melhor_json(melhor_conteudo, inputs_usuario)
            print(f"\nO melhor índice é {melhor_index} com score {melhor_index_score:.2f}.")
            print(f"URL do melhor índice: {melhor_url}")
        else:
            print("Nenhuma opção relevante foi encontrada.")

if __name__ == "__main__":
    perguntasIanes.main()
