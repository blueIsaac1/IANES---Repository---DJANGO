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

    const abrirTexto = document.getElementById("tp_ia-expandMenu-abrir");
    const fecharTexto = document.getElementById("tp_ia-expandMenu-fechar");
    let tp_class_exSidebar_hide = "tp_expandSidebar_hide"

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
        abrirTexto.classList.add(tp_class_exSidebar_hide);
        fecharTexto.classList.remove(tp_class_exSidebar_hide);
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
        fecharTexto.classList.add(tp_class_exSidebar_hide);
        abrirTexto.classList.remove(tp_class_exSidebar_hide);
    }
}
// Função para abrir a caixa específica
function activeExtraOptionsBox(button) {
    const box = button.nextElementSibling; // Acessa o próximo elemento (roomsExtraOptions_box)
    const isExpanded_exBox = button.getAttribute("aria-expanded");

    // console.log("Box:", box);
    // console.log("Is Expanded:", isExpanded_exBox);
    
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

// Função para rolar a conversa para baixo
function rolarConversa(tipo) {
    if (tipo === 'onload') {
        setTimeout(() => {
            chats_section.scrollTo({
                top: chats_section.scrollHeight, // Rola para a parte inferior
                behavior: 'auto'
            });
        }, 0); // Delay de 0 segundo
        return;
    }
    setTimeout(() => {
        chats_section.scrollTo({
            top: chats_section.scrollHeight, // Rola para a parte inferior
            behavior: 'smooth' // Rola suavemente
        });
    }, 0)
}

// Chame a função onload após carregar a página
window.onload = function() {
    rolarConversa('onload');
};

// Quando a textarea estiver seleciona "focus" ele muda a cor da borda
if (textarea) {
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
}

// Função para mostrar e esconder uma tooltip especifica
function showTooltip(tooltipType, tooltipId) {
    const tooltip = document.getElementById(`tp_ia-${tooltipType}-${tooltipId}`)
    if (tooltip) {
        tooltip.style.display = 'block';
    }
}
function hideTooltip(tooltipType, tooltipId) {
    const tooltip = document.getElementById(`tp_ia-${tooltipType}-${tooltipId}`)
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Variável para rastrear o estado do popup
let popupActive = false;

// Função para copiar o texto com ID dinâmico
function copyText_chatIA(textID) {
    // Previne o comportamento padrão e garante que o popup só abra uma vez
    if (popupActive) return; 

    // Gera o ID dinamicamente e busca o conteúdo
    let elementID = `ianes_msg-${textID}`;
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
function processarAudio(texto) {
    // Get CSRF token from cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    const csrftoken = getCookie('csrftoken');
    
    fetch('processar_audio/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
            texto: texto
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        
        // Limpar o URL do objeto após a reprodução
        audio.onended = () => {
            URL.revokeObjectURL(url);
        };
        
        audio.play().catch(e => console.error('Error playing audio:', e));
    })
    .catch(error => {
        console.error('Error:', error);
    });
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
    if (textarea) {
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
}

// Simula um envio de mensagem

let botMessageCount = 0; // Contador de mensagens do bot

function enviarMensagem(tipo) {
    // Atualiza a visibilidade do ícone de rolagem
    atualizarIconeRolar();

    // Adicione o URL nos novos ícones, caso necessário
    adicionar_PicImgs();
}

// Variável para a mensagem inicial do bot
let msgInicial_ianes = null
let botInicialMsg = document.getElementById("texto_chatIA_botInicialMsg")
if (botInicialMsg) {
    msgInicial_ianes = botInicialMsg.textContent;
}

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

if (textarea) {
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
}

// Função para contar os caracteres e atualizar o contador com pontuação de milhares
let idiomaCount = "pt-BR"
function contarCaracteres() {
    if (textarea) {
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
}

// Função para habilitar ou desabilitar o botão com base nos caracteres
function habilitarBotao() {
    if (textarea) {
        if (textarea.value.trim() === "") {
            botaoEnviar.classList.add("btn_desativado");
            botaoEnviar.classList.remove("btn_ativado");
        } else {
            botaoEnviar.classList.remove("btn_desativado");
            botaoEnviar.classList.add("btn_ativado");
        }
    }
}

// Função para alternar entre as salas
// CASO queira fazer a sala NAO abrir na ultima que foi aberta, precisa vefiricar o URL.
function selectRoom(salaID) {
    console.log("LALALALAL", salaID)
    // Apenas os Botões de Trocar a sala
    const btn_trocarSalas_all = document.querySelectorAll(".btn_trocarSalas");
    const btn_trocarSalas_this = document.getElementById(`btn_trocarSalas_sala-${salaID}`);
    // Classe do BTN Selecionado
    let classBtn_select = "btn_trocarSalas_select";
    // Vefica se o ID é null (Nenhuma sala foi chamada)
    if (!salaID) {
        btn_trocarSalas_all.forEach(btn => {
            btn.classList.remove(classBtn_select);
        });
        localStorage.setItem('salaSelecionada', null);
        return
    }

    // Salvar o ID da sala no localStorage
    localStorage.setItem('salaSelecionada', salaID);
    // Para cada Botão, remove a classe
    btn_trocarSalas_all.forEach(btn => {
        btn.classList.remove(classBtn_select);
    });
    // Para o Botão selecionado, adiciona a classe
    btn_trocarSalas_this.classList.add(classBtn_select);
}
function loadSelectRoom() {
    // Obter o ID da sala salva
    let salaSelecionada = localStorage.getItem('salaSelecionada');
    selectRoom(salaSelecionada);
}
// loadSelectRoom()

// -------------------- LOGICA DE IGNORAR O COMPORTAMENTO PADRAO DE ENVIO
document.querySelectorAll(".renameForm_sendIgnore").forEach(form => {
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        console.log("Comportamento padrão ignorado para:", form);
    });
});

// -------------------- LOGICA DE RENOMEAR

let activeRenameRoom = null; // Variável para rastrear qual sala está sendo renomeada

async function callRenameRoom(roomID) {
    const formRename = document.getElementById(`form_rename-${roomID}`);
    const inputRename = document.getElementById(`input_rename-${roomID}`);
    const room_name_p = document.getElementById(`room_name_p-${roomID}`);
    const dotsOptions = document.getElementById(`btn_roomsEP-${roomID}`);

    if (activeRenameRoom === roomID) {
        // Segundo clique ou confirmação
        console.log('Confirmação de renome para a sala:', roomID);
        activeRenameRoom = null; // Redefine para que seja possível ativar outra sala
        confirmRenameRoom(roomID); // Chama a função de confirmação
    } else {
        // Primeiro clique
        console.log('Ativando área de renome para a sala:', roomID);
        activeRenameRoom = roomID; // Marca esta sala como ativa

        // Ativa o campo de Rename e esconde o Nome atual
        inputRename.style.display = "flex";
        room_name_p.style.display = "none";
        dotsOptions.style.display = "none";
        // Seleciona automaticamente o texto do input ao abrir
        inputRename.focus();
        inputRename.select();
    }
}

// Detectar cliques fora do elemento (cancela a renomeação)
document.addEventListener('click', (event) => {
    if (
        activeRenameRoom && // Há uma sala ativa
        !event.target.closest(`#form_rename-${activeRenameRoom}`) && // Clique fora do formulário
        !event.target.closest(`#sideBar_rename`) // Clique fora do botão
    ) {
        // Um faz o envio, mesmo se o clique for fora, a outra Cancela, é possivel escolher
        // Atual: Confirma
        confirmRenameRoom(activeRenameRoom); // Chama a função de confirmação
        // cancelRenameRoom(activeRenameRoom); // Chama a função de cancelar
        console.log('Clique fora detectado. Confirmando ou Cancelando renome.');
        activeRenameRoom = null; // Redefine o estado ativo
    }
});

// Detectar a tecla Enter (Confirma a renomeação)
document.addEventListener('keydown', (event) => {
    if (activeRenameRoom && event.key === 'Enter') {
        console.log('Tecla Enter pressionada. Confirmando renome para a sala:', activeRenameRoom);
        confirmRenameRoom(activeRenameRoom); // Chama a função de confirmação
        activeRenameRoom = null; // Redefine o estado ativo
    }
});

// Detectar a tecla Esc (Cancela a renomeação)
document.addEventListener('keydown', (event) => {
    if (activeRenameRoom && event.key === 'Escape') {
        console.log('Tecla Esc pressionada. Cancelando renome para a sala:', activeRenameRoom);
        cancelRenameRoom(activeRenameRoom); // Chama a função de cancelamento
        activeRenameRoom = null; // Redefine o estado ativo
    }
});

// Função para cancelar a renomeação (reverte para o estado inicial)
function cancelRenameRoom(roomID) {
    const inputRename = document.getElementById(`input_rename-${roomID}`);
    const room_name_p = document.getElementById(`room_name_p-${roomID}`);
    const dotsOptions = document.getElementById(`btn_roomsEP-${roomID}`);

    // Reverte a visibilidade dos elementos
    inputRename.style.display = "none";
    room_name_p.style.display = "flex";
    dotsOptions.style.display = "flex";

    // Limpa o campo de input ou volta ao valor original
    inputRename.value = room_name_p.textContent; // Reverte o nome de volta para o original
}

// -------------------- CONFIRMAÇÃO DO RENOMEAR e ENVIO AO BD

async function confirmRenameRoom(roomID) {
    // Obtendo os elementos com base no roomID
    const formRename = document.getElementById(`form_rename-${roomID}`);
    const inputRename = document.getElementById(`input_rename-${roomID}`);
    const room_name_p = document.getElementById(`room_name_p-${roomID}`);
    const dotsOptions = document.getElementById(`btn_roomsEP-${roomID}`);

    console.log("CONFIRMADO", roomID);

    // Exibir o novo nome no console
    let newName = inputRename.value.trim();
    console.log("Novo Nome", newName);

    // Verifica se o novo nome não está vazio
    if (!newName) {
        console.error("O nome não pode estar vazio!");
        return;
    }

    // URL do endpoint para enviar os dados
    const currentUrl = `http://127.0.0.1:8000/IAnes/${roomID}/`;

    // Obtendo o token CSRF
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    console.log('Token CSRF:', csrfToken);

    // Preparando os dados para enviar
    const bodyData = `room_id=${roomID}&name_text=${encodeURIComponent(newName)}`;

    try {
        // Fazendo a requisição POST ao servidor
        const response = await fetch(currentUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: bodyData,
        });

        // Tratando a resposta do servidor
        const data = await response.json();
        if (response.ok && data.success) {
            console.log('Sala renomeada com sucesso!', data);
            // Atualizar o nome no elemento
            room_name_p.textContent = newName;
            // Atualiza o título dá página
            document.title = `Sala - ${newName}`
            // Atualiza todos os Textos que só tem o "newName"/"{{ room.title }}" Titulos Atuais
            document.querySelectorAll("#roomTitle_atual").forEach(text => {
                text.textContent = newName
            })
        } else {
            console.error('Erro ao renomear a sala:', data.error || response.statusText);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }

    // Restaura a exibição dos elementos
    inputRename.style.display = "none";
    room_name_p.style.display = "flex";
    dotsOptions.style.display = "flex";

    activeRenameRoom = null; // Redefine o estado ativo
}

// Escutador de no input para configura-lo
if (textarea) {
    textarea.addEventListener("input", configInput);
}

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
// ---------- Variaveis Bases do Overlay

// Variaveis Globais
const overlay_confSalaDel = document.getElementById('confSalaDel_overlay');
const overlayCont_confSalaDel = document.getElementById("ov_confSalaDel_container")
let class_ovConfSalaDel_active = "ov_confSalaDel_container_active"

// Função para alternar a exibição do Confirmar Delete da Sala
function toggleOverlay_confDelete() {
    toggleList(null)
    let overlayState = overlay_confSalaDel.getAttribute("aria-active");

    if (overlayState === "true") {
        overlay_confSalaDel.style.display = "none";
        overlay_confSalaDel.setAttribute("aria-active", "false");
        document.body.style.overflowY = "auto";
        overlayCont_confSalaDel.classList.remove(class_ovConfSalaDel_active);
    } else if (overlayState === "false") {
        overlay_confSalaDel.style.display = "flex";
        overlay_confSalaDel.setAttribute("aria-active", "true");
        document.body.style.overflowY = "hidden";
        overlayCont_confSalaDel.classList.add(class_ovConfSalaDel_active);
    } else {return}
}

function askForDelete(roomId) {
    const btn_delete = document.getElementById("texto_chatIA_deleteRoom_delete")
    const btn_cancel = document.getElementById("texto_chatIA_deleteRoom_cancel")
    toggleOverlay_confDelete()
    setConfirmDelete(roomId)
}
function setConfirmDelete(roomId) {
    let deleteBtn = document.getElementById("texto_chatIA_deleteRoom_delete");
    let rtAtual = document.getElementById("roomTitle_atual");
    let nomeChat = document.getElementById(`room_name_p-${roomId}`);
    deleteBtn.setAttribute('href', `/delete-room/${roomId}/`);
    rtAtual.textContent = nomeChat.textContent

}

// Clique no overlay ou no botão de fechar do Confirmar Delete da Sala
overlay_confSalaDel.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleOverlay_confDelete();
});
// Clique dentro do Container não faz nada
overlayCont_confSalaDel.addEventListener('click', (event) => {
    event.stopPropagation();
});

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
// Use o setTimeout para dar o foco no elemento após 1 segundo
setTimeout(() => {
    if (textarea) {
        textarea.focus();
    }
}, 0);