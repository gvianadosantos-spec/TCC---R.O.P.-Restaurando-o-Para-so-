import * as dbNoticias from '../repository/noticiasRepository.js';

import { Router } from "express";
const endpoints = Router();

endpoints.get('/noticias', async (req, resp) => {
  let not = await dbNoticias.listNoticias();
  resp.send(not);
})

export default endpoints;