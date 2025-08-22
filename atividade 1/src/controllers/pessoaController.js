import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Criar uma pessoa [cite: 66]
export const createPessoa = async (req, res) => {
    const { nome } = req.body;
    const pessoa = await prisma.pessoa.create({ data: { nome } });
    res.status(201).json(pessoa);
};

// Listar todas as pessoas [cite: 67]
export const getPessoas = async (req, res) => {
    const pessoas = await prisma.pessoa.findMany();
    res.status(200).json(pessoas);
};

// Buscar pessoa por id [cite: 68]
export const getPessoaById = async (req, res) => {
    const { id } = req.params;
    const pessoa = await prisma.pessoa.findUnique({ where: { id: parseInt(id) } });
    if (!pessoa) return res.status(404).json({ error: 'Pessoa não encontrada' });
    res.status(200).json(pessoa);
};

// Atualizar pessoa por id [cite: 69]
export const updatePessoa = async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    const pessoa = await prisma.pessoa.update({
        where: { id: parseInt(id) },
        data: { nome },
    });
    res.status(200).json(pessoa);
};

// Excluir pessoa por id [cite: 70]
export const deletePessoa = async (req, res) => {
    const { id } = req.params;
    await prisma.pessoa.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
};