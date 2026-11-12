import { con } from './connection.js'

export async function buscarPorEmail(email) {
  const [linhas] = await con.execute(
    `SELECT id_usuario, nome_usuario, email, senha_hash
     FROM usuario_cadastro WHERE email = ? LIMIT 1`, [email]
  )
  return linhas[0] ?? null
}

export async function buscarPorNome(nome_usuario) {
  const [linhas] = await con.execute(
    'SELECT id_usuario FROM usuario_cadastro WHERE nome_usuario = ? LIMIT 1', [nome_usuario]
  )
  return linhas[0] ?? null
}

export async function buscarPorId(id_usuario) {
  const [linhas] = await con.execute(
    `SELECT id_usuario, nome_usuario, email, senha_hash,
       DATE_FORMAT(data_nascimento, '%Y-%m-%d') AS data_nascimento,
       foto_perfil, criado_em
     FROM usuario_cadastro WHERE id_usuario = ? LIMIT 1`, [id_usuario]
  )
  return linhas[0] ?? null
}

export async function criarConta({ nome_usuario, email, senha_hash }) {
  const [resultado] = await con.execute(
    `INSERT INTO usuario_cadastro (nome_usuario, email, senha_hash)
     VALUES (?, ?, ?)`, [nome_usuario, email, senha_hash]
  )
  return resultado.insertId
}

export async function atualizarEmail(id_usuario, email) {
  const [resultado] = await con.execute(
    'UPDATE usuario_cadastro SET email = ? WHERE id_usuario = ?', [email, id_usuario]
  )
  return resultado.affectedRows
}

export async function atualizarSenha(id_usuario, senha_hash) {
  const [resultado] = await con.execute(
    'UPDATE usuario_cadastro SET senha_hash = ? WHERE id_usuario = ?', [senha_hash, id_usuario]
  )
  return resultado.affectedRows
}

export async function atualizarPerfil(id_usuario, campos) {
  const permitidos = ['nome_usuario', 'data_nascimento', 'foto_perfil']
  const nomes = permitidos.filter((nome) => Object.prototype.hasOwnProperty.call(campos, nome))
  if (!nomes.length) return 0
  const partes = nomes.map((nome) => `${nome} = ?`)
  const valores = nomes.map((nome) => campos[nome])
  const [resultado] = await con.execute(
    `UPDATE usuario_cadastro SET ${partes.join(', ')} WHERE id_usuario = ?`,
    [...valores, id_usuario]
  )
  return resultado.affectedRows
}
