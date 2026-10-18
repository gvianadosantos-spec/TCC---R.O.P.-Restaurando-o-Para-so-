import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './login.scss'

// ====== IMAGENS: troque só aqui (link/URL ou import) ======
const IMG_LOGO = '/assets/cabecalho/logo.png'
const IMG_FUNDO = '/assets/login/image.png'
// ==========================================================

// ====== ROTAS / LINKS: troque só aqui ======
const ROTA_APOS_LOGIN = '/inicio'
const ROTA_ESQUECI_SENHA = '/esqueci-senha'
const ROTA_CRIAR_CONTA = '/registro'
const ROTA_INSTAGRAM = 'https://www.instagram.com/?hl=pt-br'   // pode ser página interna ou URL completa (https://...)
const ROTA_FACEBOOK = 'https://www.facebook.com/'     // idem
// ===========================================

// Usa <Link> para páginas internas e <a> para URLs externas (https://...)
function Atalho({ para, children, ...props }) {
    const externo = /^https?:\/\//.test(para)
    if (externo) {
        return <a href={para} target='_blank' rel='noreferrer' {...props}>{children}</a>
    }
    return <Link to={para} {...props}>{children}</Link>
}

function Login() {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState('')
    const [senha, setSenha] = useState('')

    function entrar(e) {
        e.preventDefault()
        // TODO: chamar sua API de login aqui e só navegar se der certo
        console.log({ usuario, senha })
        navigate(ROTA_APOS_LOGIN)
    }

    return (
        <div className='login-corpo' style={{ backgroundImage: `url(${IMG_FUNDO})` }}>
            <main className='conteudo'>
                <section className='marca'>
                    <img className='logo' src={IMG_LOGO} alt='R.O.P – Restaurando o Paraíso' />
                    <div className='linha' />
                    <p>
                        Realizando ajuda até<br />
                        Onde a vida<br />
                        Pode prosperar.
                    </p>
                </section>

                <section className='cartao'>
                    <h1>LOGIN</h1>

                    <form onSubmit={entrar}>
                        <label htmlFor='usuario'>Nome de usuário</label>
                        <input
                            id='usuario'
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            autoComplete='username'
                            required
                        />

                        <label htmlFor='senha'>Senha</label>
                        <input
                            id='senha'
                            type='password'
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            autoComplete='current-password'
                            required
                        />
                        <Atalho para={ROTA_ESQUECI_SENHA} className='esqueci'>
                            esqueci minha senha
                        </Atalho>

                        <button className='entrar' type='submit'>Entrar</button>
                    </form>

                    <div className='rodape'>
                        <Atalho para={ROTA_CRIAR_CONTA} className='criar'>Criar conta</Atalho>
                        <div className='social'>
                            <Atalho para={ROTA_INSTAGRAM} aria-label='Instagram'>
                                <svg viewBox='0 0 24 24'><path d='M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5ZM17.3 5.8a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z' /></svg>
                            </Atalho>
                            <Atalho para={ROTA_FACEBOOK} aria-label='Facebook'>
                                <svg viewBox='0 0 24 24'><path d='M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-4v-8h2.6l.4-3H15V9.2c0-.9.3-1.5 1.6-1.5H18V5.1A20 20 0 0 0 15.7 5C13.6 5 12 6.3 12 8.7V11H9.5v3H12v8H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Z' /></svg>
                            </Atalho>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Login