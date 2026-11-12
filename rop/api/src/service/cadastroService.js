import bcrypt from 'bcryptjs'
import * as db from '../repository/cadastroRepository.js'
import { generateToken } from '../utils/jwt.js'

function erro(mensagem, status = 400) {
  return Object.assign(new Error(mensagem), { status })
}

function validarEmail(valor) {
  const email = typeof valor === 'string' ? valor.trim().toLowerCase() : ''
  if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw erro('Informe um email válido.')
  }
  return email
}

function validarSenha(senha) {
  if (typeof senha !== 'string' || senha.length < 8 || Buffer.byteLength(senha, 'utf8') > 72) {
    throw erro('A senha deve ter pelo menos 8 caracteres e até 72 bytes.')
  }
  return senha
}

export async function saveCadastro(dados = {}) {
  const nome_usuario = typeof dados.nome_usuario === 'string' ? dados.nome_usuario.trim() : ''
  if (nome_usuario.length < 3 || nome_usuario.length > 100) {
    throw erro('O nome de usuário deve ter de 3 a 100 caracteres.')
  }
  const email = validarEmail(dados.email)
  const senha = validarSenha(dados.senha ?? dados.senha_hash)
  if (await db.buscarPorEmail(email)) throw erro('Email já cadastrado.', 409)
  if (await db.buscarPorNome(nome_usuario)) throw erro('Nome de usuário já cadastrado.', 409)
  const senha_hash = await bcrypt.hash(senha, 12)
  return db.criarConta({ nome_usuario, email, senha_hash })
}

export async function login(emailInformado, senha) {
  const email = validarEmail(emailInformado)
  if (typeof senha !== 'string') throw erro('Email ou senha inválidos.', 401)
  const usuario = await db.buscarPorEmail(email)
  const correta = usuario ? await bcrypt.compare(senha, usuario.senha_hash) : false
  if (!correta) throw erro('Email ou senha inválidos.', 401)
  return generateToken(usuario)
}

export async function consultarPerfil(id_usuario) {
  const usuario = await db.buscarPorId(id_usuario)
  if (!usuario) throw erro('Usuário não encontrado.', 404)
  return {
    id_usuario: usuario.id_usuario,
    nome_usuario: usuario.nome_usuario,
    email: usuario.email,
    data_nascimento: usuario.data_nascimento,
    foto_perfil: usuario.foto_perfil,
    criado_em: usuario.criado_em
  }
}

function validarNascimento(valor) {
  if (valor === null || valor === '') return null
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    throw erro('Informe uma data de aniversário válida.')
  }
  const [ano, mes, dia] = valor.split('-').map(Number)
  const data = new Date(Date.UTC(ano, mes - 1, dia))
  if (ano < 1900 || data.getUTCFullYear() !== ano || data.getUTCMonth() + 1 !== mes || data.getUTCDate() !== dia || data.getTime() > Date.now()) {
    throw erro('Informe uma data de aniversário válida e não futura.')
  }
  return valor
}

function validarFoto(valor) {
  if (valor === null) return null
  if (typeof valor !== 'string' || valor.length > 210000 || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(valor)) {
    throw erro('Formato de foto inválido. Use uma imagem JPG pequena.')
  }
  const base64 = valor.split(',')[1]
  const imagem = Buffer.from(base64, 'base64')
  if (imagem.length > 155000 || imagem.length < 4 || imagem[0] !== 0xff || imagem[1] !== 0xd8 || imagem[2] !== 0xff || imagem[imagem.length - 2] !== 0xff || imagem[imagem.length - 1] !== 0xd9) {
    throw erro('O arquivo enviado não é uma imagem JPG válida.')
  }
  return valor
}

export async function editarPerfil(id_usuario, dados = {}) {
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) throw erro('Dados de perfil inválidos.')
  const permitidos = ['nome_usuario', 'data_nascimento', 'foto_perfil']
  const chaves = Object.keys(dados)
  if (!chaves.length || chaves.some((chave) => !permitidos.includes(chave))) {
    throw erro('Informe apenas campos permitidos do perfil.')
  }
  const usuario = await db.buscarPorId(id_usuario)
  if (!usuario) throw erro('Usuário não encontrado.', 404)
  const campos = {}
  if (Object.prototype.hasOwnProperty.call(dados, 'nome_usuario')) {
    const nome = typeof dados.nome_usuario === 'string' ? dados.nome_usuario.trim() : ''
    if (nome.length < 3 || nome.length > 100) throw erro('O nome deve ter de 3 a 100 caracteres.')
    if (nome !== usuario.nome_usuario && await db.buscarPorNome(nome)) throw erro('Nome de usuário já cadastrado.', 409)
    campos.nome_usuario = nome
  }
  if (Object.prototype.hasOwnProperty.call(dados, 'data_nascimento')) {
    campos.data_nascimento = validarNascimento(dados.data_nascimento)
  }
  if (Object.prototype.hasOwnProperty.call(dados, 'foto_perfil')) {
    campos.foto_perfil = validarFoto(dados.foto_perfil)
  }
  await db.atualizarPerfil(id_usuario, campos)
  return consultarPerfil(id_usuario)
}

export async function alterarEmail(id_usuario, dados = {}) {
  const novoEmail = validarEmail(dados.email)
  const usuario = await db.buscarPorId(id_usuario)
  if (!usuario) throw erro('Usuário não encontrado.', 404)
  const senhaCorreta = typeof dados.senha_atual === 'string' && await bcrypt.compare(dados.senha_atual, usuario.senha_hash)
  if (!senhaCorreta) throw erro('Senha atual incorreta.', 401)
  if (usuario.email.toLowerCase() === novoEmail) throw erro('Esse já é seu email atual.')
  if (await db.buscarPorEmail(novoEmail)) throw erro('Email já cadastrado.', 409)
  return db.atualizarEmail(id_usuario, novoEmail)
}

export async function alterarSenha(id_usuario, dados = {}) {
  const nova_senha = validarSenha(dados.nova_senha)
  const usuario = await db.buscarPorId(id_usuario)
  if (!usuario) throw erro('Usuário não encontrado.', 404)
  const senhaCorreta = typeof dados.senha_atual === 'string' && await bcrypt.compare(dados.senha_atual, usuario.senha_hash)
  if (!senhaCorreta) throw erro('Senha atual incorreta.', 401)
  if (await bcrypt.compare(nova_senha, usuario.senha_hash)) throw erro('A nova senha deve ser diferente da atual.')
  const senha_hash = await bcrypt.hash(nova_senha, 12)
  return db.atualizarSenha(id_usuario, senha_hash)
}
