const almoco = document.querySelectorAll('.almoco');
const merenda = document.querySelectorAll('.merenda');

// Endereço do servidor
const apiUrl = 'http://localhost:3000/api/items';

let dados = [];
const dias = ['seg', 'ter', 'qua', 'qui', 'sex'];

// Faz a requisição dos dados no servidor e manda mostra na tela
const fetchItems = async () => {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Server is down');
        }

        const itens = await response.json();
        dados = [];
        itens.forEach(item => {
            dados.push(item);
        });

        let index;
        dados.forEach((dado) => {
            for (index = 0; index < dias.length; index++) {
                if (dias[index] === dado.dia) saveChanges(dias[index], dado.almoco, dado.merenda);
            }
        });

        printMenuToday();
    } catch (error) {
        Swal.fire({
            title: "Fora do ar :/",
            text: "Infelizmente o nosso servidor está fora do ar, tente novamente mais tarde!",
            imageUrl: "../icon/tux.svg",
            imageWidth: 197.9,
            imageHeight: 218.6,
            imageAlt: "Pinguim Tux"
        });
    }
};

const itemList = document.getElementById('itemList');

fetchItems();

// Exibe os dados do servidor na tela
function saveChanges(day, almoco, merenda) {
    switch (day) {
        case 'seg':
            document.getElementById('segundaAlmoco').textContent = almoco;
            document.getElementById('segundaMerenda').textContent = merenda;
            break;
        case 'ter':
            document.getElementById('tercaAlmoco').textContent = almoco;
            document.getElementById('tercaMerenda').textContent = merenda;
            break;
        case 'qua':
            document.getElementById('quartaAlmoco').textContent = almoco;
            document.getElementById('quartaMerenda').textContent = merenda;
            break;
        case 'qui':
            document.getElementById('quintaAlmoco').textContent = almoco;
            document.getElementById('quintaMerenda').textContent = merenda;
            break;
        case 'sex':
            document.getElementById('sextaAlmoco').textContent = almoco;
            document.getElementById('sextaMerenda').textContent = merenda;
            break;
        default:
            break;
    }
}

// Obtem a abreviatura do dia através da número do dia
function getDayName(dayNum) {
    const todosOsDias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    return todosOsDias[dayNum];
}

// Exibe os dados do lanche e da merenda do dia atual
function printMenuToday() {
    const data = new Date();
    const dia = getDayName(data.getDay());

    const hojeAlmoco = document.querySelector('#hojeAlmoco');
    const hojeMerenda = document.querySelector('#hojeMerenda');

    if (hojeAlmoco === null) return

    if (dia === 'dom' || dia === 'sab') {
        hojeAlmoco.textContent = 'Feriado';
        hojeMerenda.textContent = 'Feriado';
    } else {
        dias.forEach((e) => {
            if (dia === e) {
                dados.forEach((dado) => {
                    if (dado.dia === dia) {
                        hojeAlmoco.textContent = dado.almoco;
                        hojeMerenda.textContent = dado.merenda;
                    }
                });
            }
        });
    }
}

// Abre menu de configurações
document.querySelector('.botao-configuracao').addEventListener('click', () => {
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
