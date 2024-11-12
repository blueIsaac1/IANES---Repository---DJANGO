from gtts import gTTS

# Texto que você quer converter em fala
texto = "Olá! Eu sou o IAnes, estou aqui para lhe ajudar. Vamos iniciar a consulta?"

# Criação do objeto gTTS
tts = gTTS(text=texto, lang='pt', slow=False)  # 'pt' para português

# Salvar o arquivo de áudio (em formato .mp3)
tts.save("audio_texto.mp3")

# Opcional: Reproduzir o áudio diretamente
import os
os.system("start audio_texto.mp3")  # No Windows, use 'start'. No Linux, use 'mpg321' ou 'aplay'.