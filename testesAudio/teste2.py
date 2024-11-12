import os
from gtts import gTTS

# Defina o texto que você deseja transformar em fala
texto = "Olá professor Daniel."

# Caminho para a pasta "audios" (usando o caminho relativo até a pasta 'testerAudio/audios')
pasta_audios = "testesAudio/audios"

# Função para gerar um nome único para o arquivo
def gerar_nome_arquivo():
    # Inicializa o número do arquivo
    numero = 1
    # Loop até encontrar um nome de arquivo disponível
    while True:
        nome_arquivo = f"ianesTalk_{numero}.mp3"
        caminho_arquivo = os.path.join(pasta_audios, nome_arquivo)
        if not os.path.exists(caminho_arquivo):  # Verifica se o arquivo já existe
            return caminho_arquivo
        numero += 1

# Criação do objeto TTS
tts = gTTS(text=texto, lang='pt', slow=False)

# Verifica se a pasta "testerAudio/audios" existe, caso contrário, cria a pasta
if not os.path.exists(pasta_audios):
    os.makedirs(pasta_audios)

# Gera um nome único para o arquivo
caminho_audio = gerar_nome_arquivo()

# Salva o áudio no arquivo com o nome gerado na pasta "testerAudio/audios"
tts.save(caminho_audio)

# Reproduzir o áudio (dependendo do sistema operacional)
os.system(f"start {caminho_audio}")  # Windows: use 'start'. No Linux, use 'mpg321' ou 'aplay'.

# Exibe o caminho do arquivo salvo
print(f"Áudio salvo em: {caminho_audio}")