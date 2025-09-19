import mongoose, { Document } from 'mongoose';
export interface ILivro extends Document {
    titulo: string;
    autor: string;
    ano: number;
}
declare const _default: mongoose.Model<ILivro, {}, {}, {}, mongoose.Document<unknown, {}, ILivro, {}, {}> & ILivro & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=livro.d.ts.map