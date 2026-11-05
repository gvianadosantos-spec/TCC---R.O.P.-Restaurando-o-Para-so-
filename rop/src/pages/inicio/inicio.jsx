
import "./inicio.scss";
import { useEffect, useRef, useState } from "react";
import Cabecalho from "../../componentes/cabecalho/cabecalho.jsx";

// SLIDES
const slides = [
  {
    image: "/assets/img/pages/inicio/image.png",
    eyebrow: "FAUNA BRASILEIRA",
    title:
      "Proteger a fauna começa por conhecer quem vive ao nosso lado.",
    button: "Ver espécies",
    href: "/especies",
  },
  {
    image: "/assets/img/pages/inicio/image copy.png",
    eyebrow: "PROJETOS EM CAMPO",
    title:
      "Pesquisa, monitoramento e cuidado com os animais na natureza.",
    button: "Ver projetos",
    href: "/projetos",
  },
  {
    image: "/assets/img/pages/inicio/image copy 2.png",
    eyebrow:
      "EM BUSCA DA CONEXÃO COM A BIODIVERSIDADE AO NOSSO REDOR",
    title:
      "Vamos juntos construir uma relação harmônica e valorizar a fauna livre?",
    button: "Visitar",
    href: "/projetos",
  },
  {
    image: "/assets/img/pages/inicio/image copy 3.png",
    eyebrow: "CONHECE A AMPARA STORE?",
    title:
      "Produtos com propósito! Toda a renda é revertida para os nossos projetos. Compre e ajude a fauna brasileira.",
    button: "Conhecer a loja",
    href: "/loja",
  },
];

// DADOS DOS IMPACTOS
const impactos = [
  {
    numero: "+1.400",
    descricao: "animais silvestres diretamente impactados",
  },
  {
    numero: "4M",
    descricao:
      "de pessoas tocadas por campanhas de conscientização em 2023",
  },
  {
    numero: "+50 mil",
    descricao:
      "pessoas diretamente impactadas com ações de educação",
  },
  {
    numero: "8",
    descricao:
      "ODS da ONU contempladas em nossas ações",
  },
];

const TEMPO_SLIDE = 6000;

function Inicio() {
  // CARROSSEL
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const tempoDecorrido = useRef(0);

  // ANIMAÇÃO DOS IMPACTOS
  const impactosRef = useRef(null);
  const [impactosVisiveis, setImpactosVisiveis] =
    useState(false);

  function irPara(indice) {
    tempoDecorrido.current = 0;
    setProgresso(0);
    setAtual((indice + slides.length) % slides.length);
  }

  function proximo() {
    irPara(atual + 1);
  }

  function anterior() {
    irPara(atual - 1);
  }

  // TROCA AUTOMÁTICA DOS SLIDES
  useEffect(() => {
    if (pausado) return;

    let ultimaAtualizacao = Date.now();

    const intervalo = setInterval(() => {
      const agora = Date.now();

      tempoDecorrido.current += agora - ultimaAtualizacao;
      ultimaAtualizacao = agora;

      if (tempoDecorrido.current >= TEMPO_SLIDE) {
        tempoDecorrido.current = 0;
        setProgresso(0);
        setAtual((i) => (i + 1) % slides.length);
        return;
      }

      setProgresso(
        (tempoDecorrido.current / TEMPO_SLIDE) * 100
      );
    }, 50);

    return () => clearInterval(intervalo);
  }, [pausado]);

  // ANIMAÇÃO AO ROLAR A PÁGINA
  useEffect(() => {
    const elemento = impactosRef.current;
    if (!elemento) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImpactosVisiveis(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(elemento);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="corpo-inicio">
      <Cabecalho />

      <main className="topo">

        {/* CARROSSEL */}
        <section
          className="inicio"
          aria-label="Destaques do R.O.P."
          aria-roledescription="carrossel"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onFocusCapture={() => setPausado(true)}
          onBlurCapture={(event) => {
            if (
              !event.currentTarget.contains(
                event.relatedTarget
              )
            ) {
              setPausado(false);
            }
          }}
        >
          {slides.map((slide, indice) => (
            <div
              key={indice}
              className={`inicio__slide ${
                indice === atual ? "is-active" : ""
              }`}
              aria-hidden={indice !== atual}
              role="group"
              aria-roledescription="slide"
              aria-label={`${indice + 1} de ${slides.length}`}
            >
              <img
                src={slide.image}
                alt=""
                className="inicio__image-bg"
                aria-hidden="true"
              />

              <img
                src={slide.image}
                alt=""
                className="inicio__image"
                draggable="false"
              />

              <div className="inicio__shade" />

              <div className="inicio__content">
                <p className="inicio__eyebrow">
                  {slide.eyebrow}
                </p>

                <h1 className="inicio__title">
                  {slide.title}
                </h1>

                <a
                  href={slide.href}
                  className="inicio__button"
                  tabIndex={indice === atual ? 0 : -1}
                >
                  {slide.button}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ))}

          {/* CONTROLES */}
          <div className="inicio__controls">
            <div className="inicio__dots">
              {slides.map((slide, indice) => (
                <button
                  key={indice}
                  type="button"
                  className={`inicio__dot ${
                    indice === atual ? "is-active" : ""
                  }`}
                  aria-label={`Ir para slide ${indice + 1}`}
                  aria-current={
                    indice === atual ? "true" : undefined
                  }
                  onClick={() => irPara(indice)}
                >
                  {indice === atual && (
                    <span
                      className="inicio__progress"
                      style={{ width: `${progresso}%` }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="inicio__arrows">
              <button
                type="button"
                onClick={anterior}
                aria-label="Slide anterior"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={proximo}
                aria-label="Próximo slide"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* =========================
            NOSSOS IMPACTOS
        ========================= */}

        <div
          className={`impactos ${
            impactosVisiveis ? "visivel" : ""
          }`}
          id="impactos"
          ref={impactosRef}
        >
          <div className="impactos__container">

            <div className="impactos__cabecalho">
              <p className="impactos__subtitulo">
                NOSSOS IMPACTOS
              </p>

              <h2 className="impactos__titulo">
                Cada número é uma vida, uma
                consciência desperta.
              </h2>
            </div>

            <div className="impactos__painel">
              {impactos.map((item, index) => (
                <div
                  className="impactos__item"
                  key={index}
                  style={{
                    "--delay": `${index * 0.15}s`,
                  }}
                >
                  <strong className="impactos__numero">
                    {item.numero}
                  </strong>

                  <p className="impactos__descricao">
                    {item.descricao}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

export default Inicio;
