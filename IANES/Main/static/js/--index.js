window.rolarPara = function(id) {
    if (id === "banner_maisIARE") {
        console.log("ASHDAHUDSA")
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth' }); // Rolagem suave
        }
    } else if (id === "topo") {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Rolagem suave para o topo
        });
    } else if (id === "topo_screen") {
        window.scrollTo({
            top: 0,
            behavior: 'auto' // Rolagem bruta para o topo
        });
    }
}

document.addEventListener('scroll', function() {
    const bubble_goTop = document.getElementById('bubble_goTop');
    if (window.scrollY > 100) { // Muda o valor para ajustar quando o balão aparece
        bubble_goTop.classList.add('show');
    } else {
        bubble_goTop.classList.remove('show');
    }
});

// Quebra linha dos nomes na aba sobre
const textos = document.querySelectorAll('#membros_sec_p'); // Use a classe
textos.forEach(texto => {
    texto.innerHTML = texto.innerText.split(' ').join('<br>'); // Usa <br> para quebra de linha
});

// ----------------- Função para Abrir Membros

// Abre os Membros
async function callMember(membro) {
    let arq_membros;

    // Carrega o arquivo JSON dos membros
    try {
        const response = await fetch(`../_data/membros.json`);
        if (!response.ok) throw new Error(`Falha ao carregar os membros`);
        
        arq_membros = await response.json();
    } catch (error) {
        console.error('Erro ao carregar o arquivo de membros:', error);
        return; // Sai da função se houver erro
    }

    const info = arq_membros[membro];
    
    // Verifica se o membro existe
    if (!info) {
        console.error(`Membro ${membro} não encontrado.`);
        return; // Sai da função se o membro não existir
    }

    // Preencher os dados no overlay
    document.getElementById("fotoM_overlay").src = info.url_img;
    document.getElementById("nomeM_overlay").innerText = info.nome;
    document.getElementById("devM_overlay").innerText = info.dev;
    document.getElementById("plaM_overlay").innerText = info.pla;

    // Quebra linha dos nomes do overlay
    const paragrafo = document.getElementById('nomeM_overlay');
    paragrafo.innerHTML = paragrafo.innerText.split(' ').join('<br>');

    // Preencher lista de dev
    const listaDev = document.getElementById("lista_dev");
    listaDev.innerHTML = ""; // Limpa a lista antes de adicionar
    info.lista_dev.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        listaDev.appendChild(li);
    });

    // Preencher lista de planejamento
    const listaPla = document.getElementById("lista_pla");
    listaPla.innerHTML = ""; // Limpa a lista antes de adicionar
    info.lista_pla.forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        listaPla.appendChild(li);
    });

    // Preencher links sociais
    document.getElementById("linkedin_memb").href = info.linkedin.href;
    document.getElementById("linkedin_memb").innerText = info.linkedin.text;

    document.getElementById("github_memb").href = info.github.href;
    document.getElementById("github_memb").innerText = info.github.text;

    document.getElementById("email_memb").href = info.email.href;
    document.getElementById("email_memb").innerText = info.email.text;

    // Abrir o overlay
    toggleOverlay();
}

// Limpa os dados no overlay
function clearOverlay() {
    // Limpa textos
    document.getElementById("nomeM_overlay").innerText = "";
    document.getElementById("devM_overlay").innerText = "";
    document.getElementById("plaM_overlay").innerText = "";
    document.getElementById("fotoM_overlay").src = ""; // Limpa a imagem

    // Limpa lista de dev
    const listaDev = document.getElementById("lista_dev");
    listaDev.innerHTML = ""; // Limpa a lista

    // Limpa lista de planejamento
    const listaPla = document.getElementById("lista_pla");
    listaPla.innerHTML = ""; // Limpa a lista

    // Limpa links sociais
    document.getElementById("linkedin_memb").href = "#";
    document.getElementById("linkedin_memb").innerText = "";

    document.getElementById("github_memb").href = "#";
    document.getElementById("github_memb").innerText = "";

    document.getElementById("email_memb").href = "#";
    document.getElementById("email_memb").innerText = "";
}


// Função para abrir e fechar o Overlay
function toggleOverlay() {
    const overlay = document.getElementById('membro_overlay');
    
    if (overlay.style.display === "none" || overlay.style.display === "") {
        overlay.style.display = "flex"; // Abre o overlay
        console.log("Overlay de Membro Aberta");
    } else {
        overlay.style.display = "none"; // Fecha o overlay
        clearOverlay()
        console.log("Overlay de Membro Fechada");
    }
}

// Fecha o overlay ao clicar na parte preta
document.getElementById('membro_overlay').onclick = function() {
    this.style.display = "none"; // Fecha o overlay
    clearOverlay()
    console.log("Overlay de Membro Fechada");
};

//Funcao para Copiar o Email
let popupActive = false; // Variável para rastrear o estado do popup

function copyEmail(event) {
    event.preventDefault(); // Evita o comportamento padrão do link
    
    // Verifica se o popup já está ativo
    if (popupActive) return; 

    const email = document.getElementById('email_memb').innerText;

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
    popup.style.display = 'block';
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

// ------------------------- Novos

// Função da Tela de Loading

let tempo_loading_page = 500; // 500 milisegundos

window.loading_page = function() {
    const tela_load = document.getElementById("loading_container");
    const barra_preenchida = document.getElementById("loading_bar_fill");

    tela_load.style.display = "flex";
    document.body.style.overflow = "hidden";

    let startTime = Date.now();
    let interval = setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        let progressPercentage = Math.min((elapsedTime / tempo_loading_page) * 100, 100);
        barra_preenchida.style.width = progressPercentage + "%";

        if (elapsedTime >= tempo_loading_page) {
            clearInterval(interval);
            tela_load.style.display = "none";
            document.body.style.overflow = "";
        }
    }, 1);
}

// Funções Auto-Executaveis

window.onload = () => {
    setTimeout(() => {
        let ultimaTela = localStorage.getItem('ultimaTela') || "inicio";
        console.log("⚙ Primeira", ultimaTela);
        callScreen(ultimaTela);
    }, tempo_loading_page);
};

// Adiciona um ouvinte para o evento hashchange
window.onhashchange = function() {
    const hash = window.location.hash.replace('#', ''); // Remove o "#" do hash
    callScreen(hash);
};

// // Inicializa a tela correta ao carregar a página com base no hash atual
// if (window.location.hash) {
//     const hash = window.location.hash.replace('#', '');
//     callScreen(hash);
// }