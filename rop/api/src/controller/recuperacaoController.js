
import { createHash, randomBytes } from 'node:crypto'
import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import { con } from '../repository/connection.js'

const router = Router()

// Limitar solicitações de recuperação
const limitarSolicitacoes = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: {
        erro: 'Muitas solicitações. Aguarde alguns minutos.'
    }
})

// Limitar tentativas de redefinição
const limitarRedefinicoes = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {
        erro: 'Muitas tentativas. Aguarde alguns minutos.'
    }
})

// Mensagem genérica para proteger os e-mails cadastrados
const mensagemSolicitacao = {
    mensagem: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação.'
}

// Gerar hash do token
const hashToken = (token) =>
    createHash('sha256').update(token).digest()

// =====================================================
// ENVIAR E-MAIL PELO RESEND
// =====================================================

async function enviarLink(email, token) {
    const link = new URL(
        '/esqueci-senha',
        process.env.FRONTEND_URL
    )

    link.hash = new URLSearchParams({ token }).toString()

    const resposta = await fetch(
        'https://api.resend.com/emails',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: process.env.RESEND_FROM,
                to: [email],
                subject: 'Recuperação de senha — R.O.P.',
                text: `Olá!

Recebemos uma solicitação para redefinir sua senha na R.O.P.

Clique no link abaixo para criar uma nova senha:

${link.toString()}

Este link expira em 30 minutos.

Se você não solicitou a alteração, ignore este e-mail.

R.O.P. — Restaurando o Paraíso`
            })
        }
    )

    if (!resposta.ok) {
        throw new Error(
            `Resend recusou o envio (HTTP ${resposta.status})`
        )
    }

    console.log('Solicitação de envio aceita pelo Resend.')
}

// =====================================================
// SOLICITAR RECUPERAÇÃO DE SENHA
// =====================================================

router.post(
    '/cadastro/recuperar-senha',
    limitarSolicitacoes,
    async (req, res) => {

        const email = typeof req.body?.email === 'string'
            ? req.body.email.trim().toLowerCase()
            : ''

        if (
            email.length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            return res.status(400).json({
                erro: 'Informe um e-mail válido.'
            })
        }

        // Verificar configuração do Resend
        const resendConfigurado = [
            'RESEND_API_KEY',
            'RESEND_FROM',
            'FRONTEND_URL'
        ].every((nome) =>
            Boolean(process.env[nome]?.trim())
        )

        if (!resendConfigurado) {
            return res.status(503).json({
                erro: 'A recuperação de senha está temporariamente indisponível.'
            })
        }

        try {
            const token = randomBytes(32).toString('hex')
            const tokenHash = hashToken(token)

            const [resultado] = await con.execute(
                `INSERT INTO recuperacao_senha
                    (id_usuario, token_hash, expira_em)
                 SELECT
                    id_usuario,
                    ?,
                    UTC_TIMESTAMP() + INTERVAL 30 MINUTE
                 FROM usuario_cadastro
                 WHERE email = ?
                 LIMIT 1
                 ON DUPLICATE KEY UPDATE
                    token_hash = ?,
                    expira_em = UTC_TIMESTAMP() + INTERVAL 30 MINUTE`,
                [tokenHash, email, tokenHash]
            )

            if (resultado.affectedRows > 0) {
                try {
                    await enviarLink(email, token)
                } catch (erroEnvio) {
                    console.error(
                        'Falha no envio da recuperação:',
                        erroEnvio.message
                    )
                }
            }

            return res.status(202).json(
                mensagemSolicitacao
            )

        } catch (erro) {
            console.error(
                'Falha ao solicitar recuperação:',
                erro.code || erro.name
            )

            return res.status(500).json({
                erro: 'Não foi possível processar a solicitação.'
            })
        }
    }
)

// =====================================================
// REDEFINIR SENHA
// =====================================================

router.post(
    '/cadastro/redefinir-senha',
    limitarRedefinicoes,
    async (req, res) => {

        const { token, nova_senha } = req.body ?? {}

        if (
            typeof token !== 'string' ||
            !/^[a-f0-9]{64}$/.test(token)
        ) {
            return res.status(400).json({
                erro: 'Link inválido ou expirado.'
            })
        }

        if (
            typeof nova_senha !== 'string' ||
            nova_senha.length < 8 ||
            Buffer.byteLength(nova_senha, 'utf8') > 72
        ) {
            return res.status(400).json({
                erro: 'A senha deve ter pelo menos 8 caracteres e até 72 bytes.'
            })
        }

        let conexao

        try {
            const tokenHash = hashToken(token)

            conexao = await con.getConnection()

            await conexao.beginTransaction()

            const [pedidos] = await conexao.execute(
                `SELECT id_usuario
                 FROM recuperacao_senha
                 WHERE token_hash = ?
                   AND expira_em > UTC_TIMESTAMP()
                 FOR UPDATE`,
                [tokenHash]
            )

            if (pedidos.length === 0) {
                await conexao.rollback()

                return res.status(400).json({
                    erro: 'Link inválido ou expirado.'
                })
            }

            const { id_usuario } = pedidos[0]

            const senhaHash = await bcrypt.hash(
                nova_senha,
                12
            )

            await conexao.execute(
                `UPDATE usuario_cadastro
                 SET senha_hash = ?
                 WHERE id_usuario = ?`,
                [senhaHash, id_usuario]
            )

            await conexao.execute(
                `DELETE FROM recuperacao_senha
                 WHERE id_usuario = ?`,
                [id_usuario]
            )

            await conexao.commit()

            return res.json({
                mensagem: 'Senha redefinida. Entre com a nova senha.'
            })

        } catch (erro) {
            if (conexao) {
                await conexao.rollback().catch(() => {})
            }

            console.error(
                'Falha ao redefinir senha:',
                erro.code || erro.name
            )

            return res.status(500).json({
                erro: 'Não foi possível redefinir a senha.'
            })

        } finally {
            conexao?.release()
        }
    }
)

export default router
