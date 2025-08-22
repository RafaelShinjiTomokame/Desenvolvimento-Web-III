import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * @description Cria um novo carro no banco de dados.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const createCarro = async (req, res) => {
    try {
        const { modelo } = req.body;
        const carro = await prisma.carro.create({
            data: { modelo },
        });
        res.status(201).json(carro);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * @description Lista todos os carros cadastrados.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getCarros = async (req, res) => {
    try {
        const carros = await prisma.carro.findMany();
        res.status(200).json(carros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @description Busca um carro específico pelo seu ID.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const getCarroById = async (req, res) => {
    try {
        const { id } = req.params;
        const carro = await prisma.carro.findUnique({
            where: { id: parseInt(id) },
        });
        if (!carro) {
            return res.status(404).json({ error: 'Carro não encontrado' });
        }
        res.status(200).json(carro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @description Atualiza os dados de um carro pelo ID.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const updateCarro = async (req, res) => {
    try {
        const { id } = req.params;
        const { modelo } = req.body;
        const carro = await prisma.carro.update({
            where: { id: parseInt(id) },
            data: { modelo },
        });
        res.status(200).json(carro);
    } catch (error) {
        // O Prisma retorna um erro específico se o registro a ser atualizado não for encontrado.
        res.status(404).json({ error: 'Carro não encontrado' });
    }
};

/**
 * @description Exclui um carro do banco de dados pelo ID.
 * @param {object} req - O objeto de requisição do Express.
 * @param {object} res - O objeto de resposta do Express.
 */
export const deleteCarro = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.carro.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send(); // Resposta de sucesso sem conteúdo.
    } catch (error) {
        res.status(404).json({ error: 'Carro não encontrado' });
    }
};