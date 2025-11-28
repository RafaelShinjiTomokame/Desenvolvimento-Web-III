import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import eventRoutes from './routes/events';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', eventRoutes);

// Conexão com MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/evento';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB: evento');
  })
  .catch((error) => {
    console.error('Erro ao conectar com MongoDB:', error);
  });

export default app;