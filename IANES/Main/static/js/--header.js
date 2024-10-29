window.detectar_pagina = function() { 
    // const url_page_index = "http://127.0.0.1:5500/index.html";
    // const url_page_auth = "http://127.0.0.1:5500/auth.html";
    // const url_page_ianes = "http://localhost:8000/list-messages/18";

    const currentUrl = window.location.href;

    let pageType;

    if (currentUrl.startsWith(url_page_index)) {
        pageType = "index";
    } else if (currentUrl === url_page_auth) {
        pageType = "auth";
    } else if (currentUrl === url_page_ianes) {
        pageType = "ianes";
    } else {
        pageType = "unknown";
    }

    const header_top = document.getElementById("header_top");
    const header_bot = document.getElementById("header_bot");
    const mainElement = document.querySelector("main"); // Seleciona o elemento <main>

    const tamanho_header = "6vw";
    const tamanho_header_top = "4vw";
    const tamanho_header_bot = "2vw";

    const tamanho_footer = "2vw";

    let tamanho_topo; // Variável para armazenar o tamanho do cabeçalho

    // Lógica que vai configurar o Header, dependendo da página
    switch(pageType) {
        case "index":
            header_top.style.display = "flex";
            header_bot.style.display = "flex";
            document.documentElement.style.setProperty('--tamanho_header', tamanho_header);
            mainElement.style.marginTop = tamanho_header;
            mainElement.style.marginBottom = tamanho_footer;
            tamanho_topo = tamanho_header; // Armazena o tamanho
            break;
        case "auth":
            header_top.style.display = "flex";
            header_bot.style.display = "none";
            document.documentElement.style.setProperty('--tamanho_header', tamanho_header_top);
            mainElement.style.marginTop = tamanho_header_top;
            mainElement.style.marginBottom = tamanho_footer;
            tamanho_topo = tamanho_header_top; // Armazena o tamanho
            break;
        case "ianes":
            header_top.style.display = "flex";
            header_bot.style.display = "none";
            document.documentElement.style.setProperty('--tamanho_header', tamanho_header_top);
            mainElement.style.marginTop = '0';
            mainElement.style.marginBottom = '0';
            tamanho_topo = tamanho_header_top; // Armazena o tamanho
            break;
        default:
            console.log("Página não reconhecida.");
    }

    // Chame a função para criar o Cabeçalho Assistente
    window.header_assistente(tamanho_topo);
}

// Função para criar o Cabeçalho Assistente
window.header_assistente = function(tamanho_topo) { 
    const janelaAtual_url = localStorage.getItem("ultimaJanela");
    console.log(janelaAtual_url)
    // Verifica se a página é a 'url_page_ianes'
    if (janelaAtual_url.includes(url_page_ianes)) {
        document.getElementById("header").style.top = `0`;
        document.getElementById("header").style.position = `relative`;
        return;
    }

    let prevScrollPos = window.pageYOffset;

    window.onscroll = function() {
        const currentScrollPos = window.pageYOffset;

        if (prevScrollPos > currentScrollPos) {
            document.getElementById("header").style.top = "0";
        } else {
            document.getElementById("header").style.top = `-${tamanho_topo}`; // Usa a variável para o tamanho
        }

        prevScrollPos = currentScrollPos;
    };

    // Lógica adicional para as outras páginas pode ser adicionada aqui
    if (janelaAtual_url.includes(url_page_index) || janelaAtual_url.includes(url_page_auth)) {
        // Adicione lógica específica para index ou auth
        document.getElementById("header").style.position = `fixed`;
    }
};