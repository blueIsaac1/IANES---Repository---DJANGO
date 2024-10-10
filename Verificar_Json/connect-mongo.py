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
        json_file_path = './conteudo_anp.json'
        print("Conectado 4")
    except Exception as e:
        print("Erro ", e)

    try:
        with open(json_file_path, 'r', encoding='utf-8') as jf:
            json_data = json.load(jf)
        print("Json Conectado")
    except Exception as e:
        print("Erro ", e)
        return

    max_size = 16777216  # 16 MB
    current_batch = []
    current_size = 0
    ignored_documents = 0  # Contador para documentos ignorados
    total_characters_inserted = 0  # Contador para caracteres inseridos

    for document in json_data:
        doc_size = len(json.dumps(document).encode('utf-8'))
        print(f"Tamanho do documento: {doc_size} bytes")  # Tamanho do documento em bytes

        # Verificar se o documento individual é muito grande
        if doc_size > max_size:
            print(f"Erro: Documento individual excede o limite de 16 MB. Tamanho: {doc_size} bytes")
            ignored_documents += 1  # Incrementar contador de documentos ignorados
            continue  # Ignorar este documento ou tratá-lo de outra forma

        if current_size + doc_size > max_size:
            # Inserir o lote atual se o tamanho exceder o limite
            if current_batch:
                result = collection.insert_many(current_batch)
                total_characters_inserted += sum(len(json.dumps(doc).encode('utf-8')) for doc in current_batch)
                print(f"{len(result.inserted_ids)} documentos inseridos")
                current_batch = []  # Limpar o lote atual
                current_size = 0  # Reiniciar o tamanho atual

        current_batch.append(document)
        current_size += doc_size

    # Inserir qualquer documento restante
    if current_batch:
        result = collection.insert_many(current_batch)
        total_characters_inserted += sum(len(json.dumps(doc).encode('utf-8')) for doc in current_batch)
        print(f"{len(result.inserted_ids)} documentos inseridos")

    print(f"Total de documentos ignorados: {ignored_documents}")
    print(f"Total de caracteres inseridos no MongoDB: {total_characters_inserted}")

    client.close()