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

def buscar_conteudo(url):
    print(f"Vasculhando: {url}")
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            print(f"Erro ao acessar a URL: {response.status_code}")
            return None
    except Exception as e:
        print(f"Erro ao tentar acessar a URL: {e}")
        return None

    soup = BeautifulSoup(response.content, 'html.parser')
    texto_relevante = []
    for tag in soup.find_all('div'):
        texto = tag.get_text(strip=True)
        if len(texto) < 100:
            continue
        if conteudo_relevante(texto):
            texto_relevante.append(texto)

    if texto_relevante:
        return ' '.join(texto_relevante)
    return None

def buscar_e_atualizar_json():
    urls_com_conteudo_relevante = []

    try:
        with open('C:/Users/CTDEV23/Desktop/IANES---Repository---DJANGO/Verificar_Json/links_FCO.json', 'r', encoding='utf-8') as f:
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