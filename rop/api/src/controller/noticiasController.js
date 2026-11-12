import { Router } from 'express';
import * as dbNoticias from '../repository/noticiasRepository.js';

const endpoints = Router();

endpoints.get('/noticias', async (req, resp) => {
  try {
    const noticias = await dbNoticias.listNoticias();
    resp.status(200).send(noticias);
  } catch (erro) {
    console.error('Erro ao listar notícias:', erro);

    resp.status(500).send({
      erro: 'Não foi possível carregar as notícias.'
    });
  }
});

export default endpoints;
