if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/cardapio/alunos/pwabuilder-sw.js').then((registration) => {
            console.log('Service Worker registrado com sucesso:', registration);
        }).catch((error) => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
    });
}

const themeSelect = document.querySelector('.theme');
const savedTheme = localStorage.getItem('cardapio-theme');

// Obtem os dados salvos em local storage e carrega o tema
if (savedTheme) {
    themeSelect.value = savedTheme;
    
    if (savedTheme === 'auto') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.add('light');
        }
    } else {
        document.documentElement.classList.add(savedTheme);
    }
}

// Aguarda mudança no swith para alterar o tema
themeSelect.addEventListener('change', () => {
    localStorage.setItem('cardapio-theme', themeSelect.value);
    location.reload();
});

// Carrega o zoom salvo em local storage
if (localStorage.getItem('cardapio-escala')) alterarZoom(localStorage.getItem('cardapio-escala'));

// Aguarda evento de clique no botão de adicionar escala para aumentar a escala
document.querySelector('.btn-adicionar-escala').addEventListener('click', () => alterarZoom((Number(document.querySelector('.valor-escala').textContent) + 10) / 100));
// Aguarda evento de clique no botão de reduzir escala para diminuir a escala
document.querySelector('.btn-reduzir-escala').addEventListener('click', () => alterarZoom((Number(document.querySelector('.valor-escala').textContent) - 10) / 100));

// Aguarda evento de clique no valor da escala para retornar ao padrão
document.querySelector('.valor-escala').addEventListener('click', () => alterarZoom(1));

// Aguarda evento de clique no botão de voltar para voltar a ppagina inicial
document.querySelector('.back-home').addEventListener('click', () => location.href = '../alunos/index.html');

// Aguarda evento de clique no botão de compartilhar para abrir o menu de compartilhamento ou copiar o link do site
document.querySelector('.btn-compartilhar').addEventListener('click', async (e) => {
    try {
        await navigator.share({
            title: 'Onrange',
            text: 'Acesse o cardápio da escola de forma simples, rápida e digital!',
            url: 'https://eierick.github.io/cardapio/alunos/',
        });
    } catch (err) {
        navigator.clipboard.writeText('https://eierick.github.io/cardapio/alunos/');
        e.target.innerText = 'Link Copiado!';
        setTimeout(() => {
            e.target.innerText = 'Compartilhar';
        }, 2000);
    }
});

// Altera o zoom na página
function alterarZoom(valor) {
    if (valor < 0.50 || valor > 3) return;
    document.body.style.zoom = valor;
    localStorage.setItem('cardapio-escala', valor);
    exibirZoom(valor);
}

// Exibi o valor de zoom no elemento '.valor-escala'
function exibirZoom(valor) {
    document.querySelector('.valor-escala').textContent = parseInt(valor*100);
}
