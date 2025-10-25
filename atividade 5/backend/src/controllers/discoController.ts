import { Request, Response } from 'express';
import Disco, { IDisco } from '../models/Disco';

// Criar novo disco
export const criarDisco = async (req: Request, res: Response): Promise<void> => {
  try {
    const discoData = {
      titulo: req.body.titulo,
      artista: req.body.artista,
      ano: req.body.ano,
      genero: req.body.genero,
      formato: req.body.formato,
      preco: req.body.preco
    };

    const disco = new Disco(discoData);
    const novodisco = await disco.save();
    
    res.status(201).json({
      success: true,
      data: novodisco,
      message: 'Disco criado com sucesso!'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Listar todos os discos
export const listarDiscos = async (req: Request, res: Response): Promise<void> => {
  try {
    const discos = await Disco.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: discos.length,
      data: discos
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar discos: ' + error.message
    });
  }
};

// Obter disco por ID
export const obterDisco = async (req: Request, res: Response): Promise<void> => {
  try {
    const disco = await Disco.findById(req.params.id);
    
    if (!disco) {
      res.status(404).json({
        success: false,
        error: 'Disco não encontrado'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: disco
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar disco: ' + error.message
    });
  }
};

// Atualizar disco
export const atualizarDisco = async (req: Request, res: Response): Promise<void> => {
  try {
    const disco = await Disco.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!disco) {
      res.status(404).json({
        success: false,
        error: 'Disco não encontrado'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: disco,
      message: 'Disco atualizado com sucesso!'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Excluir disco
export const excluirDisco = async (req: Request, res: Response): Promise<void> => {
  try {
    const disco = await Disco.findByIdAndDelete(req.params.id);
    
    if (!disco) {
      res.status(404).json({
        success: false,
        error: 'Disco não encontrado'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Disco excluído com sucesso!'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir disco: ' + error.message
    });
  }
};