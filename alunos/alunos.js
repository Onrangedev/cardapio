if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/cardapio/alunos/pwabuilder-sw.js').then((registration) => {
            console.log('Service Worker registrado com sucesso:', registration);
        }).catch((error) => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
    });
}

const API_KEY = 'AIzaSyAEOb_1iv4NXFeV7OQph2FW5UpqCUiGMcc';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Escopos de autorização necessários pela API; múltiplos escopos podem ser incluídos, separados por espaços.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// document.querySelector('.container-ultima-alteracao').style.display = 'none';

let cardapio = [];

// Recupera os dados salvos no local storage
const dadosSalvos = localStorage.getItem('cardapio');
if (dadosSalvos) cardapio = JSON.parse(dadosSalvos);

const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

const frases = ['Alimente seu corpo, cultive sua saúde.', 'Uma boa alimentação é o primeiro passo para uma vida mais saudável.', 'Coma bem, viva melhor.', 'Seu corpo agradece cada alimento saudável.', 'A comida é o combustível do seu corpo. Abasteça-o com o melhor!', 'A saúde começa no prato.', 'Alimente seus sonhos com uma dieta balanceada.', 'Uma dieta equilibrada é a receita para uma vida feliz e saudável.', 'Invista em sua saúde, invista em uma boa alimentação.',
'Cada garfada é uma oportunidade para nutrir seu corpo.', 'A alimentação saudável não é uma dieta, é um estilo de vida.', 'Você é o que você come. Escolha bem!', 'A comida é o nosso melhor remédio.', 'Cozinhar com amor é nutrir a alma.', 'Uma alimentação saudável é um presente para o seu futuro.','A comida é a nossa primeira medicina.', 'A alimentação saudável é a base para uma vida ativa e produtiva.', 'Ame seu corpo, alimente-o com carinho.', 'O que você come hoje define como você se sentirá amanhã.', 'A comida não é apenas combustível, é uma experiência.', 'A alimentação é uma forma de amor próprio.', 'Escolha alimentos que alimentem seu corpo e seu espírito.', 'A comida conecta as pessoas e a natureza.', 'A alimentação saudável é um ato de amor por você mesmo.', 'A alimentação saudável é um investimento a longo prazo.', 'Cada escolha alimentar é uma oportunidade para crescer.','A comida é a nossa linguagem universal. Fale a linguagem da saúde.', 'A natureza nos oferece a melhor farmácia: os alimentos naturais.', 'Coma arco-íris! Variedade é a chave para uma alimentação completa.', 'Um corpo saudável é a nossa maior riqueza.', 'A comida é a arte de nutrir o corpo e a alma.', 'A felicidade se encontra também no prato.', 'A alimentação saudável é um hábito, não uma obrigação.', 'Cozinhar é um ato de amor e cuidado consigo mesmo.', 'A comida é a nossa primeira medicina preventiva.', 'Uma boa digestão é a base de uma boa saúde.', 'A alimentação saudável nos conecta com a natureza e com nós mesmos.', 'Escolha alimentos que te deixem leve e energizado.', 'A comida é celebração da vida.', 'A alimentação saudável é um estilo de vida que contagia.', 'Um corpo bem nutrido é mais resistente a doenças.', 'A comida é a nossa primeira casa.', 'A alimentação saudável é um ato de gratidão à vida.', 'Coma devagar e saboreie cada mordida.', 'A comida é a nossa melhor companhia.', 'A alimentação saudável é um investimento no futuro.', 'A comida nos conecta com nossas raízes.', 'A alimentação saudável é um ato de amor pela vida.', 'A comida é a nossa primeira paixão.', 'A alimentação saudável é um estilo de vida que transforma.', 'Um corpo saudável é uma mente saudável.'];

imprimiFrase();

// Aguarda o evento de clique para trocar a frase
document.querySelector('.frase').addEventListener('click', () => imprimiFrase());

let isplaying = false;

document.querySelector('.title').addEventListener('click', () => {
    if (!isplaying) {
        const kiamSound = new Audio('../assets/kiam-sound.mp3');
        kiamSound.play();
        isplaying = true;
    }

    setTimeout(function() {
        isplaying = false;
    }, 5000);
});

// Aguarda o evento de clique para atualizar os dados manualmente
document.querySelector('.btn-atualizar').addEventListener('click', () => {
    document.querySelector('.btn-atualizar').style.display = 'none';
    requisitarDados();
});

// Callback após o carregamento do api.js.
function gapiLoaded() {
    if (cardapio && new Date().getDay() === cardapio.dia) {
        imprimirDados(cardapio.menu);
    } else requisitarDados();
}

// Chama a função para fazer requisição dos dados e exibi tela de load
function requisitarDados() {
    gapi.load('client', initializeGapiClient);
    document.querySelectorAll('#loading-screen').forEach((load) => load.style.display = 'flex');
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
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1X1p6laul5yRw330M1ROaP8F4T70asWE7IieVsT1Qb7c',
            range: 'A2:E',
        });

        const range = response.result;
        if (!range?.values?.length) throw new Error('Nenhum valor encontrado.');

        const status = range.values[0][4];
        const isManutencao = status === 'Manutenção';
        const isAlunosPage = location.href.includes('/cardapio/alunos/');
        
        if (status !== 'Ativo' || (isManutencao && isAlunosPage)) {
            foraDoAr();
            return;
        }

        imprimirDados(range);
        localStorage.setItem('cardapio', JSON.stringify({ 'dia': new Date().getDay(), 'menu': range }));

        document.querySelectorAll('#loading-screen').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.meal').forEach(el => el.style.display = 'flex');
    } catch (err) {
        console.error(err.message);
        foraDoAr();
    }
}

// Função para imprimir almoço e merenda de forma genérica
function imprimirDados(range) {
    dias.forEach((dia, index) => {
        document.getElementById(`${dia}Almoco`).textContent = range.values[index][2];
        document.getElementById(`${dia}Merenda`).textContent = range.values[index][1];
    });

    imprimirMenuDoDia(range);
    // imprimirUltimaModificacao(range);
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
    document.querySelectorAll('.meal').forEach((meal) => {
        meal.style.display = 'flex';
        meal.textContent = 'Fora do Ar :/'
    });

    document.querySelectorAll('#loading-screen').forEach((load) => load.style.display = 'none');
    document.querySelector('.menu-hoje').style.display = 'none';
}

// Carrega tema escuro
if (localStorage.getItem('cardapio-dark-mode') && localStorage.getItem('cardapio-dark-mode') === 'true') document.documentElement.classList.add('tema-escuro');

// Carrega o zoom salvo em local storage
if (localStorage.getItem('cardapio-escala')) document.body.style.zoom = localStorage.getItem('cardapio-escala');

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
