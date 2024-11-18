// Função para detectar e aplicar o idioma preferido do dispositivo
function detectarPreferido_Idioma() {
    // Pega o idioma salvo no local storage, pode ser uma string como 'en', 'pt', etc.
    let idiomaSalvo = localStorage.getItem('situacaoIdioma');

    // Se não houver idioma salvo, inicializa como 'n_escolheu'
    if (idiomaSalvo === null) {
        lang = 'n_escolheu';
        localStorage.setItem('situacaoIdioma', lang);
        idiomaSalvo = localStorage.getItem('situacaoIdioma');
    }

    if (idiomaSalvo === 'n_escolheu') {
        lang = "n_escolheu"
    } else if (idiomaSalvo === 'device') {
        lang = "device"
    } else if (idiomaSalvo === 'pt-BR') {
        lang = "pt-BR"
    } else if (idiomaSalvo === 'pt') {
        lang = "pt"
    } else if (idiomaSalvo === 'en-US') {
        lang = "en-US"
    } else if (idiomaSalvo === 'fr') {
        lang = "fr"
    }

    aplicarIdioma(lang);
}

// Função que altera todos os textos
function alterarTextos_geral(messages) {
    
    // Seção que altera algumas coisas Gerais
    let secao_geral = 'geral';
    
    // Obtendo o nome da página atual
    const currentPage = window.location.pathname.split('/').pop();
    
    // Definindo o novo título com base na página
    let novoTitulo;
    switch (currentPage) {
        case 'auth.html':
            novoTitulo = messages[secao_geral][0]['page_title_auth'];
            break;
        case 'pagina_ia.html':
            novoTitulo = messages[secao_geral][0]['page_title_pageIA'];
            break;
        case 'index.html':
            novoTitulo = messages[secao_geral][0]['page_title_inicio'];
            break;
        case 'sobre.html':
            novoTitulo = messages[secao_geral][0]['page_title_sobre'];
            break;
        default:
            console.log('Página não reconhecida. Título não alterado.');
            return; // Para não alterar o título se a página não for reconhecida
    }
    
    // Altera o título da página
    document.title = novoTitulo;


    // Seção que altera o Cabeçalho
    let secao_navbar = 'navbar';
    let texto1_navbar = 'tooltip_logo';
    let texto2_navbar = 'tooltip_mudaridioma';
    let texto3_navbar = 'tooltip_mudartema';

    const novoTexto1_navbar = messages[secao_navbar][0][texto1_navbar];
    const novotexto2_navbar = messages[secao_navbar][0][texto2_navbar];
    const novotexto3_navbar = messages[secao_navbar][0][texto3_navbar];

    if (document.getElementById("tooltip_logo")) {
        document.getElementById("tooltip_logo").textContent = novoTexto1_navbar;
    }
    if (document.getElementById("tooltip_mudaridioma")) {
        document.getElementById("tooltip_mudaridioma").textContent = novotexto2_navbar;
    }
    if (document.getElementById("tooltip_mudartema")) {
        document.getElementById("tooltip_mudartema").textContent = novotexto3_navbar;
    }

    // Seção que altera o Rodapé
    let secao_footer = 'footer';
    let texto1_footer = 'copyright';
    let texto2_footer = 'company_info';
    let texto3_footer = 'policy_privacy';
    let texto4_footer = 'terms_conditions';

    const novoTexto1_footer = messages[secao_footer][0][texto1_footer];
    const novoTexto2_footer = messages[secao_footer][0][texto2_footer];
    const novoTexto3_footer = messages[secao_footer][0][texto3_footer];
    const novoTexto4_footer = messages[secao_footer][0][texto4_footer];

    if (document.getElementById("copyright")) {
        document.getElementById("copyright").textContent = novoTexto1_footer;
    }
    if (document.getElementById("company_info")) {
        document.getElementById("company_info").textContent = novoTexto2_footer;
    }
    if (document.getElementById("policy_privacy")) {
        document.getElementById("policy_privacy").textContent = novoTexto3_footer;
    }
    if (document.getElementById("terms_conditions")) {
        document.getElementById("terms_conditions").textContent = novoTexto4_footer;
    }
}

function alterarTextos_auth(messages) {
    console.log("☎ Chamou Texto Autenticação")
}

function alterarTextos_index(messages) {
    console.log("☎ Chamou Texto Index")
}

function alterarTextos_paginaIA(messages) {
    console.log("☎ Chamou Texto PaginaIA")
}

// Função para Aplicar o Check
async function uptadeCheck_lang(lang) {
    // --- Atualiza o CHECK do Idioma
    let todosCheck_lang = document.querySelectorAll(".lang_check");
    let class_check_lang = "lang_check_active"
    
    // Faça todos os checks invisíveis
    todosCheck_lang.forEach(check => {
        check.classList.remove(class_check_lang)
    });

    // Uma forma de fazer um Check bom
    // Se for "n_escolheu", o langSet vai ser "device"
    // Não existe um check para "n_escolheu"
    if (lang === "n_escolheu") {langSet_check = "device"}
    else {langSet_check = lang}

   // Torne o check correspondente visível
   let unicoCheck_lang = document.getElementById(`lang_check-${langSet_check}`)
   if (unicoCheck_lang) {
       unicoCheck_lang.classList.add(class_check_lang)
   }

       // --- Atualiza o Texto e Ícone do Idioma Atual
    // Carregar arquivosLang necessários usando findRequiredFiles
    const arquivosLang = await findRequiredFiles();
    if (!arquivosLang || !arquivosLang.langsDisponiveis) {
        console.error("Idiomas disponíveis não foram carregados.");
        return;
    }

    let langsDisponiveis = arquivosLang.langsDisponiveis;
    
    // --- Atualiza o Texto e Ícone do Idioma Atual
    let langInfo = langsDisponiveis[langSet_check];
    if (langInfo) {
        let { srcFlag, lang_p_text, has_botTalk } = langInfo;

        // Atualizar ícone
        let langFlagAtual = document.getElementById("langAtual_Flag");
        if (langFlagAtual) {
            langFlagAtual.setAttribute("src", srcFlag);
            langFlagAtual.setAttribute("alt", `LangFlagAtual ${langSet_check}`);
        }

        // Atualizar texto
        let langTextoAtual = document.getElementById("texto_header_confSec-lang_atual");
        if (langTextoAtual) {
            langTextoAtual.textContent = lang_p_text;
            langTextoAtual.setAttribute("aria-tema-atual", lang_p_text);
        }

        // Exemplo: usar `has_botTalk` para lógica adicional
        let botTalkAtual = document.getElementById("langBotTalk_Atual");
        let class_botTalkAtual = "botTalk_Yes_Atual";
        if (has_botTalk) {
            botTalkAtual.classList.add(class_botTalkAtual)
        } else {
            botTalkAtual.classList.remove(class_botTalkAtual)
        }

    } else {
        console.warn(`Informações para o idioma "${langSet_check}" não foram encontradas.`);
    }
}

// Função para aplicar o idioma
async function aplicarIdioma(lang) {

    console.log("✔ Aplicando idioma:", lang); // Verifica se a função é chamada corretamente

    // Detecta o idioma preferido do navegador
    const prefersLanguage = navigator.language || navigator.userLanguage;

    // Filtro
    if (lang === "device" || lang === "n_escolheu") {langSet_langID = prefersLanguage}
    else {langSet_langID = lang}

    // Define o atributo 'lang' no elemento <html>
    document.documentElement.lang = langSet_langID;

    // Coloca um "#" na URL, para identificar
    // window.location.hash = langSet_langID;

    // !!! TA BUGADO - CUIDADO
    // Define a linguagem usando uma query string
    // window.location.search = `?lang=${langSet_langID}`;

    // !!! ESSE ALTERA O CAMINHO - NAO RECOMENDO
    // Define a linguagem usando path variables
    // const currentUrl = window.location.href.split('/').slice(0, -1).join('/') + `/${langSet_langID}.html`;
    // window.location.href = currentUrl;

    // // Define a linguagem usando um fragmento
    // window.location.hash = `lang=${langSet_langID}`;

    console.log("🎈 O idioma atual é: ", lang)

    uptadeCheck_lang(lang)

    // Re-Verificação, se lang for "n_escolheu" ou "device"
    // Ele pega a Language Preferida do Navegador
    if (lang === "device" || lang === "n_escolheu") {langSet_arq = prefersLanguage}
    else {langSet_arq = lang}

    // Carrega o arquivo JSON do idioma selecionado
    try {
        const response = await fetch(`../static/page_languages/lang_${langSet_arq}.json`);
        if (!response.ok) throw new Error(`Falha ao carregar traduções: ${langSet_arq}`);
        
        const arq_messages = await response.json();

        alterarTextos_geral(arq_messages);
        alterarTextos_auth(arq_messages);
        alterarTextos_index(arq_messages);
        alterarTextos_paginaIA(arq_messages);

    } catch (error) {
        console.error('Erro ao carregar o arquivo de linguagens:', error);
    }

    // Guarda no Armazenamento Local a Situação do Idioma
    localStorage.setItem('situacaoIdioma', lang);
}

// Escutar TODOS os BTNs de trocar Idioma
function listenBtn_lang() {
    // Selecionar todos os itens da lista de idiomas
    const all_btn_toggleLang = document.querySelectorAll("#lang_Options_list_i");

    // Adicionar evento de clique para cada botão
    all_btn_toggleLang.forEach(btn => {
        btn.addEventListener("click", () => {
            // Obter o lang do atributo 'aria-lang-selector'
            let lang = btn.getAttribute("aria-lang-selector");

            // Chamar a função para aplicar o lang
            aplicarIdioma(lang);
        });
    });
}

// Funções auto-executaveis