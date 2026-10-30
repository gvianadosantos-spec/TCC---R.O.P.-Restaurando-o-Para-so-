import './inicio.scss'

import { useEffect, useState, useCallback } from "react";

import Cabecalho from '../../componentes/cabecalho/cabecalho.jsx'
import Rodape from '../../componentes/rodape/rodape.jsx'

const slides = [
  {
    image: "/images/slide-1.jpg",
    eyebrow: "Fauna brasileira",
    title: "Proteger a fauna começa por conhecer quem vive ao nosso lado.",
    button: "Ver espécies",
    href: "#especies",
  },
  {
    image: "/images/slide-2.jpg",
    eyebrow: "Projetos em campo",
    title: "Pesquisa, monitoramento e cuidado com os animais na natureza.",
    button: "Ver projetos",
    href: "#projetos",
  },
  {
    image: "/images/slide-3.jpg",
    eyebrow: "Em busca da conexão com a biodiversidade ao nosso redor",
    title: "Vamos juntos construir uma relação harmônica e valorizar a fauna livre?",
    button: "Visitar",
    href: "#visitar",
  },
  {
    image: "/images/slide-4.jpg",
    eyebrow: "Conhece a Ampara Store?",
    title:
      "Produtos com propósito! Toda a renda é revertida para os nossos projetos. Compre e ajude a fauna brasileira.",
    button: "Conhecer a loja",
    href: "#loja",
  },
];
 
const INTERVAL = 6000;

function Inicio (){
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
 
  const next = useCallback(
    () => setCurrent((i) => (i + 1) % slides.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((i) => (i - 1 + slides.length) % slides.length),
    []
  );
 
  // Troca automática. Reinicia o tempo sempre que `current` muda
  // (inclusive quando a pessoa clica numa seta ou bolinha).
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(next, INTERVAL);
    return () => clearTimeout(id);
  }, [current, paused, next]);
 
  return (
    <div className='corpo-inicio'>
        <Cabecalho/>
        <div className='topo'>
    <section
      className="inicio"
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
 
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          className={`inicio__slide ${i === current ? "is-active" : ""}`}
          aria-hidden={i !== current}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} de ${slides.length}`}
        >
          <img className="inicio__image" src={slide.image} alt="" />
          <div className="inicio__shade" />
 
          <div className="inicio__content">
            <p className="inicio__eyebrow">{slide.eyebrow}</p>
            <h1 className="inicio__title">{slide.title}</h1>
            <a
              className="inicio__button"
              href={slide.href}
              tabIndex={i === current ? 0 : -1}
            >
              {slide.button} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      ))}
 
      <div className="inicio__controls">
        <div className="inicio__dots">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              className={`inicio__dot ${i === current ? "is-active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Ir para o slide ${i + 1}`}
              aria-current={i === current}
            >
              {/* a barra enche durante o tempo do slide */}
              {i === current && (
                <span
                  key={current}
                  className="inicio__progress"
                  style={{
                    animationDuration: `${INTERVAL}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </button>
          ))}
        </div>
 
        <div className="inicio__arrows">
          <button onClick={prev} aria-label="Slide anterior">‹</button>
          <button onClick={next} aria-label="Próximo slide">›</button>
        </div>
      </div>
    </section>
        </div>
    </div>
  );
}

export default Inicio;