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
window.addEventListener("scroll", header_assistente("6vw"))