import express from 'express';
import mongoose from 'mongoose';
// MELHORIA: O 'body-parser' não é mais necessário, o express já faz isso.
// import bodyParser from 'body-parser'; 
import cors from 'cors';
import Livro from './models/livro.js';

const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb://localhost:27017/crud_livros';

// --- Middleware ---

// 1. Habilita o CORS para permitir a comunicação com o frontend
app.use(cors());

// 2. Prepara o servidor para receber e entender dados em formato JSON
// MELHORIA: app.use(express.json()) é a forma moderna e substitui o bodyParser.
app.use(express.json()); 

// 3. Define a pasta 'public' para servir arquivos estáticos (como o styles.css, se necessário)
app.use(express.static('public'));

// --- Rotas da API ---

// Rota para cadastrar um livro
app.post('/livros', async (req, res) => {
  try {
    const novoLivro = new Livro({
      titulo: req.body.titulo,
      autor: req.body.autor,
      ano: req.body.ano
    });
    const livroSalvo = await novoLivro.save();
    res.status(201).json(livroSalvo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar livro', error });
  }
});

// Rota para listar todos os livros
app.get('/livros', async (req, res) => {
  try {
    const livros = await Livro.find();
    res.json(livros);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
});

// Rota para atualizar um livro
app.put('/livros/:id', async (req, res) => {
  const { id } = req.params;
  // CORREÇÃO 2: Alterado de 'anoPublicacao' para 'ano' para bater com o frontend e o modelo.
  const { titulo, autor, ano } = req.body; 
  try {
    const livroAtualizado = await Livro.findByIdAndUpdate(id, { titulo, autor, ano }, {
      new: true
    });
    if (!livroAtualizado) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }
    res.json(livroAtualizado);
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar livro' });
  }
});

// --- Conexão com o Banco de Dados e Inicialização do Servidor ---

// Conectar ao MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    
    // CORREÇÃO 1: Inicia o servidor Express para escutar por requisições.
    // Isso só acontece DEPOIS que a conexão com o banco de dados for um sucesso.
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.log('❌ Erro ao conectar ao MongoDB:', err));