import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./carrossel.scss";

const DURACAO = 6500;

export default function Carrossel({ slides }) {
  const [atual, setAtual] = useState(0);
  const [rodada, setRodada] = useState(0);

  const [pausaManual, setPausaManual] = useState(false);
  const [mouseDentro, setMouseDentro] = useState(false);
  const [focoDentro, setFocoDentro] = useState(false);
  const [foraDaTela, setForaDaTela] = useState(false);

  const [abaOculta, setAbaOculta] = useState(
    document.hidden
  );

  const [reduzir, setReduzir] = useState(() => {
    return window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  });

  const carrosselRef = useRef(null);
  const toqueRef = useRef(null);
  const restanteRef = useRef(DURACAO);
  const rodadaRef = useRef(0);

  const pausado =
    pausaManual ||
    mouseDentro ||
    focoDentro ||
    foraDaTela ||
    abaOculta ||
    reduzir;

  function irPara(indice) {
    setAtual(
      (indice + slides.length) % slides.length
    );

    setRodada((valor) => valor + 1);
  }

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    function atualizarMovimento() {
      setReduzir(media.matches);
    }

    function atualizarAba() {
      setAbaOculta(document.hidden);
    }

    media.addEventListener(
      "change",
      atualizarMovimento
    );

    document.addEventListener(
      "visibilitychange",
      atualizarAba
    );

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entrada]) => {
              setForaDaTela(!entrada.isIntersecting);
            },
            { threshold: 0 }
          )
        : null;

    if (observer && carrosselRef.current) {
      observer.observe(carrosselRef.current);
    }

    return () => {
      media.removeEventListener(
        "change",
        atualizarMovimento
      );

      document.removeEventListener(
        "visibilitychange",
        atualizarAba
      );

      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (rodadaRef.current !== rodada) {
      restanteRef.current = DURACAO;
      rodadaRef.current = rodada;
    }

    if (pausado || slides.length < 2) return;

    const inicio = performance.now();

    const timer = window.setTimeout(() => {
      setAtual(
        (valor) => (valor + 1) % slides.length
      );

      setRodada((valor) => valor + 1);
    }, restanteRef.current);

    return () => {
      window.clearTimeout(timer);

      restanteRef.current = Math.max(
        0,
        restanteRef.current -
          (performance.now() - inicio)
      );
    };
  }, [pausado, rodada, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      ref={carrosselRef}
      className="rop-carrossel"
      aria-label="Destaques do R.O.P."
      aria-roledescription="carrossel"
      style={{ "--duracao": `${DURACAO}ms` }}
      onMouseEnter={() => setMouseDentro(true)}
      onMouseLeave={() => setMouseDentro(false)}
      onFocusCapture={() => setFocoDentro(true)}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget
          )
        ) {
          setFocoDentro(false);
        }
      }}
      onKeyDown={(event) => {
        if (
          event.altKey ||
          event.ctrlKey ||
          event.metaKey
        ) {
          return;
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          irPara(atual + 1);
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          irPara(atual - 1);
        }
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") {
          toqueRef.current = {
            x: event.clientX,
            y: event.clientY,
          };
        }
      }}
      onPointerCancel={() => {
        toqueRef.current = null;
      }}
      onPointerUp={(event) => {
        const inicio = toqueRef.current;

        toqueRef.current = null;

        if (
          !inicio ||
          event.pointerType !== "touch"
        ) {
          return;
        }

        const dx = event.clientX - inicio.x;
        const dy = event.clientY - inicio.y;

        if (
          Math.abs(dx) > 55 &&
          Math.abs(dx) > Math.abs(dy)
        ) {
          irPara(atual + (dx < 0 ? 1 : -1));
        }
      }}
    >
      {slides.map((slide, indice) => (
        <div
          key={slide.image}
          className={`rop-carrossel__slide ${
            indice === atual ? "is-active" : ""
          }`}
          inert={indice !== atual}
          aria-hidden={indice !== atual}
          role="group"
          aria-roledescription="slide"
          aria-label={`${indice + 1} de ${
            slides.length
          }`}
        >
          <img
            className="rop-carrossel__imagem"
            src={slide.image}
            alt=""
            draggable={false}
            fetchPriority={
              indice === 0 ? "high" : "auto"
            }
          />

          <div className="rop-carrossel__sombra" />

          <div className="rop-carrossel__conteudo">
            <p className="rop-carrossel__subtitulo">
              {slide.eyebrow}
            </p>

            <h1 className="rop-carrossel__titulo">
              {slide.title}
            </h1>

            <Link
              to={slide.href}
              className="rop-carrossel__botao"
            >
              {slide.button}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ))}

      <div className="rop-carrossel__controles">
        <span
          className="rop-carrossel__contador"
          aria-hidden="true"
        >
          0{atual + 1}
          <small> / 0{slides.length}</small>
        </span>

        <div className="rop-carrossel__indicadores">
          {slides.map((slide, indice) => (
            <button
              key={slide.image}
              type="button"
              className={`rop-carrossel__indicador ${
                indice === atual ? "is-active" : ""
              }`}
              aria-label={`Ir para slide ${
                indice + 1
              }`}
              aria-current={
                indice === atual ? "true" : undefined
              }
              onClick={() => irPara(indice)}
            >
              <span className="rop-carrossel__trilho">
                {indice === atual && (
                  <span
                    key={rodada}
                    className="rop-carrossel__progresso"
                    style={{
                      animationPlayState: pausado
                        ? "paused"
                        : "running",
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="rop-carrossel__setas">
          <button
            type="button"
            onClick={() => {
              setPausaManual((valor) => !valor);
            }}
            aria-label={
              pausaManual
                ? "Retomar reprodução automática"
                : "Pausar reprodução automática"
            }
            aria-pressed={pausaManual}
          >
            <span aria-hidden="true">
              {pausaManual ? "▶" : "Ⅱ"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => irPara(atual - 1)}
            aria-label="Slide anterior"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => irPara(atual + 1)}
            aria-label="Próximo slide"
          >
            ›
          </button>
        </div>
      </div>

      <span
        className="rop-carrossel__sr"
        aria-live={pausado ? "polite" : "off"}
      >
        Slide {atual + 1} de {slides.length}
      </span>
    </section>
  );
}