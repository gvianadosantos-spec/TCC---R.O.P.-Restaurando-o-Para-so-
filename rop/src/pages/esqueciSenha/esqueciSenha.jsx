import { useState } from 'react'
import { Link } from 'react-router-dom'
import './esqueciSenha.scss'

const ASSETS = `${process.env.PUBLIC_URL || ''}/assets/img`

function Icone({ tipo }) {
    const caminhos = {
        email: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m3 7 9 6 9-6" />
            </>
        ),
        chave: (
            <>
                <circle cx="8" cy="8" r="5" />
                <path d="m12 12 9 9M16 16l3-3M18 18l3-3" />
            </>
        ),
        folha: (
            <path d="M20 4C9 2 3 8 5 15s15 5 15-11ZM5 20l10-10" />
        ),
        seta: (
            <path d="M5 12h14M13 6l6 6-6 6" />
        ),
        voltar: (
            <path d="M19 12H5m6-6-6 6 6 6" />
        ),
        check: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 3 3 5-6" />
            </>
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

export default function EsqueciSenha({
    onSolicitarRecuperacao,
    enviando = false,
    mensagem = '',
    erro = '',
}) {
    const [email, setEmail] = useState('')

    function solicitarRecuperacao(event) {
        event.preventDefault()

        // Conecte a chamada da API por esta função.
        // Nenhum envio ou sucesso é simulado nesta página.
        onSolicitarRecuperacao?.(email.trim())
    }

    return (
        <main className="rop-login rop-recuperacao">
            <section
                className="rop-login__visual"
                aria-labelledby="recuperacao-proposito"
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
                        SUA CONEXÃO CONTINUA
                    </span>

                    <h1 id="recuperacao-proposito">
                        O caminho de volta
                        <br />
                        começa <em>por aqui.</em>
                    </h1>

                    <p>
                        Às vezes, a gente só precisa reencontrar
                        o caminho. Recupere seu acesso e continue
                        essa jornada pela fauna brasileira.
                    </p>

                    <div className="rop-login__assinatura">
                        <Icone tipo="folha" />

                        <span>
                            A natureza ainda tem muito para compartilhar.
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
                aria-labelledby="recuperacao-titulo"
            >
                <Link to="/" className="rop-login__voltar">
                    <span aria-hidden="true">←</span>
                    Voltar para o login
                </Link>

                <div className="rop-login__formulario">
                    <div className="rop-login__simbolo">
                        <Icone tipo="chave" />
                    </div>

                    <p className="rop-login__sobretitulo">
                        RECUPERAR ACESSO
                    </p>

                    <h2 id="recuperacao-titulo">
                        Esqueceu
                        <br />
                        sua senha?
                    </h2>

                    <p className="rop-login__introducao">
                        Acontece! Informe o e-mail da sua conta
                        para solicitar as instruções de recuperação.
                    </p>

                    <form
                        onSubmit={solicitarRecuperacao}
                        aria-busy={enviando}
                    >
                        <label htmlFor="recuperacao-email">
                            E-mail da sua conta
                        </label>

                        <div className="rop-login__campo">
                            <Icone tipo="email" />

                            <input
                                id="recuperacao-email"
                                name="email"
                                type="email"
                                placeholder="seuemail@exemplo.com"
                                autoComplete="email"
                                autoCapitalize="none"
                                spellCheck={false}
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value)
                                }}
                                readOnly={enviando}
                                aria-describedby="recuperacao-dica"
                                required
                            />
                        </div>

                        <p
                            id="recuperacao-dica"
                            className="rop-recuperacao__dica"
                        >
                            Use o mesmo e-mail informado no cadastro.
                        </p>

                        {erro && (
                            <p
                                className="rop-login__erro"
                                role="alert"
                            >
                                {erro}
                            </p>
                        )}

                        {mensagem && !erro && (
                            <div
                                className="rop-recuperacao__mensagem"
                                role="status"
                            >
                                <Icone tipo="check" />
                                <p>{mensagem}</p>
                            </div>
                        )}

                        <button
                            className="rop-login__entrar"
                            type="submit"
                            disabled={enviando}
                        >
                            {enviando ? (
                                <>
                                    Enviando…
                                    <span
                                        className="rop-recuperacao__carregando"
                                        aria-hidden="true"
                                    />
                                </>
                            ) : (
                                <>
                                    Enviar instruções
                                    <Icone tipo="seta" />
                                </>
                            )}
                        </button>
                    </form>

                    <aside className="rop-recuperacao__ajuda">
                        <div className="rop-recuperacao__ajuda-icone">
                            <Icone tipo="email" />
                        </div>

                        <div>
                            <h3>Não encontrou o e-mail?</h3>

                            <p>
                                Depois de solicitar, confira também
                                as pastas de spam e lixo eletrônico.
                            </p>
                        </div>
                    </aside>

                    <p className="rop-login__cadastro">
                        Lembrou sua senha?{' '}
                        <Link to="/">
                            Faça login{' '}
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </p>

                    <Link
                        className="rop-login__explorar"
                        to="/inicio"
                    >
                        <Icone tipo="voltar" />
                        Voltar para o projeto
                    </Link>
                </div>

                <footer className="rop-login__rodape">
                    <Icone tipo="folha" />
                    Sua jornada com a natureza continua.
                </footer>
            </section>
        </main>
    )
}