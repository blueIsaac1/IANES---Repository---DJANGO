import pyttsx3

# Inicializa o conversor de texto para fala
engine = pyttsx3.init()

# Define o texto a ser convertido
texto = "Olá! Eu sou o IAnes, estou aqui para lhe ajudar. Vamos iniciar a consulta?"

# Converte o texto em áudio e reproduz
engine.say(texto)

# Espera até que a fala termine
engine.runAndWait()

# Salvar o áudio na mesma pasta (não precisa de caminho, apenas o nome do arquivo)
engine.save_to_file(texto, 'ianesTalk.mp3')