// // Caminho/URL para as Paginas
// const url_page_index = "http://127.0.0.1:8000/auth/"
// const url_page_auth = "http://127.0.0.1:8000/auth"
// const url_page_ianes = "http://127.0.0.1:8000/auth/IAnes/1"

// Caminho/URL para as Paginas

// ----------------- Função para Navegar para as Paginas
// function navigateTo(page, tela) {
//     window.open(url_page_index, "_self");
//     // _blank: Nova aba/janela.
//     // _self: Mesma aba/janela (padrão).
//     // _parent: Janela pai (substitui a página pai em iframes).
//     // _top: Janela completa (remove todos os frames).
//     // Nome Personalizado: Abre em uma janela/aba específica, se já existir.
// }

// ----------------- Função para Chamar as Telas
// Função que exibe a tela correspondente
window.callScreen = function(tela) {
    if (tela === null) {
        tela = "inicio"
    }

    // Guarda a Tela Atual no LocalStorage
    localStorage.setItem('ultimaTela', tela);

    const navItems = document.querySelectorAll('.nav_item');

    navItems.forEach(item => {
        item.setAttribute('aria-selected', 'false');
    });

    let navItem_selecionado = document.getElementById(`nav_item-${tela}`);
    if (navItem_selecionado) {
        navItem_selecionado.setAttribute('aria-selected', 'true');
    }

    const tela_inicio = document.getElementById("tela_inicio");
    const tela_sobre = document.getElementById("tela_sobre");

    switch(tela) {
        case 'inicio':
            // Troca a Visibilidade das Telas do Index
            tela_inicio.style.display = "flex";
            tela_sobre.style.display = "none";
            // Muda o "#" na URL
            window.location.hash = "inicio"
            break;
        case 'sobre':
            // Troca a Visibilidade das Telas do Index
            tela_inicio.style.display = "none";
            tela_sobre.style.display = "flex";
            // Muda o "#" na URL
            window.location.hash = "sobre"
            break;
        default:
            // Se a tela não for reconhecida, você pode definir um comportamento padrão
            if (tela_inicio) {
                tela_inicio.style.display = "flex";
            }
            if (tela_sobre) {
                tela_sobre.style.display = "none";
            }
            window.location.hash = "inicio"
            break;
    }
    setTimeout(() => rolarPara("topo_screen"), 100);
};

function addToHead(tagName, attributes) {
  const existingTags = document.head.getElementsByTagName(tagName);
  for (let i = 0; i < existingTags.length; i++) {
      if (existingTags[i].getAttribute('href') === attributes.href || 
          existingTags[i].getAttribute('src') === attributes.src) {
          console.log(`!!! Elemento ${tagName} já existe no head:`, attributes);
          return; // Não adiciona se já existir
      }
  }
  const tag = document.createElement(tagName);
  for (const key in attributes) {
      tag.setAttribute(key, attributes[key]);
  }
  document.head.appendChild(tag);
  console.log(`⚙ Elemento ${tagName} adicionado ao head:`, attributes);
}

// Função para carregar arquivos JSON
async function fetchJSONFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Falha ao carregar o arquivo: ${filePath}`);
        return await response.json();
    } catch (error) {
        console.error(`Erro ao carregar o arquivo ${filePath}:`, error);
        return null; // Retorna null para indicar falha
    }
}
// Arquivos necessários
const LANGS_DISPONIVEIS_PATH = "{% static '_datas/langsDisponiveis.json' %}";
const TEMAS_DISPONIVEIS_PATH = "{% static '_datas/temasDisponiveis.json' %}";
// Função para buscar os arquivos necessários
async function findRequiredFiles() {
    const files = {};

    // Carregar idiomas disponíveis
    files.langsDisponiveis = await fetchJSONFile('../static/_datas/langsDisponiveis.json');
    // Carregar temas disponíveis
    files.temasDisponiveis = await fetchJSONFile('../static/_datas/temasDisponiveis.json');

    return files;
}

// Função principal que chama outras funções
function executarFuncoes({ langsDisponiveis, temasDisponiveis }) {
    // Carregando a Página de Index
    if (typeof detectar_pagina === 'function') {
        console.log("⚙ Detectando Página atual e Configurando");
        detectar_pagina();
    }
    // Detectando se o usuário está autenticado
    if (typeof detectar_usuario_autenticado === 'function') {
        console.log("⚙ Detectando se o Usuário está Autenticado");
        detectar_usuario_autenticado();
    }
    // Adicionando Idiomas na Lista
    if (langsDisponiveis && typeof appendInList_lang === 'function') {
        console.log("⚙ Inserindo Idiomas Disponíveis");
        appendInList_lang(langsDisponiveis);
    }
    // Adicionando Temas na Lista
    if (temasDisponiveis && typeof appendInList_tema === 'function') {
        console.log("⚙ Inserindo Temas Disponíveis");
        appendInList_tema(temasDisponiveis);
    }
    // Essas DEVEM ser as EXECUTADAS DEPOIS de qualquer coisa que é aplicada ao Header
    if (typeof detectarPreferido_Idioma === 'function') {
        console.log("⚙ Detectando idioma preferido");
        detectarPreferido_Idioma();
    }
    if (typeof detectarPreferido_ColorScheme === 'function') {
        console.log("⚙ Detectando esquema de cores preferido");
        detectarPreferido_ColorScheme();  
    }
    // Ouvintes para os Cliques nos Botões para Alterar o Idioma ou o Tema
    if (typeof listenBtn_lang === 'function') {
        console.log("⚙ Ativando ouvintes paracCliques nos botões para alterar o Idioma ");
        listenBtn_lang();
    }
    if (typeof listenBtn_tema === 'function') {
        console.log("⚙ Ativando ouvintes paracCliques nos botões para alterar o Tema ");
        listenBtn_tema();  
    }
}

// Usando o evento 'load' para garantir que o código só execute após a página estar totalmente carregada
document.addEventListener('DOMContentLoaded', function() {
  // Adicionando o favicon
  addToHead('link', {
    rel: 'icon',
    type: 'image/x-icon',
    href: 'https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/3932a9bcb74c20bdb3c85f4d80c678a24184cef4/_midia/_logotipos/ianesFavicon_PretaA.png'
  });

  // Adicionando a fonte Montserrat
  addToHead('link', {
    href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
    rel: 'stylesheet'
  });

  // Import WebComponent do BoxIcons
  addToHead('script', {
    src: 'https://unpkg.com/boxicons@2.1.4/dist/boxicons.js'
  });

  // Import da <i> do BoxIcons
  addToHead('link', {
    rel: 'stylesheet',
    href: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'
  });

  // Import do Material Icons
  addToHead('link', {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
  });

  // Import WebComponent do Ionic Icons
  addToHead('script', {
    type: 'module',
    src: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'
  });
});

// Funções que são carregadas diretamente

if (typeof loading_page === 'function') {
    console.log("⚙ Carregando Página");
    loading_page();
}

document.addEventListener('DOMContentLoaded', async function () {
    // Pegar a URL da página atual e armazená-la no localStorage
    const janelaAtual_url = window.location.href;
    localStorage.setItem('ultimaJanela', janelaAtual_url);

    // Esperar os arquivos necessários serem carregados
    const arquivosCarregados = await findRequiredFiles();

    if (arquivosCarregados) {
        // Passar os arquivos carregados para a função principal
        executarFuncoes(arquivosCarregados);
    } else {
        console.error("Erro ao carregar os arquivos necessários. Funções não executadas.");
    }

    // Verifique se os elementos header e footer estão no DOM
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    console.log("Header:", header);
    console.log("Footer:", footer);
});