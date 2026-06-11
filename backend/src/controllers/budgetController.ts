import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Budget from '../models/Budget';

export let mockBudgets: any[] = [
  {
    _id: '66185a0ce6e76cf0a2b53c6a',
    userId: '66185860e6e76cf0a2b53c61',
    tripId: '6618593de6e76cf0a2b53c65',
    estimatedCost: 4500,
    actualCost: 3590,
    expenses: [
      {
        id: 'exp-1',
        description: 'Flight Delhi to NY',
        amount: 1100,
        category: 'flight',
        date: new Date('2026-06-01'),
        paidBy: 'Me',
        splitWith: []
      },
      {
        id: 'exp-2',
        description: 'citizenM Hotel stay',
        amount: 1800,
        category: 'hotel',
        date: new Date('2026-06-05'),
        paidBy: 'Me',
        splitWith: ['friend1@example.com', 'friend2@example.com'] // split it
      },
      {
        id: 'exp-3',
        description: 'Semi-Final Match Ticket',
        amount: 650,
        category: 'match',
        date: new Date('2026-06-08'),
        paidBy: 'Me',
        splitWith: []
      },
      {
        id: 'exp-4',
        description: 'Dinner at Katz\'s Delicatessen',
        amount: 40,
        category: 'food',
        date: new Date('2026-07-11'),
        paidBy: 'friend1@example.com',
        splitWith: ['alex.guardian@gmail.com', 'friend2@example.com']
      }
    ]
  }
];

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let budgets = [];
    try {
      budgets = await Budget.find({ userId });
      if (budgets.length === 0) {
        budgets = mockBudgets.filter(b => b.userId === userId);
      }
    } catch (dbErr) {
      budgets = mockBudgets.filter(b => b.userId === userId);
    }

    return res.status(200).json({ success: true, budgets });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return res.status(500).json({ message: 'Error fetching budgets' });
  }
};

export const addExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { tripId, description, amount, category, date, paidBy, splitWith } = req.body;

    if (!tripId || !description || amount === undefined || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newExpense = {
      id: `exp-${Math.random().toString(36).substr(2, 9)}`,
      description,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date(),
      paidBy: paidBy || 'Me',
      splitWith: splitWith || []
    };

    let updatedBudget = null;
    try {
      updatedBudget = await Budget.findOne({ userId, tripId });
      if (!updatedBudget) {
        // Create new budget if not existing
        updatedBudget = await Budget.create({
          userId,
          tripId,
          estimatedCost: 3000,
          actualCost: newExpense.amount,
          expenses: [newExpense]
        });
      } else {
        updatedBudget.expenses.push(newExpense);
        // Recalculate actual cost
        updatedBudget.actualCost = updatedBudget.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        await updatedBudget.save();
      }
    } catch (dbErr) {
      // In-memory mock fallback
      const budget = mockBudgets.find(b => b.userId === userId && b.tripId === tripId);
      if (budget) {
        budget.expenses.push(newExpense);
        budget.actualCost = budget.expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
        updatedBudget = budget;
      } else {
        updatedBudget = {
          _id: `mock-budget-${Date.now()}`,
          userId,
          tripId,
          estimatedCost: 3000,
          actualCost: newExpense.amount,
          expenses: [newExpense]
        };
        mockBudgets.push(updatedBudget);
      }
    }

    return res.status(201).json({ success: true, budget: updatedBudget });
  } catch (error) {
    console.error('Error adding expense:', error);
    return res.status(500).json({ message: 'Error adding expense' });
  }
};

export const updateBudgetExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { tripId, expenseId, description, amount, category } = req.body;

    if (!tripId || !expenseId) {
      return res.status(400).json({ success: false, message: 'Missing tripId or expenseId' });
    }

    let updatedBudget = null;
    try {
      updatedBudget = await Budget.findOne({ userId, tripId });
      if (updatedBudget) {
        const exp = updatedBudget.expenses.find(e => e.id === expenseId);
        if (exp) {
          if (description !== undefined) exp.description = description;
          if (amount !== undefined) exp.amount = Number(amount);
          if (category !== undefined) exp.category = category;
          updatedBudget.actualCost = updatedBudget.expenses.reduce((sum, e) => sum + e.amount, 0);
          await updatedBudget.save();
        }
      } else {
        const budget = mockBudgets.find(b => b.userId === userId && b.tripId === tripId);
        if (budget) {
          const exp = budget.expenses.find((e: any) => e.id === expenseId);
          if (exp) {
            if (description !== undefined) exp.description = description;
            if (amount !== undefined) exp.amount = Number(amount);
            if (category !== undefined) exp.category = category;
            budget.actualCost = budget.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
            updatedBudget = budget;
          }
        }
      }
    } catch (dbErr) {
      const budget = mockBudgets.find(b => b.userId === userId && b.tripId === tripId);
      if (budget) {
        const exp = budget.expenses.find((e: any) => e.id === expenseId);
        if (exp) {
          if (description !== undefined) exp.description = description;
          if (amount !== undefined) exp.amount = Number(amount);
          if (category !== undefined) exp.category = category;
          budget.actualCost = budget.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
          updatedBudget = budget;
        }
      }
    }

    return res.status(200).json({ success: true, budget: updatedBudget });
  } catch (error) {
    console.error('Error updating expense:', error);
    return res.status(500).json({ success: false, message: 'Error updating expense' });
  }
};

export const deleteBudgetExpense = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { tripId, expenseId } = req.query;

    if (!tripId || !expenseId) {
      return res.status(400).json({ success: false, message: 'Missing tripId or expenseId' });
    }

    let updatedBudget = null;
    try {
      updatedBudget = await Budget.findOne({ userId, tripId });
      if (updatedBudget) {
        updatedBudget.expenses = updatedBudget.expenses.filter(e => e.id !== expenseId);
        updatedBudget.actualCost = updatedBudget.expenses.reduce((sum, e) => sum + e.amount, 0);
        await updatedBudget.save();
      } else {
        const budget = mockBudgets.find(b => b.userId === userId && b.tripId === tripId);
        if (budget) {
          budget.expenses = budget.expenses.filter((e: any) => e.id !== expenseId);
          budget.actualCost = budget.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
          updatedBudget = budget;
        }
      }
    } catch (dbErr) {
      const budget = mockBudgets.find(b => b.userId === userId && b.tripId === tripId);
      if (budget) {
        budget.expenses = budget.expenses.filter((e: any) => e.id !== expenseId);
        budget.actualCost = budget.expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
        updatedBudget = budget;
      }
    }

    return res.status(200).json({ success: true, budget: updatedBudget });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return res.status(500).json({ success: false, message: 'Error deleting expense' });
  }
};
