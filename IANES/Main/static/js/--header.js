// Variaveis Globais
const overlay_config = document.getElementById('config_overlay');
const fecharOverlay_config = document.getElementById("fecharOverlay_config");
const overlayContainer_config = document.getElementById("ovConfig_container")

const btn_config = document.getElementById("config_ovConfig_btn");
const userDiv_btn = document.getElementById("user_div");
const userDiv_container = document.getElementById("user_container");

const tp_user_clickOpen = document.getElementById("tooltip_user_clickOpen");
const tp_user_clickClose = document.getElementById("tooltip_user_clickClose");

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

// Função para alternar a exibição do overlay
function toggleOverlay_config() {
    let overlayState = overlay_config.getAttribute("aria-active");

    if (overlayState === "true") {
        overlay_config.style.display = "none";
        overlay_config.setAttribute("aria-active", "false");
        document.body.style.overflowY = "auto";
        clearOverlay();
        overlayContainer_config.classList.remove("ovConfig_container_active");
    } else if (overlayState === "false") {
        overlay_config.style.display = "flex";
        overlay_config.setAttribute("aria-active", "true");
        document.body.style.overflowY = "hidden";
        overlayContainer_config.classList.add("ovConfig_container_active");
    } else {return}
    toggleContainer_user();
}

// Função para abrir o Container de Perfil
function toggleContainer_user() {
    let containerState = userDiv_btn.getAttribute("aria-active");

    // Mostra o Container
    // Esconde o Container
    if (containerState === "true") {
        userDiv_btn.setAttribute("aria-active", "false");
        userDiv_container.classList.remove("user_container_active");
        tp_user_clickClose.classList.add("tooltip_user_hide")
        tp_user_clickOpen.classList.remove("tooltip_user_hide")
    } else if (containerState === "false") {
        userDiv_btn.setAttribute("aria-active", "true");
        userDiv_container.classList.add("user_container_active");
        tp_user_clickClose.classList.remove("tooltip_user_hide")
        tp_user_clickOpen.classList.add("tooltip_user_hide")
    } else {return}
}

// Funções auto-executaveis

// Ajustar header e iniciar função de cabeçalho assistente
let tamanho_topo = ajustarHeader();
window.addEventListener("scroll", header_assistente(tamanho_topo))

// Clique no botão "user_div" ou fora do container
userDiv_btn.addEventListener('click', (event) => {
    // Impede o fechamento do container "user_div" ao clicar no próprio botão
    event.stopPropagation();
    toggleContainer_user();
});

// Clique no botão "config_ovConfig_btn"
btn_config.addEventListener('click', (event) => {
    // Impede que o clique no "config_ovConfig_btn" feche o "user_div"
    event.stopPropagation();
    toggleOverlay_config();
});

// Clique no overlay ou no botão de fechar do overlay
overlay_config.addEventListener('click', (event) => {
    // Impede que o clique no overlay feche o "user_div"
    event.stopPropagation();
    toggleOverlay_config();
});

fecharOverlay_config.addEventListener('click', (event) => {
    // Impede que o clique no botão de fechar do overlay feche o "user_div"
    event.stopPropagation();
    toggleOverlay_config();
});

overlayContainer_config.addEventListener('click', (event) => {
    // Impede que o clique no botão de fechar do overlay feche o "overlayContainer_config"
    event.stopPropagation();
})

// Clique fora do container "user_div" (fecha o container "user_div")
document.addEventListener('click', (event) => {
    const userDiv_container = document.getElementById("user_container");

    // Verifica se o "userDiv_container" está visível e se o clique foi fora dele
    if (userDiv_container && userDiv_btn.getAttribute("aria-active") === "true" && !userDiv_container.contains(event.target) && event.target !== userDiv_btn) {
        toggleContainer_user();
    }
});

// toggleOverlay_config()