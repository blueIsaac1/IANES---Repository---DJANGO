import requests
from bs4 import BeautifulSoup
import json

def conteudo_relevante(texto):
    palavras_chave = [
        # Tema do Projeto
        "tema do projeto", "proposta", "iniciativa", "ideia de projeto", "conceito",
        "plano", "projeto", "desafio", "plano de ação", "visão", "diretiva",
        "tema central", "assunto", "tópico", "linha de ação", "ponto focal",

        # Área de Atuação
        "área de atuação", "setor", "campo de atuação", "domínio", "especialização",
        "segmento", "indústria", "nicho", "ramo", "categoria", "área de interesse",
        "campo de especialização", "esfera", "subsetor", "segmentação de mercado",
        "posição de mercado", "contexto",

        # Esboço
        "esboço", "planejamento", "descrição do projeto", "visão geral", "metodologia",
        "abordagem", "plano de execução", "rascunho", "estrutura", "organização",
        "design do projeto", "projeto preliminar", "projeto inicial", "formulação",
        "esquema", "plano diretor", "linhas gerais", "documento de trabalho",
        "modelo", "mapa", "diretrizes",

        # Orçamento
        "orçamento", "custo estimado", "previsão orçamentária", "análise financeira",
        "recursos necessários", "custo total", "estimativa de custos", "planejamento financeiro",
        "custo projetado", "orçamento total", "análise de custos", "alocação de recursos",
        "estimativa orçamentária", "mapeamento de custos", "valoração", "previsão de gastos",
        "custo de operação", "avaliação orçamentária", "sinalização de custos",
        "gestão de despesas", "contabilidade orçamentária",

        # Extensão Geográfica
        "extensão geográfica", "alcance", "escopo geográfico", "abrangência regional",
        "impacto nacional", "área de cobertura", "extensão", "esfera geográfica",
        "dimensão territorial", "localização", "distribuição geográfica",
        "campo geográfico", "escopo territorial", "abrangência", "cobertura espacial",

        # Tempo de Duração
        "tempo de duração", "duração do projeto", "prazo", "cronograma", "período de execução",
        "tempo estimado", "tempo total", "duração estimada", "tempo previsto",
        "intervalo de tempo", "tempo necessário", "data de conclusão", "prazo de entrega",
        "prazo estipulado", "cronograma de atividades", "linha do tempo", "tabela de prazos",
        "período de atividade", "programação",

        # Lucro
        "lucro", "retorno financeiro", "ganho", "rendimento", "lucro líquido",
        "resultado financeiro", "superávit", "benefício", "venda líquida",
        "margem de lucro", "lucro bruto", "lucro operacional", "receita",
        "retorno sobre investimento", "rentabilidade", "ganho financeiro",
        "excedente", "cálculo de lucro",

        # CNPJ
        "CNPJ", "registro empresarial", "documentação", "formalização", "identificação fiscal",
        "número de registro", "Cadastro Nacional da Pessoa Jurídica", "identificação jurídica",
        "documento fiscal", "registro comercial", "dados cadastrais",

        # Público Alvo
        "público alvo", "segmento de mercado", "beneficiários", "destinatários",
        "clientes potenciais", "público direcionado", "comunidade-alvo",
        "usuários finais", "demografia", "perfil do público", "segmentação",
        "público específico", "audiência", "grupos de interesse", "clientes-alvo",
        "público-meta", "target", "perfil demográfico",

        # Reembolsável
        "reembolsável", "financiamento reembolsável", "linha de crédito reembolsável",
        "condições de reembolso", "empréstimo reembolsável", "financiamento a ser devolvido",
        "crédito a ser reembolsado", "financiamento com reembolso", "regime reembolsável",
        "pagamento futuro", "reembolso", "restituição financeira", "condições de pagamento",

        # Itens Financiáveis
        "itens financiáveis", "financiamento", "recursos financiáveis",
        "projetos financiáveis", "apoio financeiro", "itens elegíveis para financiamento",
        "recursos suportados", "financiamento aprovado", "investimentos financiáveis",
        "despesas financiáveis", "cobertura financeira", "itens subvencionáveis",
        "componentes financiáveis", "recursos acessíveis", "apoio orçamentário"
    ]
    for palavra in palavras_chave:
        if palavra in texto.lower():
            return True
    return False

def buscar_conteudo(url):  #Define a função 'buscar_conteudo' que recebe uma URL como parâmetro
    print(f"Vasculhando: {url}")  #Imprime uma mensagem informando que está vasculhando a URL fornecida
    
    try:  #Inicia o bloco try para capturar exceções ao fazer a requisição HTTP
        response = requests.get(url, timeout=10)  #Realiza uma requisição GET para a URL com um timeout de 10 segundos
        if response.status_code != 200:  #Verifica se o código de status da resposta não é 200 (OK)
            print(f"Erro ao acessar a URL: {response.status_code}")  #Imprime o código de erro se não for 200
            return None  #Retorna 'None' em caso de erro na requisição
    except Exception as e:  #Captura qualquer exceção durante a requisição HTTP
        print(f"Erro ao tentar acessar a URL: {e}")  # Imprime a exceção gerada
        return None  #Retorna 'None' em caso de erro na requisição

    soup = BeautifulSoup(response.content, 'html.parser')  #Usa BeautifulSoup para parsear o conteúdo HTML da resposta
    texto_relevante = []  #Cria uma lista vazia para armazenar os textos relevantes encontrados

    for tag in soup.find_all('div'):  # tera por todas as tags <div> encontradas no HTML
        texto = tag.get_text(strip=True)  #Extrai o texto da tag <div>, removendo espaços extras
        if len(texto) < 100:  #Se o texto tiver menos de 100 caracteres, ignora
            continue  #Vai para a próxima iteração do loop
        if conteudo_relevante(texto):  #Se o texto for considerado relevante pela função 'conteudo_relevante'
            texto_relevante.append(texto)  #Adiciona o texto à lista de textos relevantes

    if texto_relevante:  #Se houver textos relevantes encontrados
        return ' '.join(texto_relevante)  #Retorna os textos relevantes unidos por um espaço
    return None  #Se não houver textos relevantes, retorna 'None'


def buscar_e_atualizar_json():
    urls_com_conteudo_relevante = []

    try:
        with open('./DADOS/links_FCO.json', 'r', encoding='utf-8') as f:
            urls = json.load(f)
    except FileNotFoundError:
        print("Arquivo 'links.json' não encontrado.")
        return
    except json.JSONDecodeError:
        print("Erro ao decodificar o arquivo JSON.")
        return

    for url in urls:
        conteudo_relevante_encontrado = buscar_conteudo(url)
        if conteudo_relevante_encontrado:
            urls_com_conteudo_relevante.append({
                "url": url,
                "conteudo": conteudo_relevante_encontrado
            })

    with open('./DADOS/conteudo_FCO.json', 'w', encoding='utf-8') as f:
        json.dump(urls_com_conteudo_relevante, f, ensure_ascii=False, indent=4)

    print(f"Processo concluído. URLs e conteúdos relevantes salvos no json respectivo.")

buscar_e_atualizar_json()