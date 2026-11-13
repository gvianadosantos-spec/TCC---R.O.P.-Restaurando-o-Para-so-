import { con } from './connection.js';

// Cria somente a tabela de favoritos, sem alterar contas ou animais existentes.
export async function prepararFavoritos() {
  await con.query(`
    CREATE TABLE IF NOT EXISTS favoritos_animais (
      id_usuario INT NOT NULL,
      id_especie INT NOT NULL,
      id_animal INT NOT NULL,
      criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id_usuario, id_especie, id_animal),
      KEY idx_favoritos_animal (id_especie, id_animal),
      CONSTRAINT fk_favoritos_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario_cadastro(id_usuario)
        ON DELETE CASCADE,
      CONSTRAINT fk_favoritos_catalogo
        FOREIGN KEY (id_especie, id_animal)
        REFERENCES catalogo_especies(id_especie, id_animal)
        ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
}

export async function listarFavoritos(idUsuario) {
  const [linhas] = await con.execute(`
    SELECT
      f.id_especie, f.id_animal, f.criado_em,
      a.nome_popular, a.nome_cientifico, a.classe_especie, a.imagem_url
    FROM favoritos_animais AS f
    JOIN vw_animais_completos AS a
      ON a.id_especie = f.id_especie AND a.id_animal = f.id_animal
    WHERE f.id_usuario = ?
    ORDER BY f.criado_em DESC, f.id_especie, f.id_animal
  `, [idUsuario]);
  return linhas;
}

export async function animalExiste(idEspecie, idAnimal) {
  const [linhas] = await con.execute(
    'SELECT id_catalogo FROM catalogo_especies WHERE id_especie = ? AND id_animal = ? LIMIT 1',
    [idEspecie, idAnimal]
  );
  return linhas.length > 0;
}

export async function adicionarFavorito(idUsuario, idEspecie, idAnimal) {
  await con.execute(`
    INSERT INTO favoritos_animais (id_usuario, id_especie, id_animal)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE id_usuario = id_usuario
  `, [idUsuario, idEspecie, idAnimal]);
}

export async function removerFavorito(idUsuario, idEspecie, idAnimal) {
  await con.execute(`
    DELETE FROM favoritos_animais
    WHERE id_usuario = ? AND id_especie = ? AND id_animal = ?
  `, [idUsuario, idEspecie, idAnimal]);
}
