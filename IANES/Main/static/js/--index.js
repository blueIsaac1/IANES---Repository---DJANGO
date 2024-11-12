window.rolarPara = function(id) {
    if (id === "banner_maisIARE") {
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