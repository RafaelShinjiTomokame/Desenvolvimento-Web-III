import { Request, Response } from 'express';
import Order, { IOrder } from '../models/Order';

export class OrderController {
  // Criar nova ordem de serviço
  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const orderData = req.body;
      const newOrder: IOrder = new Order(orderData);
      const savedOrder = await newOrder.save();
      
      res.status(201).json({
        success: true,
        data: savedOrder,
        message: 'Ordem de serviço criada com sucesso'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Erro ao criar ordem de serviço',
        error: error.message
      });
    }
  }

  // Listar todas as ordens com filtros
  public async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const { status, prioridade, setor, titulo } = req.query;
      
      const filter: any = {};
      
      if (status) filter.status = status;
      if (prioridade) filter.prioridade = prioridade;
      if (setor) filter.setorSolicitante = { $regex: setor, $options: 'i' };
      if (titulo) filter.titulo = { $regex: titulo, $options: 'i' };

      const orders = await Order.find(filter).sort({ dataAbertura: -1 });
      
      res.status(200).json({
        success: true,
        data: orders,
        total: orders.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar ordens de serviço',
        error: error.message
      });
    }
  }

  // Obter ordem por ID
  public async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const order = await Order.findById(req.params.id);
      
      if (!order) {
        res.status(404).json({
          success: false,
          message: 'Ordem de serviço não encontrada'
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar ordem de serviço',
        error: error.message
      });
    }
  }

  // Atualizar ordem de serviço
  public async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedOrder) {
        res.status(404).json({
          success: false,
          message: 'Ordem de serviço não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedOrder,
        message: 'Ordem de serviço atualizada com sucesso'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'Erro ao atualizar ordem de serviço',
        error: error.message
      });
    }
  }

  // Excluir ordem de serviço
  public async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const deletedOrder = await Order.findByIdAndDelete(req.params.id);

      if (!deletedOrder) {
        res.status(404).json({
          success: false,
          message: 'Ordem de serviço não encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Ordem de serviço excluída com sucesso'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir ordem de serviço',
        error: error.message
      });
    }
  }

  // Estatísticas do sistema
  public async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const totalOrders = await Order.countDocuments();
      const openOrders = await Order.countDocuments({ status: 'aberta' });
      const inProgressOrders = await Order.countDocuments({ status: 'em andamento' });
      const completedOrders = await Order.countDocuments({ status: 'concluída' });
      
      const highPriorityOrders = await Order.countDocuments({ prioridade: 'alta' });
      
      const totalValue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: '$valorServico' } } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          total: totalOrders,
          abertas: openOrders,
          emAndamento: inProgressOrders,
          concluidas: completedOrders,
          altaPrioridade: highPriorityOrders,
          valorTotal: totalValue[0]?.total || 0
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar estatísticas',
        error: error.message
      });
    }
  }
}