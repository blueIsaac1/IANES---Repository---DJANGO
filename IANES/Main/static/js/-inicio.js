// Função para atualizar os blocos de notas (alterar o z-index)
function updateBlocoNotas(categoria) {

    // Seleciona todos os elementos com a classe 'maisIARE_blocoNotas_categoria'
    const containers_notas = document.querySelectorAll('.maisIARE_blocoNotas_categoria');
    const containers_titulos = document.querySelectorAll('.maisIARE_blocoNotas_titulo');
    const containers_boxs = document.querySelectorAll('.maisIARE_blocoNotas_box');

    // Selecionando os containers usando o id
    const container_notas = document.querySelector(`#blocoNotas-categoria-${categoria}`);
    const container_titulo = document.querySelector(`#blocoNotas-categoria-tit-${categoria}`);
    const container_box = document.querySelector(`#blocoNotas-categoria-box-${categoria}`);

    // Itera sobre cada container
    containers_notas.forEach(container => {
        container.style.zIndex = 40;
    });

    // Itera sobre cada container
    containers_titulos.forEach(titulo => {
        titulo.style.alignItems = "flex-start";
    });

    // Itera sobre cada container
    containers_boxs.forEach(box => {
        box.style.display = "none";
    });

    // Altera os estilos do container correspondente
    if (container_notas) {
        container_notas.style.zIndex = "41";
    }
    if (container_titulo) {
        container_titulo.style.alignItems = "flex-end";
    }
    if (container_box) {
        container_box.style.display = "flex";
    }
}
