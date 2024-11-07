# 🚀 Tecnologias Usadas

## 📜 Tecnologia do ".md" - Formatações

#### Informações Tiradas de: [readme - template](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request)

<details>
<summary>Formatações</summary>
> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

</details>

## 🐒 Tecnologias do HTML, CSS e JavaScript

### 🛠 Local Storage

- Explicação

#### Usos:

```javascript
let temaSalvo = localStorage.getItem('situacaoTema');
```
```javascript
tema = 'n_escolheu';
    localStorage.setItem('situacaoTema', tema);
```

### 🛠 Prefers Dark Scheme

- Explicação

#### Usos:
```javascript
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
```
```javascript
situacao_tema = prefersDarkScheme ? 'escuro' : 'claro';
```

### 🛠 Transformar em Objetos

O uso dessa tecnologia foi para conseguir aplicar o "header" e o "footer" vulgo Cabeçalho e Rodapé, de forma geral, ou seja existindo apenas 1 ""header" e "footer" e aplica-los em todas as paginas, assim qualquer alteração feita em um, ele aplica em todos

```javascript
loadHTML('header', './_header.html');
loadHTML('footer', './_footer.html');
```

A Existencia de um HTML para o "header" e um para "footer", e usando uma função onde recebe o ID do local aonde vai ser colocado, e o caminho do Arquivo.

A Função "loadHTML" faz todo esse processo.


#### 🛠 Comandos com usos especificos

##### Promise.All

```javascript
- Promise.all([...])
```
Essa parte do código utiliza Promise.all para garantir que ambas as chamadas para loadHTML (carregando o header e o footer) sejam completadas antes de prosseguir. O Promise.all aceita um array de promessas e retorna uma nova promessa que é resolvida quando todas as promessas do array são resolvidas. Se alguma delas falhar, a nova promessa será rejeitada.

```javascript
.then(() => {...})
```
Esse bloco será executado apenas depois que ambas as promessas (carregar o header e o footer) forem resolvidas. Aqui você pode chamar funções que dependem do conteúdo do header e footer já estarem carregados e disponíveis no DOM.

##### Time Stamp

O timestamp gera um número que representa o tempo atual em milissegundos desde 1 de janeiro de 1970 (epoch time). Adicionando esse valor como um parâmetro de consulta na URL, você cria uma URL única a cada requisição.

Isso é útil para evitar o cache do navegador. Quando a URL muda a cada requisição, o navegador não consegue usar a versão em cache do recurso, forçando-o a buscar uma nova versão do servidor.