// Função para abrir ou fechar o popup
function openPopup_tema() {
    var popup = document.getElementById('popup_tema');
    var tooltip = document.querySelector('#tooltip_mudartema');
    
    // Alternar a classe 'show_popup_tema'
    if (popup.classList.contains('show_popup_tema')) {
        popup.classList.remove('show_popup_tema');
        tooltip.style.visibility = 'visible'; //
    } else {
        popup.classList.add('show_popup_tema'); //
        tooltip.style.visibility = 'hidden'; //
    }
}

// Função para fechar o popup
function closePopup_tema() {
    var popup = document.getElementById('popup_tema');
    var tooltip = document.querySelector('#tooltip_mudartema');

    popup.classList.remove('show_popup_tema');
    tooltip.style.visibility = 'visible';
}

// Função para fechar o popup quando clicar fora dele
function closePopup_tema_clickOut(event) {
    var popup = document.getElementById('popup_tema');
    var button = document.querySelector('.change_theme_div');
    
    if (!popup.contains(event.target) && !button.contains(event.target)) {
        closePopup_tema();
    }
}

// Função para abrir ou fechar o popup
function openPopup_lang() {
    var popup = document.getElementById('popup_language');
    var tooltip = document.querySelector('#tooltip_mudaridioma');

    if (popup.classList.contains('show_popup_lang')) {
        // Se o popup está visível, fecha-o
        popup.classList.remove('show_popup_lang');
        tooltip.style.visibility = 'visible';
    } else {
        // Se o popup está oculto, abre-o
        popup.classList.add('show_popup_lang');
        tooltip.style.visibility = 'hidden';
    }
}

// Função para fechar o popup
function closePopup_lang() {
    var popup = document.getElementById('popup_language');
    var tooltip = document.querySelector('#tooltip_mudaridioma');

    popup.classList.remove('show_popup_lang');
    tooltip.style.visibility = 'visible';
}

// Função para fechar o popup quando clicar fora dele
function closePopup_lang_clickOut(event) {
    var popup = document.getElementById('popup_language');
    var button = document.querySelector('.change_lang_div');

    if (!popup.contains(event.target) && !button.contains(event.target)) {
        closePopup_lang();
    }
}

// Adiciona um listener para o clique fora do popup
document.addEventListener('click', closePopup_tema_clickOut);

// Adiciona um listener para o clique fora do popup
document.addEventListener('click', closePopup_lang_clickOut);

// Função para Preencher automaticamente os Idiomas e Tema
const idiomas = {
    device: {
        lang_code: "device",
        lang_icon: "laptop-outline",
        lang_name: "Usar o Idioma do dispositivo"
    },
    pt_BR: {
        lang_code: "pt-BR",
        img_url: "https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/2ed6e8aaf86b263f603e3a95d1958450a5e0ff87/_midia/_flag/flag_br.png",
        lang_name: "Português (Brasil)"
    },
    pt: {
        lang_code: "pt",
        img_url: "https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/3932a9bcb74c20bdb3c85f4d80c678a24184cef4/_midia/_flag/flag_pt.png",
        lang_name: "Português (Portugal)"
    },
    en_US: {
        lang_code: "en-US",
        img_url: "https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/3932a9bcb74c20bdb3c85f4d80c678a24184cef4/_midia/_flag/flag_us.png",
        lang_name: "Inglês (Americano)"
    },
    en_GB: {
        lang_code: "en-GB",
        img_url: "https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/2ed6e8aaf86b263f603e3a95d1958450a5e0ff87/_midia/_flag/flag_uk.png",
        lang_name: "Inglês (Britânico)"
    },
    fr: {
        lang_code: "fr",
        img_url: "https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/3932a9bcb74c20bdb3c85f4d80c678a24184cef4/_midia/_flag/flag_fr.png",
        lang_name: "Francês"
    },
    eo: {
        lang_code: "eo",
        img_url: "https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/2ed6e8aaf86b263f603e3a95d1958450a5e0ff87/_midia/_flag/flag_eo.png",
        lang_name: "Esperanto"
    }
};

function appendInList_lang() {
    const langOptionList = document.getElementById('langOption_list');

    // Itera sobre cada idioma no objeto
    for (const key in idiomas) {
        const { lang_code, lang_icon, img_url, lang_name } = idiomas[key];

        // Cria a div da opção de idioma
        const langOption = document.createElement('div');
        langOption.classList.add('lang_option');
        langOption.id = `lang_${lang_code}`;
        langOption.onclick = () => aplicarIdioma(lang_code);

        // Verifica se é a opção de dispositivo ou uma imagem
        if (img_url) {
            // Cria o elemento de imagem
            const imgElement = document.createElement('img');
            imgElement.src = img_url;
            imgElement.alt = `${lang_name} flag`;
            langOption.appendChild(imgElement);
        } else if (lang_icon) {
            // Cria o elemento do ícone
            const deviceIcon = document.createElement('ion-icon');
            deviceIcon.setAttribute('name', lang_icon);
            langOption.appendChild(deviceIcon);
        }

        // Cria o parágrafo
        const pElement = document.createElement('p');
        pElement.id = `lang_${lang_code}_p`;
        pElement.textContent = lang_name;
        langOption.appendChild(pElement);

        // Cria o span para o check
        const spanElement = document.createElement('span');
        spanElement.classList.add('lang_check');
        spanElement.id = `lang_check--${lang_code}`;

        const checkIcon = document.createElement('ion-icon');
        checkIcon.setAttribute('name', 'checkmark-outline');
        spanElement.appendChild(checkIcon);
        langOption.appendChild(spanElement);

        // Adiciona a opção de idioma à lista
        langOptionList.appendChild(langOption);
    }
}

const temas = {
    device: {
        tema_code: "device",
        tema_icon: "laptop-outline",
        tema_name: "Usar o tema do dispositivo"
    },
    light: {
        tema_code: "light",
        tema_icon: "sunny-outline",
        tema_name: "Tema Claro"
    },
    dark: {
        tema_code: "dark",
        tema_icon: "moon-outline",
        tema_name: "Tema Escuro"
    },
};

function appendInList_tema() {
    const temaOptionList = document.getElementById('temaOption_list');

    for (const key in temas) {
        const { tema_code, tema_icon, tema_name } = temas[key];

        const temaOption = document.createElement('div');
        temaOption.classList.add('tema_option'); // Classe correta
        temaOption.id = `tema_${tema_code}`; // ID gerado: tema_light, tema_dark, tema_device
        temaOption.onclick = () => aplicarTema(tema_code);

        const deviceIcon = document.createElement('ion-icon');
        deviceIcon.setAttribute('name', tema_icon);
        temaOption.appendChild(deviceIcon);

        const pElement = document.createElement('p');
        pElement.textContent = tema_name;
        temaOption.appendChild(pElement);

        const spanElement = document.createElement('span');
        spanElement.classList.add('tema_check'); // Classe correta
        spanElement.id = `tema_check--${tema_code}`; // IDs gerados: tema_check--light, tema_check--dark, tema_check--device

        const checkIcon = document.createElement('ion-icon');
        checkIcon.setAttribute('name', 'checkmark-outline');
        spanElement.appendChild(checkIcon);
        temaOption.appendChild(spanElement);

        temaOptionList.appendChild(temaOption);
    }
}