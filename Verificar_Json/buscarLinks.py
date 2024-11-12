import requests
from bs4 import BeautifulSoup # biblioteca que permite analisar e extrair informações de paginas WEB
import json
import time
from urllib.parse import urljoin, urlparse # biblioteca que permite manipular URLs
from concurrent.futures import ThreadPoolExecutor, as_completed # biblioteca que permite fazer tarefas em paralelo ao mesmo tempo
import os

# Função para verificar se o conteúdo é relevante para "linhas de crédito"
def conteudo_relevante(texto):
    palavras_chave = [
        "linha de crédito", "linhas de crédito", "crédito para projeto", "financiamento",
        "regras de crédito", "condições de crédito", "empréstimo para projeto", "crédito empresarial", "FCO" ,"Agricultura" ,"Pecuária","Fazendeiros","região","tempo","localização","lugar","Área"
    ]
    return any(palavra in texto.lower() for palavra in palavras_chave)

# Função para filtrar URLs principais
def url_principal(url):
    parsed_url = urlparse(url)
    return not (parsed_url.fragment or parsed_url.query) and \
           not any(char.isdigit() for char in parsed_url.path.split("/")) and \
           len(parsed_url.path.strip("/").split("/")) <= 2

# Função para buscar o conteúdo de uma URL específica
def buscar_conteudo(url):
    print(f"Vasculhando: {url}")

    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            print(f"Erro ao acessar a URL: {response.status_code}")
            return False, set()

        response.encoding = response.apparent_encoding
    except Exception as e:
        print(f"Erro ao tentar acessar a URL: {e}")
        return False, set()

    try:
        # Usando o parser padrão
        soup = BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"Erro ao tentar parsear o HTML: {e}")
        return False, set()

    conteudo_relevante_encontrado = False
    for tag in soup.find_all('div'):
        texto = tag.get_text(strip=True)
        if len(texto) < 100:
            continue
        if conteudo_relevante(texto):
            conteudo_relevante_encontrado = True
            break

    links_internos = set()
    for link in soup.find_all('a', href=True):
        href = link['href']
        url_absoluta = urljoin(url, href)
        if urlparse(url_absoluta).netloc == urlparse(url).netloc and url_principal(url_absoluta):
            links_internos.add(url_absoluta)

    return conteudo_relevante_encontrado, links_internos

# Função principal que executa o scraping e salva as URLs com conteúdo relevante em JSON
def buscar_e_atualizar_json(url, tempo_maximo=900):
    start_time = time.time()
    visitados = set()
    urls_relevantes = set()
    links_para_visitar = {url}

    #Inicia um pool de threads
    with ThreadPoolExecutor(max_workers=10) as executor:
        while links_para_visitar: # Enquanto houver links para visitar, o loop continuará executando.
            futuros = {executor.submit(buscar_conteudo, link): link for link in links_para_visitar} #Submete as tarefas para o pool de threads. Para cada link em 'links_para_visitar',
                                                                                                    #é enviado uma tarefa para a função 'buscar_conteudo', associando o link ao futuro da execução.
            links_para_visitar = set() #Limpa a lista de links para visitar, pois agora estamos processando os links.

            for futuro in as_completed(futuros): #Itera sobre os futuros que já foram completados.
                link = futuros[futuro] #Obtém o link associado ao futuro atual.
                conteudo_relevante_encontrado, links_internos = futuro.result()  #Obtém o resultado da execução da função 'buscar_conteudo' para o link atual,
                                                                                #que retorna um tuplo (conteúdo relevante, links internos encontrados).

                if conteudo_relevante_encontrado: #Se o conteúdo relevante foi encontrado, adiciona o link à lista de URLs relevantes.
                    urls_relevantes.add(link)

                novos_links = links_internos - visitados  #Calcula os novos links a serem visitados (aqueles que são internos e ainda não foram visitados).
                visitados.update(novos_links) #Atualiza o conjunto de links visitados com os novos links encontrados.
                links_para_visitar.update(novos_links) #Atualiza a lista de links a visitar com os novos links encontrados.

            elapsed_time = time.time() - start_time #Calcula o tempo decorrido desde o início da execução.
            if elapsed_time > tempo_maximo: #Verifica se o tempo máximo de execução foi atingido.
                print("Tempo máximo de execução atingido.")
                break

    script_dir = os.path.dirname(os.path.abspath(__file__)) #Obtém o diretório onde o script está localizado (usado para determinar o caminho do arquivo de saída).
    json_path = os.path.join(script_dir, 'links_FCO.json') #Cria o caminho completo para salvar um arquivo JSON contendo os links encontrados.

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(list(urls_relevantes), f, ensure_ascii=False, indent=4)

    print(f"URLs vasculhadas e URLs relevantes salvas em '{json_path}'.")

# Exemplo de uso
url = "https://www.gov.br/sudeco/pt-br/assuntos/fundo-constitucional-de-financiamento-do-centro-oeste"  # Altere o link aqui dentro para o qual você deseja fazer a busca
tempo_maximo = 900  # Tempo máximo de execução em segundos
buscar_e_atualizar_json(url, tempo_maximo)
