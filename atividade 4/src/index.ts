import express from 'express';
import type { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Servir arquivos estáticos da pasta 'views'
app.use(express.static(path.join(__dirname, '..', 'views')));

// Rota para a página inicial
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Rota para buscar o clima
app.get('/weather', async (req: Request, res: Response) => {
    const city = req.query.city as string;
    const apiKey = process.env.API_KEY;

    if (!city) {
        return res.status(400).json({ error: 'O nome da cidade não pode estar vazio.' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        const weatherData = {
            city: data.name,
            country: data.sys.country,
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
        };

        res.json(weatherData);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return res.status(404).json({ error: 'Cidade não encontrada.' });
        }
        res.status(500).json({ error: 'Erro ao buscar dados do clima.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});