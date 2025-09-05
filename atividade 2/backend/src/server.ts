import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import shoppingRoutes from './routes/shopping';

const app: Application = express();
const PORT: number = 5000;

app.use(cors());
app.use(bodyParser.json());

// --- CONFIGURAÇÃO DA CONEXÃO COM O MONGODB ---
const MONGO_URI = 'mongodb://127.0.0.1:27017/shopping-list';

// Adicionamos listeners para nos dar feedback sobre o status da conexão
const db = mongoose.connection;

db.on('connecting', () => {
    console.log('Tentando se conectar ao MongoDB...');
});

db.on('connected', () => {
    console.log('Conexão com o MongoDB estabelecida com sucesso!');
});

db.on('error', (error) => {
    // Esta é a parte mais importante! Ela vai nos mostrar o erro detalhado.
    console.error('--- ERRO DE CONEXÃO COM O MONGODB ---');
    console.error(error);
    console.error('--------------------------------------');
    console.log('DICA: Verifique se o serviço do MongoDB está em execução e se a MONGO_URI está correta.');
});

db.on('disconnected', () => {
    console.log('MongoDB desconectado.');
});

// A função de conexão agora tem mais detalhes
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            // Define um tempo limite de 5 segundos para tentar se conectar.
            // Se o banco não for encontrado nesse tempo, ele dará um erro.
            serverSelectionTimeoutMS: 5000 
        });
    } catch (error) {
        console.error('Falha crítica ao iniciar a conexão com o MongoDB. O servidor será encerrado.');
        // Em caso de falha na conexão inicial, o processo é encerrado.
        process.exit(1);
    }
};

// --- ROTAS DA API ---
app.use('/api/shopping', shoppingRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('API da Lista de Compras está funcionando!');
});


// --- INICIALIZAÇÃO DO SERVIDOR ---
const startServer = async () => {
    await connectDB(); // Primeiro conecta ao banco
    app.listen(PORT, () => { // Depois inicia o servidor Express
      console.log(`Servidor rodando na porta ${PORT}`);
    });
};

// Inicia todo o processo
startServer();

