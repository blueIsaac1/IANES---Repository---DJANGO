// Variaveis Globais
const overlay_config = document.getElementById('config_overlay');
const fecharOverlay_config = document.getElementById("fecharOverlay_config");
const overlayContainer_config = document.getElementById("ovConfig_container")

const btn_config = document.getElementById("config_ovConfig_btn");
const userDiv_btn = document.getElementById("user_div");
const userDiv_container = document.getElementById("user_container");

const tp_user_clickOpen = document.getElementById("tooltip_user_clickOpen");
const tp_user_clickClose = document.getElementById("tooltip_user_clickClose");

const all_btn_confOptions = document.querySelectorAll(".confOptions_btn");
const all_sec_confOptions = document.querySelectorAll(".confOptions_sec");

// Classes
let class_btn_active = "confOptions_btn_select"
let class_sec_active = "confOptions_sec_active"

// Função para calcular e aplicar o tamanho do header
function ajustarHeader() {
    const root = document.documentElement;
    const headerBot_size = parseFloat(getComputedStyle(root).getPropertyValue('--tamanho_header_bot'));
    const headerTop_size = parseFloat(getComputedStyle(root).getPropertyValue('--tamanho_header_top'));
    let tamanhoHeader;
    
    // Verificar se é a página index
    const headerBot = document.getElementById("header_bot")
    const headerBot_size_pageValue = headerBot ? headerBot.getAttribute("aria-page-value") : null;

    if (headerBot_size_pageValue === "index") {
        tamanhoHeader = headerBot_size + headerTop_size;
    } else {
        tamanhoHeader = headerTop_size;
    }

    // Atualizar a variável CSS do header
    root.style.setProperty('--tamanho_header', `${tamanhoHeader}vw`);
    return `${tamanhoHeader}vw`;
}

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

// Função para alternar a exibição do overlay
function toggleOverlay_config() {
    toggleList(null)
    let overlayState = overlay_config.getAttribute("aria-active");

    if (overlayState === "true") {
        overlay_config.style.display = "none";
        overlay_config.setAttribute("aria-active", "false");
        document.body.style.overflowY = "auto";
        overlayContainer_config.classList.remove("ovConfig_container_active");
    } else if (overlayState === "false") {
        overlay_config.style.display = "flex";
        overlay_config.setAttribute("aria-active", "true");
        document.body.style.overflowY = "hidden";
        overlayContainer_config.classList.add("ovConfig_container_active");
    } else {return}
}

// Função para abrir o Container de Perfil
function toggleContainer_user() {
    let containerState = userDiv_btn.getAttribute("aria-active");

    // Mostra o Container
    // Esconde o Container
    if (containerState === "true") {
        userDiv_btn.setAttribute("aria-active", "false");
        userDiv_container.classList.remove("user_container_active");
        tp_user_clickClose.classList.add("tooltip_user_hide")
        tp_user_clickOpen.classList.remove("tooltip_user_hide")
    } else if (containerState === "false") {
        userDiv_btn.setAttribute("aria-active", "true");
        userDiv_container.classList.add("user_container_active");
        tp_user_clickClose.classList.remove("tooltip_user_hide")
        tp_user_clickOpen.classList.add("tooltip_user_hide")
    } else {return}
}

// Função para trocar as Telas das Configurações
function switchConfigSection(element) {
    toggleList(null)
    // Define a formação padrão dos Botões e das Sessão
    const formatDefault_cs_btn = "confOptions_btn-"
    const formatDefault_cs_sec = "confOptions_sec-"
    // Captura a Categoria, de acordo com o ID do 'element'
    const secCateg = element.id.split("-")[1]; // Pega o texto depois do 1° "-" do ID
    // Pega o ID apenas dos Botões e das Sessão, usando a formatação e o ID da Categoria
    const btnID = document.getElementById(`${formatDefault_cs_btn}${secCateg}`)
    const secID = document.getElementById(`${formatDefault_cs_sec}${secCateg}`)
    // Para cada Botão e Sessão, remove as Classes de "ativam" elas
    all_btn_confOptions.forEach(btn => {
        btn.classList.remove(class_btn_active)
    })
    all_sec_confOptions.forEach(sec => {
        sec.classList.remove(class_sec_active)
    })
    // Define as Classes, apenas para o Botão e Sessão que se encaixam
    btnID.classList.add(class_btn_active)
    secID.classList.add(class_sec_active)
}

// Função para atualizar os botTalks que têm aria-has-bot="true"
function updateBotTalks() {
    // Seleciona todos os elementos com a classe 'botTalk'
    const botTalkImgs = document.querySelectorAll('.botTalk');
    
    botTalkImgs.forEach(element => {
        // Acessa o atributo 'aria-has-bot' de cada elemento
        const hasBot = element.getAttribute('aria-has-bot');
        
        // Verifica se o valor de 'aria-has-bot' é 'true' e atualiza o src e a classe
        if (hasBot === 'true') {
            element.src = 'https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/1b0a81c63dd7522aa041fade75030d023c5ed11e/_midia/png_icons/icon_ianesTalk.png';
            element.classList.add('botTalk_Yes');
        }
    });
}

// Função que preenche a lista de idiomas com base no JSON
function appendInList_lang(arq_langDisp) {
    // Referência ao container da lista (sem limpar o conteúdo atual)
    const langListContainer = document.getElementById('lang_Options_list');

    // Para cada idioma no JSON, cria o <li> correspondente
    Object.keys(arq_langDisp).forEach(langCode => {
        const langData = arq_langDisp[langCode];

        // Cria o elemento <li>
        const li = document.createElement('li');
        li.id = `lang_Options_list_i`;
        li.classList.add(`options_list_i`)
        li.setAttribute(`aria-lang-selector`, `${langCode}`)

        // Cria o div do BotTalk e adiciona o atributo aria-has-bot
        const botTalkDiv = document.createElement('div');
        botTalkDiv.classList.add('optionsList_botTalk_div');
        const botTalkImg = document.createElement('img');
        botTalkImg.classList.add('botTalk');
        botTalkImg.id = 'langBotTalk';
        botTalkImg.alt = `Icon IAnesTalk}`;
        botTalkImg.style.maxWidth = '2vw'
        botTalkImg.style.maxHeight = 'auto'
        // Define o valor de aria-has-bot conforme langData.has_botTalk
        botTalkImg.setAttribute('aria-has-bot', langData.has_botTalk ? 'true' : 'false');
        botTalkDiv.appendChild(botTalkImg);
        
        // Cria o div da Bandeira
        const flagDiv = document.createElement('div');
        flagDiv.classList.add('optionsList_flag_div');
        const flagImg = document.createElement('img');
        flagImg.classList.add('langFlag');
        flagImg.src = langData.srcFlag;  // URL da bandeira do JSON
        flagImg.alt = `LangFlag ${langCode}`;  // Adicionando o alt correto
        flagImg.style.maxWidth = '2vw'
        flagImg.style.maxHeight = 'auto'
        flagDiv.appendChild(flagImg);

        // Cria o div do nome do idioma
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('optionsList_p_div');
        const nameP = document.createElement('p');
        nameP.classList.add('langOptionsList_p');
        nameP.id = `lang_${langCode}_p`;
        nameP.textContent = langData.lang_p_text;  // Texto do nome do idioma do JSON
        nameDiv.appendChild(nameP);

        // Cria o div do ícone de verificação
        const checkDiv = document.createElement('div');
        checkDiv.classList.add('optionsList_check_div');
        const checkIcon = document.createElement('ion-icon');
        checkIcon.classList.add('check_icon');
        checkIcon.name = 'checkmark-outline';
        checkIcon.id = `lang_check-${langCode}`
        checkDiv.appendChild(checkIcon);

        // Adiciona os elementos ao <li>
        li.appendChild(botTalkDiv);
        li.appendChild(flagDiv);
        li.appendChild(nameDiv);
        li.appendChild(checkDiv);

        // Adiciona o <li> ao container de idiomas
        langListContainer.appendChild(li);
    });

    // Atualiza os botTalks, se necessário
    updateBotTalks();
}

// Adiciona os Itens de Tema
function appendInList_tema(arq_temaDisp) {
    // Referência ao container da lista (sem limpar o conteúdo atual)
    const temaListContainer = document.getElementById('tema_Options_list');

    // Para cada idioma no JSON, cria o <li> correspondente
    Object.keys(arq_temaDisp).forEach(temaCode => {
        const temaData = arq_temaDisp[temaCode];

        // Cria o elemento <li>
        const li = document.createElement('li');
        li.id = `tema_Options_list_i`;
        li.classList.add(`options_list_i`)
        li.setAttribute(`aria-tema-selector`, `${temaCode}`)

        // Cria o div do Icone
        const temaIconDiv = document.createElement('div');
        temaIconDiv.classList.add('optionsList_temaIcon_div');
        const temaIcon = document.createElement('ion-icon');
        temaIcon.classList.add('temaIcon');
        temaIcon.name = temaData.iconType
        temaIconDiv.appendChild(temaIcon);

        // Cria o div do nome do tema
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('optionsList_p_div');
        const nameP = document.createElement('p');
        nameP.classList.add('temaOptionsList_p');
        nameP.id = `tema_${temaCode}_p`;
        nameP.textContent = temaData.tema_p_text;  // Texto do nome do tema do JSON
        nameDiv.appendChild(nameP);

        // Cria o div do ícone de verificação
        const checkDiv = document.createElement('div');
        checkDiv.classList.add('optionsList_check_div');
        const checkIcon = document.createElement('ion-icon');
        checkIcon.classList.add('check_icon');
        checkIcon.name = 'checkmark-outline';
        checkIcon.id = `tema_check-${temaCode}`
        checkDiv.appendChild(checkIcon);

        // Adiciona os elementos ao <li>
        li.appendChild(temaIconDiv);
        li.appendChild(nameDiv);
        li.appendChild(checkDiv);

        // Adiciona o <li> ao container de idiomas
        temaListContainer.appendChild(li);
    });
}

// -- Mostra ou Esconde as lista suspensa, de acordo com o Clique
const all_secOption_btn = document.querySelectorAll(".confOptions_secOption_btn");
const all_secOption_lists = document.querySelectorAll(".options_list");
const all_secOption_arrows = document.querySelectorAll(".confSec_icon_arrow");
let class_option_active = "options_list_active";
let class_arrow_active = "confSec_icon_arrow_active";

// Função para Abrir ou fechar a Lista
function toggleList(element) {
    if (!element) {
        // Desativa todos os botões e listas
        all_secOption_btn.forEach(btn => {
            btn.setAttribute("aria-active", "false");
        });
        all_secOption_lists.forEach(list => {
            list.classList.remove(class_option_active);
        });
        return;
    }

    const formatDefault_lp_btn = "confOptions_secOption_btn-"; // Formato padrão do botão
    const formatDefault_lp_list = "_Options_list"; // Formato padrão da lista
    const formatDefault_lp_arrow = "confSec_icon_arrow-"; // Formato padrão da lista

    const listCateg = element.id.split("-")[1]; // Obtém a categoria (ex: lang, tema)
    const listID = document.getElementById(`${listCateg}${formatDefault_lp_list}`);
    const arrowID = document.getElementById(`${formatDefault_lp_arrow}${listCateg}`);
    const isActive = element.getAttribute("aria-active") === "true"; // Verifica o estado atual do botão

    // Desativa todos os botões e listas
    all_secOption_btn.forEach(btn => {
        btn.setAttribute("aria-active", "false");
    });
    all_secOption_lists.forEach(list => {
        list.classList.remove(class_option_active);
    });
    all_secOption_arrows.forEach(arrow => {
        arrow.classList.remove(class_arrow_active);
    });

    // Se já estiver ativo, desative-o
    if (isActive) {
        element.setAttribute("aria-active", "false");
        if (listID) {
            listID.classList.remove(class_option_active);
            arrowID.classList.remove(class_arrow_active);
        }
    } else {
        // Ative o botão e a lista correspondente
        element.setAttribute("aria-active", "true");
        if (listID) {
            listID.classList.add(class_option_active);
            arrowID.classList.add(class_arrow_active);
        }
    }
}

// Função para Forçar Fechar Listas Suspensas
function closeSuspendedList() {
    // Verifica se existe alguma lista ativa
    let hasActiveList = false;
    all_secOption_btn.forEach(btn => {
        if (btn.getAttribute("aria-active") === "true") {
            hasActiveList = true;
            btn.setAttribute("aria-active", "false");
        }
    });

    all_secOption_lists.forEach(list => {
        if (list.classList.contains(class_option_active)) {
            list.classList.remove(class_option_active);
        }
    });

    // Retorna se encontrou listas abertas
    return hasActiveList;
}

// Adiciona eventos de clique a todos os botões
all_secOption_btn.forEach(btn => {
    btn.addEventListener("click", (event) => {
        toggleList(event.currentTarget);
    });
});

// Funções auto-executaveis

// Ajustar header e iniciar função de cabeçalho assistente
let tamanho_topo = ajustarHeader();
window.addEventListener("scroll", header_assistente(tamanho_topo))

// Clique no botão "user_div" ou fora do container
userDiv_btn.addEventListener('click', (event) => {
    // Impede o fechamento do container "user_div" ao clicar no próprio botão
    event.stopPropagation();
    toggleContainer_user();
});

// Clique no botão "config_ovConfig_btn"
btn_config.addEventListener('click', (event) => {
    // Impede que o clique no "config_ovConfig_btn" feche o "user_div"
    event.stopPropagation();
    toggleOverlay_config();
});

// Clique no overlay ou no botão de fechar do overlay
overlay_config.addEventListener('click', (event) => {
    event.stopPropagation();

    // Fecha listas suspensas, se abertas
    const hadActiveList = closeSuspendedList();
    if (hadActiveList) return; // Sai se fechou listas

    toggleOverlay_config(); // Continua o comportamento normal
});

fecharOverlay_config.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleOverlay_config(); // Continua o comportamento normal
});

// Clique dentro do Container não faz nada, mas fecha listas abertas
overlayContainer_config.addEventListener('click', (event) => {
    event.stopPropagation();
});

document.addEventListener('click', (event) => {
    const userDiv_container = document.getElementById("user_container");
    const userDiv_btn_active = userDiv_btn.getAttribute("aria-active");

    // Verifica se o "userDiv_container" está visível e se o clique foi fora dele
    if (userDiv_container && userDiv_btn_active === "true" && !userDiv_container.contains(event.target) && event.target !== userDiv_btn) {
        console.log("3");
        toggleContainer_user();
    }
});

// Eventos para Abrir as lista suspensa das Configurações
all_btn_confOptions.forEach(btn => {
    btn.addEventListener("click", (event) => {
        switchConfigSection(event.currentTarget);
    });
});

// toggleContainer_user();
// toggleOverlay_config()