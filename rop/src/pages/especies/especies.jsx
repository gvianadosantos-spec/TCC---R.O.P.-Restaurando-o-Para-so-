import './especies.scss'
import GraficosEspecies from './GraficosEspecies';
import Rodape from "../../componentes/rodape/rodape";
import Cabecalho from '../../componentes/cabecalho/cabecalho.jsx'

function Especies() {
    return (
        <div className='especies-corpo'>

            <Cabecalho />
            <div className='c'>
                <div className='container'>
                    <p className='tt'>Animais em Extinção</p>

                    <h1>
                        Animais do Brasil
                    </h1>

                    <p className='subtitle'>Um panorama dos animais ameaçados e extintos do Brasil. Explore por grupo, pesquise
                        pelo nome comum ou científico e conheça as estatísticas e as causas por trás de cada espécie.</p>


                    <GraficosEspecies />

                    <div className='card-pesquisa'>
                        <div className='opt'>
                        <img src="./assets/pages/especies/filtro.svg" alt="" width={20}/>
                        <p className='flt'>FILTROS</p>
                        </div>

                        <div className='pesq-filt'>
                            <div className='bot'>

                            </div>

                        </div>
        

                    </div>



                </div>
            </div>
            <Rodape />
        </div>
    )
}

export default Especies;