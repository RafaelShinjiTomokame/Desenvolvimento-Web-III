// Arquivo: src/routes/pessoaCarroRoutes.js

import express from 'express';
import {
    createAssociacao,
    getAssociacoes,
    deleteAssociacao
} from '../controllers/pessoaCarroController.js';

const router = express.Router();

router.post('/', createAssociacao);                 // Rota para associar pessoa e carro [cite: 73]
router.get('/', getAssociacoes);                   // Rota para listar todas as associações [cite: 74]
router.delete('/:idpessoa/:idcarro', deleteAssociacao); // Rota para excluir uma associação [cite: 74]

export default router;