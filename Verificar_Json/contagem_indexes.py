import json

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def contagem_indexes(colecao):
    # Carregar o conteúdo do arquivo JSON com a codificação correta
    with open(f'json/{colecao}.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Contar o número de índices (chaves) no dicionário
    num_indices = len(data)

    print(f'Número de índices presentes no JSON {bcolors.WARNING}{colecao}{bcolors.ENDC}: {num_indices}')

contagem_indexes('conteudo_anp')
contagem_indexes('conteudo_bnds')
contagem_indexes('conteudo_embrapii')
contagem_indexes('conteudo_fapesp')
contagem_indexes('conteudo_finep')
contagem_indexes('conteudo_leidobem')



