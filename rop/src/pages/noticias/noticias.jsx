import './noticias.scss'
import Cabecalho from '../../componentes/cabecalho/cabecalho.jsx';
import Rodape from '../../componentes/rodape/rodape.jsx';
import { useState } from 'react';

function Noticias (){

    const [slide, setslide] = useState(0);
    const [ordem, setOrdem] = useState("antiga");
    const [ano, setAno] = useState("");
    const [mes, setMes] = useState("");


    const banners = [
        {
            categoria: "noticias",
            titulo: "Fauna em pauta",
            descricao: "Cobertura de resgate, conservação, pesquisa e políticas aambientais focada na fauna brasileira — com a fonte de cada informação.",
            imagem: "../../assets/pages/inicio/image copy 2.png"
        },


        {
            categoria: "Conservação",
            titulo: "Protegenbdo a natureza",
            descricao: "Conheça iniciativas e projetos que trabalham pela preservação da biodiversidade brasileira.",
            imagem: "../../assets/pages/inicio/image copy 3.png"
        },


        {
            categoria: "Resgates",
            titulo: "Cuidar é preservar",
            descricao: "Acompanhe ações de resgate, recuperação e proteção dos animais silvestres.",
            imagem: "../../assets/pages/inicio/image copy.png"
        },


        {
            categoria: "Educação ambiental",
            titulo: "Conhecer para proteger",
            descricao: "Informação e conhecimento são fundamentais para proteger a fauna e o meio ambiente.",
            imagem: "../../assets/pages/inicio/image.png"
        }
    ];






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