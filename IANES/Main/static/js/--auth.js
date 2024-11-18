// Função que exibe a tela correspondente
window.detectar_auth = function() {
    let tela_padrao = 'login';
    let telaAtual_auth_uso = localStorage.getItem('telaAtual_auth'); // Use 'let' aqui

    if (!telaAtual_auth_uso) {
        localStorage.setItem('telaAtual_auth', `ta_auth-${tela_padrao}`);
        telaAtual_auth_uso = tela_padrao;  // Agora pode atribuir um novo valor
        window.location.reload(true);
    }

    let ta_auth_id = telaAtual_auth_uso.split("-")[1];

    const solo_container = document.getElementById(`container_${ta_auth_id}`)
    const todos_containers = document.querySelectorAll(".container_content")

    todos_containers.forEach(item => {
        item.style.display = "none"
    })
    if (solo_container) {solo_container.style.display = "flex"}

    console.log("⚙ Detectando configurando tela de Auth");
};

// Função para chamar e mostrar as telas relevantes
window.callScreen_auth = function(page) {
    console.log("Switching screen to:", page);
    const solo_container = document.getElementById(`container_${page}`)
    const todos_containers = document.querySelectorAll(".container_content")
    localStorage.setItem('telaAtual_auth', `ta_auth-${page}`);

    todos_containers.forEach(item => {
        item.style.display = "none"
    })

    if (solo_container) {solo_container.style.display = "flex"}
}

// function callScreen_auth(type) {
//     console.log("Tipo recebido:", type);  // Deve exibir "signup" no console
//     if (type === 'signup') {
//         document.getElementById('container_login').style.display = 'none';
//         document.getElementById('container_signup').style.display = 'block';
//     } else if (type === 'login') {
//         document.getElementById('container_login').style.display = 'block';
//         document.getElementById('container_signup').style.display = 'none';
//     }
// }

// Troca a cor da Barra de Baixo dos Input's
document.getElementById('forms_signup').addEventListener('submit', function(event) {
    // Impede o envio do formulário para capturar os dados primeiro
    // event.preventDefault();

    // Captura os valores dos campos
    const username =  document.getElementById('input_signup_user').value;
    const email = document.getElementById('input_signup_email').value;
    const password = document.getElementById('input_senha_signup').value;
    const confirmPassword = document.getElementById('input_senha_signupConf').value;
    const termsAccepted = document.getElementById('check_concordo_TermPriv').value;

    // Exibe as informações no console
    console.log("Informações do Sign Up:");
    console.log("Usuário:", username);
    console.log("Email:", email);
    console.log("Senha:", password);
    console.log("Confirmação de Senha:", confirmPassword);
    console.log("Termos e condições aceitos:", termsAccepted);

    // Aqui você pode prosseguir com o envio, se necessário
    this.submit();
});
document.querySelectorAll('.input_area').forEach(input => {
    input.addEventListener('focus', function() {
        const divInputArea = this.parentElement;
        divInputArea.classList.add('active'); // Adiciona a classe 'active' ao elemento pai
    });

    input.addEventListener('blur', function() {
        const divInputArea = this.parentElement;
        divInputArea.classList.remove('active'); // Remove a classe 'active' ao perder o foco
    });
});

// Coisas para mostrar a Tooltip

function showTooltip(tooltipId) {
    const tooltips = document.querySelectorAll(`.${tooltipId}`)
    tooltips.forEach(tooltip => {
        if (tooltip) {
            tooltip.style.display = 'block';
        }
    })
}

function hideTooltip(tooltipId) {
    const tooltips = document.querySelectorAll(`.${tooltipId}`)
    tooltips.forEach(tooltip => {
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    })
}

// Coisas para Mostrar e Esconder Senha

function alterarEye(senhaId) {
    // O Nome dos Icones seguem os padrões que estão em `string` o "senhaId" é oque diferencia um do outro
    
    // O Icone do Eye
    const eyeIcon = document.getElementById(`eye_icon_${senhaId}`)

    // Tooltip dos Eye
    const eyeIcon_open_tooltip = document.getElementById(`tooltip_eye_${senhaId}_open`)
    const eyeIcon_close_tooltip = document.getElementById(`tooltip_eye_${senhaId}_close`)

    // Container do Eye
    const eyeContainer = document.getElementById(`eye_password_${senhaId}`);
    // Pode ser 'pass_hide' ou 'pass_show'
    const ariaState = eyeContainer.getAttribute('aria-state');

    // Input da Senha
    const inputSenha = document.getElementById(`input_senha_${senhaId}`);

    // Faz mostrar a senha e trocar a tooltip
    if (ariaState === "pass_hide") {
        inputSenha.type = 'text';
        eyeIcon.setAttribute('name', 'eye-off-outline')
        // Tooltip "Mostrar Senha" some
        eyeIcon_open_tooltip.style.zIndex = 50
        eyeIcon_open_tooltip.style.opacity = 0
        // Tooltip "Esconder Senha" aparece
        eyeIcon_close_tooltip.style.zIndex = 51
        eyeIcon_close_tooltip.style.opacity = 1
        // Troca o Aria-State
        eyeContainer.setAttribute('aria-state', 'pass_show')
    } else if (ariaState === "pass_show") {
        inputSenha.type = 'password';
        eyeIcon.setAttribute('name', 'eye-outline')
        // Tooltip "Mostrar Senha" aparece
        eyeIcon_open_tooltip.style.zIndex = 51
        eyeIcon_open_tooltip.style.opacity = 1
        // Tooltip "Esconder Senha" some
        eyeIcon_close_tooltip.style.zIndex = 50
        eyeIcon_close_tooltip.style.opacity = 0
        // Troca o Aria-State
        eyeContainer.setAttribute('aria-state', 'pass_hide')
    }
}

// --- Variaveis dos Input - LOGIN
// Variavel do User ou Email
const userORemail_input = document.getElementById('input_login_userORemail');
// Variavel Senha Login
const password_input_login = document.getElementById('input_senha_login');

// --- Variaveis dos Input - SIGNUP
// Variavel do User
const user_input = document.getElementById('input_signup_user');
// Variavel do Email
const email_input = document.getElementById('input_signup_email');
// Variavel do Senha Signup
const password_input_signup = document.getElementById('input_senha_signup');
// Variavel do Confirmar Senha Signup
const confpassword_input_signup = document.getElementById('input_senha_signupConf');
//
const checkbox_concorda = document.getElementById('check_concordo_TermPriv');

// Variavel do Container de Validações
const container_listaValidacoes = document.getElementById("container_listaValidacoes")

// Verificar se o container de validação estao Aparecendo ou Nao
let containerHidden = false; // Variável para controlar se o container já foi escondido

// Definindo validações para permitir auteticação
let userORemail_valid = false;
let senha_login_valid = false;

let user_valid = false;
let email_valid = false;
let senha_signp_valid = false;
let confSenha_signp_valid = false;
let checkConcordo_valid = false;

// ----- Função de Validação
function validarSenha_vivo() {
    const password = password_input_signup.value;
    const confpassword = confpassword_input_signup.value;

    const bar_fraca = document.getElementById('bar_senha_fraca');
    const bar_media = document.getElementById('bar_senha_media');
    const bar_forte = document.getElementById('bar_senha_forte');

    // Adiciona um evento para detectar a tecla pressionada
    password_input_signup.addEventListener('keydown', function(event) {
        if (event.key === 'Backspace') {
            container_listaValidacoes.style.display = 'flex';
            containerHidden = false
        }
    });

    // Verificar se o campo está vazio
    if (password.length === 0) {
        // Resetar a barra de força
        bar_fraca.style.backgroundColor = 'var(--color-cinza)';
        bar_media.style.backgroundColor = 'var(--color-cinza)';
        bar_forte.style.backgroundColor = 'var(--color-cinza)';
        bar_fraca.style.opacity = '0.5';
        bar_media.style.opacity = '0.5';
        bar_forte.style.opacity = '0.5';
    }

    const lengthValid = password.length >= 8;
    const uppercaseValid = /[A-Z]/.test(password);
    const lowercaseValid = /[a-z]/.test(password);
    const numbersValid = (password.match(/\d/g) || []).length >= 2;
    const specialValid = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= 2;
    const consecutiveValid = !/(.)\1{2,}/.test(password);
    const irregularValid = !/[.,: ]/.test(password);

    let score = 0;
    score += lengthValid ? 20 : 0;
    score += uppercaseValid ? 20 : 0;
    score += lowercaseValid ? 20 : 0;
    score += numbersValid ? 20 : 0;
    score += specialValid ? 20 : 0;

    if (!consecutiveValid || !irregularValid) {
        score = 20; // Se inválido, força a classificação fraca
        container_listaValidacoes.style.display = "flex";
        containerHidden = false;
    }

    // Configurações das Barras
    const bar_color_vermelha = 'var(--color-vermelho-main)';
    const bar_color_laranja = 'var(--color-laranja-atomic)';
    const bar_color_verde = 'var(--color-verde-sucesso)';
    const bar_color_cinza = 'var(--color-cinza)';
    const bar_opacity_full = '1';
    const bar_opacity_mini = '0.5';

    // Atualizando as barras de força
    if (score < 20) {
        bar_fraca.style.backgroundColor = bar_color_cinza;
        bar_fraca.style.opacity = bar_opacity_mini;
        bar_media.style.backgroundColor = bar_color_cinza;
        bar_media.style.opacity = bar_opacity_mini;
        bar_forte.style.backgroundColor = bar_color_cinza;
        bar_forte.style.opacity = bar_opacity_mini;
    } else if (score >= 20 && score < 60) {
        bar_fraca.style.backgroundColor = bar_color_vermelha;
        bar_fraca.style.opacity = bar_opacity_full;
        bar_media.style.backgroundColor = bar_color_cinza;
        bar_media.style.opacity = bar_opacity_mini;
        bar_forte.style.backgroundColor = bar_color_cinza;
        bar_forte.style.opacity = bar_opacity_mini;
    } else if (score >= 60 && score < 100) {
        bar_fraca.style.backgroundColor = bar_color_laranja;
        bar_fraca.style.opacity = bar_opacity_full;
        bar_media.style.backgroundColor = bar_color_laranja;
        bar_media.style.opacity = bar_opacity_full;
        bar_forte.style.backgroundColor = bar_color_cinza;
        bar_forte.style.opacity = bar_opacity_mini;
    } else if (score >= 100) {
        bar_fraca.style.backgroundColor = bar_color_verde;
        bar_fraca.style.opacity = bar_opacity_full;
        bar_media.style.backgroundColor = bar_color_verde;
        bar_media.style.opacity = bar_opacity_full;
        bar_forte.style.backgroundColor = bar_color_verde;
        bar_forte.style.opacity = bar_opacity_full;
    
        // Esconder o Container apenas uma vez
        if (containerHidden == false) {
            container_listaValidacoes.style.display = "none";
            containerHidden = true;
        } else {
            containerHidden = false
        }
    }

    // Atualizando a lista de validações
    const listItems = document.querySelectorAll('#tooltip_senhaInvalida li');
    listItems.forEach(item => {
        const condition = item.getAttribute('data-condition');
        const valid = eval(`${condition}Valid`);
        item.style.color = valid ? 'var(--color-verde-sucesso)' : 'var(--color-vermelho-main)';
    });

    const container_senhaNIgual = document.getElementById("div_confSenha_nIgual")
    if (password !== confpassword) {
        container_senhaNIgual.style.display = "flex"
        senha_signp_valid = false
        confSenha_signp_valid = false
    } else if (password === confpassword) {
        container_senhaNIgual.style.display = "none"
        senha_signp_valid = true
        confSenha_signp_valid = true
    }
    validarCriarConta()
}

// Signup - Confirmar e Validar Usuarios, Email e Senhas

function validarConfirmarSenha_vivo() {
    const password = password_input_signup.value;
    const confpassword = confpassword_input_signup.value;

    const container_senhaNIgual = document.getElementById("div_confSenha_nIgual")

    // Verificar se o campo está vazio, só funciona se não estiver vazio
    if (confpassword.length === 0) {
        container_senhaNIgual.style.display = "none"
        senha_signp_valid = false
        confSenha_signp_valid = false
    } else {

        if (password !== confpassword) {
            container_senhaNIgual.style.display = "flex"
            senha_signp_valid = false
            confSenha_signp_valid = false
        } else if (password === confpassword) {
            container_senhaNIgual.style.display = "none"
            senha_signp_valid = true
            confSenha_signp_valid = true
        }
    }
    validarCriarConta()
}

// SIMULAR SISTEMA DE LOGIN

// Exemplo de lista de usuários existentes
const listaUsuarios = ["usuario1", "usuario2", "user-test", "user_name"];

function validarUsuario() {
    const user = user_input.value;
    
    const container_user_invalido = document.getElementById("div_user_inv");
    const container_user_existente = document.getElementById("div_user_exis");
    const contador = document.getElementById("texto_user_maximoChar");

    // Atualiza a contagem de caracteres
    contador.textContent = user.length;

    // Verificar se o campo está vazio
    if (user.length === 0) {
        container_user_invalido.style.display = "none";
        container_user_existente.style.display = "none";
        user_valid = false;
    } else if (user.length < 6 || user.length > 30) {
        // Verificar se o comprimento está dentro dos limites
        container_user_invalido.style.display = "flex"; // Exibir mensagem de usuário inválido
        container_user_existente.style.display = "none";
        user_valid = false;
    } else {
        // Validar se o usuário atende aos requisitos
        const validacaoRegex = /^[a-zA-Z0-9-_]+$/; // Apenas letras, números, "-", e "_"

        if (!validacaoRegex.test(user)) {
            // Se não for válido, mostra o container de usuário inválido
            container_user_invalido.style.display = "flex";
            container_user_existente.style.display = "none";
        } else {
            // Se for válido, verifica se já existe na lista
            if (listaUsuarios.includes(user)) {
                // Se o usuário já existe, mostra o container de usuário existente
                container_user_invalido.style.display = "none";
                container_user_existente.style.display = "flex";
            } else {
                // Se tudo estiver válido, define user_valid como true
                container_user_invalido.style.display = "none";
                container_user_existente.style.display = "none";
                user_valid = true;
            }
        }
    }
    validarCriarConta()
}

// Exemplo de lista de emails existentes
const listaEmails = ["usuario1@example.com", "usuario2@example.com", "user-test@example.com", "user_name@example.com"];

function validarEmail() {
    const email = email_input.value;
    
    const container_email_invalido = document.getElementById("div_email_inv");
    const container_email_existente = document.getElementById("div_email_exis");

    // Verificar se o campo está vazio
    if (email.length === 0) {
        container_email_invalido.style.display = "none";
        container_email_existente.style.display = "none";
        email_valid = false;
    } else {
        // Regex para validar o formato do email
        const validacaoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Formato básico de e-mail
        email_valid = false;

        if (!validacaoRegex.test(email)) {
            // Se não for válido, mostra o container de e-mail inválido
            container_email_invalido.style.display = "flex";
            container_email_existente.style.display = "none";
        } else {
            // Se for válido, verifica se já existe na lista
            if (listaEmails.includes(email)) {
                // Se o e-mail já existe, mostra o container de e-mail existente
                container_email_invalido.style.display = "none";
                container_email_existente.style.display = "flex";
            } else {
                // Se tudo estiver válido, define email_valid como true
                container_email_invalido.style.display = "none";
                container_email_existente.style.display = "none";
                email_valid = true;
            }
        }
    }
    validarCriarConta()
}

function validarCheck_concordo() {
    // True ou False
    if (checkbox_concorda.checked) {
        checkConcordo_valid = true
    } else {
        checkConcordo_valid = false
    }
    validarCriarConta()
}

// Função para Validar a Criação de Conta
function validarCriarConta() {
    const btn_entrar_signup = document.getElementById("btn_entrar_signup");

    // Verifica se todas as validações estão true, incluindo o checkbox
    let criarValido = user_valid && email_valid && senha_signp_valid && confSenha_signp_valid && checkConcordo_valid;

    // console.log("User Valido: ", user_valid)
    // console.log("Email Valido: ", email_valid)
    // console.log("Senha Signup Valido: ", senha_signp_valid)
    // console.log("Confirmar Senha Signup Valido: ", confSenha_signp_valid)
    // console.log("Concordo Valido: ", checkConcordo_valid)
    // console.log("Ta Valido?: ", criarValido)
    // console.log("---------------------------------------")

    if (criarValido) {
        btn_entrar_signup.style.pointerEvents = "all";
        btn_entrar_signup.style.opacity = "1";
    } else {
        btn_entrar_signup.style.pointerEvents = "none";
        btn_entrar_signup.style.opacity = "0.7";
    }
}

function criarConta_ianes() {
    // Capturando os valores dos campos
    const userInfos = {
        user: user_input.value,
        email: email_input.value,
        password: password_input_signup.value,
        confPassword: confpassword_input_signup.value,
        checkConcordo_valid: checkbox_concorda.checked
    };

    // Limpar Campos
    // user_input.value = '';
    // email_input.value = '';
    // password_input_signup.value = '';
    // confpassword_input_signup.value = '';
    // checkbox_concorda.checked = false// Limpa a checkbox

    // Remover item do localStorage
    localStorage.removeItem("tela_auth");

    // Exibir os dados no console
    console.log(userInfos);

    // Navegar para outra página, se necessário
    // navigateTo('index_page', 'normal');
}

// Adiciona o evento de entrada para os 4 Inputs os inputs
user_input.addEventListener('input', validarUsuario);
email_input.addEventListener('input', validarEmail);
password_input_signup.addEventListener('input', validarConfirmarSenha_vivo);
confpassword_input_signup.addEventListener('input', validarConfirmarSenha_vivo);
checkbox_concorda.addEventListener('change', validarCheck_concordo)

// Adiciona o evento para validar a senha enquanto o usuário digita
password_input_signup.addEventListener('input', validarSenha_vivo);

// Chama a função de validação ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    validarCriarConta()
    validarUsuario()
    validarEmail()
    validarSenha_vivo();
    validarConfirmarSenha_vivo()
    validarCheck_concordo()
});

// document.getElementById('forms_signup').addEventListener('submit', function(event) {
//     event.preventDefault(); // Impede a submissão padrão do formulário
//     // Lógica para processar o formulário aqui
// });

// Mostrar Box de Validações
document.querySelectorAll('#input_senha_signup').forEach(input => {
    const container_listaValidacoes = document.getElementById("container_listaValidacoes")

    input.addEventListener('focus', function() {
        container_listaValidacoes.style.display = "flex"
        containerHidden = false;
    });

    input.addEventListener('blur', function() {
        container_listaValidacoes.style.display = "none"
        containerHidden = true;
    });
});

setTimeout(() => {
    detectar_auth()
}, 500);

// Adiciona um ouvinte para o evento hashchange
window.onhashchange = function() {
    rolarPara("topo_screen");
};

// window.onbeforeunload = function() {
//     userORemail_input.value = '';
//     password_input_login.value = '';
//     user_input.value = '';
//     email_input.value = '';
//     password_input_signup.value = '';
//     confpassword_input_signup.value = '';
// };