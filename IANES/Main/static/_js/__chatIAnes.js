const textarea = document.getElementById('user_msg');

// Quando a textarea estiver seleciona "focus" ele muda a cor da borda
const inputContainer = document.querySelector('.input_container');

textarea.addEventListener('focus', () => {
    inputContainer.classList.add('focused');
});

textarea.addEventListener('blur', () => {
    inputContainer.classList.remove('focused');
});

function getTextWidth(text, font) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
}

// ------------- Ajusta as "rows" da textarea quando atinge a largura máxima
function adjustRows(tipo = "padrao") {
    const maxWidth = textarea.clientWidth; // largura da textarea
    const textWidth = getTextWidth(textarea.value, getComputedStyle(textarea).font) || 0;

    if (tipo === "quebra_linha") {
        // Chama a função de ajuste de linhas após a quebra de linha
        const newRows = Math.max(Math.ceil(textWidth / maxWidth), 1);
        textarea.rows = newRows;
    } else {
        // Calcula o número de linhas necessárias com base na largura
        const newRows = Math.max(Math.ceil(textWidth / maxWidth), 1);
        textarea.rows = newRows;
    }

    // Ajusta o line-height se houver mais de uma linha
    if (textarea.rows > 1) {
        textarea.style.lineHeight = '1.5'; // Define um espaço entre as linhas
    } else {
        textarea.style.lineHeight = '1'; // Volta ao normal se tiver apenas uma linha
    }
}

// Ajusta as linhas enquanto o usuário digita
textarea.addEventListener('input', () => {
    adjustRows(); // Chamando a função aqui para ajustar a altura
    toggleButton(); // Atualiza o botão ao digitar
});

// Inativa e Ativa o Botão
function toggleButton() {
    const button = document.getElementById('btn_enviar');

    if (textarea.value.trim() === '') {
        textarea.style.lineHeight = '1';
        button.style.backgroundColor = 'var(--color-cinza)';
        button.style.border = '0vw var(--color-cinza) solid)';
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.5';
    } else {
        button.style.backgroundColor = 'var(--color-vermelho-medio)';
        button.style.border = '0vw var(--color-vermelho-medio) solid)';
        button.style.pointerEvents = 'auto';
        button.style.opacity = '1';
    }
}

// Função para enviar msg com "enter" e pular linha com "shift + enter"
textarea.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            event.preventDefault(); // Evita o comportamento padrão de nova linha

            // Insere uma nova linha na posição atual do cursor
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // Insere a nova linha
            textarea.value = textarea.value.substring(0, start) + '\n' + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 1; // Move o cursor para a nova linha
            
            // Não chama adjustRows aqui, pois queremos evitar o reajuste
            adjustRows("quebra_linha")
        } else {
            // Apenas Enter, envia a mensagem
            enviarMensagem("normal");
            event.preventDefault(); // Evita o comportamento padrão de nova linha
        }
    } else if (event.key === 'Backspace') {
        // Ajusta a altura quando Backspace é pressionado
        setTimeout(adjustRows, 0); // Usa setTimeout para garantir que o valor da textarea foi atualizado
    }
});

// --------------------- AJUSTA A SCROLL DAS RESPOSTA

const respostaContainer = document.querySelector('.resposta_content');
const scrollButton = document.getElementById('scrollButton');

function checkScroll() {
    const scrollHeight = respostaContainer.scrollHeight;
    const scrollTop = respostaContainer.scrollTop;
    const clientHeight = respostaContainer.clientHeight;

    // Verifica se a barra de rolagem está no final
    if (scrollHeight - scrollTop > clientHeight) {
        scrollButton.style.display = 'block'; // Mostra o botão
    } else {
        scrollButton.style.display = 'none'; // Esconde o botão
    }
}

// Adiciona o evento de rolagem
respostaContainer.addEventListener('scroll', checkScroll);

// Adiciona o evento de clique ao botão
scrollButton.addEventListener('click', () => {
    respostaContainer.scrollTop = respostaContainer.scrollHeight; // Rola até o final
});

// Inicializa a verificação no carregamento da página
checkScroll();



// --------------------- SIMULAÇÂO DE CHAT

// ------------- Simula o envio de uma Mensagem

let simul_user_entry = "Cara, você viu o novo álbum do Matuê? A forma como ele mistura trap com elementos de funk e até melodias de MPB é simplesmente surreal! As letras são muito profundas, ele fala sobre suas experiências e a realidade de muitos jovens. Eu me pego refletindo sobre a vida toda vez que escuto. A faixa “M4” é um verdadeiro hino de superação! A produção é impecável, e a maneira como ele brinca com as rimas é uma obra de arte. Você já teve a oportunidade de ver algum show dele ao vivo? É uma energia indescritível, todo mundo cantando junto, é como se estivéssemos numa grande festa em família."

let simul_chat_answer = "Eu vi, mano! O Matuê tá realmente em outra dimensão. Ele conseguiu criar uma conexão tão forte com a galera, e isso é raro. As letras dele falam de luta, amor, e autenticidade, e é por isso que a gente se identifica tanto. A forma como ele aborda a saúde mental e questões sociais também é muito importante, trazendo uma voz pra quem muitas vezes não é ouvido. E os clipes? Cada um é um curta-metragem que conta uma história, com uma estética visual impressionante! Eu fui no último show dele e, cara, foi uma experiência transformadora. A vibe era tão intensa, parecia que todos ali estavam em sintonia, quase como uma terapia coletiva. É incrível ver um artista tão genuíno, né? A música dele tem o poder de unir e inspirar!"

let user_msg;
let typingTimeout;

function enviarMensagem(tipo) {
    if (textarea.value.trim() !== '' || tipo === 'teste') {
        let msg_atual;
        if (tipo === "normal") {
            msg_atual = textarea.value;
        } else if (tipo === "teste") {
            msg_atual = simul_user_entry;
        }

        const user_msg = msg_atual;

        scrollButton.style.display = 'block'; // Mostra o botão

        // Atualiza a UI
        textarea.value = ''; // Limpa a textarea após enviar
        toggleButton(); // Atualiza o estado do botão
        adjustRows(); // Ajusta a altura após limpar
        textarea.style.lineHeight = '1'; // Reseta o line-height
        
        // Altera o botão
        document.getElementById('icon_aviao').style.display = 'none';
        document.getElementById('icon_quadrado').style.display = 'block';
        textarea.placeholder = "IAnes trabalhando...";
        textarea.style.pointerEvents = 'none'; // Desabilita a textarea

        // Adiciona a mensagem do usuário
        const respostaContent = document.querySelector('.resposta_content');
        const userMsgContainer = document.createElement('div');
        userMsgContainer.classList.add('userMSG_container');
        userMsgContainer.innerHTML = `
            <div class="imgPic_user">
                <ion-icon id="userMSG_icon" name="person"></ion-icon>
            </div>
            <div class="userMSG_div">
                <p class="userMSG_p">${user_msg}</p>
            </div>
        `;
        respostaContent.appendChild(userMsgContainer);

        // Inicia a digitação da resposta
        digitarResposta(respostaContent, simul_chat_answer);
    }
}

function digitarResposta(container, resposta) {
    const ianesMsgContainer = document.createElement('div');
    ianesMsgContainer.classList.add('ianesMSG_container');

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('imgPic_ianes');
    imgDiv.innerHTML = `<img src="_midia/logotipos/ianesLogo_PretaT.png" alt="" class="IAnesPic" id="IanesPic">`;

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('ianesMSG_div');
    const p = document.createElement('p');
    p.classList.add('ianesMSG_p');

    msgDiv.appendChild(p);
    ianesMsgContainer.appendChild(imgDiv);
    ianesMsgContainer.appendChild(msgDiv);
    container.appendChild(ianesMsgContainer);

    // Animação de digitação com um loop
    typingTimeout = setTimeout(() => {
        for (let i = 0; i < resposta.length; i++) {
            setTimeout(() => {
                if (i === resposta.length - 1) {
                    resetInput(); // Reseta o estado após digitar
                }
                p.textContent += resposta[i];
            }, i * 5); // Atraso de 5ms entre cada caractere
        }
    }, 500); // Pequeno atraso antes de começar a digitar
}

function resetInput() {
    textarea.placeholder = "Descreva o seu projeto...";
    textarea.style.pointerEvents = 'auto'; // Reabilita a textarea
    document.getElementById('icon_aviao').style.display = 'block';
    document.getElementById('icon_quadrado').style.display = 'none';
}

function stopTyping() {
    clearTimeout(typingTimeout);
    resetInput();
}

addEventListener.

// Chama a função inicialmente para definir o estado correto
toggleButton();
adjustRows()