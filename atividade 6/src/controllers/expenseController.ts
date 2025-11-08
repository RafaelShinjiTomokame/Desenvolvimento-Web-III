import { Request, Response } from 'express';
import Expense, { IExpense } from '../models/Expense';

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { description, amount, date } = req.body;
    
    if (!description || !amount) {
      return res.status(400).json({ error: 'Descrição e valor são obrigatórios' });
    }
    
    if (amount < 0) {
      return res.status(400).json({ error: 'O valor não pode ser negativo' });
    }

    const expenseData: any = {
      description,
      amount: parseFloat(amount)
    };

    if (date) {
      expenseData.date = new Date(date);
    }

    const expense = new Expense(expenseData);
    await expense.save();
    
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar despesa' });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar despesas' });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { description, amount, date } = req.body;

    if (amount && amount < 0) {
      return res.status(400).json({ error: 'O valor não pode ser negativo' });
    }

    const updateData: any = {};
    if (description) updateData.description = description;
    if (amount) updateData.amount = parseFloat(amount);
    if (date) updateData.date = new Date(date);

    const expense = await Expense.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar despesa' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }

    res.json({ message: 'Despesa excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir despesa' });
  }
};

export const getTotalExpenses = async (req: Request, res: Response) => {
  try {
    const total = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    const totalAmount = total.length > 0 ? total[0].totalAmount : 0;
    res.json({ totalAmount });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao calcular o total das despesas' });
  }
};