import { createHash } from 'node:crypto'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

// Mantemos versão texto simples para leitores de e-mail sem HTML.
function corpoTexto(link) {
  return [
    'R.O.P. — Restaurando o Paraíso',
    '',
    'Redefinição de senha',
    '',
    'Recebemos uma solicitação para redefinir a senha da sua conta R.O.P.',
    'Use o endereço abaixo para criar uma nova senha:',
    '',
    link,
    '',
    'Este link expira em 30 minutos e só pode ser usado uma vez.',
    'Se você não fez essa solicitação, pode ignorar esta mensagem.',
    '',
    'R.O.P. — Restaurando o Paraíso',
    'Projeto acadêmico fictício de conservação da fauna brasileira.'
  ].join('\n')
}

function escaparHtml(valor) {
  return String(valor).replace(/[&<>"']/g, (simbolo) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[simbolo]
  )
}

// HTML com estilos inline: maior compatibilidade com Gmail, Outlook e celular.
function corpoHtml(link) {
  const urlSegura = escaparHtml(link)
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Recuperação de senha — R.O.P.</title>
</head>
<body style="margin:0;padding:0;background-color:#f3f0e7;color:#142a23;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;overflow:hidden;opacity:0;">
    Você solicitou a redefinição da sua senha na R.O.P. O link expira em 30 minutos.
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f3f0e7;">
    <tr><td align="center" style="padding:34px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background-color:#ffffff;border:1px solid #dce6de;">
        <tr><td style="padding:25px 32px;background-color:#10352c;color:#ffffff;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:29px;font-weight:bold;letter-spacing:1px;">R.O.P.</div>
          <div style="margin-top:3px;font-size:12px;letter-spacing:1px;color:#d7e7df;">RESTAURANDO O PARAÍSO</div>
        </td></tr>
        <tr><td style="padding:36px 32px 30px;">
          <p style="margin:0 0 12px;color:#95661d;font-size:12px;font-weight:bold;letter-spacing:1.5px;">SEGURANÇA DA CONTA</p>
          <h1 style="margin:0 0 17px;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;font-weight:normal;color:#14372d;">Redefinir sua senha</h1>
          <p style="margin:0 0 20px;color:#394b43;font-size:15px;line-height:1.7;">Recebemos uma solicitação para alterar a senha da sua conta na R.O.P. Para continuar, utilize o botão abaixo.</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#e8aa32" style="background-color:#e8aa32;">
            <a href="${urlSegura}" style="display:inline-block;padding:15px 22px;color:#1d281b;text-decoration:none;font-size:15px;font-weight:bold;">Criar nova senha</a>
          </td></tr></table>
          <p style="margin:24px 0 7px;font-size:14px;line-height:1.6;color:#394b43;"><strong>O link é válido por 30 minutos</strong> e só pode ser utilizado uma vez.</p>
          <p style="margin:0 0 22px;font-size:14px;line-height:1.6;color:#394b43;">Se você não solicitou essa alteração, ignore este e-mail. Sua senha atual não será alterada.</p>
          <hr style="height:1px;border:0;background-color:#dce6de;margin:23px 0 17px;">
          <p style="margin:0 0 7px;color:#63776b;font-size:12px;line-height:1.6;">Se o botão não funcionar, copie o endereço abaixo no navegador:</p>
          <p style="margin:0;color:#24533f;font-size:12px;line-height:1.6;word-break:break-all;overflow-wrap:anywhere;"><a href="${urlSegura}" style="color:#24533f;text-decoration:underline;">${urlSegura}</a></p>
        </td></tr>
        <tr><td style="padding:20px 32px;background-color:#edf3ed;color:#5f7368;font-size:12px;line-height:1.6;">
          R.O.P. — Restaurando o Paraíso<br>
          Projeto acadêmico fictício de conservação da fauna brasileira.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function urlRecuperacao(token) {
  const base = process.env.FRONTEND_URL
  const url = new URL('/esqueci-senha', base)
  if (!['https:', 'http:'].includes(url.protocol)) {
    throw new Error('FRONTEND_URL precisa usar http ou https')
  }
  url.hash = new URLSearchParams({ token }).toString()
  return url.toString()
}

export async function enviarLinkRecuperacao(email, token) {
  const link = urlRecuperacao(token)
  const idempotencyKey = 'rop-recuperacao-' + createHash('sha256').update(token).digest('hex')
  const corpo = {
    from: process.env.RESEND_FROM,
    to: [email],
    subject: 'Redefina sua senha | R.O.P.',
    text: corpoTexto(link),
    html: corpoHtml(link)
  }

  // Uma nova tentativa apenas em falhas transitórias; mesma chave evita duplicação.
  for (let tentativa = 0; tentativa < 2; tentativa++) {
    try {
      const resposta = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        signal: AbortSignal.timeout(9000),
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(corpo)
      })

      if (resposta.ok) {
        // O Resend aceitou o envio; isso ainda não confirma entrega na caixa de entrada.
        const resultado = await resposta.json().catch(() => ({}))
        console.log('Resend aceitou solicitação de recuperação.', resultado.id || '')
        return
      }

      if (![500, 502, 503, 504].includes(resposta.status) || tentativa === 1) {
        throw new Error(`Resend recusou envio (HTTP ${resposta.status})`)
      }
    } catch (erro) {
      const podeRepetir = tentativa === 0 && (
        erro.name === 'TimeoutError' ||
        erro.name === 'AbortError' ||
        erro instanceof TypeError
      )
      if (!podeRepetir) throw erro
    }

    await new Promise((resolver) => setTimeout(resolver, 450))
  }
}
