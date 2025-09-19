import mongoose, { Schema, Document } from 'mongoose';
// Schema do livro
const LivroSchema = new Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    ano: { type: Number, required: true },
});
// Exporta o modelo
export default mongoose.model('Livro', LivroSchema);
//# sourceMappingURL=livro.js.map