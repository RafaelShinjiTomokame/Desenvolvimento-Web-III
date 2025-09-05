import { Request, Response } from 'express';
import ShoppingItem, { IShoppingItem } from '../models/modelo';

// --- Buscar todos os itens ---
export const getItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items: IShoppingItem[] = await ShoppingItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar os itens.', error });
  }
};

// --- Adicionar um novo item ---
export const addItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
        res.status(400).json({ message: 'Nome e preço são obrigatórios.' });
        return;
    }

    const newItem = new ShoppingItem({ name, price });
    const savedItem: IShoppingItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar o item.', error });
  }
};

// --- Atualizar um item existente ---
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const updatedItem = await ShoppingItem.findByIdAndUpdate(
        id, 
        { name, price }, 
        { new: true, runValidators: true }
    );

    if (!updatedItem) {
        res.status(404).json({ message: 'Item não encontrado.' });
        return;
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o item.', error });
  }
};

// --- Excluir um item ---
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedItem = await ShoppingItem.findByIdAndDelete(id);

    if (!deletedItem) {
        res.status(404).json({ message: 'Item não encontrado.' });
        return;
    }
    res.status(200).json({ message: 'Item excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir o item.', error });
  }
};

