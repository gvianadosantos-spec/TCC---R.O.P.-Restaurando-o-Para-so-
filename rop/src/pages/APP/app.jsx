import './app.scss'
import { Link } from 'react-router-dom';
import Rodape from '../../componentes/rodape/rodape.jsx';
function App (){
    return(
        <>
        <div className='corpo'>

        <Link to={'/'} className='btn-link'>ir para login</Link>
        <Link to={'/registro'} className='btn-link'>ir para registro</Link>
        <Link to={'/inicio'} className='btn-link'>ir para início</Link>
        <Link to={'/especies'} className='btn-link'>ir para espécies</Link>
        <Link to={'/noticias'} className='btn-link'>ir para notícias</Link>
        <Link to={'/loja'} className='btn-link'>ir para loja</Link>
        <Link to={'/doe'} className='btn-link'>ir para doe</Link>
        


        </div>

        <div>
            <Rodape />
        </div>
     </>

    )
}

export default App;