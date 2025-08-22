// Arquivo: src/server.js

import express from 'express';
import pessoaRoutes from './routes/pessoaRoutes.js';
import carroRoutes from './routes/carroRoutes.js';
import pessoaCarroRoutes from './routes/pessoaCarroRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para o Express entender JSON
app.use(express.json());

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static('public')); 

// Define e usa as rotas importadas
app.use('/pessoas', pessoaRoutes);
app.use('/carros', carroRoutes);
app.use('/associacoes', pessoaCarroRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});