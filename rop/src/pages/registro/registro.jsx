import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './registro.scss'

function Resgistro() {
    const navigate = useNavigate()

    const [dados, setDados] = useState({
        email: '',
        usuario: '',
        senha: '',
        confirmar: ''
    })
    const [erro, setErro] = useState('')
    const [sucesso, setSucesso] = useState('') // Novo estado para a mensagem de sucesso no site

    function handleChange(e) {
        const { name, value } = e.target
        setDados((anterior) => ({ ...anterior, [name]: value }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        setErro('')
        setSucesso('')

        if (!e.currentTarget.checkValidity()) {
            setErro('Preencha todos os campos corretamente. A senha precisa ter pelo menos 6 caracteres.')
            return
        }

        if (dados.senha !== dados.confirmar) {
            setErro('As senhas não são iguais.')
            return
        }

        // Aqui você envia os dados para o seu back-end
        console.log('Cadastro válido:', {
            email: dados.email,
            usuario: dados.usuario
        })

        // Define a mensagem de sucesso no site em vez de usar alert()
        setSucesso('Conta criada com sucesso! A redirecionar para o login...')

        // Redireciona após 2 segundos (2000 milissegundos) para o utilizador conseguir ler a mensagem
        setTimeout(() => {
            navigate('/') // Altera para o caminho exato da tua rota de login
        }, 2000)
    }

    return (
        <div
            className='registro-corpo'
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/assets/login/image.png)` }}
        >
            <main className='card'>
                <h1>Criar Conta</h1>

                <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor='email'>Gmail</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        autoComplete='email'
                        value={dados.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor='usuario'>Nome de Usuário</label>
                    <input
                        type='text'
                        id='usuario'
                        name='usuario'
                        autoComplete='username'
                        value={dados.usuario}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor='senha'>Senha</label>
                    <input
                        type='password'
                        id='senha'
                        name='senha'
                        autoComplete='new-password'
                        minLength={6}
                        value={dados.senha}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor='confirmar'>Confirmar Senha</label>
                    <input
                        type='password'
                        id='confirmar'
                        name='confirmar'
                        autoComplete='new-password'
                        value={dados.confirmar}
                        onChange={handleChange}
                        required
                    />

                    {/* Exibe a mensagem de erro (se houver) */}
                    <p className='erro' role='alert' aria-live='polite'>{erro}</p>

                    {/* Exibe a mensagem de sucesso dentro do site (podes criar uma classe .sucesso no SCSS se quiseres estilizar com cor verde) */}
                    <p className='sucesso' role='status' aria-live='polite' style={{ color: '#4BB543', marginTop: '10px' }}>
                        {sucesso}
                    </p>

                    <button type='submit'>Criar Conta</button>
                </form>
            </main>
        </div>
    )
}

export default Resgistro