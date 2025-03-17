# IANES Project

## Descrição

O projeto IANES é uma aplicação que interage com Json's para gerenciar e analisar dados relacionados a investimentos. A aplicação permite que os usuários insiram informações sobre projetos e recomenda as melhores opções de investimento com base em análises de dados.

## Funcionalidades

- Carregamento de dados de várias coleções.
- Análise de conteúdo usando a API Gemini.
- Interface de usuário para entrada de dados.
- Exibição de recomendações de investimento.

## Tecnologias Utilizadas

- Python
- Django
- Js, Html e Css
- Json
- Beautiful Soup e UrlLib
- SQlite
- Google Generative AI API
- Google Translate API
- Docker
- Git
- Windows Server 2025


## Pré-requisitos

Antes de executar o projeto, você precisa ter o seguinte instalado:

- Python 3.x
- pip (gerenciador de pacotes do Python)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/blueIsaac1/IANES---Repository---DJANGO
   cd IANES
   ```

2. Crie um ambiente virtual (opcional, mas recomendado):

   ```bash
   python -m venv venv
   source venv/bin/activate  # Para Linux/Mac
   venv\Scripts\activate  # Para Windows
   ```

3. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

   **Nota:** Certifique-se de que o arquivo `requirements.txt` contém todas as bibliotecas necessárias, como `google-generativeai`, `googletrans`, `Django`, etc.

4. Configure as credenciais da API:

   - Substitua a chave da API no código pelo seu próprio valor.

## Execução

Para executar o projeto, use o seguinte comando:
    ```bash
   python -m IANES.Main
   ```

Ou, se você estiver usando Django:
    ```bash
   python manage.py runserver
   ```

Acesse a aplicação em seu navegador em `http://127.0.0.1:8000/`.

## Estrutura do Projeto
IANES/
│
├── IANES/
│ ├── init.py
│ ├── settings.py
│ ├── urls.py
│ └── wsgi.py
│
├── Main/
│ ├── init.py
│ ├── models.py
│ ├── views.py
│ ├── urls.py
│ └── static/
│ └── js/
│ └── main.js
│
├── Verificar_Json/
│ ├── checar_coleções.py
│ ├── checar_json.py
│ └── connection-mongo.py
│
├── manage.py
└── requirements.txt

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir um problema ou enviar um pull request.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.