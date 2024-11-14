// Obtendo os elementos necessários
const btns_trocar = document.querySelectorAll(".maisIARE_blocoNotas_cat_title");
const boxs_trocar = document.querySelectorAll(".maisIARE_blocoNotas_box");
const btn_trocar_classAtivo = "categ_select_tit";
const box_trocar_classAtivo = "categ_select_box";
let formatoBtn = "blocoNotas-categoria-cat-";
let formatoBox = "blocoNotas-categoria-box-";
let categoriaSelec;

// Função para alternar o bloco de notas
function alternarBlocoNotas(type, element) {
    let categoriaSelec;

    // Verifica se é um 'click' ou 'load'
    if (type == 'click') {
        categoriaSelec = element.id.split("-").slice(3).join("-");
    } else if (type == 'load') {
        // Para o carregamento da página, seleciona a primeira categoria por padrão
        categoriaSelec = "nenhuma"; // A categoria inicial é "nenhuma"
    } else {
        return; // Se o tipo não for reconhecido, retorna sem fazer nada
    }

    // Formatos para o ID
    let formatoBtn = "blocoNotas-categoria-cat-";
    let formatoBox = "blocoNotas-categoria-box-";

    // Selecionando o botão e a box que devem ser ativados
    let categoriaBtn_solo = null; // Inicializa como null
    if (categoriaSelec !== "nenhuma") {
        categoriaBtn_solo = document.getElementById(`${formatoBtn}${categoriaSelec}`);
    }
    let categoriaBox_solo = document.getElementById(`${formatoBox}${categoriaSelec}`);

    // Removendo as classes ativas de todos os botões e caixas
    btns_trocar.forEach(item => {
        item.classList.remove(btn_trocar_classAtivo);
    });
    boxs_trocar.forEach(item => {
        item.classList.remove(box_trocar_classAtivo);
    });

    // Adicionando as classes ativas ao botão e box selecionados
    if (categoriaBtn_solo) { // Só adiciona a classe se o botão realmente existir
        categoriaBtn_solo.classList.add(btn_trocar_classAtivo);
    }
    if (categoriaBox_solo) { // Sempre adiciona a classe à box
        categoriaBox_solo.classList.add(box_trocar_classAtivo);
    }
}

// Mostrando e Escondendo as tooltips
const tp_inicio = document.getElementById("tp_blocoNotas_clickExpand")
function showTp_inicio() {
    if (!tp_inicio) return
    tp_inicio.classList.add("tp_blocoNotas_clickExpand_active")
}
function hideTp_inicio() {
    if (!tp_inicio) return
    tp_inicio.classList.remove("tp_blocoNotas_clickExpand_active")
}

// Adicionando o evento de clique aos botões
document.addEventListener("DOMContentLoaded", function() {
    // Eventos que acionam e configuram o Bloco de Notas
    btns_trocar.forEach(element => {
        element.addEventListener("click", () => alternarBlocoNotas('click', element));
        element.addEventListener("mouseover", showTp_inicio);
        element.addEventListener("mouseout", hideTp_inicio);
    });
    // Chama a função de alternância para 'load' com a categoria inicial
    alternarBlocoNotas('load', null);
});