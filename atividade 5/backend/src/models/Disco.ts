import mongoose, { Document, Schema } from 'mongoose';

export interface IDisco extends Document {
  titulo: string;
  artista: string;
  ano: number;
  genero: string;
  formato: 'Vinil' | 'CD';
  preco: number;
  createdAt: Date;
  updatedAt: Date;
}

const DiscoSchema: Schema = new Schema({
  titulo: { 
    type: String, 
    required: [true, 'Título é obrigatório'],
    trim: true
  },
  artista: { 
    type: String, 
    required: [true, 'Artista é obrigatório'],
    trim: true
  },
  ano: { 
    type: Number, 
    required: [true, 'Ano é obrigatório'],
    min: [1900, 'Ano deve ser maior que 1900'],
    max: [new Date().getFullYear(), 'Ano não pode ser no futuro']
  },
  genero: { 
    type: String, 
    required: [true, 'Gênero é obrigatório'],
    trim: true
  },
  formato: { 
    type: String, 
    enum: {
      values: ['Vinil', 'CD'],
      message: 'Formato deve ser Vinil ou CD'
    },
    required: [true, 'Formato é obrigatório']
  },
  preco: { 
    type: Number, 
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  }
}, {
  timestamps: true
});

export default mongoose.model<IDisco>('Disco', DiscoSchema);