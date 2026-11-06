import "./inicio.scss";
import { useEffect, useRef, useState } from "react";
import Cabecalho from "../../componentes/cabecalho/cabecalho.jsx";
import { HashLink } from "react-router-hash-link";

// Os arquivos estão dentro de public/assets/img/pages/inicio.
const slides = [
  {
    image: "/assets/img/pages/inicio/image.png",
    eyebrow: "FAUNA BRASILEIRA",
    title: "Proteger a fauna começa por conhecer quem vive ao nosso lado.",
    button: "Ver espécies",
    href: "/especies",
  },
  {
    image: "/assets/img/pages/inicio/image copy.png",
    eyebrow: "PROJETOS EM CAMPO",
    title: "Pesquisa, monitoramento e cuidado com os animais na natureza.",
    button: "Ver projetos",
    href: "/projetos",
  },
  {
    image: "/assets/img/pages/inicio/image copy 2.png",
    eyebrow: "EM BUSCA DA CONEXÃO COM A BIODIVERSIDADE AO NOSSO REDOR",
    title: "Vamos juntos construir uma relação harmônica e valorizar a fauna livre?",
    button: "Visitar",
    href: "/projetos",
  },
  {
    image: "/assets/img/pages/inicio/image copy 3.png",
    eyebrow: "CONHECE A AMPARA STORE?",
    title: "Produtos com propósito! Toda a renda é revertida para os nossos projetos. Compre e ajude a fauna brasileira.",
    button: "Conhecer a loja",
    href: "/loja",
  },
];

const impactos = [
  { numero: "+1.400", descricao: "animais silvestres diretamente impactados" },
  { numero: "4M", descricao: "de pessoas tocadas por campanhas de conscientização em 2023" },
  { numero: "+50 mil", descricao: "pessoas diretamente impactadas com ações de educação" },
  { numero: "8", descricao: "ODS da ONU contempladas em nossas ações" },
];

const TEMPO_SLIDE = 6000;

function Inicio() {
  // Carrossel existente
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const tempoDecorrido = useRef(0);

  // Animação existente: Impactos
  const impactosRef = useRef(null);
  const [impactosVisiveis, setImpactosVisiveis] = useState(false);

  // Nova animação: Apresentação
  const apresentacaoRef = useRef(null);
  const [apresentacaoVisivel, setApresentacaoVisivel] = useState(false);

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

  // Troca automática dos slides, respeitando a pausa.
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
      setProgresso((tempoDecorrido.current / TEMPO_SLIDE) * 100);
    }, 50);

    return () => clearInterval(intervalo);
  }, [pausado]);

  // Animação de entrada dos Impactos
  useEffect(() => {
    const elemento = impactosRef.current;
    if (!elemento) return;
    if (!("IntersectionObserver" in window)) {
      setImpactosVisiveis(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImpactosVisiveis(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  // Animação de entrada da Apresentação
  useEffect(() => {
    const elemento = apresentacaoRef.current;
    if (!elemento) return;
    if (!("IntersectionObserver" in window)) {
      setApresentacaoVisivel(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setApresentacaoVisivel(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -45px 0px" }
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
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setPausado(false);
            }
          }}
        >
          {slides.map((slide, indice) => (
            <div
              key={indice}
              className={`inicio__slide ${indice === atual ? "is-active" : ""}`}
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
                <p className="inicio__eyebrow">{slide.eyebrow}</p>
                <h1 className="inicio__title">{slide.title}</h1>
                <a
                  href={slide.href}
                  className="inicio__button"
                  tabIndex={indice === atual ? 0 : -1}
                >
                  {slide.button} <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ))}

          <div className="inicio__controls">
            <div className="inicio__dots">
              {slides.map((slide, indice) => (
                <button
                  key={indice}
                  type="button"
                  className={`inicio__dot ${indice === atual ? "is-active" : ""}`}
                  aria-label={`Ir para slide ${indice + 1}`}
                  aria-current={indice === atual ? "true" : undefined}
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
              <button type="button" onClick={anterior} aria-label="Slide anterior">‹</button>
              <button type="button" onClick={proximo} aria-label="Próximo slide">›</button>
            </div>
          </div>
        </section>

        {/* NOSSOS IMPACTOS */}
        <div
          id="impactos"
          ref={impactosRef}
          className={`impactos ${impactosVisiveis ? "visivel" : ""}`}
        >
          <div className="impactos__container">
            <div className="impactos__cabecalho">
              <p className="impactos__subtitulo">NOSSOS IMPACTOS</p>
              <h2 className="impactos__titulo">
                Cada número é uma vida, uma consciência desperta.
              </h2>
            </div>
            <div className="impactos__painel">
              {impactos.map((item, index) => (
                <div
                  className="impactos__item"
                  key={index}
                  style={{ "--delay": `${index * 0.15}s` }}
                >
                  <strong className="impactos__numero">{item.numero}</strong>
                  <p className="impactos__descricao">{item.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* APRESENTAÇÃO — dentro da página Início */}
        <div
          id="apresentacao"
          ref={apresentacaoRef}
          className={`apresentacao ${apresentacaoVisivel ? "visivel" : ""}`}
        >
          <div className="apresentacao__container">
            <div className="apresentacao__visual">
              <div className="apresentacao__imagem">
                <img
                  src="/assets/img/pages/inicio/mato.png"
                  alt="Mata brasileira com árvores e vegetação verde"
                  loading="lazy"
                />
              </div>
              <div className="apresentacao__selo">
                <strong>R.O.P.</strong>
                <span>RESTAURANDO O PARAÍSO</span>
              </div>
            </div>

            <div className="apresentacao__conteudo">
              <div className="apresentacao__cabecalho">
                <p className="apresentacao__subtitulo">APRESENTAÇÃO</p>
                <h2 className="apresentacao__titulo">
                  Cuidamos da fauna que perdeu seu lar — e devolvemos o paraíso.
                </h2>
              </div>

              <div className="apresentacao__textos">
                <p>
                  Nossa proposta é cuidar de animais silvestres necessitados que
                  perderam seus habitats por causas naturais ou humanas. Juntamente
                  com órgãos parceiros — como <strong>CETAS</strong> e{" "}
                  <strong>Instituto Gremar</strong> — ajudamos a recuperar esses
                  animais e, quando estão prontos, os devolvemos à natureza.
                </p>
                <p>
                  Quando o habitat não é adequado, eles seguem para santuários,
                  onde vivem tranquilamente; e, quando necessário, mantemos o animal
                  em cuidado prolongado. Com animais tratados e em parceria com
                  órgãos de cuidado a pessoas com deficiência, participamos do
                  atendimento aos pacientes, com o auxílio de animais e profissionais
                  aptos ao trabalho conjunto.
                </p>
                <p>
                  Oferecemos também aulas voltadas ao cuidado com a vida e a natureza,
                  com nossos parceiros <strong>Projeto Escola Verde</strong>,{" "}
                  <strong>Projeto Cidadão Legal</strong> e <strong>Com-Vida</strong>,
                  para ensinar aos alunos a cuidar da fauna brasileira que tanto amamos.
                </p>
              </div>

              <div className="apresentacao__cards">
                <div className="apresentacao__card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="9" cy="7" r="3" />
                    <path d="M3 20v-2a6 6 0 0 1 12 0v2" />
                    <path d="M17 5a3 3 0 0 1 0 6" />
                    <path d="M19 20v-2a6 6 0 0 0-2-4.5" />
                  </svg>
                  <span>IDADE</span>
                  <strong>14+ anos</strong>
                </div>
                <div className="apresentacao__card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
                  </svg>
                  <span>GÊNERO</span>
                  <strong>Todos</strong>
                </div>
                <div className="apresentacao__card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m12 2 2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2Z" />
                    <path d="m19 17 .8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z" />
                  </svg>
                  <span>CLASSE SOCIAL</span>
                  <strong>Todas as classes</strong>
                </div>
                <div className="apresentacao__card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18" />
                    <path d="M12 3a15 15 0 0 1 0 18" />
                    <path d="M12 3a15 15 0 0 0 0 18" />
                  </svg>
                  <span>REGIÃO</span>
                  <strong>Brasil / Sul-Americana</strong>
                </div>
              </div>

              {/* A última seção ainda será criada: adicionar id="ultima-area" nela. */}
              <HashLink smooth to="/inicio#ultima-area" className="apresentacao__botao">
                Conheça mais
                <span aria-hidden="true">→</span>
              </HashLink>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Inicio;
