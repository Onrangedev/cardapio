const API_KEY = 'AIzaSyAEOb_1iv4NXFeV7OQph2FW5UpqCUiGMcc';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Escopos de autorização necessários pela API; múltiplos escopos podem ser incluídos, separados por espaços.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

let cardapio;
let isForaDoAr;

// Recupera os dados salvos no local storage
const savedCardapio = localStorage.getItem('cardapio-lista');
if (savedCardapio){
    cardapio = JSON.parse(savedCardapio);
}

// Recuperar o dado de fora do ar
const savedForaDoAr = localStorage.getItem('cardapio-fora-do-ar');
if (savedForaDoAr) {
    savedForaDoAr === 'true' ? isForaDoAr = true : isForaDoAr = false;
}

const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

const frases = ['Alimente seu corpo, cultive sua saúde.', 'Uma boa alimentação é o primeiro passo para uma vida mais saudável.', 'Coma bem, viva melhor.', 'Seu corpo agradece cada alimento saudável.', 'A comida é o combustível do seu corpo. Abasteça-o com o melhor!', 'A saúde começa no prato.', 'Alimente seus sonhos com uma dieta balanceada.', 'Uma dieta equilibrada é a receita para uma vida feliz e saudável.', 'Invista em sua saúde, invista em uma boa alimentação.',
'Cada garfada é uma oportunidade para nutrir seu corpo.', 'A alimentação saudável não é uma dieta, é um estilo de vida.', 'Você é o que você come. Escolha bem!', 'A comida é o nosso melhor remédio.', 'Cozinhar com amor é nutrir a alma.', 'Uma alimentação saudável é um presente para o seu futuro.','A comida é a nossa primeira medicina.', 'A alimentação saudável é a base para uma vida ativa e produtiva.', 'Ame seu corpo, alimente-o com carinho.', 'O que você come hoje define como você se sentirá amanhã.', 'A comida não é apenas combustível, é uma experiência.', 'A alimentação é uma forma de amor próprio.', 'Escolha alimentos que alimentem seu corpo e seu espírito.', 'A comida conecta as pessoas e a natureza.', 'A alimentação saudável é um ato de amor por você mesmo.', 'A alimentação saudável é um investimento a longo prazo.', 'Cada escolha alimentar é uma oportunidade para crescer.','A comida é a nossa linguagem universal. Fale a linguagem da saúde.', 'A natureza nos oferece a melhor farmácia: os alimentos naturais.', 'Um corpo saudável é a nossa maior riqueza.', 'A comida é a arte de nutrir o corpo e a alma.', 'A felicidade se encontra também no prato.', 'A alimentação saudável é um hábito, não uma obrigação.', 'Cozinhar é um ato de amor e cuidado consigo mesmo.', 'A comida é a nossa primeira medicina preventiva.', 'Uma boa digestão é a base de uma boa saúde.', 'A alimentação saudável nos conecta com a natureza e com nós mesmos.', 'Escolha alimentos que te deixem leve e energizado.', 'A comida é celebração da vida.', 'A alimentação saudável é um estilo de vida que contagia.', 'Um corpo bem nutrido é mais resistente a doenças.', 'A comida é a nossa primeira casa.', 'A alimentação saudável é um ato de gratidão à vida.', 'Coma devagar e saboreie cada mordida.', 'A comida é a nossa melhor companhia.', 'A alimentação saudável é um investimento no futuro.', 'A comida nos conecta com nossas raízes.', 'A alimentação saudável é um ato de amor pela vida.', 'A comida é a nossa primeira paixão.', 'A alimentação saudável é um estilo de vida que transforma.', 'Um corpo saudável é uma mente saudável.'];

imprimirFrase();

// Aguarda evento de clique no nome onrange para tocar música
document.querySelector('.title').addEventListener('click', () => playMusic());

// Aguarda evento de click no botão de instalação do banner
document.getElementById('installButton').addEventListener('click', async () => installApp());

// Aguarda evento de clique para abrir menu de configurações
document.querySelector('.botao-configuracao').addEventListener('click', () => location.href = '../configuracao/index.html');

// Aguarda o evento de clique na frase
document.querySelector('.frase').addEventListener('click', () => imprimirFrase());

// Se a página foi carregada do cache, forçamos o recarregamento para evitar bugs
window.addEventListener('pageshow', function (event) {
    if (event.persisted)  {
        window.location.reload();
    }
});

// Callback após o carregamento do api.js.
function gapiLoaded() {
    if (cardapio) {
        if (navigator.onLine && isForaDoAr) {
            imprimirForaDoAr();
            requisitarDados();
        } else if (navigator.onLine) {
            imprimirCardapio(cardapio);
            requisitarDados();
        } else {
            imprimirCardapio(cardapio);
        }
    } else if (!navigator.onLine) {
        imprimirForaDoAr();
    } else {
        requisitarDados();
        imprimirDadosVazio();
    }
}

// Chama a função para fazer requisição dos dados e exibi tela de load
function requisitarDados() {
    document.querySelector('.load-title').style.display = 'flex';
    gapi.load('client', initializeGapiClient);
}

// Callback após o cliente da API ser carregado. Carrega o discovery doc para inicializar a API.
async function initializeGapiClient() {
    try {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        listMajors();
    } catch (error) {
        imprimirForaDoAr();
    }
}

// Imprime a merenda e o lanche do dia. Spreadsheet: https://docs.google.com/spreadsheets/d/1X1p6laul5yRw330M1ROaP8F4T70asWE7IieVsT1Qb7c/edit
async function listMajors() {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1X1p6laul5yRw330M1ROaP8F4T70asWE7IieVsT1Qb7c',
            range: 'admin!A1:E',
        });

        const range = transpose(response.result.values);
        imprimirCardapio(range);

        const status = range[2][0];
        const isManutencao = status === 'Manutenção';
        const isDesligado = status === 'Desligado';
        const isAlunosPage = location.href.includes('/cardapio/alunos/');
        
        if (status !== 'Ativo' && (isManutencao && isAlunosPage) || isDesligado) {
            imprimirForaDoAr();
        } else {
            imprimirCardapio(range);
            salvarCardapio(range);

            cardapio = range;

            document.querySelector('.load-title').style.display = 'none';
            document.querySelectorAll('.meal').forEach(el => el.style.display = 'flex');
            
            if (isForaDoAr) {
                localStorage.setItem('cardapio-fora-do-ar', false);
                location.reload();
            }
        }        
    } catch (err) {
        console.error(err.message);
        imprimirForaDoAr();
    }
}

// Imprimi o almoço e a merenda
function imprimirCardapio(range) {           
    dias.forEach((dia, index) => {
        range[3].forEach((item) => {
            if (item !== undefined && item !== '' && item !== null) {                
                if (range[0][index] === item.split('/')[1]) document.getElementById(`${dia}Merenda`).textContent = item.split('/')[0];
            }
        });

        range[4].forEach((item) => {
            if (item !== undefined && item !== '' && item !== null) {                
                if (range[1][index] === item.split('/')[1]) document.getElementById(`${dia}Almoco`).textContent = item.split('/')[0];
            }
        });
    });

    salvarUltimaAlteracao(range);
}

// Imprimi o almoço e a merenda como vazio
function imprimirDadosVazio() {
    dias.forEach((dia) => {
        document.getElementById(`${dia}Almoco`).textContent = '---';
        document.getElementById(`${dia}Merenda`).textContent = '---';
    });
}

// Imprimi sistema fora do ar
function imprimirForaDoAr() {
    document.querySelectorAll('.meal').forEach((meal) => {
        meal.style.display = 'flex';
        document.querySelector('.fora-do-ar').style.display = 'block';
        document.querySelectorAll('.my-card').forEach((e) => e.style.display = 'none');
        document.querySelector('.navigation').style.display = 'none';
    });

    document.querySelector('.load-title').style.display = 'none';
    localStorage.setItem('cardapio-fora-do-ar', true);
}

//  Imprimi uma frese aleatoriamente
function imprimirFrase() {
    if (localStorage.getItem('cardapio-frase') === 'false') {
        return;
    } else {
        const num = Math.floor(Math.random() * (frases.length - 0) + 0);
        document.querySelector('.frase').textContent = `"${frases[num]}"`;
        document.querySelector('.container-frase').style.opacity = 1;
    }
}

// Salva os dados no local storage
function salvarCardapio(range) {    
    if (cardapio) {
        if (JSON.stringify(range) !== JSON.stringify(cardapio)) {
            localStorage.setItem('cardapio-lista', JSON.stringify(range));
        }
    } else {
        localStorage.setItem('cardapio-lista', JSON.stringify(range));
    }
}

// Salva quando foi a última alteração no servidor
function salvarUltimaAlteracao(range) {
    localStorage.setItem('cardapio-ultima-alteracao', range[2][1]);
}

// Toca música
let isPlaying = false;

function playMusic() {
    if (!isPlaying) {
        new Audio('../assets/kiam-sound.mp3').play();
        isPlaying = true;
    }
}

// Altera a opacidade dos elementos
function alterarOpacidadeElementos(opacidade) {
    ['.card-carousel', '.header', '.navigation', '.container-frase', '.today'].forEach(seletor => document.querySelector(seletor).style.opacity = opacidade);
}

// Diminui a opacidade de elementos
function ocultarElementos() {
    alterarOpacidadeElementos('0');
}

// Aumenta a opacidade de elementos
function exibirElementos() {
    alterarOpacidadeElementos('1');
}

// Exibe um banner para o google chrome
function bannerForChrome() {
    ocultarElementos();
    Swal.fire({
        title: "Abrir no Google Chrome!",
        html: `
            <img width="200px" src="../assets/chrome.svg" alt="chrome">
            <h3>Para instalar o App Onrange é necessário que você utilize o navegador Google Chrome!</h3>
        `,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        cancelButtonText: 'Continuar no usando no navegador atual',
        confirmButtonText: 'Abrir o Google Chrome',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "googlechrome://eierick.github.io/cardapio/alunos";
            navigator.clipboard.writeText('https://eierick.github.io/cardapio/alunos/');
        }

        setTimeout(exibirElementos, 300);
    });
}

// Exibe um banner de informações nutricionais
function bannerForNutritionalInformation(day) {
    ocultarElementos();    
    Swal.fire({
        title: "Informações Nutricionais",
        html: `
            <h2>Merenda</h2>
            <h3>Calorias: ${pegarElementoId(cardapio[0][day]).split('/')[2]}</h3>
            <h3>Lactose: ${pegarElementoId(cardapio[0][day]).split('/')[3]}</h3>
            <h2>Almoço</h2>
            <h3>Calorias: ${pegarElementoId(cardapio[1][day]).split('/')[2]}</h3>
            <h3>Lactose: ${pegarElementoId(cardapio[1][day]).split('/')[3]}</h3>
        `,
        showCloseButton: true,
    }).then(() => {
        setTimeout(exibirElementos, 300);
    });
}

// Pega um elemento do cardapio com o seu ID
function pegarElementoId(id) {
    let elemento;

    cardapio[3].forEach((item) => {
        if (item !== undefined && item !== '' && item.split('/')[1] === id) elemento = item;
    });

    cardapio[4].forEach((item) => {
        if (item !== undefined && item !== '' && item.split('/')[1] === id) elemento = item;
    });

    return elemento;
}

// Carrega o tema
const savedTheme = localStorage.getItem('cardapio-theme');

if (savedTheme) {
    if (savedTheme === 'auto') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.add('light');
        }
    } else {
        document.documentElement.classList.add(savedTheme);
    }
} else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.add('light');
    }
}

// Carregar as imgs
const cardapioImgs = localStorage.getItem('cardapio-imgs-toggle');

if (cardapioImgs) {
    if (cardapioImgs === 'false') {        
        document.querySelectorAll('.img-merenda').forEach((e) => e.style.display = 'none');
        document.querySelectorAll('.img-almoco').forEach((e) => e.style.display = 'none');
    } else {
        document.querySelectorAll('.img-merenda').forEach((e) => e.style.display = 'flex');
        document.querySelectorAll('.img-almoco').forEach((e) => e.style.display = 'flex');
    }
} else {
    document.querySelectorAll('.img-merenda').forEach((e) => e.style.display = 'none');
    document.querySelectorAll('.img-almoco').forEach((e) => e.style.display = 'none');
}

// Função para transpor (converter linhas em colunas)
function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

let deferredPrompt;
let AllowsPwa = false;

// Detecta se o dispositivo está no iOS
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    AllowsPwa = true;
});

// Verifica se o app está instalado para mostrar ou retirar o banner
if (!window.matchMedia('(display-mode: standalone)').matches && !isIos()) {
    showBtnInstall();
}

// Mostra o banner de instalação
function showBtnInstall() {
    const installBanner = document.getElementById('installButton');
    installBanner.style.display = 'block';
}

// Chama o prompt de instalação do app
function installApp() {
    if (AllowsPwa) {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt = null;
        }
    } else {
        bannerForChrome();
    }
}
