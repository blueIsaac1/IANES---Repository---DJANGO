
    let user_msg; // Variável global

    function toggleButton() {
        const textarea = document.getElementById('user_msg');
        user_msg = textarea.value; // Atualiza a variável global

        const button = document.getElementById('btn_enviar');
        if (user_msg.trim() === '') {
            button.classList.remove('active');
        } else {
            button.classList.add('active');
        }
    }

    function enviarMensagem() {
        if (user_msg.trim() !== '') {
            console.log('Mensagem enviada:', user_msg);
            document.getElementById('user_msg').value = ''; // Limpa a textarea
            toggleButton(); // Atualiza o estado do botão
        }
    }

    // Adiciona o evento para detectar pressionamento de teclas
    document.getElementById('user_msg').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                // Se Shift + Enter, pula uma linha
                const textarea = event.target;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;

                // Insere uma nova linha
                textarea.value = textarea.value.substring(0, start) + '\n' + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1; // Move o cursor para a nova linha
                event.preventDefault(); // Evita o comportamento padrão
            } else {
                // Apenas Enter, envia a mensagem
                enviarMensagem();
                event.preventDefault(); // Evita o comportamento padrão de nova linha
            }
        }
    });

    // Chama a função inicialmente para definir o estado correto
    toggleButton();