const API_KEY = 'AIzaSyAEOb_1iv4NXFeV7OQph2FW5UpqCUiGMcc';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Escopos de autorização necessários pela API; múltiplos escopos podem ser incluídos, separados por espaços.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.querySelector('.container-ultima-alteracao').style.display = 'none';

let cardapio = [];

const dadosSalvos = localStorage.getItem('cardapio');
if (dadosSalvos) {
    cardapio = JSON.parse(dadosSalvos);
}

const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

const frases = ['Alimente seu corpo, cultive sua saúde.', 'Uma boa alimentação é o primeiro passo para uma vida mais saudável.', 'Coma bem, viva melhor.', 'Seu corpo agradece cada alimento saudável.', 'A comida é o combustível do seu corpo. Abasteça-o com o melhor!', 'A saúde começa no prato.', 'Alimente seus sonhos com uma dieta balanceada.', 'Uma dieta equilibrada é a receita para uma vida feliz e saudável.', 'Invista em sua saúde, invista em uma boa alimentação.',
'Cada garfada é uma oportunidade para nutrir seu corpo.', 'A alimentação saudável não é uma dieta, é um estilo de vida.', 'Você é o que você come. Escolha bem!', 'A comida é o nosso melhor remédio.', 'Cozinhar com amor é nutrir a alma.', 'Uma alimentação saudável é um presente para o seu futuro.','A comida é a nossa primeira medicina.', 'A alimentação saudável é a base para uma vida ativa e produtiva.', 'Ame seu corpo, alimente-o com carinho.', 'O que você come hoje define como você se sentirá amanhã.', 'A comida não é apenas combustível, é uma experiência.', 'A alimentação é uma forma de amor próprio.', 'Escolha alimentos que alimentem seu corpo e seu espírito.', 'A comida conecta as pessoas e a natureza.', 'A alimentação saudável é um ato de amor por você mesmo.', 'A alimentação saudável é um investimento a longo prazo.', 'Cada escolha alimentar é uma oportunidade para crescer.','A comida é a nossa linguagem universal. Fale a linguagem da saúde.', 'A natureza nos oferece a melhor farmácia: os alimentos naturais.', 'Coma arco-íris! Variedade é a chave para uma alimentação completa.', 'Um corpo saudável é a nossa maior riqueza.', 'A comida é a arte de nutrir o corpo e a alma.', 'A felicidade se encontra também no prato.', 'A alimentação saudável é um hábito, não uma obrigação.', 'Cozinhar é um ato de amor e cuidado consigo mesmo.', 'A comida é a nossa primeira medicina preventiva.', 'Uma boa digestão é a base de uma boa saúde.', 'A alimentação saudável nos conecta com a natureza e com nós mesmos.', 'Escolha alimentos que te deixem leve e energizado.', 'A comida é celebração da vida.', 'A alimentação saudável é um estilo de vida que contagia.', 'Um corpo bem nutrido é mais resistente a doenças.', 'A comida é a nossa primeira casa.', 'A alimentação saudável é um ato de gratidão à vida.', 'Coma devagar e saboreie cada mordida.', 'A comida é a nossa melhor companhia.', 'A alimentação saudável é um investimento no futuro.', 'A comida nos conecta com nossas raízes.', 'A alimentação saudável é um ato de amor pela vida.', 'A comida é a nossa primeira paixão.', 'A alimentação saudável é um estilo de vida que transforma.', 'Um corpo saudável é uma mente saudável.'];

imprimiFrase();

// Aguarda o evento de clique para trocar a frase
document.querySelector('.frase').addEventListener('click', () => imprimiFrase());

document.querySelector('.btn-atualizar').addEventListener('click', () => {
    document.querySelector('.btn-atualizar').style.display = 'none';
    gapi.load('client', initializeGapiClient);

    // Mostra a tela de carregamento
    document.querySelectorAll('#loading-screen').forEach((load) => load.style.display = 'flex');
    // Oculta o 'meal' da página
    document.querySelectorAll('.meal').forEach((meal) => meal.style.display = 'none');
});

// Callback após o carregamento do api.js.
function gapiLoaded() {
    if (cardapio) {
        if (new Date().getDay() === cardapio.dia) {
            imprimirAlmoco(cardapio.menu);
            imprimirMerenda(cardapio.menu);
            imprimirMenuDoDia(cardapio.menu);
            imprimirUltimaModificacao(cardapio.menu);
            return;
        }
    }

    gapi.load('client', initializeGapiClient);

    // Mostra a tela de carregamento
    document.querySelectorAll('#loading-screen').forEach((load) => load.style.display = 'flex');
    // Oculta o 'meal' da página
    document.querySelectorAll('.meal').forEach((meal) => meal.style.display = 'none');
}

// Callback após o cliente da API ser carregado. Carrega o discovery doc para inicializar a API.
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    listMajors();
}

// Imprime a merenda e o lanche do dia. Spreadsheet: https://docs.google.com/spreadsheets/d/1X1p6laul5yRw330M1ROaP8F4T70asWE7IieVsT1Qb7c/edit
async function listMajors() {
    let response;
    try {
        // Busca os dados na planilha
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1X1p6laul5yRw330M1ROaP8F4T70asWE7IieVsT1Qb7c',
            range: 'A2:E',
        });
    } catch (err) {
        console.error(err.message);
        foraDoAr();
        return;
    }

    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        console.error('Nenhum valor encontrado.');
        foraDoAr();
        return;
    }
    
    if (range.values[0][4] !== 'Ativo') {
        foraDoAr();
        return;
    } else if (range.values[0][4] === 'Manutenção' && location.href === 'https://eierick.github.io/cardapio/alunos/' || range.values[0][4] === 'Manutenção' && location.href === 'https://eierick.github.io/cardapio/alunos/index.html') {
        foraDoAr();
        return;
    }

    imprimirAlmoco(range);
    imprimirMerenda(range);
    imprimirMenuDoDia(range);
    imprimirUltimaModificacao(range);

    localStorage.setItem('cardapio', JSON.stringify({'dia': new Date().getDay(), 'menu': range}));

    // Esconde a tela de carregamento após o processamento dos dados
    document.querySelectorAll('#loading-screen').forEach((load) => load.style.display = 'none');
    // Mostra o 'meal' após o processamento dos dados
    document.querySelectorAll('.meal').forEach((meal) => meal.style.display = 'flex');
}

// Imprime o almoço
function imprimirAlmoco(range) {
    document.getElementById('segundaAlmoco').textContent = range.values[0][2];
    document.getElementById('tercaAlmoco').textContent = range.values[1][2];
    document.getElementById('quartaAlmoco').textContent = range.values[2][2];
    document.getElementById('quintaAlmoco').textContent = range.values[3][2];
    document.getElementById('sextaAlmoco').textContent = range.values[4][2];
}

// Imprime a merenda
function imprimirMerenda(range) {
    document.getElementById('segundaMerenda').textContent = range.values[0][1];
    document.getElementById('tercaMerenda').textContent = range.values[1][1];
    document.getElementById('quartaMerenda').textContent = range.values[2][1];
    document.getElementById('quintaMerenda').textContent = range.values[3][1];
    document.getElementById('sextaMerenda').textContent = range.values[4][1];
}

// Imprimi o menu do dia
function imprimirMenuDoDia(range) {
    const dia = new Date().getDay();

    const hojeAlmoco = document.querySelector('#hojeAlmoco');
    const hojeMerenda = document.querySelector('#hojeMerenda');

    if (hojeAlmoco === null) return;
    if (dia === 0 || dia === 6) {
        hojeAlmoco.parentNode.textContent = 'Feriado';
    } else {
        hojeMerenda.textContent = range.values[dia-1][1];
        hojeAlmoco.textContent = range.values[dia-1][2];
    }

    document.querySelector('.menu-hoje').style.display = 'block';
}

// Imprimi quando foi a última alteração no google sheets
function imprimirUltimaModificacao(range) {
    document.querySelector('.container-ultima-alteracao').style.display = 'block';
    document.querySelector('.dia-ultima-alteracao').textContent = range.values[0][3];
}

// Escolhe e imprime uma frese aleatoriamente
function imprimiFrase() {
    const num = Math.floor(Math.random() * (frases.length - 0) + 0);
    document.querySelector('.frase').textContent = `"${frases[num]}"`;
}

// Aguarda evento de clique para abrir menu de configurações
document.querySelector('.botao-configuracao').addEventListener('click', () => location.href = '../configuracao/index.html');

// Exibi que o sistema está fora do ar
function foraDoAr() {
    document.querySelectorAll('.meal').forEach(element => element.textContent = 'Fora do Ar :/');
    document.querySelectorAll('#loading-screen').forEach((load) => load.style.display = 'none');
    document.querySelector('.menu-hoje').style.display = 'none';
}

// Carrega tema escuro
if (localStorage.getItem('cardapio-dark-mode') && localStorage.getItem('cardapio-dark-mode') === 'true') document.documentElement.classList.add('tema-escuro');

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
});

// Aguarda o app estar instalado para retirar o banner
window.addEventListener('appinstalled', () => hideInstallBanner());

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
