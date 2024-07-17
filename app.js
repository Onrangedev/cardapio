const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rotas de exemplo para CRUD (simulado em memória)
let cardapio = {
  segunda: { almoco: 'Frango grelhado', merenda: 'Frutas' },
  terca: { almoco: 'Peixe assado', merenda: 'Iogurte' },
  // ... outros dias da semana
};

app.get('/api/cardapio', (req, res) => {
  res.json(cardapio);
});

app.post('/api/cardapio/:dia', (req, res) => {
  const { dia } = req.params;
  const { almoco, merenda } = req.body;

  cardapio[dia] = { almoco, merenda };

  io.emit('cardapio_atualizado', cardapio);

  res.status(201).json({ message: `Cardápio do ${dia} atualizado com sucesso.` });
});

// Inicie o servidor e escute conexões via Socket.io
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Configuração do Socket.io para notificações em tempo real
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});