import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  titulo: string;
  descricao?: string;
  data: Date;
  local: string;
  valor: number;
}

const EventSchema: Schema = new Schema({
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  descricao: {
    type: String,
    trim: true
  },
  data: {
    type: Date,
    required: [true, 'Data é obrigatória']
  },
  local: {
    type: String,
    required: [true, 'Local é obrigatório'],
    trim: true
  },
  valor: {
    type: Number,
    required: [true, 'Valor é obrigatório'],
    min: [0, 'Valor não pode ser negativo']
  }
}, {
  timestamps: true
});

export default mongoose.model<IEvent>('Event', EventSchema);