import { createHash, randomBytes } from 'node:crypto'
import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { con } from '../repository/connection.js'

const router = Router()

const limitarSolicitacoes = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: { erro: 'Muitas solicitações. Aguarde alguns minutos.' },
})

const limitarRedefinicoes = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { erro: 'Muitas tentativas. Aguarde alguns minutos.' },
})

const mensagemSolicitacao = {
    mensagem: 'Se o e-mail estiver cadastrado, você receberá um link de recuperação.',
}

const hashToken = (token) => createHash('sha256').update(token).digest()

async function enviarLink(email, token) {
    const porta = Number(process.env.SMTP_PORT || 587)

    const transporte = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: porta,
        secure: porta === 465,
        requireTLS: porta !== 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    const link = new URL('/esqueci-senha', process.env.FRONTEND_URL)
    link.hash = new URLSearchParams({ token }).toString()

    await transporte.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Redefinição de senha — R.O.P.',
        text: `Abra este link para redefinir sua senha:\n${link}\n\nO link expira em 30 minutos. Se você não solicitou a troca, ignore este e-mail.`,
    })
}

router.post('/cadastro/recuperar-senha', limitarSolicitacoes, async (req, res) => {
    const email = typeof req.body?.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : ''

    if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ erro: 'Informe um e-mail válido.' })
    }

    try {
        const token = randomBytes(32).toString('hex')
        const tokenHash = hashToken(token)

        const [resultado] = await con.execute(
            `INSERT INTO recuperacao_senha (id_usuario, token_hash, expira_em)
             SELECT id_usuario, ?, UTC_TIMESTAMP() + INTERVAL 30 MINUTE
             FROM usuario_cadastro
             WHERE email = ?
             LIMIT 1
             ON DUPLICATE KEY UPDATE
                 token_hash = ?,
                 expira_em = UTC_TIMESTAMP() + INTERVAL 30 MINUTE`,
            [tokenHash, email, tokenHash]
        )

        if (resultado.affectedRows > 0) {
            void enviarLink(email, token).catch((erro) => {
                console.error('Falha no envio da recuperação:', erro.code || 'SMTP')
            })
        }

        return res.status(202).json(mensagemSolicitacao)
    } catch (erro) {
        console.error('Falha ao solicitar recuperação:', erro.code || erro.name)
        return res.status(500).json({ erro: 'Não foi possível processar a solicitação.' })
    }
})

router.post('/cadastro/redefinir-senha', limitarRedefinicoes, async (req, res) => {
    const { token, nova_senha } = req.body ?? {}

    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
        return res.status(400).json({ erro: 'Link inválido ou expirado.' })
    }

    if (
        typeof nova_senha !== 'string' ||
        nova_senha.length < 8 ||
        Buffer.byteLength(nova_senha, 'utf8') > 72
    ) {
        return res.status(400).json({
            erro: 'A senha deve ter pelo menos 8 caracteres e até 72 bytes.',
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
             WHERE token_hash = ? AND expira_em > UTC_TIMESTAMP()
             FOR UPDATE`,
            [tokenHash]
        )

        if (pedidos.length === 0) {
            await conexao.rollback()
            return res.status(400).json({ erro: 'Link inválido ou expirado.' })
        }

        const { id_usuario } = pedidos[0]
        const senhaHash = await bcrypt.hash(nova_senha, 12)

        await conexao.execute(
            'UPDATE usuario_cadastro SET senha_hash = ? WHERE id_usuario = ?',
            [senhaHash, id_usuario]
        )
        await conexao.execute(
            'DELETE FROM recuperacao_senha WHERE id_usuario = ?',
            [id_usuario]
        )

        await conexao.commit()
        return res.json({ mensagem: 'Senha redefinida. Entre com a nova senha.' })
    } catch (erro) {
        if (conexao) {
            await conexao.rollback().catch(() => {})
        }
        console.error('Falha ao redefinir senha:', erro.code || erro.name)
        return res.status(500).json({ erro: 'Não foi possível redefinir a senha.' })
    } finally {
        conexao?.release()
    }
})

export default router