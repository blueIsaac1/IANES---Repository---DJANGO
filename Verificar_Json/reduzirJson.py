import json
import os

def reduzir_tamanho_json(arquivo_json, tamanho_max_mb):
    tamanho_max_bytes = tamanho_max_mb * 1024 * 1024  # Converte MB para bytes
    
    try:
        with open(arquivo_json, 'r', encoding='utf-8') as f:
            conteudo = json.load(f)  # Carrega o conteúdo do arquivo JSON
        
        if not isinstance(conteudo, list):
            print("O arquivo JSON não é uma lista. Operação abortada.")
            return
        
        # Remove itens do final da lista até que o tamanho do JSON seja menor ou igual ao limite
        while True:
            # Testa o tamanho do JSON atual
            json_teste = json.dumps(conteudo, ensure_ascii=False)
            tamanho_atual_bytes = len(json_teste.encode('utf-8'))
            
            if tamanho_atual_bytes <= tamanho_max_bytes:
                break  # Para o loop se o tamanho for aceitável
            
            # Remove o último item da lista
            if conteudo:
                conteudo.pop()
            else:
                print("Todos os itens foram removidos, mas o tamanho ainda excede o limite.")
                break
        
        # Sobrescreve o arquivo JSON com o conteúdo reduzido
        with open(arquivo_json, 'w', encoding='utf-8') as f:
            json.dump(conteudo, f, ensure_ascii=False, indent=4)
        
        print(f"Arquivo JSON reduzido para {tamanho_max_mb}MB ou menos.")
    
    except FileNotFoundError:
        print(f"Arquivo {arquivo_json} não encontrado.")
    except json.JSONDecodeError:
        print("Erro ao decodificar o arquivo JSON.")
    except Exception as e:
        print(f"Ocorreu um erro: {e}")

# Exemplo de uso
arquivo = 'F:/Projetos-VSCode/IANES---Repository---DJANGO/IANES/Main/DADOS/conteudo_finep.json'
reduzir_tamanho_json(arquivo, 0.5)

