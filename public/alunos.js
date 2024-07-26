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
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    console.log(deferredPrompt);
    // Update UI notify the user they can install the PWA
    showInstallBanner();
});

window.addEventListener('appinstalled', (event) => {
    // Log install to analytics
    console.log('PWA installed');
    hideInstallBanner();
});

function showInstallBanner() {
    const installBanner = document.getElementById('installBanner');
    installBanner.style.display = 'block';
}

function hideInstallBanner() {
    const installBanner = document.getElementById('installBanner');
    installBanner.style.display = 'none';
}

document.getElementById('installButton').addEventListener('click', async () => {
    hideInstallBanner();
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
    }
});

if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('PWA is already installed');
} else {
    console.log('PWA is not installed');
}