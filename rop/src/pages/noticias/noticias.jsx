import './noticias.scss'
import Cabecalho from '../../componentes/cabecalho/cabecalho.jsx';
import Rodape from '../../componentes/rodape/rodape.jsx';

function Noticias (){

    return(
        <div className='noticias-corpo'>

        <Cabecalho/>

        
            <div className='bf'>

            <h1>
                westá em desenvolvimento, mas em breve você poderá acompanhar notícias sobre a fauna brasileira, resgates, conservação e educação ambiental.
            </h1>
                 

            </div>


        <Rodape/>
        </div>
    )
}

export default Noticias;