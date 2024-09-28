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
const ultimaAlteracao = localStorage.getItem('cardapio-ultima-alteracao');

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

document.querySelector('.menu-ultima-alteracao').style.display = 'none';

if (ultimaAlteracao) {
    document.querySelector('.menu-ultima-alteracao').style.display = 'block';
    document.querySelector('.dia-ultima-alteracao').textContent = ultimaAlteracao;
}

// Aguarda mudança no swith para alterar o tema
themeSelect.addEventListener('change', () => {
    localStorage.setItem('cardapio-theme', themeSelect.value);
    location.reload();
});

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

// Exibi o valor de zoom no elemento '.valor-escala'
function exibirZoom(valor) {
    document.querySelector('.valor-escala').textContent = parseInt(valor*100);
}
