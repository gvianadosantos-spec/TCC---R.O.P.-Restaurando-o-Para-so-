import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import * as service from '../service/cadastroService.js'
import { getAuthentication } from '../utils/jwt.js'

const endpoints = Router()
const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Tente novamente mais tarde.' }
})

function responderErro(err, resp) {
  if (err.code === 'ER_DUP_ENTRY') {
    return resp.status(409).json({ erro: 'Email ou nome de usuário já cadastrado.' })
  }
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 500 ? err.status : 500
  if (status === 500) console.error('Erro no cadastro:', err)
  return resp.status(status).json({ erro: status === 500 ? 'Erro interno do servidor.' : err.message })
}

function conferirDono(req, resp) {
  const id = Number(req.params.id)
  if (!Number.isSafeInteger(id) || id < 1) {
    resp.status(400).json({ erro: 'ID inválido.' })
    return null
  }
  if (id !== Number(req.user.id_usuario)) {
    resp.status(403).json({ erro: 'Você só pode alterar sua própria conta.' })
    return null
  }
  return id
}

endpoints.post('/cadastro', async (req, resp) => {
  try {
    const id = await service.saveCadastro(req.body ?? {})
    return resp.status(201).json({ id })
  } catch (err) { return responderErro(err, resp) }
})

endpoints.post('/cadastro/login', limitarLogin, async (req, resp) => {
  try {
    const token = await service.login(req.body?.email, req.body?.senha ?? req.body?.senha_hash)
    return resp.json({ token })
  } catch (err) { return responderErro(err, resp) }
})

endpoints.get('/cadastro/me', getAuthentication(), async (req, resp) => {
  try {
    const perfil = await service.consultarPerfil(req.user.id_usuario)
    return resp.json(perfil)
  } catch (err) { return responderErro(err, resp) }
})

// Atualiza somente a conta identificada pelo JWT (não aceita ID de outra pessoa).
endpoints.put('/cadastro/me', getAuthentication(), async (req, resp) => {
  try {
    const perfil = await service.editarPerfil(req.user.id_usuario, req.body)
    return resp.json(perfil)
  } catch (err) { return responderErro(err, resp) }
})

endpoints.put('/email/:id', getAuthentication(), async (req, resp) => {
  const id = conferirDono(req, resp)
  if (id === null) return
  try { return resp.json({ qtd: await service.alterarEmail(id, req.body ?? {}) }) }
  catch (err) { return responderErro(err, resp) }
})

endpoints.put('/senha/:id', getAuthentication(), async (req, resp) => {
  const id = conferirDono(req, resp)
  if (id === null) return
  try { return resp.json({ qtd: await service.alterarSenha(id, req.body ?? {}) }) }
  catch (err) { return responderErro(err, resp) }
})

export default endpoints
