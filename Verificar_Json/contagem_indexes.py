import json

class bcolors:

    WARNING = '\033[93m'
    ENDC = '\033[0m'

jsons = ['conteudo_anp', 'conteudo_bndes', 'conteudo_embrapii', 'conteudo_fapesp', 'conteudo_FCO',
         'conteudo_finep', 'conteudo_funcafe', 'conteudo_leidobem', 'conteudo_pronamp', 'conteudo_pronampe']

def contagem_indexes(colecao):
    # Carregar o conteúdo do arquivo JSON com a codificação correta
    with open(f'DADOS/{colecao}.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Contar o número de índices (chaves) no dicionário
    num_indices = len(data)

    print(f'Número de índices presentes no JSON {bcolors.WARNING}{colecao}{bcolors.ENDC}: {num_indices}')


for nome in jsons:
    contagem_indexes(f'{nome}')



