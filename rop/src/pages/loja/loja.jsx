import { useEffect } from "react";
import { HashLink as Link } from "react-router-hash-link";
import Cabecalho from "../../componentes/cabecalho/cabecalho";
import Rodape from "../../componentes/rodape/rodape";
import "./loja.scss";

const irParaTopo = () => window.scrollTo(0, 0);

const PASTA_IMAGENS = `${process.env.PUBLIC_URL}/assets/img/pages/loja`;

const PRODUTOS = [
  {
    titulo: "Camiseta Fauna Brasileira",
    descricao: "Algodão orgânico com estampa de espécies em extinção.",
    preco: "R$ 89,90",
    imagem: "CAMISA.webp",
  },
  {
    titulo: "EcoBag Restaure o Paraíso",
    descricao: "Bolsa reutilizável de fibra natural, impressão à base d'água.",
    preco: "R$ 49,90",
    imagem: "ECOBAG.webp",
  },
  {
    titulo: "Caneca Éden das Asas",
    descricao: "Cerâmica em edição limitada com a arte do nosso mantenedor.",
    preco: "R$ 39,90",
    imagem: "CANECA.webp",
  },
  {
    titulo: "Kit Adesivos Biodiversidade",
    descricao: "Conjunto de adesivos com a fauna silvestre brasileira.",
    preco: "R$ 24,90",
    imagem: "ADESIVOS.webp",
  },
  {
    titulo: "Agenda Santuário Éden das Asas",
    descricao:
      "Caderno A5 com a arte do nosso santuário de aves, para organizar seus dias pela fauna.",
    preco: "R$ 59,90",
    imagem: "AGENDA.webp",
  },
  {
    titulo: "Broche Éden das Asas",
    descricao:
      "Broche metálico esmaltado com a arte da ave em voo da R.O.P. Um acessório de impacto para apoiar a fauna.",
    preco: "R$ 19,90",
    imagem: "BROCHE.webp",
  },
];

/* Se a foto não existir, esconde a imagem quebrada e mostra o fundo azul do card. */
const esconderImagem = (e) => {
  e.currentTarget.style.display = "none";
};

export default function Loja() {
  useEffect(() => {
    document.title = "Loja R.O.P. - Produtos com propósito";
  }, []);

  return (
    <div className="loja-corpo">
      <Cabecalho />

      <div className="loja">
        <header className="loja-topo">
          <div className="pre-titulo">Loja R.O.P.</div>
          <h1>Produtos com propósito</h1>
          <p className="descricao">
            Uma vitrine de produtos pensados para a R.O.P. Eles ainda não estão à venda, mas ilustram como o projeto poderia ganhar vida.
          </p>
          <div className="etiqueta-status">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
              <path d="M4 17v2" />
              <path d="M5 18H3" />
            </svg>
            Conceito de loja
          </div>
        </header>

        <section className="faixa-impacto">
          <svg
            className="icone-impacto"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <h2>Gostou do nosso trabalho?</h2>
          <p>
            Os produtos são ilustrativos, mas você pode apoiar voluntariamente os estudantes que criaram a R.O.P.
          </p>
        </section>

        <main className="grade-produtos">
          {PRODUTOS.map((produto) => (
            <article className="cartao-produto" key={produto.titulo}>
              <div className="produto-imagem">
                <img
                  src={`${PASTA_IMAGENS}/${produto.imagem}`}
                  alt={produto.titulo}
                  onError={esconderImagem}
                />
                <span className="selo">Conceito</span>
              </div>
              <div className="produto-info">
                <h3>{produto.titulo}</h3>
                <p>{produto.descricao}</p>
              </div>
              <div className="produto-rodape">
                <span className="preco">{produto.preco}</span>
                <Link to="/doe" className="botao-pequeno" onClick={irParaTopo}>
                  Quero apoiar
                </Link>
              </div>
            </article>
          ))}
        </main>
      </div>

      <Rodape />
    </div>
  );
}