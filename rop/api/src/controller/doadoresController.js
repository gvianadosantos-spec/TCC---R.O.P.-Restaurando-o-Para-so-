
import { Router } from 'express';
import * as dbDoacoes from '../repository/doadoresRepository.js';
import { getAuthentication } from '../utils/jwt.js';

const endpoints = Router();
const autenticado = getAuthentication();

// REGISTRAR DOAÇÃO
endpoints.post('/doacoes', autenticado, async (req, resp) => {
    try {
        const id_usuario = Number(req.user?.id_usuario);

        const valor = String(req.body?.valor ?? '')
            .trim()
            .replace(',', '.');

        if (!Number.isSafeInteger(id_usuario) || id_usuario <= 0) {
            return resp.status(401).json({
                erro: 'Usuário inválido no token.'
            });
        }

        if (
            !/^(0|[1-9]\d{0,7})(\.\d{1,2})?$/.test(valor) ||
            Number(valor) <= 0
        ) {
            return resp.status(400).json({
                erro: 'Informe um valor positivo com até duas casas decimais.'
            });
        }

        const id_doacao = await dbDoacoes.registrarDoacao(
            id_usuario,
            valor
        );

        return resp.status(201).json({
            id_doacao,
            id_usuario,
            valor
        });

    } catch (err) {
        console.error('Erro ao registrar doação:', err);

        return resp.status(500).json({
            erro: 'Erro ao registrar doação.'
        });
    }
});

// CONSULTAR MINHAS DOAÇÕES
endpoints.get('/doacoes/me', autenticado, async (req, resp) => {
    try {
        const doacoes = await dbDoacoes.listarMinhasDoacoes(
            req.user.id_usuario
        );

        return resp.status(200).json(doacoes);

    } catch (err) {
        console.error('Erro ao consultar doações:', err);

        return resp.status(500).json({
            erro: 'Erro ao consultar doações.'
        });
    }
});

// RESUMO GERAL
endpoints.get('/doacoes/resumo', autenticado, async (req, resp) => {
    try {
        const resumo = await dbDoacoes.resumoDoacoes();

        return resp.status(200).json(resumo);

    } catch (err) {
        console.error('Erro ao consultar resumo:', err);

        return resp.status(500).json({
            erro: 'Erro ao consultar resumo.'
        });
    }
});

export default endpoints;
