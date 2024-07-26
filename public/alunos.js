// Define o turno do aluno
if (!localStorage.getItem('cardapio-turno')) {
    Swal.fire({
        title: 'Qual é o seu turno?',
        html: `
            <select id="macroSelect" class="swal2-select">
                <option value="">Selecione um turno</option>
                <option value="matutino">Matutino</option>
                <option value="vespertino">Vespertino</option>
            </select>
        `,
        confirmButtonText: 'Confirmar',
        focusConfirm: false,
        preConfirm: () => {
            const selectedOption = document.getElementById('macroSelect').value;
            if (selectedOption) {
                localStorage.setItem('cardapio-turno', document.querySelector('#macroSelect').value)
            } else {
                Swal.showValidationMessage('Você precisa selecionar um Turno!');
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const message = `O seu turno foi definido para ${document.querySelector('#macroSelect').value}`;
            Swal.fire({
                icon: 'success',
                title: 'Turno definido!',
                text: message
            });
        }
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
});

// Agarda o app estar instalado para retirar o banner
window.addEventListener('appinstalled', (event) => {
    hideInstallBanner();
});

// Mostra o banner o banner de instalação
function showInstallBanner() {
    const installBanner = document.getElementById('installBanner');
    installBanner.style.display = 'block';
}

// Oculta o banner o banner de instalação
function hideInstallBanner() {
    const installBanner = document.getElementById('installBanner');
    installBanner.style.display = 'none';
}

// Agarda o click no botão de instalação do banner
document.getElementById('installButton').addEventListener('click', async () => {
    hideInstallBanner();
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt = null;
    }
});
