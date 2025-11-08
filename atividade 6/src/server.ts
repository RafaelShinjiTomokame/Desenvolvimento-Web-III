import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import expenseRoutes from './routes/expenseRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../src/views')));

// Rotas da API
app.use('/api', expenseRoutes);

// Rota principal - servir o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/views/index.html'));
});

// Conexão com MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/controle-despesas';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar com MongoDB:', error);
  });