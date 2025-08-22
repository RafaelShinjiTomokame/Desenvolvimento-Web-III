// Arquivo: src/routes/carroRoutes.js

import express from 'express';
import {
    createCarro,
    getCarros,
    getCarroById,
    updateCarro,
    deleteCarro
} from '../controllers/carroController.js';

const router = express.Router();

router.post('/', createCarro);       // Rota para Criar um carro [cite: 59]
router.get('/', getCarros);         // Rota para Listar todos os carros [cite: 60]
router.get('/:id', getCarroById);   // Rota para Buscar carro por id [cite: 61]
router.put('/:id', updateCarro);      // Rota para Atualizar carro por id [cite: 62]
router.delete('/:id', deleteCarro); // Rota para Excluir carro por id [cite: 63]

export default router;