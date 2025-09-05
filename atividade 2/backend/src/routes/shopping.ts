import { Router } from 'express';
import { getItems, addItem, updateItem, deleteItem } from '../controllers/controlador';

const router = Router();

// Define as rotas do CRUD para os itens de compra

// GET /api/shopping -> Busca todos os itens
router.get('/', getItems);

// POST /api/shopping -> Adiciona um novo item
router.post('/', addItem);

// PUT /api/shopping/:id -> Atualiza um item pelo ID
router.put('/:id', updateItem);

// DELETE /api/shopping/:id -> Exclui um item pelo ID
router.delete('/:id', deleteItem);

export default router;

