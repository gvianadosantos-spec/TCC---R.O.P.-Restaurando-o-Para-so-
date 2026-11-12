
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './esqueciSenha.scss'

const ASSETS = `${process.env.PUBLIC_URL || ''}/assets/img`

const API_URL = (
  process.env.REACT_APP_API_URL || 'http://localhost:5050'
).replace(/\/+$/, '')

function obterToken() {
  const parametros = new URLSearchParams(
    window.location.hash.slice(1)
  )

  return parametros.get('token') || ''
}

export default function EsqueciSenha() {
  const [token] = useState(obterToken)
  const redefinindo = Boolean(token)

  const [email, setEmail] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [concluido, setConcluido] = useState(false)

  async function solicitarRecuperacao(event) {
    event.preventDefault()
    if (enviando) return

    setErro('')
    setMensagem('')
    setEnviando(true)

    try {
      const resposta = await fetch(
        `${API_URL}/cadastro/recuperar-senha`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      )

      const dados = await resposta.json().catch(() => null)

      if (!resposta.ok) {
        setErro(
          dados?.erro ||
          'Não foi possível solicitar a recuperação.'
        )
        return
      }

      setMensagem(
        dados?.mensagem ||
        'Se o e-mail estiver cadastrado, você receberá as instruções.'
      )
    } catch {
      setErro('Não foi possível conectar à API.')
    } finally {
      setEnviando(false)
    }
  }

  async function redefinirSenha(event) {
    event.preventDefault()
    if (enviando) return

    setErro('')
    setMensagem('')

    if (novaSenha.length < 8) {
      setErro('A senha precisa ter pelo menos 8 caracteres.')
      return
    }

    if (new TextEncoder().encode(novaSenha).length > 72) {
      setErro('A senha não pode ultrapassar 72 bytes.')
      return
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setEnviando(true)

    try {
      const resposta = await fetch(
        `${API_URL}/cadastro/redefinir-senha`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            nova_senha: novaSenha,
          }),
        }
      )

      const dados = await resposta.json().catch(() => null)

      if (!resposta.ok) {
        setErro(
          dados?.erro ||
          'Não foi possível redefinir sua senha.'
        )
        return
      }

      setConcluido(true)
      setNovaSenha('')
      setConfirmarSenha('')
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search
      )

      setMensagem('Senha redefinida com sucesso! Já pode entrar.')
    } catch {
      setErro('Não foi possível conectar à API.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="rop-login rop-recuperacao">
      <section className="rop-login__visual">
        <img
          className="rop-login__foto"
          src={`${ASSETS}/pages/inicio/apadrinhe/onca.png`}
          alt="Filhote de onça-pintada entre a vegetação"
        />

        <Link className="rop-login__marca" to="/inicio">
          <img
            src={`${ASSETS}/componentes/cabecalho/logo.png`}
            alt="R.O.P."
          />
        </Link>

        <div className="rop-login__mensagem">
          <span className="rop-login__etiqueta">
            CONECTADOS PELA NATUREZA
          </span>

          <h1>
            O caminho de volta
            <br />
            começa <em>por aqui.</em>
          </h1>

          <p>
            Recupere seu acesso e continue sua jornada
            pela preservação da fauna brasileira.
          </p>
        </div>
      </section>

      <section className="rop-login__painel">
        <Link to="/" className="rop-login__voltar">
          ← Voltar para o login
        </Link>

        <div className="rop-login__formulario">
          <p className="rop-login__sobretitulo">
            RECUPERAR ACESSO
          </p>

          <h2>
            {redefinindo
              ? 'Crie sua nova senha.'
              : 'Esqueceu sua senha?'}
          </h2>

          <p className="rop-login__introducao">
            {redefinindo
              ? 'Informe uma nova senha para sua conta.'
              : 'Informe o e-mail utilizado no seu cadastro.'}
          </p>

          {!redefinindo && (
            <form onSubmit={solicitarRecuperacao}>
              <label htmlFor="recuperacao-email">
                E-mail da sua conta
              </label>

              <div className="rop-login__campo">
                <input
                  id="recuperacao-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setErro('')
                  }}
                  disabled={enviando}
                  required
                />
              </div>

              {erro && (
                <p className="rop-login__erro" role="alert">
                  {erro}
                </p>
              )}

              {mensagem && (
                <div
                  className="rop-recuperacao__mensagem"
                  role="status"
                >
                  <p>{mensagem}</p>
                </div>
              )}

              <button
                className="rop-login__entrar"
                type="submit"
                disabled={enviando}
              >
                {enviando
                  ? 'Solicitando...'
                  : 'Enviar instruções'}
              </button>
            </form>
          )}

          {redefinindo && !concluido && (
            <form onSubmit={redefinirSenha}>
              <label htmlFor="nova-senha">
                Nova senha
              </label>

              <div className="rop-login__campo">
                <input
                  id="nova-senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Mínimo de 8 caracteres"
                  autoComplete="new-password"
                  minLength={8}
                  value={novaSenha}
                  onChange={(event) =>
                    setNovaSenha(event.target.value)
                  }
                  disabled={enviando}
                  required
                />
              </div>

              <label htmlFor="confirmar-senha">
                Confirme a nova senha
              </label>

              <div className="rop-login__campo">
                <input
                  id="confirmar-senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  placeholder="Digite novamente"
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmarSenha}
                  onChange={(event) =>
                    setConfirmarSenha(event.target.value)
                  }
                  disabled={enviando}
                  required
                />
              </div>

              <label className="rop-recuperacao__mostrar">
                <input
                  type="checkbox"
                  checked={mostrarSenha}
                  onChange={(event) =>
                    setMostrarSenha(event.target.checked)
                  }
                />
                Mostrar senhas
              </label>

              {erro && (
                <p className="rop-login__erro" role="alert">
                  {erro}
                </p>
              )}

              <button
                className="rop-login__entrar"
                type="submit"
                disabled={enviando}
              >
                {enviando
                  ? 'Salvando...'
                  : 'Redefinir minha senha'}
              </button>
            </form>
          )}

          {concluido && (
            <div
              className="rop-recuperacao__mensagem"
              role="status"
            >
              <p>{mensagem}</p>
              <Link to="/">Ir para o login</Link>
            </div>
          )}

          <p className="rop-login__cadastro">
            Lembrou sua senha?{' '}
            <Link to="/">Faça login</Link>
          </p>

          <Link
            className="rop-login__explorar"
            to="/inicio"
          >
            Voltar para o projeto
          </Link>
        </div>

        <footer className="rop-login__rodape">
          Cuidar da natureza é cuidar do nosso futuro.
        </footer>
      </section>
    </main>
  )
}
