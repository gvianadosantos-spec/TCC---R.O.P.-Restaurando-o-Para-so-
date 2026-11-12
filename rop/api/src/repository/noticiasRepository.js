import { con } from './connection.js';

export async function listNoticias() {
  const command = `
    SELECT
      id_noticia,
      titulo,
      descricao,
      imagem_url,
      fonte_url,
      publicado_em
    FROM noticias_natureza
    ORDER BY publicado_em DESC, id_noticia DESC
  `;

  const [linhas] = await con.query(command);
  return linhas;
}
