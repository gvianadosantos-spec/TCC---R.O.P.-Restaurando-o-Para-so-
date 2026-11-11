
import bcrypt from 'bcryptjs';
import * as db from '../repository/cadastroRepository.js';
import { generateToken } from '../utils/jwt.js';

function erro(mensagem, status = 400) {
  return Object.assign(new Error(mensagem), { status });
}

function validarEmail(valor) {
  const email = typeof valor === 'string'
    ? valor.trim().toLowerCase()
    : '';

  if (
    email.length > 255 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw erro('Informe um email válido.');
  }

  return email;
}

function validarSenha(senha) {
  if (
    typeof senha !== 'string' ||
    senha.length < 8 ||
    Buffer.byteLength(senha, 'utf8') > 72
  ) {
    throw erro(
      'A senha deve ter pelo menos 8 caracteres e até 72 bytes.'
    );
  }

  return senha;
}

// CADASTRAR USUÁRIO
export async function saveCadastro(dados = {}) {
  const nome_usuario =
    typeof dados.nome_usuario === 'string'
      ? dados.nome_usuario.trim()
      : '';

  if (nome_usuario.length < 3 || nome_usuario.length > 100) {
    throw erro('O nome de usuário deve ter de 3 a 100 caracteres.');
  }

  const email = validarEmail(dados.email);
  const senha = validarSenha(dados.senha ?? dados.senha_hash);

  if (await db.buscarPorEmail(email)) {
    throw erro('Email já cadastrado.', 409);
  }

  if (await db.buscarPorNome(nome_usuario)) {
    throw erro('Nome de usuário já cadastrado.', 409);
  }

  const senha_hash = await bcrypt.hash(senha, 12);

  return db.criarConta({
    nome_usuario,
    email,
    senha_hash
  });
}

// LOGIN
export async function login(emailInformado, senha) {
  const email = validarEmail(emailInformado);

  if (typeof senha !== 'string') {
    throw erro('Email ou senha inválidos.', 401);
  }

  const usuario = await db.buscarPorEmail(email);

  const correta = usuario
    ? await bcrypt.compare(senha, usuario.senha_hash)
    : false;

  if (!correta) {
    throw erro('Email ou senha inválidos.', 401);
  }

  return generateToken(usuario);
}

// CONSULTAR PERFIL
export async function consultarPerfil(id_usuario) {
  const usuario = await db.buscarPorId(id_usuario);

  if (!usuario) {
    throw erro('Usuário não encontrado.', 404);
  }

  return {
    id_usuario: usuario.id_usuario,
    nome_usuario: usuario.nome_usuario,
    email: usuario.email
  };
}

// ALTERAR EMAIL
export async function alterarEmail(id_usuario, dados = {}) {
  const novoEmail = validarEmail(dados.email);
  const usuario = await db.buscarPorId(id_usuario);

  if (!usuario) {
    throw erro('Usuário não encontrado.', 404);
  }

  const senhaCorreta =
    typeof dados.senha_atual === 'string' &&
    await bcrypt.compare(
      dados.senha_atual,
      usuario.senha_hash
    );

  if (!senhaCorreta) {
    throw erro('Senha atual incorreta.', 401);
  }

  if (usuario.email.toLowerCase() === novoEmail) {
    throw erro('Esse já é seu email atual.');
  }

  if (await db.buscarPorEmail(novoEmail)) {
    throw erro('Email já cadastrado.', 409);
  }

  return db.atualizarEmail(id_usuario, novoEmail);
}

// ALTERAR SENHA
export async function alterarSenha(id_usuario, dados = {}) {
  const nova_senha = validarSenha(dados.nova_senha);
  const usuario = await db.buscarPorId(id_usuario);

  if (!usuario) {
    throw erro('Usuário não encontrado.', 404);
  }

  const senhaCorreta =
    typeof dados.senha_atual === 'string' &&
    await bcrypt.compare(
      dados.senha_atual,
      usuario.senha_hash
    );

  if (!senhaCorreta) {
    throw erro('Senha atual incorreta.', 401);
  }

  if (await bcrypt.compare(nova_senha, usuario.senha_hash)) {
    throw erro('A nova senha deve ser diferente da atual.');
  }

  const senha_hash = await bcrypt.hash(nova_senha, 12);

  return db.atualizarSenha(id_usuario, senha_hash);
}
