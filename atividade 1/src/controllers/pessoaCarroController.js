// Arquivo: src/controllers/pessoaCarroController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Associar uma pessoa a um carro
export const createAssociacao = async (req, res) => {
    try {
        const { idpessoa, idcarro } = req.body;
        const associacao = await prisma.pessoaPorCarro.create({
            data: { 
                idpessoa: parseInt(idpessoa), 
                idcarro: parseInt(idcarro) 
            },
        });
        res.status(201).json(associacao);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar associação ou associação já existente.' });
    }
};

// Listar todas as associações
export const getAssociacoes = async (req, res) => {
    try {
        const associacoes = await prisma.pessoaPorCarro.findMany({
            include: { // Inclui os dados da pessoa e do carro
                pessoa: true,
                carro: true,
            },
        });
        res.status(200).json(associacoes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Excluir uma associação
export const deleteAssociacao = async (req, res) => {
    try {
        const { idpessoa, idcarro } = req.params;
        await prisma.pessoaPorCarro.delete({
            where: {
                idpessoa_idcarro: {
                    idpessoa: parseInt(idpessoa),
                    idcarro: parseInt(idcarro),
                },
            },
        });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Associação não encontrada.' });
    }
};