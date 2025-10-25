import { Router } from 'express';
import {
  criarDisco,
  listarDiscos,
  obterDisco,
  atualizarDisco,
  excluirDisco
} from '../controllers/discoController';

const router = Router();

router.post('/discos', criarDisco);
router.get('/discos', listarDiscos);
router.get('/discos/:id', obterDisco);
router.put('/discos/:id', atualizarDisco);
router.delete('/discos/:id', excluirDisco);

export default router;