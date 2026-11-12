import { Link } from "react-router-dom";
import Cabecalho from "../../componentes/cabecalho/cabecalho.jsx";
import Rodape from "../../componentes/rodape/rodape.jsx";
import "./orientacoes.scss";

export default function Orientacoes() {
  return (
    <div className="orientacoes-pagina">
      <Cabecalho />

      <main className="orientacoes-main">
        <div className="orientacoes-container">
          <p className="orientacoes-etiqueta">EDUCAÇÃO AMBIENTAL</p>
          <h1>Orientações para proteger a fauna.</h1>
          <p className="orientacoes-introducao">
            Conhecer os animais é o primeiro passo para respeitar o espaço
            deles e entender quando procurar ajuda especializada.
          </p>

          <section className="orientacoes-painel" aria-labelledby="orientacoes-painel-titulo">
            <span className="orientacoes-selo">EM PREPARAÇÃO</span>
            <h2 id="orientacoes-painel-titulo">Conhecer também é proteger.</h2>
            <p>
              Estamos preparando guias educativos sobre convivência responsável
              com a fauna silvestre e como buscar orientação de profissionais
              e órgãos competentes.
            </p>

            <div className="orientacoes-aviso">
              <strong>Encontrou um animal silvestre em situação de risco?</strong>
              <p>
                Mantenha distância, não tente capturar, alimentar ou transportar
                o animal. Procure um órgão ambiental ou serviço de resgate de
                fauna autorizado na sua região.
              </p>
            </div>

            <Link to="/especies" className="orientacoes-voltar">
              Voltar para Espécies <span aria-hidden="true">↗</span>
            </Link>
          </section>

          <p className="orientacoes-nota">
            A R.O.P. é um projeto acadêmico fictício e não realiza resgates.
            Novos conteúdos educativos serão adicionados aqui.
          </p>
        </div>
      </main>

      <Rodape />
    </div>
  );
}
