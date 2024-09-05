const API_KEY = 'AIzaSyAEOb_1iv4NXFeV7OQph2FW5UpqCUiGMcc';
const CLIENT_ID = '293531894729-3uaa8kgj0rfj9v2qatoorpi4a99rhnnq.apps.googleusercontent.com';

const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Escopos de autorização necessários pela API; múltiplos escopos podem ser incluídos, separados por espaços.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.querySelector('.container-ultima-alteracao').style.display = 'none';

const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

// Callback após o carregamento do api.js.
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

// Callback após o cliente da API ser carregado. Carrega o discovery doc para inicializar a API.
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    listMajors(); // Chama a função para carregar os dados sem autenticação
}

// Imprime a merenda e o lanche do dia. Spreadsheet: https://docs.google.com/spreadsheets/d/1X1p6laul5yRw330M1ROaP8F4T70asWE7IieVsT1Qb7c/edit
async function listMajors() {
    let response;
    try {
        // Busca os primeiros 10 arquivos
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1X1p6laul5yRw330M1ROaP8F4T70asWE7IieVsT1Qb7c',
            range: 'A2:D',
        });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }

    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        document.getElementById('content').innerText = 'Nenhum valor encontrado.';
        return;
    }

    imprimirAlmoco(range);
    imprimirMerenda(range);
    imprimirMenuDoDia(range);
    imprimirUltimaModificacao(range);
}

function imprimirAlmoco(range) {
    document.getElementById('segundaAlmoco').textContent = range.values[0][2];
    document.getElementById('tercaAlmoco').textContent = range.values[1][2];
    document.getElementById('quartaAlmoco').textContent = range.values[2][2];
    document.getElementById('quintaAlmoco').textContent = range.values[3][2];
    document.getElementById('sextaAlmoco').textContent = range.values[4][2];
}

function imprimirMerenda(range) {
    document.getElementById('segundaMerenda').textContent = range.values[0][1];
    document.getElementById('tercaMerenda').textContent = range.values[1][1];
    document.getElementById('quartaMerenda').textContent = range.values[2][1];
    document.getElementById('quintaMerenda').textContent = range.values[3][1];
    document.getElementById('sextaMerenda').textContent = range.values[4][1];
}

function imprimirMenuDoDia(range) {
    const dia = new Date().getDay();

    const hojeAlmoco = document.querySelector('#hojeAlmoco');
    const hojeMerenda = document.querySelector('#hojeMerenda');

    if (hojeAlmoco === null) {
        return;
    }

    if (dia === 0 || dia === 6) {
        hojeAlmoco.parentNode.textContent = 'Feriado';
    } else {
        hojeMerenda.textContent = range.values[dia-1][1];
        hojeAlmoco.textContent = range.values[dia-1][2];
    }
}

function imprimirUltimaModificacao(range) {
    document.querySelector('.container-ultima-alteracao').style.display = 'block';
    document.querySelector('.dia-ultima-alteracao').textContent = range.values[0][3];
}

// Abre menu de configurações
document.querySelector('.botao-configuracao').addEventListener('click', (e) => {
    location.href = '../configuracao/index.html';
});

// Carrega tema escuro
if (localStorage.getItem('cardapio-dark-mode') && localStorage.getItem('cardapio-dark-mode') === 'true') {
    document.documentElement.classList.add('tema-escuro');
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
});

// Aguarda o app estar instalado para retirar o banner
window.addEventListener('appinstalled', (event) => {
    hideInstallBanner();
});

// Mostra o banner de instalação
function showInstallBanner() {
    const installBanner = document.getElementById('installBanner');
    installBanner.style.display = 'block';
}

// Oculta o banner de instalação
function hideInstallBanner() {
    const installBanner = document.getElementById('installBanner');
    installBanner.style.display = 'none';
}

// Aguarda o click no botão de instalação do banner
document.getElementById('installButton').addEventListener('click', async () => {
    hideInstallBanner();
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt = null;
    }
});
