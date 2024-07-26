const checkboxTheme = document.querySelector('.checkbox-theme');

if (localStorage.getItem('cardapio-dark-mode') && localStorage.getItem('cardapio-dark-mode') === 'true') {
    checkboxTheme.checked = true;
    document.documentElement.classList.add('tema-escuro');
}

checkboxTheme.addEventListener('change', () => {
    localStorage.setItem('cardapio-dark-mode', checkboxTheme.checked);
    location.reload();
});

// Carrega tema escuro
if (localStorage.getItem('cardapio-dark-mode') && localStorage.getItem('cardapio-dark-mode') === 'true') {
    document.documentElement.classList.add('tema-escuro');
}

// main.js

let installPrompt = null;
const installButton = document.querySelector("#install");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.removeAttribute("hidden");
  console.log("aaa");
});
  