import json
from pymongo import MongoClient

def inserirjson_anp(): 
    url = "mongodb://localhost:27017/"
    dbname = "IANES"
    
    try: 
        client = MongoClient(url)
        print("Conectado 1")
        db = client[dbname]
        print("Conectado 2")
    except Exception as e:
        print("Erro ", e)
    
    try: 
        collection = db['Conteudo_ANP']
        print("Conectado 3")
        json_file_path = '../Json/conteudo_anp.json'
        print("Conectado 4")
    except Exception as e:
        print("Erro ", e)

    try:
        with open(json_file_path, 'r', encoding='utf-8') as jf:
            json_data = json.load(jf)
        print("Json Conectado")
        # exit()
    except Exception as e:
        print("Erro ", e)
        return

    max_size = 16777216  # 16 MB
    current_batch = []
    current_size = 0

    for document in json_data:
        doc_size = len(json.dumps(document).encode('utf-8'))
        print(f"Tamanho do documento: {doc_size} bytes")  # Tamanho do documento em bytes

        # Verificar se o documento individual é muito grande
        if doc_size > max_size:
            print(f"Erro: Documento individual excede o limite de 16 MB. Tamanho: {doc_size} bytes")
            continue  # Ignorar este documento ou tratá-lo de outra forma

        if current_size + doc_size > max_size:
            # Inserir o lote atual se o tamanho exceder o limite
            if current_batch:
                result = collection.insert_many(current_batch)
                print(f"{len(result.inserted_ids)} documentos inseridos")
                current_batch = []  # Limpar o lote atual
                current_size = 0  # Reiniciar o tamanho atual

        current_batch.append(document)
        current_size += doc_size

    # Inserir qualquer documento restante
    if current_batch:
        result = collection.insert_many(current_batch)
        print(f"{len(result.inserted_ids)} documentos inseridos")

    client.close()

def contar_caracteres_json(json_file_path):
    try:
        with open(json_file_path, 'r', encoding='utf-8') as jf:
            json_data = jf.read()  # Lê o conteúdo do arquivo JSON
            num_caracteres = len(json_data)  # Conta o número de caracteres
            return num_caracteres
    except Exception as e:
        print("Erro ao ler o arquivo JSON:", e)
        return None

def contar_caracteres_json_mongo():
    client = MongoClient('mongodb://localhost:27017/')
    print("Conectado")
    db_links = client['IANES']
    a = db_links['Conteudo_LeiDoBem']
    total_caracteres = 0
    for document in a.find():
        document['_id'] = str(document['_id'])
        # Converte o documento para JSON e conta os caracteres
        total_caracteres += len(json.dumps(document))
    
    return total_caracteres



# json_file_path = '../Json/conteudo_leidobem.json'
# quantidade_caracteres = contar_caracteres_json(json_file_path)
# quantidade_caracteres_mongo = contar_caracteres_json_mongo()
inserirjson_anp()