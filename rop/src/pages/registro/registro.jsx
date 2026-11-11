import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './registro.scss'

const ASSETS = `${process.env.PUBLIC_URL || ''}/assets/img`
const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5050')
    .replace(/\/+$/, '')

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
        seta: <path d="M5 12h14M13 6l6 6-6 6" />,
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
    const navigate = useNavigate()

    const [dados, setDados] = useState({
        email: '',
        usuario: '',
        senha: '',
        confirmar: '',
    })

    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
    const [erro, setErro] = useState(null)
    const [enviando, setEnviando] = useState(false)

    function atualizar(event) {
        const { name, value } = event.target
        setDados((anterior) => ({ ...anterior, [name]: value }))
        setErro(null)
    }

    async function cadastrar(event) {
        event.preventDefault()
        if (enviando) return

        const formulario = event.currentTarget
        const nomeUsuario = dados.usuario.trim()

        setErro(null)

        if (nomeUsuario.length < 3 || nomeUsuario.length > 100) {
            setErro({
                campo: 'usuario',
                mensagem: 'O nome de usuário deve ter de 3 a 100 caracteres.',
            })
            formulario.elements.usuario.focus()
            return
        }

        if (new TextEncoder().encode(dados.senha).length > 72) {
            setErro({
                campo: 'senha',
                mensagem: 'A senha deve ter até 72 bytes. Use uma senha mais curta.',
            })
            formulario.elements.senha.focus()
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

        setEnviando(true)

        try {
            const resposta = await fetch(`${API_URL}/cadastro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome_usuario: nomeUsuario,
                    email: dados.email.trim(),
                    senha: dados.senha,
                }),
            })

            const resultado = await resposta.json().catch(() => null)

            if (resposta.status !== 201 || !resultado?.id) {
                setErro({
                    mensagem: resultado?.erro || 'Não foi possível criar sua conta. Tente novamente.',
                })
                return
            }

            navigate('/', { replace: true })
        } catch {
            setErro({
                mensagem: 'Não foi possível conectar à API. Confira se ela está rodando.',
            })
        } finally {
            setEnviando(false)
        }
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
                        <span>Mais pessoas conectadas. Mais vida protegida.</span>
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
                    <p className="rop-login__sobretitulo">FAÇA PARTE DA R.O.P.</p>

                    <h2 id="registro-titulo">
                        Um novo começo.
                        <br />
                        Um mesmo propósito.
                    </h2>

                    <p className="rop-login__introducao">
                        Crie sua conta e dê o primeiro passo
                        nessa conexão com a natureza.
                    </p>

                    <form onSubmit={cadastrar} aria-busy={enviando}>
                        <div className="rop-registro__grupo">
                            <label htmlFor="registro-email">E-mail</label>

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
                                    maxLength={255}
                                    value={dados.email}
                                    onChange={atualizar}
                                    readOnly={enviando}
                                    required
                                />
                            </div>
                        </div>

                        <div className="rop-registro__grupo">
                            <label htmlFor="registro-usuario">Nome de usuário</label>

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
                                    maxLength={100}
                                    value={dados.usuario}
                                    onChange={atualizar}
                                    aria-invalid={erro?.campo === 'usuario'}
                                    aria-describedby={
                                        erro?.campo === 'usuario' ? 'registro-erro' : undefined
                                    }
                                    readOnly={enviando}
                                    required
                                />
                            </div>
                        </div>

                        <div className="rop-registro__grupo">
                            <label htmlFor="registro-senha">Senha</label>

                            <div className="rop-login__campo">
                                <Icone tipo="cadeado" />
                                <input
                                    id="registro-senha"
                                    name="senha"
                                    type={mostrarSenha ? 'text' : 'password'}
                                    placeholder="Crie sua senha"
                                    autoComplete="new-password"
                                    minLength={8}
                                    value={dados.senha}
                                    onChange={atualizar}
                                    aria-invalid={erro?.campo === 'senha'}
                                    aria-describedby={
                                        erro?.campo === 'senha'
                                            ? 'registro-dica-senha registro-erro'
                                            : 'registro-dica-senha'
                                    }
                                    readOnly={enviando}
                                    required
                                />

                                <button
                                    className="rop-login__ver-senha"
                                    type="button"
                                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                                    aria-pressed={mostrarSenha}
                                    onClick={() => setMostrarSenha((visivel) => !visivel)}
                                >
                                    <Icone tipo={mostrarSenha ? 'oculto' : 'olho'} />
                                </button>
                            </div>

                            <p id="registro-dica-senha" className="rop-registro__dica">
                                Use pelo menos 8 caracteres.
                            </p>
                        </div>

                        <div className="rop-registro__grupo">
                            <label htmlFor="registro-confirmar">Confirmar senha</label>

                            <div className="rop-login__campo">
                                <Icone tipo="cadeado" />
                                <input
                                    id="registro-confirmar"
                                    name="confirmar"
                                    type={mostrarConfirmacao ? 'text' : 'password'}
                                    placeholder="Digite a senha novamente"
                                    autoComplete="new-password"
                                    minLength={8}
                                    value={dados.confirmar}
                                    onChange={atualizar}
                                    aria-invalid={erro?.campo === 'confirmar'}
                                    aria-describedby={
                                        erro?.campo === 'confirmar' ? 'registro-erro' : undefined
                                    }
                                    readOnly={enviando}
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
                                    onClick={() => setMostrarConfirmacao((visivel) => !visivel)}
                                >
                                    <Icone tipo={mostrarConfirmacao ? 'oculto' : 'olho'} />
                                </button>
                            </div>
                        </div>

                        {erro && (
                            <p id="registro-erro" className="rop-login__erro" role="alert">
                                {erro.mensagem}
                            </p>
                        )}

                        <button
                            className="rop-login__entrar"
                            type="submit"
                            disabled={enviando}
                        >
                            {enviando ? 'Criando conta…' : 'Criar minha conta'}
                            <Icone tipo="seta" />
                        </button>
                    </form>

                    <p className="rop-login__cadastro">
                        Já tem uma conta?{' '}
                        <Link to="/">
                            Entre aqui{' '}
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </p>

                    <Link className="rop-login__explorar" to="/inicio">
                        Conhecer o projeto primeiro
                        <Icone tipo="seta" />
                    </Link>
                </div>

                <footer className="rop-login__rodape">
                    Pequenas atitudes transformam o futuro.
                </footer>
            </section>
        </main>
    )
}