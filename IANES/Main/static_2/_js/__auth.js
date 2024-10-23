// Ajustar o tamanho vertical da pagina automaticamente
function ajustarTamanhoContainer() {
    const container = document.getElementById('corpoPagina');
    container.style.height = `${window.innerHeight}px`;
    container.style.width = `${window.innerWidth}px`;
}

// Adiciona um 'eventlistener' para ajustar a Tamanho quando a janela é redimensionada
// Pode ser um 'onresize="ajustarTamanhoContainer()"' no '<body></body>'
window.addEventListener('resize', ajustarTamanhoContainer);

// Inicia algumas funções ao carregar a página
window.onload = function() {
    ajustarTamanhoContainer();
}