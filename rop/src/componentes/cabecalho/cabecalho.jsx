import { useEffect, useState } from 'react'
import './cabecalho.scss'
import { HashLink as Link } from 'react-router-hash-link';

function Cabecalho() {
    const [rolou, setRolou] = useState(false)

    useEffect(() => {
        function aoRolar() {
            setRolou(window.scrollY > 10)
        }

        aoRolar()
        window.addEventListener('scroll', aoRolar, { passive: true })
        return () => window.removeEventListener('scroll', aoRolar)
    }, [])

    return (
        <>
            <header className={`comp-cabecalho ${rolou ? 'rolou' : ''}`}>

                <div className='comp-corpo'>

                    <div className='comp-logo'>
                        <img src="/assets/cabecalho/logo.png" alt="R.O.P - Restaurando o Paraíso" />
                    </div>

                    <div className='comp-botoes'>
                        <Link to={'../inicio'} className='comp-link'>Início</Link>
                        <Link to={'../especies'} className='comp-link'>Espécies</Link>
                        <Link to={'../noticias'} className='comp-link'>Notícias</Link>
                        <Link to={'../inicio'} className='comp-link'>Impactos</Link>
                        <Link to={'../inicio'} className='comp-link'>Projetos</Link>
                        <Link to={'../inicio'} className='comp-link'>Publicações</Link>
                        <Link to={'../inicio'} className='comp-link'>Apadrinhe</Link>
                        <Link to={'../loja'} className='comp-link'>Loja</Link>
                    </div>

                    <div className='comp-doe-div'>
                        <Link to={'../doe'} className='comp-doe'>
                            <img src="/assets/componentes/cabecalho/coracao.png" alt="" className="icone-coracao" />
                            <span>Doe agora</span>
                        </Link>
                    </div>

                </div>

                <div className='comp-aviso' role='note' aria-hidden={rolou}>
                    <b>Projeto fictício.</b>
                    <span className='comp-aviso-longo'>
                        A R.O.P. não existe de verdade. Este site foi criado para um TCC.
                    </span>
                    <span className='comp-aviso-curto'>
                        Site criado para um TCC.
                    </span>
                </div>

            </header>

            <div className='comp-espaco' aria-hidden='true' />
        </>
    )
}

export default Cabecalho;