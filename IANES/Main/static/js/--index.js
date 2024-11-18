// Função para rolar
window.rolarPara = function (id) {
    if (id === "banner_maisIARE") {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth' }); // Rolagem suave
        }
    } else if (id === "topo") {
        // Rolagem suave para o topo
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else if (id === "topo_screen") {
        // Rolagem direta para o topo
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    } else if (id === "lDown") {
        // Rola para baixo o equivalente à altura da janela
        window.scrollBy({
            top: 500,
            behavior: 'smooth'
        });
    }
};

// Ouvintes ao Scroll
document.addEventListener('scroll', function () {
    const bubble_goTop = document.getElementById('bubble_goTop');
    const bubble_moreAbove = document.getElementById('bubble_moreAbove');

    // Configurar o comportamento do "Voltar ao Topo"
    if (window.scrollY > 100) { // Exibir "Voltar ao Topo" se passar de 100px
        bubble_goTop.classList.add('show');
        bubble_moreAbove.classList.remove('show');
    } else { // Exibir "Role para mais" quando estiver no topo
        bubble_goTop.classList.remove('show');
        bubble_moreAbove.classList.add('show');
    }
});

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
        let tela
        let ultimaTela = localStorage.getItem('ultimaTela');
        if (ultimaTela === null) {
            tela = "inicio"
        } else {
            tela = ultimaTela
        }
        console.log("⚙ Primeira", tela);
        callScreen(tela);
    }, tempo_loading_page);
};

// Adiciona um ouvinte para o evento hashchange (Navegar com o Hash)
window.onhashchange = function() {
    const hash = window.location.hash.replace('#', ''); // Remove o "#" do hash
    callScreen(hash);
};

// Inicializa a tela correta ao carregar a página com base no hash atual
// if (window.location.hash) {
//     let hash = window.location.hash.replace('#', '');
//     callScreen(hash);
// }