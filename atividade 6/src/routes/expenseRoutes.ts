import { Router } from 'express';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getTotalExpenses
} from '../controllers/expenseController';

const router = Router();

router.post('/expenses', createExpense);
router.get('/expenses', getExpenses);
router.put('/expenses/:id', updateExpense);
router.delete('/expenses/:id', deleteExpense);
router.get('/expenses/total', getTotalExpenses);

export default router;