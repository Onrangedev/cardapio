// Endereço do servidor
const apiUrl = 'http://localhost:3000/api/items';

let dados = [];
const dias = ['seg', 'ter', 'qua', 'qui', 'sex'];

// Faz a requisição dos dados no servidor e manda mostra na tela
const fetchItems = async () => {
    try {
        const response = await fetch(apiUrl);
        const itens = await response.json();
        dados = [];
        itens.forEach(item => {
            dados.push(item);
        });

        let index;
        dados.forEach((dado) => {
            for (index = 0; index < dias.length; index++) {
                if (dias[index] === dado.dia) {
                    saveChanges(dias[index], dado.almoco, dado.merenda);
                }
            }

            if (dado.ultimaAlteracao) {
                document.querySelector('.dia-ultima-alteracao').textContent = dado.ultimaAlteracao;
            }
        });

        printMenuToday();
    } catch (error) {
        document.querySelectorAll('.meal').forEach((e) => {
            e.textContent = 'Fora do ar :/'
        });

        document.querySelector('.container-ultima-alteracao').style.display = 'none';
    }
};

const itemList = document.getElementById('itemList');
fetchItems();

// Exibe os dados do servidor na tela
function saveChanges(day, almoco, merenda) {
    const ids = {
        seg: ['segundaAlmoco', 'segundaMerenda'],
        ter: ['tercaAlmoco', 'tercaMerenda'],
        qua: ['quartaAlmoco', 'quartaMerenda'],
        qui: ['quintaAlmoco', 'quintaMerenda'],
        sex: ['sextaAlmoco', 'sextaMerenda']
    };
    
    if (ids[day]) {
        document.getElementById(ids[day][0]).textContent = almoco;
        document.getElementById(ids[day][1]).textContent = merenda;
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

    if (hojeAlmoco === null) {
        return;
    }

    if (dia === 'dom' || dia === 'sab') {
        hojeAlmoco.parentNode.textContent = 'Feriado';
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
