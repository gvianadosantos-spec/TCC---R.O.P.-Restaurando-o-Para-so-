import 'dotenv/config';
import mysql from 'mysql2/promise';
import { readFileSync } from 'node:fs';

const url = process.env.MYSQL_URL;
if (!url) {
  throw new Error('MYSQL_URL nao configurada no Railway.');
}

const con = await mysql.createConnection({ uri: url, multipleStatements: true });
try {
  const [databaseRows] = await con.query('SELECT DATABASE() AS nome');
  const database = databaseRows[0]?.nome;
  if (!database) throw new Error('MYSQL_URL deve selecionar um banco de dados.');

  const [tables] = await con.execute(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
    [database]
  );
  if (tables.length === 0) {
    console.log('Banco vazio: importando esquema e catalogo de 60 animais...');
    const script = readFileSync(new URL('../db/rop-inicial.sql', import.meta.url), 'utf8');
    await con.query(script);
  } else {
    const required = [
      'usuario_cadastro', 'pesquisa_especie', 'mamiferos', 'aves', 'repteis',
      'anfibios', 'peixes', 'invertebrados', 'catalogo_especies',
      'vw_animais_completos', 'doacoes', 'noticias_natureza', 'recuperacao_senha'
    ];
    const existing = new Set(tables.map((row) => row.TABLE_NAME ?? row.table_name));
    const missing = required.filter((table) => !existing.has(table));
    if (missing.length) {
      throw new Error(
        'Banco ja contem objetos, mas o esquema R.O.P. esta incompleto: ' +
        missing.join(', ') + '. Nenhum dado foi sobrescrito.'
      );
    }
    console.log('Esquema ja presente; importacao ignorada para preservar os dados.');
  }

  const [rows] = await con.query(
    'SELECT COUNT(*) AS total FROM vw_animais_completos'
  );
  const total = Number(rows[0]?.total ?? 0);
  if (total < 60) {
    throw new Error('Catalogo R.O.P. contem apenas ' + total + ' especies. Revisao necessaria.');
  }
  console.log('Banco R.O.P. verificado. Animais no catalogo: ' + total);
} finally {
  await con.end();
}
