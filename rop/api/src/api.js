
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { addRoutes } from './routes.js';

const api = express();

// Configurações do servidor
api.use(cors());
api.use(express.json());

// Teste de funcionamento da API
api.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        mensagem: 'API R.O.P. funcionando'
    });
});

// Mantém as rotas existentes
addRoutes(api);

// Porta do servidor
const PORT = Number(process.env.PORT) || 5050;

api.listen(PORT, () => {
    console.log(
        `API R.O.P. iniciada em http://localhost:${PORT}`
    );
});
