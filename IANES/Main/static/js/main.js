// // Caminho/URL para as Paginas
const url_page_index = "http://127.0.0.1:8000/auth/"
const url_page_auth = "http://127.0.0.1:8000/auth"
const url_page_ianes = "http://127.0.0.1:8000/auth/IAnes/1"

// Caminho/URL para as Paginas

// ----------------- Função para Navegar para as Paginas
function navigateTo(page, tela) {
    switch(page) {
        case 'auth_page':
            if (tela === "auth_login") {
                localStorage.setItem("tela_auth", "auth_login")
            } else if (tela === "auth_signup") {
                localStorage.setItem("tela_auth", "auth_signup")
            }
            // window.location.href = url_page_auth;
            window.open(url_page_auth, "_self");
            break
        case 'ianes_page':
            // window.location.href = url_page_ianes;
            window.open(url_page_ianes, "_self");
            break
        case 'index_page':
            // window.location.href = url_page_index;
            window.open(url_page_index, "_self");
            break
    }
    rolarPara("topo_screen");
    // _blank: Nova aba/janela.
    // _self: Mesma aba/janela (padrão).
    // _parent: Janela pai (substitui a página pai em iframes).
    // _top: Janela completa (remove todos os frames).
    // Nome Personalizado: Abre em uma janela/aba específica, se já existir.
}

// ----------------- Função para Chamar as Telas
// Função que exibe a tela correspondente
window.callScreen = function(tela) {
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
            tela_inicio.style.display = "block";
            tela_sobre.style.display = "none";
            // Muda o "#" na URL
            window.location.hash = "inicio"
            break;
        case 'sobre':
            // Troca a Visibilidade das Telas do Index
            tela_inicio.style.display = "none";
            tela_sobre.style.display = "block";
            // Muda o "#" na URL
            window.location.hash = "sobre"
            break;
        default:
            // Se a tela não for reconhecida, você pode definir um comportamento padrão
            if (tela_inicio) {
                tela_inicio.style.display = "block";
            }
            if (tela_sobre) {
                tela_sobre.style.display = "none";
            }
            break;
    }
    rolarPara("topo_screen");
};

// Função para carregar HTML em um elemento
// async function loadHTML(elementId, url) {
//     const response = await fetch(url);
//     const html = await response.text();
//     document.getElementById(elementId).innerHTML = html; 
//     console.log(`⚙ Carregando ${url} em ${elementId}`);
// }

// Função para adicionar um elemento ao head
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

// Função para Detectar se o usuário está Autenticado
window.detectar_usuario_autenticado = function() {
    const banner_login = document.getElementById("banner_vantConta");
    const user_nome_index = document.getElementById("user_name_t");

    // Temporaria
    let usuario_logado = false;
    localStorage.setItem("usuario_auth", usuario_logado);

    // Recuperando o valor do localStorage e convertendo para booleano
    usuario_logado = localStorage.getItem("usuario_auth") === "true";

    if (!usuario_logado) { // Se não estiver logado
        if (banner_login) {
            banner_login.style.display = "flex";
        }
        user_nome_index.textContent = "";
        user_nome_index.style.display = "none";
    } else { // Se estiver logado
        if (banner_login) {
            banner_login.style.display = "none";
        }
        user_nome_index.textContent = "Roberto e Jorge";
        user_nome_index.style.display = "block";
    }

    console.log("⚙ Detectando se o usuário está Autenticado");
}

// Função principal que chama outras funções
function executarFuncoes() {
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
    if (typeof appendInList_lang === 'function') {
        console.log("⚙ Inserindo Idiomas Disponiveis");
        appendInList_lang();
    }
    // Adicionando Temas na Lista
    if (typeof appendInList_tema === 'function') {
        console.log("⚙ Inserindo Temas Disponiveis");
        appendInList_tema();
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
  // Coloque aqui as funções que não dependem do header/footer.
});

// Funções que são carregadas diretamente

if (typeof loading_page === 'function') {
    console.log("⚙ Carregando Página");
    loading_page();
}

// Função para carregar os componentes
// async function carregarComponentes() {
//     const promises = [];
//     const janelaAtual_url = localStorage.getItem("ultimaJanela")
//     if (janelaAtual_url.includes(url_page_index) || janelaAtual_url.includes(url_page_auth)) {
//       promises.push(loadHTML('header', "{% static 'html/_header.html' %}"));
//       promises.push(loadHTML('footer', '{% static "html/_footer.html" %}'));
//     } else if (janelaAtual_url.includes(url_page_ianes)) {
//       promises.push(loadHTML('header', '{% static "html/_header.html" %}'));
//     }
  
//     await Promise.all(promises);
//     console.log("⚙ COMPONENTES carregados");
//   }

document.addEventListener('DOMContentLoaded', async function() {
    // Pegar a URL da página atual e armazená-la no localStorage
    const janelaAtual_url = window.location.href;
    localStorage.setItem('ultimaJanela', janelaAtual_url);

    // await carregarComponentes();

    // Verifique se os elementos estão no DOM
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    console.log("Header:", header);
    console.log("Footer:", footer);

    executarFuncoes();
});