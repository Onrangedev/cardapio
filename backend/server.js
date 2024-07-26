const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFilePath = path.join(__dirname, 'cardapio.json');

const readData = () => {
    try {
        const data = fs.readFileSync(dataFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler o arquivo de dados:', error);
        return { items: [] };
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Erro ao escrever no arquivo de dados:', error);
    }
};

app.get('/api/items', (req, res) => {
    const data = readData();
    res.json(data.items);
});

app.get('/api/items/:id', (req, res) => {
    const data = readData();
    const item = data.items.find(i => i.id === parseInt(req.params.id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).send('Item não encontrado');
    }
});

app.post('/api/items', (req, res) => {
    const data = readData();
    const newItem = {
        id: data.items.length ? data.items[data.items.length - 1].id + 1 : 1,
        ...req.body
    };
    data.items.push(newItem);
    writeData(data);
    res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
    const data = readData();
    const itemIndex = data.items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex !== -1) {
        data.items[itemIndex] = { id: parseInt(req.params.id), ...req.body };
        writeData(data);
        res.json(data.items[itemIndex]);
    } else {
        res.status(404).send('Item não encontrado');
    }
});

app.delete('/api/items/:id', (req, res) => {
    const data = readData();
    const newItems = data.items.filter(i => i.id !== parseInt(req.params.id));
    if (newItems.length !== data.items.length) {
        data.items = newItems;
        writeData(data);
        res.status(204).send();
    } else {
        res.status(404).send('Item não encontrado');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
