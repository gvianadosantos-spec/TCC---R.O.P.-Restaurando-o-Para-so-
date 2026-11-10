import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './login.scss'

const ASSETS = `${process.env.PUBLIC_URL || ''}/assets/img`

function Icone({ tipo }) {
    const caminhos = {
        seta: (
            <path d="M5 12h14M13 6l6 6-6 6" />
        ),
        usuario: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
            </>
        ),
        cadeado: (
            <>
                <rect x="5" y="10" width="14" height="11" rx="3" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
            </>
        ),
        olho: (
            <>
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ),
        oculto: (
            <>
                <path d="m3 3 18 18" />
                <path d="M10.6 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a19 19 0 0 1-3.2 4" />
                <path d="M6.2 6.2A21 21 0 0 0 2 12s3.5 7 10 7a12 12 0 0 0 5.8-1.5" />
                <path d="M10 10a3 3 0 0 0 4 4" />
            </>
        ),
        folha: (
            <path d="M20 4C9 2 3 8 5 15s15 5 15-11ZM5 20l10-10" />
        ),
    }

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {caminhos[tipo]}
        </svg>
    )
}

export default function Login() {
    const navigate = useNavigate()

    const [usuario, setUsuario] = useState('')
    const [senha, setSenha] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [capsLock, setCapsLock] = useState(false)
    const [erro, setErro] = useState('')

    function entrar(event) {
        event.preventDefault()

        if (!usuario.trim()) {
            setErro('Informe seu nome de usuário.')
            event.currentTarget.elements.usuario.focus()
            return
        }

        setErro('')

        // Fluxo demonstrativo.
        // Quando a API estiver pronta, autentique antes de navegar.
        navigate('/inicio')
    }

    function verificarCapsLock(event) {
        setCapsLock(event.getModifierState('CapsLock'))
    }

    return (
        <main className="rop-login">
            <section
                className="rop-login__visual"
                aria-labelledby="login-proposito"
            >
                <img
                    className="rop-login__foto"
                    src={`${ASSETS}/pages/inicio/apadrinhe/onca.png`}
                    alt="Filhote de onça-pintada entre a vegetação"
                    fetchPriority="high"
                />

                <Link
                    className="rop-login__marca"
                    to="/inicio"
                    aria-label="R.O.P. — Ir para o início"
                >
                    <img
                        src={`${ASSETS}/componentes/cabecalho/logo.png`}
                        alt=""
                    />
                </Link>

                <div className="rop-login__mensagem">
                    <span className="rop-login__etiqueta">
                        <span />
                        CONECTADOS PELA NATUREZA
                    </span>

                    <h1 id="login-proposito">
                        O futuro da fauna
                        <br />
                        começa com <em>você.</em>
                    </h1>

                    <p>
                        Conhecer, cuidar e preservar. Faça parte dessa
                        conexão com a vida que existe ao nosso redor.
                    </p>

                    <div className="rop-login__assinatura">
                        <Icone tipo="folha" />
                        <span>
                            Uma nova conexão. Um mesmo propósito.
                        </span>
                    </div>
                </div>

                <span className="rop-login__legenda">
                    FAUNA BRASILEIRA
                    <span>ONÇA-PINTADA</span>
                </span>
            </section>

            <section
                className="rop-login__painel"
                aria-labelledby="login-titulo"
            >
                <Link to="/inicio" className="rop-login__voltar">
                    <span aria-hidden="true">←</span>
                    Voltar para o site
                </Link>

                <div className="rop-login__formulario">
                    <div className="rop-login__simbolo">
                        <Icone tipo="folha" />
                    </div>

                    <p className="rop-login__sobretitulo">
                        BEM-VINDO À R.O.P.
                    </p>

                    <h2 id="login-titulo">
                        Bom ter você
                        <br />
                        por aqui de novo.
                    </h2>

                    <p className="rop-login__introducao">
                        Entre na sua conta e continue essa jornada
                        com a gente.
                    </p>

                    <form onSubmit={entrar}>
                        <label htmlFor="usuario">
                            Nome de usuário
                        </label>

                        <div className="rop-login__campo">
                            <Icone tipo="usuario" />

                            <input
                                id="usuario"
                                name="usuario"
                                type="text"
                                placeholder="Digite seu usuário"
                                autoComplete="username"
                                autoCapitalize="none"
                                spellCheck={false}
                                value={usuario}
                                onChange={(event) => {
                                    setUsuario(event.target.value)
                                    setErro('')
                                }}
                                aria-invalid={Boolean(erro)}
                                aria-describedby={
                                    erro ? 'login-erro' : undefined
                                }
                                required
                            />
                        </div>

                        <div className="rop-login__linha-senha">
                            <label htmlFor="senha">Senha</label>

                            <Link to="/esqueci-senha">
                                Esqueceu a senha?
                            </Link>
                        </div>

                        <div className="rop-login__campo">
                            <Icone tipo="cadeado" />

                            <input
                                id="senha"
                                name="senha"
                                type={mostrarSenha ? 'text' : 'password'}
                                placeholder="Digite sua senha"
                                autoComplete="current-password"
                                value={senha}
                                onChange={(event) => {
                                    setSenha(event.target.value)
                                }}
                                onKeyDown={verificarCapsLock}
                                onKeyUp={verificarCapsLock}
                                onBlur={() => setCapsLock(false)}
                                aria-describedby={
                                    capsLock ? 'login-caps' : undefined
                                }
                                required
                            />

                            <button
                                className="rop-login__ver-senha"
                                type="button"
                                aria-label={
                                    mostrarSenha
                                        ? 'Ocultar senha'
                                        : 'Mostrar senha'
                                }
                                aria-pressed={mostrarSenha}
                                onClick={() => {
                                    setMostrarSenha(!mostrarSenha)
                                }}
                            >
                                <Icone
                                    tipo={mostrarSenha ? 'oculto' : 'olho'}
                                />
                            </button>
                        </div>

                        {capsLock && (
                            <p
                                id="login-caps"
                                className="rop-login__aviso"
                                role="status"
                            >
                                Caps Lock está ativado.
                            </p>
                        )}

                        {erro && (
                            <p
                                id="login-erro"
                                className="rop-login__erro"
                                role="alert"
                            >
                                {erro}
                            </p>
                        )}

                        <button
                            className="rop-login__entrar"
                            type="submit"
                        >
                            Entrar na minha conta
                            <Icone tipo="seta" />
                        </button>

                        <p className="rop-login__demo">
                            Modo demonstração · acesso sem autenticação.
                        </p>
                    </form>

                    <p className="rop-login__cadastro">
                        Ainda não faz parte?{' '}
                        <Link to="/registro">
                            Crie sua conta{' '}
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </p>

                    <Link
                        className="rop-login__explorar"
                        to="/inicio"
                    >
                        Prefiro explorar o projeto
                        <Icone tipo="seta" />
                    </Link>
                </div>

                <footer className="rop-login__rodape">
                    <Icone tipo="folha" />
                    Cuidar da natureza é cuidar do nosso futuro.
                </footer>
            </section>
        </main>
    )
}