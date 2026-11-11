
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';

import * as service from '../service/cadastroService.js';
import { getAuthentication } from '../utils/jwt.js';

const endpoints = Router();

// LIMITAR TENTATIVAS DE LOGIN
const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    erro: 'Muitas tentativas de login. Tente novamente mais tarde.'
  }
});

// TRATAMENTO DE ERROS
function responderErro(err, resp) {
  if (err.code === 'ER_DUP_ENTRY') {
    return resp.status(409).json({
      erro: 'Email ou nome de usuário já cadastrado.'
    });
  }

  const status =
    Number.isInteger(err.status) &&
    err.status >= 400 &&
    err.status < 500
      ? err.status
      : 500;

  if (status === 500) {
    console.error('Erro no cadastro:', err);
  }

  return resp.status(status).json({
    erro: status === 500
      ? 'Erro interno do servidor.'
      : err.message
  });
}

// IMPEDIR ALTERAÇÕES EM CONTAS DE OUTRAS PESSOAS
function conferirDono(req, resp) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    resp.status(400).json({ erro: 'ID inválido.' });
    return null;
  }

  if (id !== Number(req.user.id_usuario)) {
    resp.status(403).json({
      erro: 'Você só pode alterar sua própria conta.'
    });
    return null;
  }

  return id;
}

// CRIAR CONTA
endpoints.post('/cadastro', async (req, resp) => {
  try {
    const id = await service.saveCadastro(req.body ?? {});
    return resp.status(201).json({ id });
  } catch (err) {
    return responderErro(err, resp);
  }
});

// FAZER LOGIN
endpoints.post(
  '/cadastro/login',
  limitarLogin,
  async (req, resp) => {
    try {
      const token = await service.login(
        req.body?.email,
        req.body?.senha ?? req.body?.senha_hash
      );

      return resp.json({ token });
    } catch (err) {
      return responderErro(err, resp);
    }
  }
);

// CONSULTAR O PRÓPRIO PERFIL
endpoints.get(
  '/cadastro/me',
  getAuthentication(),
  async (req, resp) => {
    try {
      const perfil = await service.consultarPerfil(
        req.user.id_usuario
      );

      return resp.json(perfil);
    } catch (err) {
      return responderErro(err, resp);
    }
  }
);

// ATUALIZAR EMAIL
endpoints.put(
  '/email/:id',
  getAuthentication(),
  async (req, resp) => {
    const id = conferirDono(req, resp);
    if (id === null) return;

    try {
      const qtd = await service.alterarEmail(
        id,
        req.body ?? {}
      );

      return resp.json({ qtd });
    } catch (err) {
      return responderErro(err, resp);
    }
  }
);

// ATUALIZAR SENHA
endpoints.put(
  '/senha/:id',
  getAuthentication(),
  async (req, resp) => {
    const id = conferirDono(req, resp);
    if (id === null) return;

    try {
      const qtd = await service.alterarSenha(
        id,
        req.body ?? {}
      );

      return resp.json({ qtd });
    } catch (err) {
      return responderErro(err, resp);
    }
  }
);

export default endpoints;
