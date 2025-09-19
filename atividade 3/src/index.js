import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import Livro from './models/livro.js';
const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb://localhost:27017/crud_livros';
// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
// Conectar ao MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log('Erro ao conectar ao MongoDB:', err));
// Rota para cadastrar um livro
app.post('/livros', async (req, res) => {
    try {
        const novoLivro = new Livro({
            titulo: req.body.titulo,
            autor: req.body.autor,
            ano: req.body.ano
        });
        const livroSalvo = await novoLivro.save();
        res.status(201).json(livroSalvo); // Certifique-se de retornar o livro cadastrado
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar livro', error });
    }
});
// Rota para listar todos os livros
app.get('/livros', async (req, res) => {
    try {
        const livros = await Livro.find();
        res.json(livros);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar livros' });
    }
});
// Rota para atualizar um livro
app.put('/livros/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, autor, anoPublicacao } = req.body;
    try {
        const livroAtualizado = await Livro.findByIdAndUpdate(id, { titulo, autor, anoPublicacao }, {
            new: true
        });
        if (!livroAtualizado) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }
        res.json(livroAtualizado);
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar livro' });
    }
});
// Rota para deletar um livro
app.delete('/livros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const livroDeletado = await Livro.findByIdAndDelete(id);
        if (!livroDeletado) {
            return res.status(404).json({ error: 'Livro não encontrado' });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar livro' });
    }
});
//# sourceMappingURL=index.js.map