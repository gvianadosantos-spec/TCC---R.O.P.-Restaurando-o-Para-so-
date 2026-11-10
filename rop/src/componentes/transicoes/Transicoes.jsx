import { useLayoutEffect, useRef, useState } from "react";
import { Routes, useLocation } from "react-router-dom";
import "./transicoes.scss";

export default function Transicoes({ children }) {
  const destino = useLocation();

  const [exibida, setExibida] = useState(destino);
  const [saindo, setSaindo] = useState(false);

  const paginaRef = useRef(null);

  useLayoutEffect(() => {
    const reduzirMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Links para seções não desmontam a página atual.
    if (
      destino.pathname === exibida.pathname ||
      reduzirMovimento
    ) {
      setExibida(destino);
      setSaindo(false);
      return;
    }

    setSaindo(true);

    const timer = window.setTimeout(() => {
      setExibida(destino);
      setSaindo(false);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [destino, exibida.pathname]);

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    const pagina = paginaRef.current;

    const titulo = Array.from(
      pagina.querySelectorAll("h1, h2")
    ).find((elemento) => {
      return !elemento.closest('[aria-hidden="true"]');
    });

    const alvo = titulo || pagina;
    const tabindexAnterior = alvo.getAttribute("tabindex");

    alvo.setAttribute("tabindex", "-1");
    alvo.focus({ preventScroll: true });

    return () => {
      if (tabindexAnterior === null) {
        alvo.removeAttribute("tabindex");
      } else {
        alvo.setAttribute("tabindex", tabindexAnterior);
      }
    };
  }, [exibida.pathname]);

  // Aguarda a nova página montar antes de rolar até a seção.
  useLayoutEffect(() => {
    if (!exibida.hash) return;

    let segundoFrame;

    const primeiroFrame = requestAnimationFrame(() => {
      segundoFrame = requestAnimationFrame(() => {
        let id;

        try {
          id = decodeURIComponent(exibida.hash.slice(1));
        } catch {
          return;
        }

        const alvo = document.getElementById(id);

        if (!alvo) return;

        const cabecalho = document.querySelector(
          ".comp-cabecalho"
        );

        const alturaCabecalho =
          cabecalho?.getBoundingClientRect().height || 0;

        const posicao =
          alvo.getBoundingClientRect().top +
          window.scrollY -
          alturaCabecalho -
          16;

        const reduzirMovimento = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({
          top: Math.max(0, posicao),
          behavior: reduzirMovimento ? "instant" : "smooth",
        });
      });
    });

    return () => {
      cancelAnimationFrame(primeiroFrame);
      cancelAnimationFrame(segundoFrame);
    };
  }, [exibida.pathname, exibida.hash, exibida.key]);

  return (
    <div
      key={exibida.pathname}
      ref={paginaRef}
      className={`pagina-transicao ${
        saindo ? "is-saindo" : ""
      }`}
      inert={saindo}
    >
      <Routes location={exibida}>{children}</Routes>
    </div>
  );
}