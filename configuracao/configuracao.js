if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/cardapio/alunos/pwabuilder-sw.js').then((registration) => {
            console.log('Service Worker registrado com sucesso:', registration);
        }).catch((error) => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
    });
}

const checkboxTheme = document.querySelector('.checkbox-theme');

// Obtem os dados salvos em local storage
if (localStorage.getItem('cardapio-dark-mode') && localStorage.getItem('cardapio-dark-mode') === 'true') {
    checkboxTheme.checked = true;
    document.documentElement.classList.add('tema-escuro');
}

// Aguarda mudança no swith para alterar o tema
checkboxTheme.addEventListener('change', () => {
    localStorage.setItem('cardapio-dark-mode', checkboxTheme.checked);
    location.reload();
});

// Carrega tema escuro
if (localStorage.getItem('cardapio-dark-mode') && localStorage.getItem('cardapio-dark-mode') === 'true') document.documentElement.classList.add('tema-escuro')

// Aguarda evento de clique no botão de voltar para voltar a ppagina inicial
document.querySelector('.back-home').addEventListener('click', () => location.href = '../alunos/index.html');

// Aguarda evento de clique no botão de copia para copiar o link do site
document.querySelector('.btn-copy-link').addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('https://eierick.github.io/cardapio/alunos/');

    e.target.innerText = 'Copiado!';
    setTimeout(() => {
        e.target.innerText = 'Copiar link';
    }, 2000);
});
