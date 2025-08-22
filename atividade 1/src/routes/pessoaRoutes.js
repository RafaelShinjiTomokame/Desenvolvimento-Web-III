// Arquivo: src/routes/pessoaRoutes.js

import express from 'express';
import {
    createPessoa,
    getPessoas,
    getPessoaById,
    updatePessoa,
    deletePessoa
} from '../controllers/pessoaController.js';

const router = express.Router();

// Mapeia as operações do CRUD para as funções do controlador
router.post('/', createPessoa);       // Rota para Criar uma pessoa [cite: 66]
router.get('/', getPessoas);         // Rota para Listar todas as pessoas [cite: 67]
router.get('/:id', getPessoaById);   // Rota para Buscar pessoa por id [cite: 68]
router.put('/:id', updatePessoa);      // Rota para Atualizar pessoa por id [cite: 69]
router.delete('/:id', deletePessoa); // Rota para Excluir pessoa por id [cite: 70]

export default router;