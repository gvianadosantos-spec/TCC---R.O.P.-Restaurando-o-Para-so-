import './cabecalho.scss'
import { HashLink as Link } from 'react-router-hash-link';

function Cabecalho() {
    return (
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
    )
}

export default Cabecalho;