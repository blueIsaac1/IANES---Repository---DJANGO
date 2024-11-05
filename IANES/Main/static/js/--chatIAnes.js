// // Pegando o idioma autal para configurar
// const idiomaAtual_chatIAnes = localStorage.getItem('situacaoIdioma')

// // Area que o usuario digita
// const textarea = document.getElementById('user_input');
// // Form do IAnes, para envio e ajustes
// const form_ianes = document.getElementById('inputTo_ianes_form');
// // Area que as mensagens são adicionadas
// const chats_section = document.getElementById("chats_section");
// // Botão de Scroll para rolar até abaixo das Mensagens
// const btn_rolarConvesa = document.getElementById("btn_rolarConvesa");
// // Texto com Contador de Caracteres
// const contadorCaracteres = document.getElementById("ianesInput_contadorCaracteres");
// // Botão de Enviar a mensagens
// const botaoEnviar = document.getElementById("inputTo_ianes_enviar");

// // TEMPORARIO - Lista de Mensagens caso seja Util
// const messagesList = document.getElementById("messages_list");

// // ---------------------------------- Função para Expadir a barra lateral
// function expandSidebar() {
//     const rooms_container = document.getElementById("rooms_container");
//     const chat_container = document.getElementById("chat_container");
//     const btn_expandirSalas = document.getElementById("btn_expandirSalas");
//     const icone_expandSidebar = document.getElementById("icone_expandSidebar");

//     const abrirTexto = document.getElementById("tp_texto_abrirSidebar");
//     const fecharTexto = document.getElementById("tp_texto_fecharSidebar");

//     // Verifica o valor atual de aria-expanded
//     const isExpanded = btn_expandirSalas.getAttribute("aria-expanded") === "true";

//     // if = Já Expandido | else = Não Expandido
//     if (isExpanded) {
//         // Fechando
//         console.log("Fechando");
//         rooms_container.classList.remove("rooms_container-close")
//         rooms_container.classList.add("rooms_container-open")
//         chat_container.classList.remove("chat_container-full")
//         chat_container.classList.add("chat_container-half")
        
//         // Configurando o botão de expandir
//         btn_expandirSalas.setAttribute("aria-expanded", "false");

//         // Configura o Botão
//         btn_expandirSalas.classList.remove("btn_expandirSalas-open")
//         btn_expandirSalas.classList.add("btn_expandirSalas-close")

//         // Configura o Icone do Botão
//         // icone_expandSidebar.classList.remove("rotate90neg")
//         // icone_expandSidebar.classList.add("rotate90pos")
//         icone_expandSidebar.classList.add("rotate_flip")

//         // Exibe a tooltip "Abrir" e esconde a "Fechar"
//         abrirTexto.classList.add("texto_expandSidebar-hide");
//         fecharTexto.classList.remove("texto_expandSidebar-hide");
//     } else {
//         // Expandido
//         console.log("Expandindo");
//         rooms_container.classList.add("rooms_container-close")
//         rooms_container.classList.remove("rooms_container-open")
//         chat_container.classList.add("chat_container-full")
//         chat_container.classList.remove("chat_container-half")
        
//         // Configurando o botão de expandir
//         btn_expandirSalas.setAttribute("aria-expanded", "true");

//         // Configura o Botão
//         btn_expandirSalas.classList.add("btn_expandirSalas-open")
//         btn_expandirSalas.classList.remove("btn_expandirSalas-close")

//         // Configura o Icone do Botão
//         // icone_expandSidebar.classList.add("rotate90neg")
//         // icone_expandSidebar.classList.remove("rotate90pos")
//         icone_expandSidebar.classList.remove("rotate_flip")
        
//         // Exibe a tooltip "Fechar" e esconde a "Abrir"
//         fecharTexto.classList.add("texto_expandSidebar-hide");
//         abrirTexto.classList.remove("texto_expandSidebar-hide");
//     }
// }

// // Icone do Rolar as mensagens abaixo
// function atualizarIconeRolar() {
//     const isScrolledToBottom = (chats_section.scrollHeight - chats_section.scrollTop) <= (chats_section.clientHeight + 100);
//     btn_rolarConvesa.style.display = isScrolledToBottom ? "none" : "block";
// }

// // Função para conversa para baixo
// function rolarConversa() {
//     chats_section.scrollTo({
//         top: chats_section.scrollHeight, // Rola para a parte inferior
//         behavior: 'smooth' // Rola suavemente
//     });
// }

// // Quando a textarea estiver seleciona "focus" ele muda a cor da borda
// textarea.addEventListener('focus', () => {
//     form_ianes.classList.add('textarea_focused');
//     contadorCaracteres.classList.add('contadorCaracteres_focused')
//     btn_rolarConvesa.classList.add('btn_rolarConvesa_focused')
// });
// textarea.addEventListener('blur', () => {
//     form_ianes.classList.remove('textarea_focused');
//     contadorCaracteres.classList.remove('contadorCaracteres_focused')
//     btn_rolarConvesa.classList.remove('btn_rolarConvesa_focused')
// });

// // Função para mostrar e esconder uma tooltip especifica
// function showTooltip_chat(tooltipType, tooltipId) {
//     const tooltips = document.querySelectorAll(`#tp_ia-${tooltipId}-${tooltipType}`)
//     tooltips.forEach(tooltip => {
//         if (tooltip) {
//             tooltip.style.display = 'block';
//         }
//     })
// }

// function hideTooltip_chat(tooltipType, tooltipId) {
//     const tooltips = document.querySelectorAll(`#tp_ia-${tooltipId}-${tooltipType}`)
//     tooltips.forEach(tooltip => {
//         if (tooltip) {
//             tooltip.style.display = 'none';
//         }
//     })
// }

// // Variável para rastrear o estado do popup
// let popupActive = false;

// // Função para copiar o texto com ID dinâmico
// function copyText_chatIA(textID) {
//     // Previne o comportamento padrão e garante que o popup só abra uma vez
//     if (popupActive) return; 

//     // Gera o ID dinamicamente e busca o conteúdo
//     const elementID = `ianes_sala-1_msg-${textID}`;
//     const contentElement = document.getElementById(elementID);

//     // Verifica se o elemento existe
//     if (!contentElement) {
//         console.error(`Elemento com ID "${elementID}" não encontrado.`);
//         return;
//     }

//     const textToCopy = contentElement.innerText;

//     // Copia o texto para a área de transferência
//     navigator.clipboard.writeText(textToCopy)
//         .then(() => showPopup_textCopy())
//         .catch(err => console.error('Erro ao copiar o texto: ', err));
// }

// // Função que exibe o popup e o efeito de loading
// function showPopup_textCopy() {
//     const popup = document.getElementById('popup_copyText');
//     const loadingBar = document.getElementById('loading_bar'); // Acesse a barra de loading diretamente

//     popupActive = true; // Marca o popup como ativo
//     popup.style.display = 'flex';
//     loadingBar.style.width = '100%'; // Preenche a barra de loading

//     // Começa a esvaziar a barra após 50ms
//     setTimeout(() => {
//         // Mantém a barra cheia por 2 segundos
//         setTimeout(() => {
//             loadingBar.style.transition = 'width 1s'; // Define a transição para o esvaziamento
//             loadingBar.style.width = '0%'; // Reseta a barra

//             // Esconde o popup após 2 segundos (dura o esvaziamento)
//             setTimeout(() => {
//                 popup.style.display = 'none'; // Esconde o popup
//                 popupActive = false; // Marca o popup como inativo
//             }, 1000); 
//         }, 1000); // Espera 2 segundos após a barra estar cheia
//     }, 50); // Começa a esvaziar após 50ms
// }

// // Função IMPORTANTE - Ela ajusta o tamanho do <main>
// // Para sempre ter a altura da janela, menos 4vw (Cabeçalho)
// function ajustarAltura_main() {
//     const mainContent = document.getElementById("mainElement_chatIAnes");
//     const alturaJanela = window.innerHeight;

//     if (!mainContent) {
//         console.error("Elemento #mainElement_chatIAnes não encontrado.");
//         return;
//     }

//     // Converte '4vw' para pixels
//     const vwToPx = (4 * window.innerWidth) / 100;

//     // Calcula a altura final
//     const alturaMain = alturaJanela - vwToPx;

//     // Aplica a altura calculada ao elemento
//     mainContent.style.height = `${alturaMain}px`;

//     console.log(`⚙ Ajustando tamanho da tela: - Elemento Main: ${mainContent} - Altura da Janela: ${alturaJanela} - Altura Calculada para o Main: ${alturaMain}`);
// }

// function adicionar_PicImgs() {
//     const imgPic_ianes = document.querySelectorAll("#ianes_pic")
//     const urlPic_ianes = "https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/3932a9bcb74c20bdb3c85f4d80c678a24184cef4/_midia/_logotipos/ianesLogo_PretaT.png"

//     // Faça todos os checks invisíveis
//     imgPic_ianes.forEach(img => {
//         img.src = urlPic_ianes 
//     });

// }

// // Função para Ajustar a Textarea e as Áreas de Input e Chat
// function ajustarAlturaTextarea() {
//     textarea.style.height = "auto"; // Reseta a altura para recalcular
//     const novaAltura = Math.min(textarea.scrollHeight, parseInt(getComputedStyle(textarea).maxHeight));
//     textarea.style.height = novaAltura + "px";

//     // Calcular a nova altura proporcional para o input_area
//     const percentInputArea = Math.min(5 + (novaAltura / 10), 50); // Limita em 50% no máximo
//     const percentChatMessages = 100 - percentInputArea; // Mantém o total em 100%

//     // Aplica as novas alturas
//     chats_section.style.height = percentChatMessages + "%";

//     atualizarIconeRolar();
// }

// // Simula um envio de mensagem

// let botMessageCount = 0; // Contador de mensagens do bot

// function enviarMensagem(tipo) {
//     const userMessage = textarea.value.trim();
//     const botMessage = "Essa é uma resposta automática do IAnes! Essa é uma resposta automática do IAnes!";
//     if (userMessage === "") return; // Não envia se estiver vazio

//     // Adiciona a mensagem do usuário
//     const userMessageLi = document.createElement("li");
//     userMessageLi.classList.add("message", "user");
//     const userMessageP = document.createElement("p");
//     userMessageP.textContent = userMessage;
//     userMessageLi.appendChild(userMessageP);
//     messagesList.appendChild(userMessageLi);

//     // Limpa a área de texto
//     textarea.value = "";
//     ajustarAlturaTextarea(); // Redefine a altura para o padrão
//     contarCaracteres()

//     // Incrementa o contador de mensagens do bot
//     botMessageCount++;

//     // Adiciona a resposta do bot com a estrutura específica
//     const botMessageLi = document.createElement("li");
//     botMessageLi.classList.add("message", "bot");

//     // Cria o HTML interno da mensagem do bot
//     botMessageLi.innerHTML = `
//         <img id="ianes_pic" src="" alt="IAnes Pic">
//         <p id="ianes_sala-1_msg-${botMessageCount}">${botMessage}</p>
//         <div class="extraOptions_IAnes">
//             <div class="extraOptions_IAnes_Itens" onclick="copyText_chatIA('${botMessageCount}')" onmouseover="showTooltip_chat('copy', '${botMessageCount}')" onmouseout="hideTooltip_chat('copy', '${botMessageCount}')">
//                 <ion-icon name="copy-outline"></ion-icon>
//                 <p class="tp_extraO_IA" id="tp_ia-${botMessageCount}-copy">Copiar</p>
//             </div>
//         </div>
//     `;

//     // Adiciona a estrutura criada à lista de mensagens
//     messagesList.appendChild(botMessageLi);

//     // Desce automaticamente para a última mensagem
//     const chatMessages = document.getElementById("chats_section");
//     chatMessages.scrollTop = chatMessages.scrollHeight;

//     // Atualiza a visibilidade do ícone de rolagem
//     atualizarIconeRolar();

//     // Adicione o URL nos novos ícones, caso necessário
//     adicionar_PicImgs();
// }

// // Variável para a mensagem inicial do bot
// const msgInicial_ianes = document.getElementById("texto_chatIA_botInicialMsg").textContent;

// function baixarConversaComoPDF() {
//     const { jsPDF } = window.jspdf; // Acessa a biblioteca jsPDF
//     const doc = new jsPDF();
    
//     const mensagens = [
//         "IAnes: " + msgInicial_ianes, // Mensagem inicial com identificação do IAnes
//     ];

//     // Adiciona as mensagens da conversa ao array
//     const userMessages = messagesList.getElementsByClassName("user");
//     const botMessages = messagesList.getElementsByClassName("bot");

//     for (let i = 0; i < userMessages.length; i++) {
//         mensagens.push("Usuário: " + userMessages[i].innerText);
//         mensagens.push("IAnes: " + (botMessages[i]?.innerText || "")); // Adiciona resposta do bot se existir
//     }

//     // Define o espaço entre as linhas
//     const espacoEntreLinhas = 15;

//     // Adiciona as mensagens ao PDF
//     mensagens.forEach((mensagem, index) => {
//         doc.text(mensagem, 10, 10 + (index * espacoEntreLinhas));
//     });

//     // Salva o PDF
//     doc.save("conversa.pdf");
// }

// textarea.addEventListener("keydown", function (event) {
//     if (event.key === "Enter") {
//         if (!event.shiftKey) {
//             event.preventDefault();
//             enviarMensagem('normal');
//         } else {
//             textarea.value += "\n";
//             ajustarAlturaTextarea();
//         }
//     }
// });

// // Função para contar os caracteres e atualizar o contador com pontuação de milhares
// let idiomaCount = "pt-BR"
// function contarCaracteres() {
//     const caracteres = textarea.value.length;
//     // Formata o número com pontos de milhar
//     console.log(idiomaAtual_chatIAnes)
//     if (idiomaAtual_chatIAnes === "n_escolheu" || idiomaAtual_chatIAnes === null) {
//         idiomaCount = "pt-BR"
//     } else {
//         idiomaCount = idiomaAtual_chatIAnes
//     }
//     contadorCaracteres.textContent = new Intl.NumberFormat(`${idiomaCount}`).format(caracteres);
// }

// // Função para habilitar ou desabilitar o botão com base nos caracteres
// function habilitarBotao() {
//     if (textarea.value.trim() === "") {
//         botaoEnviar.classList.add("btn_desativado");
//         botaoEnviar.classList.remove("btn_ativado");
//     } else {
//         botaoEnviar.classList.remove("btn_desativado");
//         botaoEnviar.classList.add("btn_ativado");
//     }
// }

// // Função para alternar entre as salas
// function trocarSalas(salaID) {
//     // Apenas os Botões de Trocar a sala
//     const btn_trocarSalas_all = document.querySelectorAll(".btn_trocarSalas");
//     const btn_trocarSalas_this = document.getElementById(`btn_trocarSalas_sala-${salaID}`);
//     // Apenas as Salas
//     const chatMessages_sala_all = document.querySelectorAll(".chat_messages")
//     const chatMessages_sala_this = document.getElementById(`chat_messages-chat-${salaID}`)

//     // Altera todos os Botões
//     btn_trocarSalas_all.forEach(btn => {
//         btn.style.backgroundColor = "red";
//     });
//     // Altera apenas o Selecionado
//     if (btn_trocarSalas_this) {
//         btn_trocarSalas_this.style.backgroundColor = "blue";
//     } else {
//         console.error(`Botão com ID 'btn_trocarSalas_sala-${salaID}' não encontrado.`);
//     }

//     // Esconde todas as Telas
//     chatMessages_sala_all.forEach(screen => {
//         screen.style.display = "none"
//     })
//     // Mostra apeans a Selecionada
//     if (chatMessages_sala_this) {
//         chatMessages_sala_this.style.display = "flex";
//     } else {
//         console.error(`Sala de mensagens com o ID 'chat_messages-chat-${salaID}' não encontrado.`);
//     }
// }

// // Escutador de no input para configura-lo
// textarea.addEventListener("input", configInput);

// function configInput() {
//     ajustarAlturaTextarea();
//     contarCaracteres();
//     habilitarBotao();
// }

// function configInput_onLoad() {
//     ajustarAlturaTextarea();
//     rolarConversa();
//     contarCaracteres();
//     habilitarBotao();
// }

// form_ianes.addEventListener('submit', function(event) {
//     event.preventDefault(); // Impede a submissão padrão do formulário
//     // Lógica para processar o formulário aqui
// });

// // Adicione um listener de scroll para o chats_section
// chats_section.addEventListener('scroll', atualizarIconeRolar);

// window.addEventListener("resize", () => {
//     ajustarAltura_main();
//     ajustarAlturaTextarea();
//     rolarConversa();
// });

// ajustarAltura_main()
// expandSidebar()
// adicionar_PicImgs()
// configInput_onLoad()
// Pegando o idioma autal para configurar
const idiomaAtual_chatIAnes = localStorage.getItem('situacaoIdioma')

// Area que o usuario digita
const textarea = document.getElementById('user_message');
// Form do IAnes, para envio e ajustes
const form_ianes = document.getElementById('inputTo_ianes_form');
// Area que as mensagens são adicionadas
const chats_section = document.getElementById("chats_section");
// Botão de Scroll para rolar até abaixo das Mensagens
const btn_rolarConvesa = document.getElementById("btn_rolarConvesa");
// Texto com Contador de Caracteres
const contadorCaracteres = document.getElementById("ianesInput_contadorCaracteres");
// Botão de Enviar a mensagens
const botaoEnviar = document.getElementById("inputTo_ianes_enviar");

// TEMPORARIO - Lista de Mensagens caso seja Util
const messagesList = document.getElementById("messages_list");

// ---------------------------------- Função para Expadir a barra lateral
function expandSidebar() {
    const rooms_container = document.getElementById("rooms_container");
    const chat_container = document.getElementById("chat_container");
    const btn_expandirSalas = document.getElementById("btn_expandirSalas");
    const icone_expandSidebar = document.getElementById("icone_expandSidebar");

    const abrirTexto = document.getElementById("tp_texto_abrirSidebar");
    const fecharTexto = document.getElementById("tp_texto_fecharSidebar");

    // Verifica o valor atual de aria-expanded
    const isExpanded = btn_expandirSalas.getAttribute("aria-expanded") === "true";

    // if = Já Expandido | else = Não Expandido
    if (isExpanded) {
        // Fechando
        console.log("Fechando");
        rooms_container.classList.remove("rooms_container-close")
        rooms_container.classList.add("rooms_container-open")
        chat_container.classList.remove("chat_container-full")
        chat_container.classList.add("chat_container-half")
        
        // Configurando o botão de expandir
        btn_expandirSalas.setAttribute("aria-expanded", "false");

        // Configura o Botão
        btn_expandirSalas.classList.remove("btn_expandirSalas-open")
        btn_expandirSalas.classList.add("btn_expandirSalas-close")

        // Configura o Icone do Botão
        // icone_expandSidebar.classList.remove("rotate90neg")
        // icone_expandSidebar.classList.add("rotate90pos")
        icone_expandSidebar.classList.add("rotate_flip")

        // Exibe a tooltip "Abrir" e esconde a "Fechar"
        abrirTexto.classList.add("texto_expandSidebar-hide");
        fecharTexto.classList.remove("texto_expandSidebar-hide");
    } else {
        // Expandido
        console.log("Expandindo");
        rooms_container.classList.add("rooms_container-close")
        rooms_container.classList.remove("rooms_container-open")
        chat_container.classList.add("chat_container-full")
        chat_container.classList.remove("chat_container-half")
        
        // Configurando o botão de expandir
        btn_expandirSalas.setAttribute("aria-expanded", "true");

        // Configura o Botão
        btn_expandirSalas.classList.add("btn_expandirSalas-open")
        btn_expandirSalas.classList.remove("btn_expandirSalas-close")

        // Configura o Icone do Botão
        // icone_expandSidebar.classList.add("rotate90neg")
        // icone_expandSidebar.classList.remove("rotate90pos")
        icone_expandSidebar.classList.remove("rotate_flip")
        
        // Exibe a tooltip "Fechar" e esconde a "Abrir"
        fecharTexto.classList.add("texto_expandSidebar-hide");
        abrirTexto.classList.remove("texto_expandSidebar-hide");
    }
}
// Função para abrir a caixa específica
function activeExtraOptionsBox(button) {
    const box = button.nextElementSibling; // Acessa o próximo elemento (roomsExtraOptions_box)
    const isExpanded_exBox = button.getAttribute("aria-expanded");

    console.log("Box:", box);
    console.log("Is Expanded:", isExpanded_exBox);
    
    // Verifica se a caixa está aberta ou fechada
    if (isExpanded_exBox === "false") {
        // Fecha todas as caixas antes de abrir a nova
        closeAllBoxes();

        box.style.display = "flex"; // Abre a caixa atual
        button.setAttribute("aria-expanded", "true"); // Atualiza o estado

        // Adiciona o listener para detectar clique fora ao abrir a caixa
        document.addEventListener("click", closeBoxOnClickOutside);
    } else {
        box.style.display = "none"; // Fecha a caixa atual
        button.setAttribute("aria-expanded", "false"); // Atualiza o estado

        // Remove o listener ao fechar a caixa
        document.removeEventListener("click", closeBoxOnClickOutside);
    }
}

// Função para fechar todas as caixas
function closeAllBoxes() {
    const boxes = document.querySelectorAll('.roomsExtraOptions_box'); // Seleciona todas as caixas
    const buttons = document.querySelectorAll('.btn_roomsEP'); // Seleciona todos os botões

    boxes.forEach((box) => {
        box.style.display = 'none'; // Fecha a caixa
    });

    buttons.forEach((button) => {
        button.setAttribute("aria-expanded", "false"); // Reseta todos os botões
    });
}

// Função para fechar a caixa ao clicar fora dela
function closeBoxOnClickOutside(event) {
    const openBoxes = document.querySelectorAll('.roomsExtraOptions_box[style*="flex"]'); // Seleciona caixas abertas

    // Se o clique foi fora de uma caixa aberta, fecha todas
    if (openBoxes.length > 0 && !openBoxes[0].contains(event.target) && !event.target.closest('.btn_roomsEP')) {
        closeAllBoxes(); // Fecha todas as caixas
        document.removeEventListener("click", closeBoxOnClickOutside); // Remove o listener
    }
}
// Icone do Rolar as mensagens abaixo
function atualizarIconeRolar() {
    const isScrolledToBottom = (chats_section.scrollHeight - chats_section.scrollTop) <= (chats_section.clientHeight + 100);
    btn_rolarConvesa.style.display = isScrolledToBottom ? "none" : "block";
}

// Função para conversa para baixo
function rolarConversa(tipo) {
    if (tipo === 'onload') {
        chats_section.scrollTo({
            top: chats_section.scrollHeight, // Rola para a parte inferior
            behavior: 'auto'
        });
        return
    }
    chats_section.scrollTo({
        top: chats_section.scrollHeight, // Rola para a parte inferior
        behavior: 'smooth' // Rola suavemente
    });
}

// Quando a textarea estiver seleciona "focus" ele muda a cor da borda
textarea.addEventListener('focus', () => {
    form_ianes.classList.add('textarea_focused');
    contadorCaracteres.classList.add('contadorCaracteres_focused')
    btn_rolarConvesa.classList.add('btn_rolarConvesa_focused')
});
textarea.addEventListener('blur', () => {
    form_ianes.classList.remove('textarea_focused');
    contadorCaracteres.classList.remove('contadorCaracteres_focused')
    btn_rolarConvesa.classList.remove('btn_rolarConvesa_focused')
});

// Função para mostrar e esconder uma tooltip especifica
function showTooltip_chat(tooltipType, tooltipId) {
    const tooltips = document.querySelectorAll(`#tp_ia-${tooltipId}-${tooltipType}`)
    tooltips.forEach(tooltip => {
        if (tooltip) {
            tooltip.style.display = 'block';
        }
    })
}

function hideTooltip_chat(tooltipType, tooltipId) {
    const tooltips = document.querySelectorAll(`#tp_ia-${tooltipId}-${tooltipType}`)
    tooltips.forEach(tooltip => {
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    })
}

// Variável para rastrear o estado do popup
let popupActive = false;

// Função para copiar o texto com ID dinâmico
function copyText_chatIA(textID) {
    // Previne o comportamento padrão e garante que o popup só abra uma vez
    if (popupActive) return; 

    // Gera o ID dinamicamente e busca o conteúdo
    const elementID = `ianes_sala-1_msg-${textID}`;
    const contentElement = document.getElementById(elementID);

    // Verifica se o elemento existe
    if (!contentElement) {
        console.error(`Elemento com ID "${elementID}" não encontrado.`);
        return;
    }

    const textToCopy = contentElement.innerText;

    // Copia o texto para a área de transferência
    navigator.clipboard.writeText(textToCopy)
        .then(() => showPopup_textCopy())
        .catch(err => console.error('Erro ao copiar o texto: ', err));
}

// Função que exibe o popup e o efeito de loading
function showPopup_textCopy() {
    const popup = document.getElementById('popup_copyText');
    const loadingBar = document.getElementById('loading_bar'); // Acesse a barra de loading diretamente

    popupActive = true; // Marca o popup como ativo
    popup.style.display = 'flex';
    loadingBar.style.width = '100%'; // Preenche a barra de loading

    // Começa a esvaziar a barra após 50ms
    setTimeout(() => {
        // Mantém a barra cheia por 2 segundos
        setTimeout(() => {
            loadingBar.style.transition = 'width 1s'; // Define a transição para o esvaziamento
            loadingBar.style.width = '0%'; // Reseta a barra

            // Esconde o popup após 2 segundos (dura o esvaziamento)
            setTimeout(() => {
                popup.style.display = 'none'; // Esconde o popup
                popupActive = false; // Marca o popup como inativo
            }, 1000); 
        }, 1000); // Espera 2 segundos após a barra estar cheia
    }, 50); // Começa a esvaziar após 50ms
}

// Função IMPORTANTE - Ela ajusta o tamanho do <main>
// Para sempre ter a altura da janela, menos 4vw (Cabeçalho)
function ajustarAltura_main() {
    const mainContent = document.getElementById("mainElement_chatIAnes");
    const alturaJanela = window.innerHeight;

    if (!mainContent) {
        console.error("Elemento #mainElement_chatIAnes não encontrado.");
        return;
    }

    // Converte '4vw' para pixels
    const vwToPx = (4 * window.innerWidth) / 100;

    // Calcula a altura final
    const alturaMain = alturaJanela - vwToPx;

    // Aplica a altura calculada ao elemento
    mainContent.style.height = `${alturaMain}px`;

    console.log(`⚙ Ajustando tamanho da tela: - Elemento Main: ${mainContent} - Altura da Janela: ${alturaJanela} - Altura Calculada para o Main: ${alturaMain}`);
}

function adicionar_PicImgs() {
    const imgPic_ianes = document.querySelectorAll("#ianes_pic")
    const urlPic_ianes = "https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/3932a9bcb74c20bdb3c85f4d80c678a24184cef4/_midia/_logotipos/ianesLogo_PretaT.png"

    // Faça todos os checks invisíveis
    imgPic_ianes.forEach(img => {
        img.src = urlPic_ianes 
    });

}

// Função para Ajustar a Textarea e as Áreas de Input e Chat
function ajustarAlturaTextarea() {
    textarea.style.height = "auto"; // Reseta a altura para recalcular
    const novaAltura = Math.min(textarea.scrollHeight, parseInt(getComputedStyle(textarea).maxHeight));
    textarea.style.height = novaAltura + "px";

    // Calcular a nova altura proporcional para o input_area
    const percentInputArea = Math.min(5 + (novaAltura / 10), 50); // Limita em 50% no máximo
    const percentChatMessages = 100 - percentInputArea; // Mantém o total em 100%

    // Aplica as novas alturas
    chats_section.style.height = percentChatMessages + "%";

    atualizarIconeRolar();
}

// Simula um envio de mensagem

let botMessageCount = 0; // Contador de mensagens do bot

function enviarMensagem(tipo) {
    // const userMessage = textarea.value.trim();
    // const botMessage = "Essa é uma resposta automática do IAnes! Essa é uma resposta automática do IAnes!";
    // if (userMessage === "") return; // Não envia se estiver vazio

    // // Adiciona a mensagem do usuário
    // const userMessageLi = document.createElement("li");
    // userMessageLi.classList.add("message", "user");
    // const userMessageP = document.createElement("p");
    // userMessageP.textContent = userMessage;
    // userMessageLi.appendChild(userMessageP);
    // messagesList.appendChild(userMessageLi);

    // // Limpa a área de texto
    // textarea.value = "";
    // ajustarAlturaTextarea(); // Redefine a altura para o padrão
    // contarCaracteres()

    // // Incrementa o contador de mensagens do bot
    // botMessageCount++;

    // // Adiciona a resposta do bot com a estrutura específica
    // const botMessageLi = document.createElement("li");
    // botMessageLi.classList.add("message", "bot");

    // // Cria o HTML interno da mensagem do bot
    // botMessageLi.innerHTML = `
    //     <img id="ianes_pic" src="" alt="IAnes Pic">
    //     <p id="ianes_sala-1_msg-${botMessageCount}">${botMessage}</p>
    //     <div class="extraOptions_IAnes">
    //         <div class="extraOptions_IAnes_Itens" onclick="copyText_chatIA('${botMessageCount}')" onmouseover="showTooltip_chat('copy', '${botMessageCount}')" onmouseout="hideTooltip_chat('copy', '${botMessageCount}')">
    //             <ion-icon name="copy-outline"></ion-icon>
    //             <p class="tp_extraO_IA" id="tp_ia-${botMessageCount}-copy">Copiar</p>
    //         </div>
    //     </div>
    // `;

    // // Adiciona a estrutura criada à lista de mensagens
    // messagesList.appendChild(botMessageLi);

    // // Desce automaticamente para a última mensagem
    // const chatMessages = document.getElementById("chats_section");
    // chatMessages.scrollTop = chatMessages.scrollHeight;

    // Atualiza a visibilidade do ícone de rolagem
    atualizarIconeRolar();

    // Adicione o URL nos novos ícones, caso necessário
    adicionar_PicImgs();
}

// Variável para a mensagem inicial do bot
const msgInicial_ianes = document.getElementById("texto_chatIA_botInicialMsg").textContent;

function baixarConversaComoPDF() {
    const { jsPDF } = window.jspdf; // Acessa a biblioteca jsPDF
    const doc = new jsPDF();
    
    const mensagens = [
        "IAnes: " + msgInicial_ianes, // Mensagem inicial com identificação do IAnes
    ];

    // Adiciona as mensagens da conversa ao array
    const userMessages = messagesList.getElementsByClassName("user");
    const botMessages = messagesList.getElementsByClassName("bot");

    for (let i = 0; i < userMessages.length; i++) {
        mensagens.push("Usuário: " + userMessages[i].innerText);
        mensagens.push("IAnes: " + (botMessages[i]?.innerText || "")); // Adiciona resposta do bot se existir
    }

    // Define o espaço entre as linhas
    const espacoEntreLinhas = 15;

    // Adiciona as mensagens ao PDF
    mensagens.forEach((mensagem, index) => {
        doc.text(mensagem, 10, 10 + (index * espacoEntreLinhas));
    });

    // Salva o PDF
    doc.save("conversa.pdf");
}

textarea.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        if (!event.shiftKey) {
            event.preventDefault();
            enviarMensagem('normal');
            form_ianes.submit();
        } else {
            textarea.value += "\n";
            ajustarAlturaTextarea();
        }
    }
});

// Função para contar os caracteres e atualizar o contador com pontuação de milhares
let idiomaCount = "pt-BR"
function contarCaracteres() {
    const caracteres = textarea.value.length;
    // Formata o número com pontos de milhar
    console.log(idiomaAtual_chatIAnes)
    if (idiomaAtual_chatIAnes === "n_escolheu" || idiomaAtual_chatIAnes === null) {
        idiomaCount = "pt-BR"
    } else {
        idiomaCount = idiomaAtual_chatIAnes
    }
    contadorCaracteres.textContent = new Intl.NumberFormat(`${idiomaCount}`).format(caracteres);
}

// Função para habilitar ou desabilitar o botão com base nos caracteres
function habilitarBotao() {
    if (textarea.value.trim() === "") {
        botaoEnviar.classList.add("btn_desativado");
        botaoEnviar.classList.remove("btn_ativado");
    } else {
        botaoEnviar.classList.remove("btn_desativado");
        botaoEnviar.classList.add("btn_ativado");
    }
}

// Função para alternar entre as salas
function trocarSalas(salaID) {
    // Apenas os Botões de Trocar a sala
    const btn_trocarSalas_all = document.querySelectorAll(".btn_trocarSalas");
    const btn_trocarSalas_this = document.getElementById(`btn_trocarSalas_sala-${salaID}`);
    // Apenas as Salas
    const chatMessages_sala_all = document.querySelectorAll(".chat_messages")
    const chatMessages_sala_this = document.getElementById(`chat_messages-chat-${salaID}`)

    // Altera todos os Botões
    btn_trocarSalas_all.forEach(btn => {
        btn.style.backgroundColor = "red";
    });
    // Altera apenas o Selecionado
    if (btn_trocarSalas_this) {
        btn_trocarSalas_this.style.backgroundColor = "blue";
    } else {
        console.error(`Botão com ID 'btn_trocarSalas_sala-${salaID}' não encontrado.`);
    }

    // Esconde todas as Telas
    chatMessages_sala_all.forEach(screen => {
        screen.style.display = "none"
    })
    // Mostra apeans a Selecionada
    if (chatMessages_sala_this) {
        chatMessages_sala_this.style.display = "flex";
    } else {
        console.error(`Sala de mensagens com o ID 'chat_messages-chat-${salaID}' não encontrado.`);
    }
}
function trocarSalas(button) {
    // Obtém todos os botões e as telas
    const btn_trocarSalas_all = document.querySelectorAll(".btn_trocarSalas");
    const chatMessages_sala_all = document.querySelectorAll(".chat_messages");

    // Extrai o ID da sala dinamicamente
    const salaID = button.id.match(/\d+$/)?.[0]; // Extrai apenas o número do final do ID

    if (!salaID) {
        console.error("Número da sala não encontrado no ID do botão.");
        return;
    }

    // Sala correspondente ao ID extraído
    const chatMessages_sala_this = document.getElementById(`chat_messages-chat-${salaID}`);

    // Remove a classe de todos os botões
    btn_trocarSalas_all.forEach(btn => {
        btn.classList.remove("btn_trocarSalas-select");
    });

    // Adiciona a classe apenas para o botão selecionado
    button.classList.add("btn_trocarSalas-select");

    // Esconde todas as salas
    // chatMessages_sala_all.forEach(screen => {
    //     screen.style.display = "none";
    // });

    // Mostra a sala correspondente ao botão clicado
    // if (chatMessages_sala_this) {
    //     chatMessages_sala_this.style.display = "flex";
    // } else {
    //     console.error(`Sala de mensagens com ID 'chat_messages-chat-${salaID}' não encontrada.`);
    // }
}
function renameRoom(element) {
    // Acessa o formulário e os elementos dentro do contêiner pai de "Renomear"
    const roomContainer = element.closest('.container_btn_trocarSalas');
    const nameText = roomContainer.querySelector('.roomName');
    const renameInput = roomContainer.querySelector('.rename_area');
    const btnOptions = roomContainer.querySelector('.btn_roomsEP');
    const form_rename = roomContainer.querySelector('#form_rename');

    // form_rename.addEventListener('submit', function(event) {
    //     event.preventDefault(); // BLOQUEANDO O ENTER
    // });
    if (renameInput.value) {
        fetch("{% url 'list_messages' %}", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': '{{ csrf_token }}'
            },
            body: `rename_input=${renameInput}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Status atualizado com sucesso!');
            } else {
                console.error('Erro ao atualizar a sala:', data.error);
                // Se houver erro, você pode querer mover a tarefa de volta
                // tasksContainer.removeChild(draggingTask); // Remove da nova coluna
                // previousContainer.appendChild(draggingTask); // Adiciona de volta à coluna anterior
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            // Se houver erro, você pode querer mover a tarefa de volta
            // tasksContainer.removeChild(draggingTask); // Remove da nova coluna
            // previousContainer.appendChild(draggingTask); // Adiciona de volta à coluna anterior
        });
    } else {
        console.error("Nome da sala não definido corretamente.");
    }
    // Mostra o input e esconde o <p> e as opções
    nameText.style.display = "none";
    renameInput.style.display = "flex";
    btnOptions.style.display = "none";

    // Seleciona automaticamente o texto do input ao abrir
    renameInput.focus();
    renameInput.select();

    // Função para confirmar o renomear
    function confirmRename() {
        // Atualiza o <p> com o valor do input
        nameText.textContent = renameInput.value;

        // Mostra o <p> e as opções novamente, e esconde o input
        nameText.style.display = "flex";
        renameInput.style.display = "none";
        btnOptions.style.display = "flex";

        // Remove os event listeners após confirmação
        document.removeEventListener('click', handleClickOutside);
        renameInput.removeEventListener('blur', confirmRename);
        renameInput.removeEventListener('keydown', handleKeyDown);

        // Envia o formulário (opcional, descomente para ativar)
        // form.submit();
    }

    // Checa se a tecla pressionada é "Enter"
    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            confirmRename();
        }
    }

    // Fecha o input se o clique for fora do campo de input
    function handleClickOutside(event) {
        if (!roomContainer.contains(event.target)) {
            confirmRename();
        }
    }

    // Adiciona os event listeners para confirmar ao clicar fora ou pressionar "Enter"
    renameInput.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    renameInput.addEventListener('blur', confirmRename);
}

// Escutador de no input para configura-lo
textarea.addEventListener("input", configInput);

function configInput() {
    ajustarAlturaTextarea();
    contarCaracteres();
    habilitarBotao();
}

function configInput_onLoad() {
    ajustarAlturaTextarea();
    rolarConversa('onload');
    contarCaracteres();
    habilitarBotao();   
}

// form_ianes.addEventListener('submit', function(event) {
//     event.preventDefault(); // Impede a submissão padrão do formulário
//     // Lógica para processar o formulário aqui
// });

// Adicione um listener de scroll para o chats_section
chats_section.addEventListener('scroll', atualizarIconeRolar);

window.addEventListener("resize", () => {
    ajustarAltura_main();
    ajustarAlturaTextarea();
    rolarConversa();
});

ajustarAltura_main()
expandSidebar()
adicionar_PicImgs()
configInput_onLoad()