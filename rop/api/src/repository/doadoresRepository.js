
import { con } from './connection.js';

// REGISTRAR DOAÇÃO
export async function registrarDoacao(id_usuario, valor) {
    const command = `
        INSERT INTO doacoes (id_usuario, valor)
        VALUES (?, ?)
    `;

    const [resultado] = await con.execute(
        command,
        [id_usuario, valor]
    );

    return resultado.insertId;
}

// LISTAR DOAÇÕES DO USUÁRIO
export async function listarMinhasDoacoes(id_usuario) {
    const command = `
        SELECT
            d.id_doacao,
            u.nome_usuario,
            d.valor
        FROM doacoes AS d
        INNER JOIN usuario_cadastro AS u
            ON u.id_usuario = d.id_usuario
        WHERE d.id_usuario = ?
        ORDER BY d.id_doacao DESC
    `;

    const [linhas] = await con.execute(
        command,
        [id_usuario]
    );

    return linhas;
}

// RESUMO DE TODAS AS DOAÇÕES
export async function resumoDoacoes() {
    const command = `
        SELECT
            COUNT(*) AS quantidade_doacoes,
            COALESCE(SUM(valor), 0) AS valor_total
        FROM doacoes
    `;

    const [linhas] = await con.query(command);

    return linhas[0];
}
