import { Link } from "react-router-dom";
import Cabecalho from "../../componentes/cabecalho/cabecalho.jsx";
import Rodape from "../../componentes/rodape/rodape.jsx";
import "./orientacoes.scss";

// EDITE AQUI AS CAPAS DAS REVISTAS.
// 1. Coloque a imagem em: rop/public/assets/img/pages/orientacoes/
// 2. Substitua capa: "" pelo caminho, por exemplo:
//    capa: "/assets/img/pages/orientacoes/capa-01.webp"
// 3. Os PDFs ficam em: rop/public/assets/pdfs/orientacoes/
//    Os nomes do campo arquivo devem ser iguais aos arquivos PDF.
const revistas = [
  {
    numero: "01",
    titulo: "Animal ferido",
    descricao: "Saiba como agir com segurança e onde procurar ajuda quando encontrar um animal silvestre ferido.",
    capa: "/assets/img/pages/orientacoes/capa1.png",
    arquivo: "ROP_Revista_01_Animal_ferido.pdf",
  },
  {
    numero: "02",
    titulo: "Filhote sozinho",
    descricao: "Entenda quando observar, quando esperar e quando é necessário pedir ajuda especializada.",
    capa: "/assets/img/pages/orientacoes/capa2.png",
    arquivo: "ROP_Revista_02_Filhote_sozinho.pdf",
  },
  {
    numero: "03",
    titulo: "Serpentes e peçonhentos",
    descricao: "Aprenda atitudes seguras para encontros com serpentes e outros animais peçonhentos.",
    capa: "/assets/img/pages/orientacoes/capa3.png",
    arquivo: "ROP_Revista_03_Serpentes_e_peconhentos.pdf",
  },
  {
    numero: "04",
    titulo: "Fauna nas cidades",
    descricao: "Conheça boas práticas para conviver com animais silvestres em espaços urbanos.",
    capa: "/assets/img/pages/orientacoes/capa4.png",
    arquivo: "ROP_Revista_04_Fauna_nas_cidades.pdf",
  },
  {
    numero: "05",
    titulo: "Quem contatar?",
    descricao: "Saiba quais órgãos e serviços procurar e que informações passar ao pedir orientação.",
    capa: "/assets/img/pages/orientacoes/capa5.png",
    arquivo: "ROP_Revista_05_Quem_contatar.pdf",
  },
  {
    numero: "06",
    titulo: "Proteja a fauna",
    descricao: "Descubra atitudes simples que ajudam a conservar a biodiversidade brasileira.",
    capa: "/assets/img/pages/orientacoes/capa6.png",
    arquivo: "ROP_Revista_06_Proteja_a_fauna.pdf",
  },
];

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

          <section
            className="orientacoes-painel"
            aria-labelledby="orientacoes-painel-titulo"
          >
            <span className="orientacoes-selo">REVISTAS EDUCATIVAS</span>
            <h2 id="orientacoes-painel-titulo">Conhecer também é proteger.</h2>
            <p>
              Explore os seis guias da coleção Conviver e Proteger. Cada revista
              traz orientações educativas e pode ser baixada gratuitamente em PDF.
            </p>

            <div className="orientacoes-revistas">
              {revistas.map((revista) => (
                <article className="orientacoes-revista" key={revista.numero}>
                  <a
                    className="orientacoes-revista-capa"
                    href={`/assets/pdfs/orientacoes/${revista.arquivo}`}
                    download={revista.arquivo}
                    aria-label={`Baixar PDF pela capa: ${revista.titulo}`}
                  >
                    {revista.capa ? (
                      <img
                        src={revista.capa}
                        alt={`Capa da revista ${revista.titulo}`}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      // Este espaço aparece até você adicionar o caminho da capa.
                      <div className="orientacoes-revista-sem-capa">
                        <span>R.O.P. | CONVIVER E PROTEGER</span>
                        <strong>EDIÇÃO {revista.numero}</strong>
                        <small>ESPAÇO PARA A CAPA</small>
                      </div>
                    )}
                  </a>

                  <div className="orientacoes-revista-conteudo">
                    <span className="orientacoes-revista-numero">
                      EDIÇÃO Nº {revista.numero}
                    </span>
                    <h3>{revista.titulo}</h3>
                    <p>{revista.descricao}</p>

                    <a
                      className="orientacoes-revista-download"
                      href={`/assets/pdfs/orientacoes/${revista.arquivo}`}
                      download={revista.arquivo}
                      type="application/pdf"
                      aria-label={`Baixar PDF: ${revista.titulo}`}
                    >
                      Baixar PDF <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>

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
            As revistas são educativas e não substituem orientações de profissionais
            ou órgãos competentes.
          </p>
        </div>
      </main>

      <Rodape />
    </div>
  );
}
