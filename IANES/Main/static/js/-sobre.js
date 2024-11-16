// Variaveis Globais
const overlay_membro = document.getElementById('membro_overlay');
const fecharOverlay_membro = document.getElementById("fecharOverlay_membro");
const overlayContainer_membro = document.getElementById("ovMembro_container")

// Quebra linha dos nomes na aba sobre
const textos = document.querySelectorAll('#membros_sec_p'); // Use a classe
textos.forEach(texto => {
    texto.innerHTML = texto.innerText.split(' ').join('<br>'); // Usa <br> para quebra de linha
});

// ----------------- Função para Abrir Membros

// Função para preencher os dados do membro
async function callMember(membro) {
    // const memberId = element.id.split("-")[2]; // Pega o membro, depois do 2° "-" do ID
    const memberId = membro

    let arq_membros;

    // Carregar o arquivo JSON dos membros
    try {
        const response = await fetch(`../static/_datas/membros.json`);
        if (!response.ok) throw new Error(`Falha ao carregar os membros`);
        
        arq_membros = await response.json();
    } catch (error) {
        console.error('Erro ao carregar o arquivo de membros:', error);
        return;
    }

    // Usar o `memberId` para acessar as informações do membro
    let memberData;
    try {
        memberData = arq_membros[memberId];
        if (!memberData) throw new Error(`Membro com ID ${memberId} não encontrado`);
    } catch (error) {
        console.error('Erro ao acessar os dados do membro:', error.message);
        return;
    }

    // Preencher os dados do overlay
    document.getElementById('membroOverlay_fotoM').src = memberData.url_img_membro;
    document.getElementById('membroOverlay_fotoM').alt = memberData.alt_img_text;
    document.getElementById('nomeM_overlay').textContent = memberData.nome_membro;
    document.getElementById('texto_sobre_adding_mainDev').textContent = memberData.main_dev;

    // Preencher as listas de desenvolvimento e adicionais
    const devList = document.getElementById('list_developed');
    devList.innerHTML = '';
    memberData.list_developed.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        devList.appendChild(li);
    });

    const addList = document.getElementById('list_additional');
    addList.innerHTML = '';
    memberData.list_additional.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        addList.appendChild(li);
    });

    // Preencher os links de redes sociais
    document.getElementById('link_linkedin').href = memberData.linkedin.href;
    document.getElementById('link_linkedin').textContent = memberData.linkedin.text;

    document.getElementById('link_github').href = memberData.github.href;
    document.getElementById('link_github').textContent = memberData.github.text;

    document.getElementById('link_email').href = memberData.email.href;
    document.getElementById('link_email').textContent = memberData.email.text;

    // Exibir o overlay
    config_toggleOverlay_membro();
}

// Limpa os dados no overlay
function clearOverlay() {
    // Limpar a imagem do membro
    document.getElementById('membroOverlay_fotoM').src = ''; // Define a imagem como vazia
    document.getElementById('membroOverlay_fotoM').alt = ''; // Define o texto alternativo como vazio

    // Limpar o nome do membro
    document.getElementById('nomeM_overlay').textContent = ''; // Remove o nome do membro

    // Limpar a função principal do membro
    document.getElementById('texto_sobre_adding_mainDev').textContent = ''; // Remove a função principal

    // Limpar as listas de desenvolvimento e adicionais
    const devList = document.getElementById('list_developed');
    devList.innerHTML = ''; // Limpa todos os itens da lista de desenvolvimentos

    const addList = document.getElementById('list_additional');
    addList.innerHTML = ''; // Limpa todos os itens da lista adicional

    // Limpar os links de redes sociais
    document.getElementById('link_linkedin').href = '';
    document.getElementById('link_linkedin').textContent = '';

    document.getElementById('link_github').href = '';
    document.getElementById('link_github').textContent = '';

    document.getElementById('link_email').href = '';
    document.getElementById('link_email').textContent = '';
}

// Função para alternar a exibição do overlay
function config_toggleOverlay_membro() {
    const overlayState = overlay_membro.getAttribute("aria-active");

    if (overlayState === "true") {
        overlay_membro.style.display = "none";
        overlay_membro.setAttribute("aria-active", "false");
        document.body.style.overflowY = "auto";
        clearOverlay();
        overlayContainer_membro.classList.remove("ovMembro_container_active");
    } else if (overlayState === "false") {
        overlay_membro.style.display = "flex";
        overlay_membro.setAttribute("aria-active", "true");
        document.body.style.overflowY = "hidden";
        overlayContainer_membro.classList.add("ovMembro_container_active");
    } else {return}
}

// Função para Copiar o Email
let popupActive = false;
function copyEmail(event, element) {
    event.preventDefault();
    
    // Verifica se o popup já está ativo
    if (popupActive) return; 

    const email = element.textContent;

    // Copia o texto para a área de transferência
    navigator.clipboard.writeText(email).then(() => {
        showPopup_emailCopy();
    }).catch(err => {
        console.error('Erro ao copiar o email: ', err);
    });
}
function showPopup_emailCopy() {
    const popup = document.getElementById('popup_copyEmail');
    const loadingBar = document.getElementById('loading');
    
    popupActive = true; // Marca o popup como ativo
    popup.style.display = 'flex';
    loadingBar.style.width = '100%'; // Preenche a barra de loading

    // Começa a esvaziar a barra após 50ms para garantir que ela apareça
    setTimeout(() => {
        loadingBar.style.width = '0%'; // Reseta a barra de loading

        // Esconde o popup após 2 segundos
        setTimeout(() => {
            popup.style.display = 'none'; // Esconde o popup
            popupActive = false; // Marca o popup como inativo
        }, 2000); // Tempo para o efeito de desaparecimento, mesmo tempo do ".loading"
    }, 50); // Pequeno atraso antes de começar a esvaziar
}

// Mostrando e Escondendo as tooltips
const tp_sobre = document.getElementById("tp_members_clickExpand")
function showTp_sobre() {
    if (!tp_sobre) return
    tp_sobre.classList.add("tp_members_clickExpand_active")
}
function hideTp_sobre() {
    if (!tp_sobre) return
    tp_sobre.classList.remove("tp_members_clickExpand_active")
}

// Mostrando e Escondendo as tooltips
const tp_sobre_overlay = document.getElementById("tp_members_overlay")
function showTp_sobre_overlay() {
    if (!tp_sobre_overlay) return
    tp_sobre_overlay.classList.add("tp_members_overlay_active")
}
function hideTp_sobre_overlay() {
    if (!tp_sobre_overlay) return
    tp_sobre_overlay.classList.remove("tp_members_overlay_active")
}

// Função para preencher as imgs com seus icones
async function fillDevIcons() {

    let arq_iconsPNG;
    // Carregar o arquivo JSON dos Icones em PNG
    try {
        const response = await fetch(`../static/_datas/iconsPGN.json`);
        if (!response.ok) throw new Error(`Falha ao carregar os Icones em PNG`);
        
        arq_iconsPNG = await response.json();
    } catch (error) {
        console.error('Erro ao carregar o arquivo de Icones em PNG:', error);
        return;
    }
    const iconsData = arq_iconsPNG

    // Seleciona todas as imagens com a classe 'devMemb_icons_item'
    const imgElements = document.querySelectorAll(".devMemb_icons_item");

    imgElements.forEach(imgElement => {
        // Obtém o valor do atributo 'data-icon'
        const iconType = imgElement.getAttribute("data-icon");

        // Obtém os dados correspondentes ao tipo de ícone
        const data = iconsData[iconType];

        if (data) {
            // Atualiza atributos `src`, `title`, e `alt`
            imgElement.src = data.src;
            imgElement.title = data.title;
            imgElement.alt = data.alt;
        }
    });
}

// Adicionando o evento de clique aos botões
document.addEventListener("DOMContentLoaded", function() {
    // Eventos que acionam e configuram o Bloco de Notas
    document.querySelectorAll(".membros_sec").forEach(element => {
        // element.addEventListener("click", () => callMember(element));
        element.addEventListener("mouseover", showTp_sobre);
        element.addEventListener("mouseout", hideTp_sobre);
    });
    document.querySelectorAll("#link_email").forEach(element => {
        // Adiciona a função 'copyEmail' como um callback sem executá-la imediatamente
        element.addEventListener("click", (event) => copyEmail(event, element));
        element.addEventListener("mouseover", showTp_sobre_overlay);
        element.addEventListener("mouseout", hideTp_sobre_overlay);
    });

    // Eventos para fechar o overlay_membro
    overlay_membro.addEventListener("click", config_toggleOverlay_membro);
    if (fecharOverlay_membro) {
        fecharOverlay_membro.addEventListener("click", config_toggleOverlay_membro);
    }
    // Quando clica em cima do Container, impede ações "de fora"
    overlayContainer_membro.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    // Chama a função para preencher as imagens dos Icones
    fillDevIcons()
});