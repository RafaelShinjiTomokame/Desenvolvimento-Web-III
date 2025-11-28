import express, { Request, Response } from 'express';
import Event, { IEvent } from '../models/Event';

const router = express.Router();

// Criar evento
router.post('/events', async (req: Request, res: Response) => {
  try {
    const event: IEvent = new Event(req.body);
    await event.save();
    res.status(201).json({
      success: true,
      message: 'Evento criado com sucesso!',
      data: event
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar evento',
      error: error.message
    });
  }
});

// Listar todos os eventos
router.get('/events', async (req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ data: 1 });
    res.json({
      success: true,
      data: events
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar eventos',
      error: error.message
    });
  }
});

// Pesquisar eventos por título
router.get('/events/search', async (req: Request, res: Response) => {
  try {
    const { titulo } = req.query;
    const events = await Event.find({
      titulo: { $regex: titulo, $options: 'i' }
    }).sort({ data: 1 });
    
    res.json({
      success: true,
      data: events
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar eventos',
      error: error.message
    });
  }
});

// Buscar evento por ID
router.get('/events/:id', async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }
    res.json({
      success: true,
      data: event
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar evento',
      error: error.message
    });
  }
});

// Atualizar evento
router.put('/events/:id', async (req: Request, res: Response) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Evento atualizado com sucesso!',
      data: event
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar evento',
      error: error.message
    });
  }
});

// Excluir evento
router.delete('/events/:id', async (req: Request, res: Response) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Evento excluído com sucesso!'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir evento',
      error: error.message
    });
  }
});

export default router;