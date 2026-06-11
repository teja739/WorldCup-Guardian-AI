import { Router } from 'express';
import { getBudgets, addExpense, updateBudgetExpense, deleteBudgetExpense } from '../controllers/budgetController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getBudgets);
router.post('/', authMiddleware, addExpense);
router.put('/', authMiddleware, updateBudgetExpense);
router.delete('/', authMiddleware, deleteBudgetExpense);

export default router;
