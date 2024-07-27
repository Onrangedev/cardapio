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
    } catch (error) {
        console.error('Failed to fetch items:', error);

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

// Adiciona a merenda e almoço ao servidor e apaga os dados do almoço e merenda antigos
async function add(dia, merenda, almoco) {
    try {
        
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
            body: JSON.stringify({'dia': dia, 'merenda': capitalizeFirstLetters(merenda), 'almoco': capitalizeFirstLetters(almoco)})
        });
        
        fetchItems();
    } catch (error) {
        console.error('Failed to fetch items:', error);

        Swal.fire({
            icon: "error",
            title: "Fora do ar :/",
            text: "Infelizmente o nosso servidor está fora do ar e não podemos editar os dados do cardápio, tente novamente mais tarde!",
        });
    }
}

let macroOption = '';

// Exibe uma janela de edição para definir o lanche e o almoço do dia
function editDay(dia) {
    let almoco = "";
    let merenda = "";

    dados.forEach((dado) => {
        if (dado.dia === dia) {
            merenda = dado.merenda;
            almoco = dado.almoco;
        }
    });

    let formContent = `
        <label for="almoco">Almoço:</label>
        <input type="text" id="almoco" value="${almoco}"><br><br>
        <label for="merenda">Merenda:</label>
        <input type="text" id="merenda" value="${merenda}"><br><br>
    `;

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
            const message = `Cardápio da ${getFullNameDay(dia)} modificado com sucesso.`;
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: message
            });
        }
    });
}

// Capitaliza a primeira letra de cada palavra
function capitalizeFirstLetters(str) {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

// Exibe uma janela de seleção para definir o lanche da semana toda
function editAllDays() {
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
                applyMacro(selectedOption);
            } else {
                Swal.showValidationMessage('Você precisa selecionar um lanche!');
            }
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

// Apaga os dados do cardápio no servidor e exibe na tela
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

// Atualiza todos os lanches e almoços para o mesmo tipo
function applyMacro(selectedOption) {
    macroOption = selectedOption;

    dias.forEach(dia => {
        add(dia, selectedOption, selectedOption);
    });
}

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

// Obtem o nome do dia completo através da abreviatura do dia
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
