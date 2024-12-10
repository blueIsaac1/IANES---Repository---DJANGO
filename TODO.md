- Desenvoler lógica ou adiciocar função para direcionar ao chat ianes e criar uma sala automaticamente // adicionado
- Lista ultima sala do banco de dados com reverse url // adicionado
- Fix botao excluir sala // adicionado
- Adicionar Api VLibras // adicionado
- Cadastro/Login // adicionado
- Fix botao renomear sala // adicionado
- Quando entra na sala de chat, cria uma nova sala, ao inves de apenas entrar na 1° // adicionado
- Copiar a msg do ianes. nao funciona // adicionado
- Renomear nao funcionando // adicionado
- Adicionar lógica do front + back // quase 100%
- Gerar Pdf // adicionado
- Arrumar estrutura do banco de dados:
    1. Atribuir um usuario a cada sala (usuario-*salas) (salas-usuario) - (1-*) (1-1) // adicionado
- Baixar pdf/buffer direto do navegador // adicionado

# ERROS:

- Arrumar response da ianes ?????
- OS ARQUIVOS DE IDIOMAS E TEMAS, POR ALGUM MOTIVO NA CARREGA EM CERTAS PAGINAS, MOTIVO:
- Quando url da pagina é: http://127.0.0.1:8000/IAnes/12/ ← Sendo qualquer numero, ele NAO encontra os arquivos. Provavelmente pq, as salas ficam em internas no DJANGO. Mas quando o url é http://127.0.0.1:8000/IAnes/, ele encontra normalmente.
- VERIFICAR - Troca de Salas FUNCIONA, porem nao marca qual sala esta selecionado. DEIXA PRO FRANCISCO // Esta com problemas, devido ao URL.

- Textos que sao adicionados automaticamente, como as listas de temas não sao traduzidos AINDA, pois esqueci de pegar os seus ID's. Fazer manualmente
- Arrumar o Title da Pagina de Index
- Tema mal aplicado nas Tooltips do Chat

- Erro de merda: "Ianes: Erro: unsupported operand type(s) for +=: 'NoneType' and 'str'" // Resolvido
- Campo de Input bugado. CHICO CONSEGUE RESOLVER? // Consigo, RESOLVIDO

# ADICIONAR:

- Lógica de preocessar e enviar pdf no momento que a analise estiver pronta