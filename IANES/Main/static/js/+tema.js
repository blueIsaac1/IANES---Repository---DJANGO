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
    console.log("Ativando : Tema Claro 🌞")

    // Atributos
    document.body.setAttribute("data-theme", "light");

    // Alterando :roots
    document.documentElement.style.setProperty('--color_tema-fundo-tema', 'var(--color-fundo-claro)');
    document.documentElement.style.setProperty('--color_tema-cinza-hover-bg', 'var(--color-cinza_hover_bg_light)');
    document.documentElement.style.setProperty('--color_tema-text_1', 'var(--color-full-black)');
    document.documentElement.style.setProperty('--color_tema-text_2', 'var(--color-full-white)');
    document.documentElement.style.setProperty('--color_tema-tooltip-bg', 'var(--color-azul-medio)');
    document.documentElement.style.setProperty('--color_tema-tp-text_1', 'var(--color-full-white)');
    document.documentElement.style.setProperty('--color_tema-btn-bg_1', 'var(--color-vermelho-medio)');
    document.documentElement.style.setProperty('--color_tema-btn-bg_2', 'var(--color-azul-medio)');
    document.documentElement.style.setProperty('--color_tema-btn-bg_alt', 'var(--color-vermelho-medio)');
    document.documentElement.style.setProperty('--color_tema-svg_1', 'var(--color-full-white)');
    document.documentElement.style.setProperty('--color_tema-fundo_1', 'var(--color-vermelho-medio)');
    document.documentElement.style.setProperty('--color_tema-fundo_2', 'var(--color-azul-medio)');
    document.documentElement.style.setProperty('--color_tema-text_c1', 'var(--color-vermelho-medio)');
    document.documentElement.style.setProperty('--color_tema-text_c2', 'var(--color-vermelho-main)');
    
    // --- Header
    
    // Seleciona todos os elementos <header> da página
    const headers = document.querySelectorAll('header');
    // Adiciona a classe desejada a cada header
    headers.forEach(header => {
        header.classList.add('tema_fundo_1', 'tema_borderBottomCinza');
    });
    
    // URL da Logo Preta
    let imgSrc_Header_ianes_black = "https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/3932a9bcb74c20bdb3c85f4d80c678a24184cef4/_midia/_logotipos/ianesLogo_PretaT.png"

    // Altera a do Header
    let imgId_header_ianes = document.getElementById("header_logo_img")
    if (imgId_header_ianes) {
        imgId_header_ianes.setAttribute("src", imgSrc_Header_ianes_black)
    }
    // Altera a do Início
    let imgId_inicio_ianes = document.getElementById("banner_logo_img")
    if (imgId_inicio_ianes) {
        imgId_inicio_ianes.setAttribute("src", imgSrc_Header_ianes_black)
    }

    // --- Configurações
}

function aplicarTemaDark() {
    console.log("Ativando : Tema Escuro 🌙")
    
    // Atributos do Body
    document.body.setAttribute("data-theme", "dark");
    
    // Alterando :roots
    document.documentElement.style.setProperty('--color_tema-fundo-tema', 'var(--color-fundo-escuro)');
    document.documentElement.style.setProperty('--color_tema-cinza-hover-bg', 'var(--color-cinza_hover_bg_dark)');
    document.documentElement.style.setProperty('--color_tema-text_1', 'var(--color-full-white)');
    document.documentElement.style.setProperty('--color_tema-text_2', 'var(--color-full-black)');
    document.documentElement.style.setProperty('--color_tema-tooltip-bg', 'var(--color-vermelho-medio)');
    document.documentElement.style.setProperty('--color_tema-tp-text_1', 'var(--color-full-white)');
    document.documentElement.style.setProperty('--color_tema-btn-bg_1', 'var(--color-azul-medio)');
    document.documentElement.style.setProperty('--color_tema-btn-bg_2', 'var(--color-vermelho-medio)');
    document.documentElement.style.setProperty('--color_tema-btn-bg_alt', 'var(--color-azul-bruto)');
    document.documentElement.style.setProperty('--color_tema-svg_1', 'var(--color-full-white)');
    document.documentElement.style.setProperty('--color_tema-fundo_1', 'var(--color-azul-medio)');
    document.documentElement.style.setProperty('--color_tema-fundo_2', 'var(--color-vermelho-medio)');
    document.documentElement.style.setProperty('--color_tema-text_c1', 'var(--color-azul-medio)');
    document.documentElement.style.setProperty('--color_tema-text_c2', 'var(--color-azul-bruto)');

    // --- Header
    
    // Seleciona todos os elementos <header> da página
    const headers = document.querySelectorAll('header');
    // Adiciona a classe desejada a cada header
    headers.forEach(header => {
        header.classList.add('tema_fundo_1', 'tema_borderBottomCinza');
    });
    
    // URL da Logo Branca
    let imgSrc_Header_ianes_white = "https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/3932a9bcb74c20bdb3c85f4d80c678a24184cef4/_midia/_logotipos/ianesLogo_BrancaT.png"

    // Altera a do Header
    let imgId_header_ianes = document.getElementById("header_logo_img")
    if (imgId_header_ianes) {
        imgId_header_ianes.setAttribute("src", imgSrc_Header_ianes_white)
    } 
    // Altera a do Início
    let imgId_inicio_ianes = document.getElementById("banner_logo_img")
    if (imgId_inicio_ianes) {
        imgId_inicio_ianes.setAttribute("src", imgSrc_Header_ianes_white)
    }
}

async function uptadeCheck_tema(tema) {
    // --- Atualiza o CHECK do Tema
    let todosCheck_tema = document.querySelectorAll(".tema_check");
    let class_check_tema = "tema_check_active"
    
    // Faça todos os checks invisíveis
    todosCheck_tema.forEach(check => {
        check.classList.remove(class_check_tema)
    });
    
    // Uma forma de fazer um Check bom
    // Se for "n_escolheu", o temaSet vai ser "device"
    // Não existe um check para "n_escolheu"
    if (tema === "n_escolheu") {temaSet = "device"}
    else {temaSet = tema}
    
    // Torne o check correspondente visível
    let unicoCheck_tema = document.getElementById(`tema_check-${temaSet}`)
    if (unicoCheck_tema) {
        unicoCheck_tema.classList.add(class_check_tema)
    }

    // --- Atualiza o Texto e Ícone do Tema Atual
    // Carregar arquivosTema necessários usando findRequiredFiles
    const arquivosTema = await findRequiredFiles();
    if (!arquivosTema || !arquivosTema.temasDisponiveis) {
        console.error("Temas disponíveis não foram carregados.");
        return;
    }

    let temasDisponiveis = arquivosTema.temasDisponiveis;

    // --- Atualiza o Texto e Ícone do Tema Atual
    let temaInfo = temasDisponiveis[temaSet];
    if (temaInfo) {
        let { iconType, tema_p_text } = temaInfo;

        // Atualizar ícone
        let temaIconAtual = document.getElementById("temaAtual_Icon");
        if (temaIconAtual) {
            temaIconAtual.setAttribute("name", iconType);
        }

        // Atualizar texto
        let temaTextoAtual = document.getElementById("texto_header_confSec-tema_atual");
        if (temaTextoAtual) {
            temaTextoAtual.textContent = tema_p_text;
            temaTextoAtual.setAttribute('aria-tema-atual', tema_p_text)
        }
    } else {
        console.warn(`Informações para o tema "${temaSet}" não foram encontradas.`);
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
}

// Escutar TODOS os BTNs de trocar Tema
function listenBtn_tema() {
    // Selecionar todos os itens da lista de temas
    const all_btn_toggleTema = document.querySelectorAll("#tema_Options_list_i");
    
    // Adicionar evento de clique para cada botão
    all_btn_toggleTema.forEach(btn => {
        btn.addEventListener("click", () => {
            // Obter o tema do atributo 'aria-tema-selector'
            let tema = btn.getAttribute("aria-tema-selector");

            // Chamar a função para aplicar o tema
            aplicarTema(tema);
        });
    });
}

// Funções auto-executaveis