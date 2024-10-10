import json
from collections import Counter

def contar_palavras_repetidas(json_file_path):
    try:
        with open(json_file_path, 'r', encoding='utf-8') as jf:
            json_data = json.load(jf)  # Lê o conteúdo do arquivo JSON
    except Exception as e:
        print("Erro ao ler o arquivo JSON:", e)
        return None

    # Concatenar todos os textos em uma única string
    all_text = ""
    for document in json_data:
        if 'texto' in document:  # Supondo que os documentos têm um campo 'texto'
            all_text += document['texto'] + " "  # Adiciona o texto de cada documento

    # Dividir o texto em palavras
    palavras = all_text.split()

    # Contar a frequência de cada palavra
    contagem = Counter(palavras)

    # Filtrar palavras que aparecem mais de uma vez
    palavras_repetidas = {palavra: contagem[palavra] for palavra in contagem if contagem[palavra] > 1}

    return palavras_repetidas

# Exemplo de uso
json_file_path = '../Json/conteudo_anp.json'  # Substitua pelo caminho do seu arquivo JSON
palavras_repetidas = contar_palavras_repetidas(json_file_path)

if palavras_repetidas:
    print("Palavras repetidas e suas contagens:")
    for palavra, contagem in palavras_repetidas.items():
        print(f"{palavra}: {contagem}")
else:
    print("Sem repetições 1")

def contar_trechos_repetidos(json_file_path, n=2):
    try:
        with open(json_file_path, 'r', encoding='utf-8') as jf:
            json_data = json.load(jf)  # Lê o conteúdo do arquivo JSON
    except Exception as e:
        print("Erro ao ler o arquivo JSON:", e)
        return None

    # Concatenar todos os textos em uma única string
    all_text = ""
    for document in json_data:
        if 'texto' in document:  # Supondo que os documentos têm um campo 'texto'
            all_text += document['texto'] + " "

    # Dividir o texto em palavras
    palavras = all_text.split()

    # Criar trechos de n palavras
    trechos = [' '.join(palavras[i:i+n]) for i in range(len(palavras) - n + 1)]

    # Contar a frequência de cada trecho
    contagem = Counter(trechos)

    # Filtrar trechos que aparecem mais de uma vez
    trechos_repetidos = {trecho: contagem[trecho] for trecho in contagem if contagem[trecho] > 1}

    return trechos_repetidos

# Exemplo de uso
trechos_repetidos = contar_trechos_repetidos(json_file_path, n=2)  # n=2 para trechos de 2 palavras

if trechos_repetidos:
    print("Trechos repetidos e suas contagens:")
    for trecho, contagem in trechos_repetidos.items():
        print(f"{trecho}: {contagem}")
else:
    print("Sem repetições 2")