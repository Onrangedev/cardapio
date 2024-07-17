const socket = io();

socket.on('connect', () => {
  console.log('Conectado ao servidor Socket.io');
});

socket.on('cardapio_atualizado', (cardapio) => {
  // Atualiza dinamicamente o cardápio na interface
  console.log('Cardápio atualizado:', cardapio);
  // Implemente a lógica para atualizar a UI com o cardápio atualizado
});

// Função para enviar requisição de atualização do cardápio
function atualizarCardapio(dia) {
  const almoco = document.getElementById('almoco').value;
  const merenda = document.getElementById('merenda').value;

  fetch(`/api/cardapio/${dia}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ almoco, merenda }),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message);
    // Exibir mensagem de sucesso para o admin (usando SweetAlert2, por exemplo)
  })
  .catch(error => console.error('Erro ao atualizar cardápio:', error));
}
