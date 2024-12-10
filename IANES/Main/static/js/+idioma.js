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

// Função genérica para atualizar o título com base na chave
async function atualizarTitulo(chave) {
    let secaoGeral = 'geral';
    let messages
    dataLang = document.body.getAttribute("data-lang")
    // Carrega o arquivo JSON do idioma selecionado
    try {
        const response = await fetch(`../static/page_languages/lang_${dataLang}.json`);
        if (!response.ok) throw new Error(`Falha ao carregar traduções: ${dataLang}`);
        
        messages = await response.json();

    } catch (error) {
        console.error('Erro ao carregar o arquivo de linguagens:', error);
    }

    if (messages[secaoGeral] && messages[secaoGeral][0]) {
        const texto = messages[secaoGeral][0];
        if (texto[chave]) {
            document.title = texto[chave];
            console.log(`Título atualizado para: ${texto[chave]}`);
        } else {
            console.error(`Chave "${chave}" não encontrada em "secaoGeral".`);
        }
    } else {
        console.error(`Seção "secaoGeral" não encontrada no messages.`);
    }
}

// Função que altera textos gerais (seções "geral" e "navbar")
async function alterarTextos_geral() {
    // Seções que serão processadas
    let secaoGeral = 'geral';
    let secaoNavbar = 'navbar';
    let secaoFooter = 'footer';
    dataLang = document.body.getAttribute("data-lang")

    let messages
    // Carrega o arquivo JSON do idioma selecionado
    try {
        const response = await fetch(`../static/page_languages/lang_${dataLang}.json`);
        if (!response.ok) throw new Error(`Falha ao carregar traduções: ${dataLang}`);
        
        messages = await response.json();

    } catch (error) {
        console.error('Erro ao carregar o arquivo de linguagens:', error);
    }

    // Pegar a URL da página atual e armazená-la no localStorage
    let janelaAtual = document.querySelector('body').getAttribute('aria-thisPage');
    let telaAtual_auth = localStorage.getItem('ls_ultimaTela_auth');
    let telaAtual_index = localStorage.getItem('ls_ultimaTela_index');

    console.log("🤣 Janela Atual: ", janelaAtual)
    console.log("🤣 Tela Auth Atual: ", telaAtual_auth)
    console.log("🤣 Tela Index Atual: ", telaAtual_index)

    // Processar a lógica de atualização do título
    if (janelaAtual === "auth" && telaAtual_auth != null) {
        if (telaAtual_auth === "ta_auth-login") {
            atualizarTitulo("page_title_auth_login");
        } else if (telaAtual_auth === "ta_auth-signup") {
            atualizarTitulo("page_title_auth_signup");
        }
    } else if (janelaAtual === "index" && telaAtual_auth != null) {
        if (telaAtual_auth === "inicio") {
            atualizarTitulo("page_title_index_inicio");
        } else if (telaAtual_auth === "sobre") {
            atualizarTitulo("page_title_index_sobre");
        }
    }

    // Processar as demais seções para atualizar os textos na página
    if (messages[secaoNavbar] && messages[secaoNavbar][0]) {
        const textos = messages[secaoNavbar][0];

        // Atualiza os elementos da página com IDs que correspondem às chaves do JSON
        for (let chave in textos) {
            const elemento = document.getElementById(chave);
            if (elemento) {
                elemento.textContent = textos[chave];
            } else {
                console.log("Elemento Nao Encontrado para traduzir: ", elemento, chave)
            }
        }
    }
    // Processar as demais seções para atualizar os textos na página
    if (messages[secaoFooter] && messages[secaoFooter][0]) {
        const textos = messages[secaoFooter][0];

        // Atualiza os elementos da página com IDs que correspondem às chaves do JSON
        for (let chave in textos) {
            const elemento = document.getElementById(chave);
            if (elemento) {
                elemento.textContent = textos[chave];
            } else {
                console.log("Elemento Nao Encontrado para traduzir: ", elemento, chave)
            }
        }
    }
}

// Função que altera textos de configurações (seção "config")
function alterarTextos_config(messages) {
    // Seção a ser processada
    let secao = 'config';

    if (messages[secao] && messages[secao][0]) {
        const textos = messages[secao][0];

        // Atualiza os elementos da página com IDs que correspondem às chaves do JSON
        for (let chave in textos) {
            const elemento = document.getElementById(chave);
            if (chave === "inProductionAlert") {
                tpOpcoes_all = document.querySelectorAll(".inProductionAlert")
                tpOpcoes_all.forEach(tp => {
                    tp.textContent = textos[chave];
                })
            }
            if (elemento) {
                elemento.textContent = textos[chave];
            } else {
                console.log("Elemento Nao Encontrado para traduzir: ", elemento, chave)
            }
        }
    }

    

}

function alterarTextos_auth(messages) {
    console.log("☎ Chamou Texto Autenticação")

    // Seção a ser processada
    let secao = 'auth';
    let auth_placeholder = 'auth_placeholder';

    if (messages[secao] && messages[secao][0]) {
        const textos = messages[secao][0];

        // Atualiza os elementos da página com IDs que correspondem às chaves do JSON
        for (let chave in textos) {
            const elemento = document.getElementById(chave);
            if (elemento) {
                elemento.textContent = textos[chave];
            } else {
                console.log("Elemento Nao Encontrado para traduzir: ", elemento, chave)
            }
        }
    }

    if (messages[auth_placeholder] && messages[auth_placeholder][0]) {
        const textos = messages[auth_placeholder][0];

        // Atualiza os elementos da página com IDs que correspondem às chaves do JSON
        for (let chave in textos) {
            const elemento = document.getElementById(chave);
            if (elemento) {
                elemento.setAttribute("placeholder", textos[chave]);
            } else {
                console.log("Elemento Nao Encontrado para traduzir: ", elemento, chave)
            }
        }
    }
}

function alterarTextos_index(messages) {
    console.log("☎ Chamou Texto Index")

    // Seção a ser processada
    let secao = 'index';

    if (messages[secao] && messages[secao][0]) {
        const textos = messages[secao][0];

        // Atualiza os elementos da página com IDs que correspondem às chaves do JSON
        for (let chave in textos) {
            const elemento = document.getElementById(chave);
            if (elemento) {
                elemento.textContent = textos[chave];
            } else {
                console.log("Elemento Nao Encontrado para traduzir: ", elemento, chave)
            }
        }
    }
}

function alterarTextos_paginaIA(messages) {
    console.log("☎ Chamou Texto PaginaIA")

    // Seção a ser processada
    let secao = 'PaginaIA';

    if (messages[secao] && messages[secao][0]) {
        const textos = messages[secao][0];

        // Atualiza os elementos da página com IDs que correspondem às chaves do JSON
        for (let chave in textos) {
            const elemento = document.getElementById(chave);
            if (chave === "tp_opcoes") {
                tpOpcoes_all = document.querySelectorAll(".tp_opcoes")
                tpOpcoes_all.forEach(tp => {
                    tp.textContent = textos[chave];
                })
            }
            if (chave === "tp_copiar") {
                tpOpcoes_all = document.querySelectorAll(".tp_copiar")
                tpOpcoes_all.forEach(tp => {
                    tp.textContent = textos[chave];
                })
            }
            if (chave === "tp_narrar") {
                tpOpcoes_all = document.querySelectorAll(".tp_narrar")
                tpOpcoes_all.forEach(tp => {
                    tp.textContent = textos[chave];
                })
            }
            if (chave === "rename_area") {
                tpOpcoes_all = document.querySelectorAll(".rename_area")
                tpOpcoes_all.forEach(tp => {
                    tp.textContent = textos[chave];
                })
            }
            if (elemento) {
                elemento.textContent = textos[chave];
            } else {
                console.log("Elemento Nao Encontrado para traduzir: ", elemento, chave)
            }
        }
    }
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
    
    // Atributos do Body
    document.body.setAttribute("data-lang", `${langSet_arq}`);

    // Carrega o arquivo JSON do idioma selecionado
    try {
        const response = await fetch(`../static/page_languages/lang_${langSet_arq}.json`);
        if (!response.ok) throw new Error(`Falha ao carregar traduções: ${langSet_arq}`);
        
        const arq_messages = await response.json();

        let janelaAtual = document.querySelector('body').getAttribute('aria-thisPage');
        alterarTextos_geral();
        alterarTextos_config(arq_messages);
        if (janelaAtual === 'auth') {
            alterarTextos_auth(arq_messages);
        } else if (janelaAtual === 'index') {
            alterarTextos_index(arq_messages);
        } else if (janelaAtual === 'chat') {
            alterarTextos_paginaIA(arq_messages);
        }
        console.info("Idioma da Página alterado:", janelaAtual)

    } catch (error) {
        console.error('Erro ao carregar o arquivo de linguagens:', error);
    }

    // Guarda no Armazenamento Local a Situação do Idioma
    localStorage.setItem('situacaoIdioma', lang);

    // Envia o valor para o Django via POST
    // fetch('/set_language/', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-CSRFToken': getCSRFToken()  // Certifique-se de incluir o token CSRF se estiver usando POST no Django
    //     },
    //     body: JSON.stringify({
    //         language: lang
    //     })
    // })
    // .then(response => response.json())
    // .then(data => console.log(data))  // Processa a resposta
    // .catch(error => console.error('Erro ao enviar dados:', error));

    // // Função para pegar o CSRF Token
    // function getCSRFToken() {
    //     let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    //     return csrfToken;
    // }
    
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