const almoco = document.querySelectorAll('.almoco');
const merenda = document.querySelectorAll('.merenda');

const apiUrl = 'http://localhost:3000/api/items';

let dados = [];
const dias = ['seg', 'ter', 'qua', 'qui', 'sex'];

const fetchItems = async () => {
    const response = await fetch(apiUrl);
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
};

const itemList = document.getElementById('itemList');

fetchItems();

async function add(dia, merenda, almoco) {
    let id;
    dados.forEach((dado) => {
        if (dado.dia === dia) id = dado.id;
    });

    await fetch(apiUrl + `/${id}`, {
        method: 'DELETE'
    });

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'dia': dia, 'merenda': merenda, 'almoco': almoco})
    });

    fetchItems();
}

let macroOption = '';

function editDay(dia) {
    // Obtém o lanche da semana se estiver definido
    let almoco = "";
    let merenda = "";

    dados.forEach((dado) => {
        if (dado.dia === dia) {
            merenda = dado.merenda;
            almoco = dado.almoco;
        }
    });

    // Constrói o conteúdo do formulário de edição
    let formContent = `
        <label for="almoco">Almoço:</label>
        <input type="text" id="almoco" value="${almoco}"><br><br>
        <label for="merenda">Merenda:</label>
        <input type="text" id="merenda" value="${merenda}"><br><br>
    `;

    // Exibe o formulário de edição com SweetAlert2
    Swal.fire({
        title: `Editar Cardápio - ${getFullNameDay(dia)}`,
        html: formContent,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
            const almoco = document.getElementById('almoco').value;
            const merenda = document.getElementById('merenda').value;

            add(dia, merenda, almoco);
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const message = `Cardápio da ${dia} modificado com sucesso.`;
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: message
            });
        }
    });
}

function capitalizeFirstLetters(str) {
    // Capitaliza a primeira letra de cada palavra
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

function editAllDays() {
    // Exibe uma janela de seleção para definir o lanche da semana toda
    Swal.fire({
        title: 'Definir Lanche para Toda Semana',
        html: `
            <select id="macroSelect" class="swal2-select">
                <option value="">Selecione um lanche</option>
                <option value="Cuscuz temperado">Cuscuz temperado</option>
                <option value="Cuscuz de Tapioca">Cuscuz de Tapioca</option>
                <option value="Pão com ovo">Pão com ovo</option>
                <option value="Pão com carne">Pão com carne</option>
                <option value="Frutas e suco">Frutas e suco</option>
            </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        focusConfirm: false,
        preConfirm: () => {
            const selectedOption = document.getElementById('macroSelect').value;
            if (selectedOption) {
                // Aplica o lanche selecionado para toda a semana
                applyMacro(selectedOption);
            } else Swal.showValidationMessage('Você precisa selecionar um lanche!');
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const message = `Todos os dias foram atualizados para ${macroOption}.`;
            Swal.fire({
                icon: 'success',
                title: 'Macro Aplicada!',
                text: message
            });
        }
    });
}

async function deleteAllMenuData() {
    Swal.fire({
        title: "Você tem certeza que desejar apagar todos os dados do cardápio?",
        showCancelButton: true,
        confirmButtonText: "Yes",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Dados deletados!", "", "success");
            dias.forEach(dia => {
                add(dia, '', '');
            });
        }
    });
}

function applyMacro(selectedOption) {
    // Atualiza a variável de lanche da semana
    macroOption = selectedOption;

    // Aplica o lanche selecionado para todos os dias da semana
    dias.forEach(dia => {
        add(dia, selectedOption, selectedOption);
    });
}

function saveChanges(day, almoco, merenda) {
    // Simula a função de salvar alterações (poderia ser uma requisição AJAX para o backend)
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

function getFullNameDay(dia) {
    let diaCompleto;
    switch (dia) {
        case 'seg':
            diaCompleto = 'Segunda-feira';
            break;
        case 'ter':
            diaCompleto = 'Terça-feira';
            break;
        case 'qua':
            diaCompleto = 'Quarta-feira';
            break;
        case 'qui':
            diaCompleto = 'Quinta-feira';
            break;
        case 'sex':
            diaCompleto = 'Sexta-feira';
            break;
        default:
            break;
    }
    return diaCompleto;
}

function getDayName(dayNum) {
    const todosOsDias = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    return todosOsDias[dayNum];
}

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
