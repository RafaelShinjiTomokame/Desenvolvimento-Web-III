"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalExpenses = exports.deleteExpense = exports.updateExpense = exports.getExpenses = exports.createExpense = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
const createExpense = async (req, res) => {
    try {
        const { description, amount, date } = req.body;
        if (!description || !amount) {
            return res.status(400).json({ error: 'Descrição e valor são obrigatórios' });
        }
        if (amount < 0) {
            return res.status(400).json({ error: 'O valor não pode ser negativo' });
        }
        const expenseData = {
            description,
            amount: parseFloat(amount)
        };
        if (date) {
            expenseData.date = new Date(date);
        }
        const expense = new Expense_1.default(expenseData);
        await expense.save();
        res.status(201).json(expense);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar despesa' });
    }
};
exports.createExpense = createExpense;
const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense_1.default.find().sort({ date: -1 });
        res.json(expenses);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar despesas' });
    }
};
exports.getExpenses = getExpenses;
const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, amount, date } = req.body;
        if (amount && amount < 0) {
            return res.status(400).json({ error: 'O valor não pode ser negativo' });
        }
        const updateData = {};
        if (description)
            updateData.description = description;
        if (amount)
            updateData.amount = parseFloat(amount);
        if (date)
            updateData.date = new Date(date);
        const expense = await Expense_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!expense) {
            return res.status(404).json({ error: 'Despesa não encontrada' });
        }
        res.json(expense);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar despesa' });
    }
};
exports.updateExpense = updateExpense;
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense_1.default.findByIdAndDelete(id);
        if (!expense) {
            return res.status(404).json({ error: 'Despesa não encontrada' });
        }
        res.json({ message: 'Despesa excluída com sucesso' });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao excluir despesa' });
    }
};
exports.deleteExpense = deleteExpense;
const getTotalExpenses = async (req, res) => {
    try {
        const total = await Expense_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        const totalAmount = total.length > 0 ? total[0].totalAmount : 0;
        res.json({ totalAmount });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao calcular o total das despesas' });
    }
};
exports.getTotalExpenses = getTotalExpenses;
