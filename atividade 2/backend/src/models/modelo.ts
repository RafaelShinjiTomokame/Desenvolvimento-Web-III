import mongoose, { Schema, Document } from 'mongoose';

// Interface para definir a estrutura de um item de compra
export interface IShoppingItem extends Document {
  name: string;
  price: number;
}

// Schema do Mongoose para o item de compra
const ShoppingItemSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'O nome do produto é obrigatório.'],
    trim: true // Remove espaços em branco do início e do fim
  },
  price: {
    type: Number,
    required: [true, 'O preço do produto é obrigatório.'],
    min: [0, 'O preço não pode ser negativo.']
  }
}, {
  timestamps: true // Adiciona os campos createdAt e updatedAt automaticamente
});

// Exporta o modelo. O Mongoose criará uma coleção chamada 'shoppingitems'.
export default mongoose.model<IShoppingItem>('ShoppingItem', ShoppingItemSchema);

