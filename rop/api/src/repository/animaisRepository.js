import { con } from './connection.js';

// A view do banco rop reúne os seis grupos e fornece um id_catalogo
// único para cada espécie (id_animal se repete entre as tabelas).
const VIEW_ANIMAIS = 'vw_animais_completos';

export async function listAnimais({ nome = '', categoria = '', status = '' } = {}) {
  const filtros = [];
  const parametros = [];

  if (nome) {
    filtros.push('(nome_popular LIKE ? OR nome_cientifico LIKE ?)');
    parametros.push(`%${nome}%`, `%${nome}%`);
  }
  if (categoria) {
    filtros.push('classe_especie = ?');
    parametros.push(categoria);
  }
  if (status) {
    filtros.push('status_conservacao = ?');
    parametros.push(status);
  }

  const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
  const sql = `
    SELECT * FROM ${VIEW_ANIMAIS}
    ${where}
    ORDER BY id_catalogo ASC
  `;

  const [linhas] = await con.query(sql, parametros);
  return linhas;
}

export async function getAnimalPorCatalogo(idCatalogo) {
  const [linhas] = await con.query(
    `SELECT * FROM ${VIEW_ANIMAIS} WHERE id_catalogo = ? LIMIT 1`,
    [idCatalogo]
  );
  return linhas[0] ?? null;
}

export async function estatisticasAnimais() {
  const [totais] = await con.query(
    `SELECT COUNT(*) AS total FROM ${VIEW_ANIMAIS}`
  );
  const [porCategoria] = await con.query(`
    SELECT classe_especie AS categoria, COUNT(*) AS quantidade
    FROM ${VIEW_ANIMAIS}
    GROUP BY classe_especie
    ORDER BY classe_especie
  `);
  const [porStatus] = await con.query(`
    SELECT status_conservacao AS status, COUNT(*) AS quantidade
    FROM ${VIEW_ANIMAIS}
    GROUP BY status_conservacao
    ORDER BY status_conservacao
  `);

  return {
    total: Number(totais[0]?.total ?? 0),
    por_categoria: porCategoria,
    por_status: porStatus
  };
}

// Mantidos para não quebrar os endpoints já existentes.
export const listMamiferos = () => listAnimais({ categoria: 'Mamíferos' });
export const listAves = () => listAnimais({ categoria: 'Aves' });
export const listRepteis = () => listAnimais({ categoria: 'Répteis' });
export const listAnfibios = () => listAnimais({ categoria: 'Anfibios' });
export const listPeixes = () => listAnimais({ categoria: 'Peixes' });
export const listInvertebrados = () => listAnimais({ categoria: 'Invertebrados' });
export const listAnimaisPesquisa = (nome) => listAnimais({ nome });
