// Função para carregar HTML em um elemento
async function loadHTML(elementId, url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erro ao carregar ${url}: ${response.statusText}`);
    }
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
}
// Função para adicionar um elemento ao head
function addToHead(tagName, attributes) {
  const existingTags = document.head.getElementsByTagName(tagName);
  for (let i = 0; i < existingTags.length; i++) {
      if (existingTags[i].getAttribute('href') === attributes.href || 
          existingTags[i].getAttribute('src') === attributes.src) {
          console.log(`!!! Elemento ${tagName} já existe no head:`, attributes);
          return; // Não adiciona se já existir
      }
  }
  const tag = document.createElement(tagName);
  for (const key in attributes) {
      tag.setAttribute(key, attributes[key]);
  }
  document.head.appendChild(tag);
  console.log(`⚙ Elemento ${tagName} adicionado ao head:`, attributes);
}


// Função para criar o Cabeçalho Assistente
let prevScrollPos = window.pageYOffset;

window.onscroll = function() {
  const currentScrollPos = window.pageYOffset;

  if (prevScrollPos > currentScrollPos) {
    document.getElementById("header").style.top = "0";
  } else {
    document.getElementById("header").style.top = "-3vw"; // Ajuste este valor para corresponder à altura da sua barra de navegação ! DEIXE ELE NEGATIVO"
  }

  prevScrollPos = currentScrollPos;
};

// Função principal que chama outras funções
function executarFuncoes() {
  if (typeof appendInList_lang === 'function') {
      console.log("⚙ Inserindo Idiomas Disponiveis");
      appendInList_lang();
  }
  if (typeof appendInList_tema === 'function') {
      console.log("⚙ Inserindo Temas Disponiveis");
      appendInList_tema();
  }
  // Essas DEVEM ser as EXECUTADAS DEPOIS de qualquer coisa que é aplicada ao Header
  if (typeof detectarPreferido_Idioma === 'function') {
      console.log("⚙ Detectando idioma preferido");
      detectarPreferido_Idioma();
  }
  if (typeof detectarPreferido_ColorScheme === 'function') {
      console.log("⚙ Detectando esquema de cores preferido");
      detectarPreferido_ColorScheme();  
  }
}

// Usando o evento 'load' para garantir que o código só execute após a página estar totalmente carregada
document.addEventListener('DOMContentLoaded', function() {
  // Adicionando o favicon
  addToHead('link', {
    rel: 'icon',
    type: 'image/x-icon',
    href: 'https://raw.githubusercontent.com/Francisco-Neves-15/ianes-front---repository/3932a9bcb74c20bdb3c85f4d80c678a24184cef4/_midia/_logotipos/ianesFavicon_PretaA.png'
  });

  // Adicionando a fonte Montserrat
  addToHead('link', {
    href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
    rel: 'stylesheet'
  });

  // Import WebComponent do BoxIcons
  addToHead('script', {
    src: 'https://unpkg.com/boxicons@2.1.4/dist/boxicons.js'
  });

  // Import do Material Icons
  addToHead('link', {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
  });

  // Import WebComponent do Ionic Icons
  addToHead('script', {
    type: 'module',
    src: 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'
  });
  // Coloque aqui as funções que não dependem do header/footer.
});


async function carregarComponentes() {
  await Promise.all([
      loadHTML('header', '/static/_header.html'),
      loadHTML('footer', '/static/_footer.html')
  ]);
  
  console.log("⚙ HEADER e FOOTER carregados");
}

document.addEventListener('DOMContentLoaded', async function() {
  await carregarComponentes();
  
  // Verifique se os elementos estão no DOM
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');
  console.log("Header:", header);
  console.log("Footer:", footer);

  executarFuncoes();
  // detectarPreferido_Idioma();
  // detectarPreferido_ColorScheme();
});