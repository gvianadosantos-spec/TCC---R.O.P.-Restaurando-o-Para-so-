import { con } from "./connection.js";

export async function listNoticias() {
  const command = `
    select *
     from noticias_natureza
  `

  const [linhas] = await con.query(command);
  return linhas;
}