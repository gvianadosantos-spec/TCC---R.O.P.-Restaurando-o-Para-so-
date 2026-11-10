import { useState } from 'react'
import { Link } from 'react-router-dom'
import './registro.scss'

const ASSETS = `${process.env.PUBLIC_URL || ''}/assets/img`

function Icone({ tipo }) {
    const caminhos = {
        usuario: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
            </>
        ),
        email: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m3 7 9 6 9-6" />
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
        seta: (
            <path d="M5 12h14M13 6l6 6-6 6" />
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

export default function Registro() {
    const [dados, setDados] = useState({
        email: '',
        usuario: '',
        senha: '',
        confirmar: '',
    })

    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
    const [erro, setErro] = useState(null)
    const [sucesso, setSucesso] = useState(false)

    function atualizar(event) {
        const { name, value } = event.target

        setDados((anterior) => ({
            ...anterior,
            [name]: value,
        }))

        setErro(null)
        setSucesso(false)
    }

    function cadastrar(event) {
        event.preventDefault()

        const formulario = event.currentTarget

        setErro(null)
        setSucesso(false)

        if (!dados.usuario.trim()) {
            setErro({
                campo: 'usuario',
                mensagem: 'Informe seu nome de usuário.',
            })

            formulario.elements.usuario.focus()
            return
        }

        if (dados.senha !== dados.confirmar) {
            setErro({
                campo: 'confirmar',
                mensagem: 'As senhas não são iguais. Confira e tente novamente.',
            })

            formulario.elements.confirmar.focus()
            return
        }

        // Integre a API de cadastro aqui.
        // A demonstração apenas valida os campos e não cria uma conta real.
        // Não salve senhas no localStorage nem no console.
        setSucesso(true)

        setDados((anterior) => ({
            ...anterior,
            senha: '',
            confirmar: '',
        }))

        setMostrarSenha(false)
        setMostrarConfirmacao(false)
    }

    return (
        <main className="rop-login rop-registro">
            <section
                className="rop-login__visual"
                aria-labelledby="registro-proposito"
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
                        JUNTOS PELA VIDA
                    </span>

                    <h1 id="registro-proposito">
                        Toda grande mudança
                        <br />
                        começa com <em>uma atitude.</em>
                    </h1>

                    <p>
                        A sua conexão com a natureza pode ir mais longe.
                        Junte-se à R.O.P. e faça parte dessa jornada
                        pela fauna brasileira.
                    </p>

                    <div className="rop-registro__pilares">
                        <span>Conhecer</span>
                        <span>Cuidar</span>
                        <span>Preservar</span>
                    </div>

                    <div className="rop-login__assinatura">
                        <Icone tipo="folha" />
                        <span>
                            Mais pessoas conectadas. Mais vida protegida.
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
                aria-labelledby="registro-titulo"
            >
                <Link to="/" className="rop-login__voltar">
                    <span aria-hidden="true">←</span>
                    Voltar para o login
                </Link>

                <div className="rop-login__formulario">
                    <div className="rop-login__simbolo">
                        <Icone tipo="folha" />
                    </div>

                    <p className="rop-login__sobretitulo">
                        FAÇA PARTE DA R.O.P.
                    </p>

                    <h2 id="registro-titulo">
                        Um novo começo.
                        <br />
                        Um mesmo propósito.
                    </h2>

                    <p className="rop-login__introducao">
                        Crie sua conta e dê o primeiro passo
                        nessa conexão com a natureza.
                    </p>

                    <form onSubmit={cadastrar}>
                        <div className="rop-registro__grupo">
                            <label htmlFor="registro-email">
                                E-mail
                            </label>

                            <div className="rop-login__campo">
                                <Icone tipo="email" />

                                <input
                                    id="registro-email"
                                    name="email"
                                    type="email"
                                    placeholder="seuemail@exemplo.com"
                                    autoComplete="email"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    value={dados.email}
                                    onChange={atualizar}
                                    required
                                />
                            </div>
                        </div>

                        <div className="rop-registro__grupo">
                            <label htmlFor="registro-usuario">
                                Nome de usuário
                            </label>

                            <div className="rop-login__campo">
                                <Icone tipo="usuario" />

                                <input
                                    id="registro-usuario"
                                    name="usuario"
                                    type="text"
                                    placeholder="Como podemos te chamar?"
                                    autoComplete="username"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    value={dados.usuario}
                                    onChange={atualizar}
                                    aria-invalid={
                                        erro?.campo === 'usuario'
                                    }
                                    aria-describedby={
                                        erro?.campo === 'usuario'
                                            ? 'registro-erro'
                                            : undefined
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="rop-registro__grupo">
                            <label htmlFor="registro-senha">
                                Senha
                            </label>

                            <div className="rop-login__campo">
                                <Icone tipo="cadeado" />

                                <input
                                    id="registro-senha"
                                    name="senha"
                                    type={
                                        mostrarSenha
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Crie sua senha"
                                    autoComplete="new-password"
                                    minLength={6}
                                    value={dados.senha}
                                    onChange={atualizar}
                                    aria-describedby="registro-dica-senha"
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
                                        tipo={
                                            mostrarSenha
                                                ? 'oculto'
                                                : 'olho'
                                        }
                                    />
                                </button>
                            </div>

                            <p
                                id="registro-dica-senha"
                                className="rop-registro__dica"
                            >
                                Use pelo menos 6 caracteres.
                            </p>
                        </div>

                        <div className="rop-registro__grupo">
                            <label htmlFor="registro-confirmar">
                                Confirmar senha
                            </label>

                            <div className="rop-login__campo">
                                <Icone tipo="cadeado" />

                                <input
                                    id="registro-confirmar"
                                    name="confirmar"
                                    type={
                                        mostrarConfirmacao
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Digite a senha novamente"
                                    autoComplete="new-password"
                                    minLength={6}
                                    value={dados.confirmar}
                                    onChange={atualizar}
                                    aria-invalid={
                                        erro?.campo === 'confirmar'
                                    }
                                    aria-describedby={
                                        erro?.campo === 'confirmar'
                                            ? 'registro-erro'
                                            : undefined
                                    }
                                    required
                                />

                                <button
                                    className="rop-login__ver-senha"
                                    type="button"
                                    aria-label={
                                        mostrarConfirmacao
                                            ? 'Ocultar confirmação da senha'
                                            : 'Mostrar confirmação da senha'
                                    }
                                    aria-pressed={mostrarConfirmacao}
                                    onClick={() => {
                                        setMostrarConfirmacao(
                                            !mostrarConfirmacao
                                        )
                                    }}
                                >
                                    <Icone
                                        tipo={
                                            mostrarConfirmacao
                                                ? 'oculto'
                                                : 'olho'
                                        }
                                    />
                                </button>
                            </div>
                        </div>

                        {erro && (
                            <p
                                id="registro-erro"
                                className="rop-login__erro"
                                role="alert"
                            >
                                {erro.mensagem}
                            </p>
                        )}

                        {sucesso && (
                            <div
                                className="rop-registro__sucesso"
                                role="status"
                            >
                                <Icone tipo="check" />

                                <p>
                                    <strong>Dados validados!</strong>
                                    Esta demonstração ainda não cria uma
                                    conta real.
                                </p>
                            </div>
                        )}

                        <button
                            className="rop-login__entrar"
                            type="submit"
                        >
                            Criar minha conta
                            <Icone tipo="seta" />
                        </button>

                        <p className="rop-login__demo">
                            Modo demonstração · cadastro sem integração.
                        </p>
                    </form>

                    <p className="rop-login__cadastro">
                        Já tem uma conta?{' '}
                        <Link to="/">
                            Entre aqui{' '}
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </p>

                    <Link
                        className="rop-login__explorar"
                        to="/inicio"
                    >
                        Conhecer o projeto primeiro
                        <Icone tipo="seta" />
                    </Link>
                </div>

                <footer className="rop-login__rodape">
                    <Icone tipo="folha" />
                    Pequenas atitudes transformam o futuro.
                </footer>
            </section>
        </main>
    )
}