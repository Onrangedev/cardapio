const checkboxTheme = document.querySelector('.checkbox-theme');

if (localStorage.getItem('cadapio-dark-mode') && localStorage.getItem('cadapio-dark-mode') === 'true') {
    checkboxTheme.checked = true;
    document.documentElement.classList.add('tema-escuro');
}

checkboxTheme.addEventListener('change', () => {
    localStorage.setItem('cadapio-dark-mode', checkboxTheme.checked);
    location.reload();
});

// Carrega tema escuro
if (localStorage.getItem('cadapio-dark-mode') && localStorage.getItem('cadapio-dark-mode') === 'true') {
    document.documentElement.classList.add('tema-escuro');
}