// | Nunca escolheu NADA = 0
// | Escolheu Modo claro = 1 
// | Escolheu Modo escuro = 2
// | Escolheu SEMPRE pegar o tema do dispositivo = 3

// verifica se é "True" ou "False". Sintaxe:
// variavel = condição ? valor_se_verdadeiro : valor_se_falso

// Função para detectar e aplicar o tema preferido do dispositivo
function detectarPreferido_ColorScheme() {
    // Pega o tema salvo no local storage, em 0, 1, 2 ou 3 caso nenhum é "null"
    let temaSalvo = localStorage.getItem('situacaoTema');

    // Se não houver tema salvo, inicializa como 'n_escolheu'
    if (temaSalvo === null) {
        tema = 'n_escolheu';
        localStorage.setItem('situacaoTema', tema);
        temaSalvo = localStorage.getItem('situacaoTema');
    }

    if (temaSalvo === 'n_escolheu') {
        tema = "n_escolheu";
    } else if (temaSalvo === 'device') {
        tema = "device";
    } else if (temaSalvo === 'light') {
        tema = "light";
    } else if (temaSalvo === 'dark') {
        tema = "dark";
    }

    aplicarTema(tema);
}

function aplicarTemaLight() {
    // Icones de Sol e Lua
    const iconLight = document.querySelector(".t_light");
    const iconDark = document.querySelector(".t_dark");

    // console.log("Icon Light:", iconLight);
    // console.log("Icon Dark:", iconDark);

    if (iconLight && iconDark) {
        iconLight.style.opacity = 1;
        iconDark.style.opacity = 0;
    } else {
        console.error("Elementos do tema não encontrados");
    }
}

function aplicarTemaDark() {
    // Icones de Sol e Lua
    const iconLight = document.querySelector(".t_light");
    const iconDark = document.querySelector(".t_dark");

    // console.log("Icon Light:", iconLight);
    // console.log("Icon Dark:", iconDark);

    if (iconLight && iconDark) {
        iconLight.style.opacity = 0;
        iconDark.style.opacity = 1;
    } else {
        console.error("Elementos do tema não encontrados");
    }
}

function uptadeCheck_tema(tema) {
    // Atualiza o CHECK no Pop-up de Tema
    let todosCheck_tema = document.querySelectorAll(".tema_check");

    // Faça todos os checks invisíveis
    todosCheck_tema.forEach(check => {
        check.style.visibility = "hidden"; // Torna todos invisíveis
    });

    // Uma forma de fazer um Check bom
    // Se for "n_escolheu", o temaSet vai ser "device"
    // Não existe um check para "n_escolheu"
    if (tema === "n_escolheu") {temaSet = "device"}
    else {temaSet = tema}
    
    // Torne o check correspondente visível
    const unicoCheck_tema = document.getElementById(`tema_check--${temaSet}`);
    if (unicoCheck_tema) {
        unicoCheck_tema.style.visibility = "visible"; // Torna o específico visível
    }
}

// Função para aplicar o tema com base no valor de situacao_tema
function aplicarTema(tema) {

    console.log("✔ Aplicando tema:", tema); // Verifica se a função é chamada corretamente

    // Verifica se o tema preferido é "dark";
    // Pega ele direto do dispositivo;
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

    console.log("🎈 O tema atual é: ", tema)

    uptadeCheck_tema(tema)

    // Aplicação do tema baseado na situação

    // verifica se é "True" ou "False". Sintaxe:
    // variavel = condição ? valor_se_verdadeiro : valor_se_falso
    situacao_tema = prefersDarkScheme ? 'escuro' : 'claro';

    if (tema === "device" || tema === "n_escolheu") {
        if (situacao_tema === 'claro') {
            aplicarTemaLight();
        } else if (situacao_tema === 'escuro') {
            aplicarTemaDark();
        }
    } else { 
        if (tema === 'light') {
            aplicarTemaLight();
        } else if (tema === 'dark') {
            aplicarTemaDark();
        }
    }

    // Guarda no Armazenamento Local a Situação do Tema
    localStorage.setItem('situacaoTema', tema);

    closePopup_tema();
}

// async function appendInList_tema() {
    
// }

// function toggleList_tema(element) {
//     // Define a formação padrão dos Botões e das Sessão
//     const formatDefault_btn = "confOptions_btn-"
//     const formatDefault_sec = "lang_Options_list-"
//     // Captura a Categoria, de acordo com o ID do 'element'
//     const secCateg = element.id.split("-")[1]; // Pega o texto depois do 1° "-" do ID
//     // Pega o ID apenas dos Botões e das Sessão, usando a formatação e o ID da Categoria
//     const btnID = document.getElementById(`${formatDefault_btn}${secCateg}`)
//     const secID = document.getElementById(`${formatDefault_sec}${secCateg}`)
//     // Para cada Botão e Sessão, remove as Classes de "ativam" elas
//     all_btn_confOptions.forEach(btn => {
//         btn.classList.remove(class_btn_active)
//     })
//     all_sec_confOptions.forEach(sec => {
//         sec.classList.remove(class_sec_active)
//     })
//     // Define as Classes, apenas para o Botão e Sessão que se encaixam
//     btnID.classList.add(class_btn_active)
//     secID.classList.add(class_sec_active)
// }

// const all_secOption_btn = document.querySelectorAll("confOptions_secOption_btn")
// all_secOption_btn.forEach(btn => {
//     btn.addEventListener("click", (event) => {
//         toggleList_tema(event.currentTarget);
//     });
// });

// Funções auto-executaveis

// appendInList_tema()