// Função para calcular e aplicar o tamanho do header
function ajustarHeader() {
    const root = document.documentElement;
    const headerBot_size = parseFloat(getComputedStyle(root).getPropertyValue('--tamanho_header_bot'));
    const headerTop_size = parseFloat(getComputedStyle(root).getPropertyValue('--tamanho_header_top'));
    let tamanhoHeader;
    
    // Verificar se é a página index
    const headerBot = document.getElementById("header_bot")
    const headerBot_size_pageValue = headerBot ? headerBot.getAttribute("aria-page-value") : null;

    if (headerBot_size_pageValue === "index") {
        tamanhoHeader = headerBot_size + headerTop_size;
    } else {
        tamanhoHeader = headerTop_size;
    }

    // Atualizar a variável CSS do header
    root.style.setProperty('--tamanho_header', `${tamanhoHeader}vw`);
    return `${tamanhoHeader}vw`;
}

// Função para criar cabeçalho assistente
window.header_assistente = function(tamanho_topo) { 
    let prevScrollPos = window.pageYOffset;
    window.onscroll = function() {
        const currentScrollPos = window.pageYOffset;
        if (prevScrollPos > currentScrollPos) {
            document.getElementById("header").style.top = "0";
        } else {
            document.getElementById("header").style.top = `-${tamanho_topo}`; 
        }
        prevScrollPos = currentScrollPos;
    };
};

// Ajustar header e iniciar função de cabeçalho assistente
let tamanho_topo = ajustarHeader();
window.addEventListener("scroll", header_assistente(tamanho_topo))