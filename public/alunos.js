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
