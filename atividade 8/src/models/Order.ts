import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  titulo: string;
  descricao: string;
  dataAbertura: Date;
  status: 'aberta' | 'em andamento' | 'concluída';
  prioridade: 'baixa' | 'média' | 'alta';
  responsavel?: string;
  setorSolicitante: string;
  prazoEstimado?: Date;
  valorServico: number;
}

const OrderSchema: Schema = new Schema({
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [100, 'Título não pode exceder 100 caracteres']
  },
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    maxlength: [500, 'Descrição não pode exceder 500 caracteres']
  },
  dataAbertura: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['aberta', 'em andamento', 'concluída'],
    required: true,
    default: 'aberta'
  },
  prioridade: {
    type: String,
    enum: ['baixa', 'média', 'alta'],
    required: true
  },
  responsavel: {
    type: String,
    trim: true
  },
  setorSolicitante: {
    type: String,
    required: [true, 'Setor solicitante é obrigatório'],
    trim: true
  },
  prazoEstimado: {
    type: Date
  },
  valorServico: {
    type: Number,
    required: [true, 'Valor do serviço é obrigatório'],
    min: [0, 'Valor não pode ser negativo']
  }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', OrderSchema);