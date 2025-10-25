import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import discosRoutes from './routes/discos';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Conexão com MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/colecao-discos';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB com sucesso!');
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar com MongoDB:', error);
    process.exit(1);
  });

// Rotas
app.use('/api', discosRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor rodando normalmente',
    timestamp: new Date().toISOString()
  });
});

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', error);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

app.listen(PORT, () => {
  console.log(`🎵 Servidor de discos rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});