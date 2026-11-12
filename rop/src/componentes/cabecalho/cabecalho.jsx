import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PerfilUsuario from "../perfilUsuario/perfilUsuario.jsx";
import { HashLink } from "react-router-hash-link";

import "./cabecalho.scss";

function Cabecalho() {
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    function aoRolar() {
      setRolou(window.scrollY > 10);
    }

    aoRolar();

    window.addEventListener("scroll", aoRolar, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", aoRolar);
    };
  }, []);

  return (
    <>
      <header
        className={`comp-cabecalho ${rolou ? "rolou" : ""}`}
      >
        <div className="comp-corpo">
          <Link
            to="/inicio"
            className="comp-logo"
            aria-label="R.O.P. — Ir para o início"
          >
            <img
              src="/assets/img/componentes/cabecalho/logo.png"
              alt="R.O.P. — Restaurando o Paraíso"
            />
          </Link>

          <nav
            className="comp-botoes"
            aria-label="Navegação principal"
          >
            <Link to="/inicio" className="comp-link">
              Início
            </Link>

            <Link to="/especies" className="comp-link">
              Espécies
            </Link>

            <Link to="/orientacoes" className="comp-link">
              Orientações
            </Link>

            <Link to="/noticias" className="comp-link">
              Notícias
            </Link>

            <HashLink
              smooth
              to="/inicio#impactos"
              className="comp-link"
            >
              Impactos
            </HashLink>

            <HashLink
              smooth
              to="/inicio#projetos"
              className="comp-link"
            >
              Projetos
            </HashLink>

            <HashLink
              smooth
              to="/inicio#apadrinhe"
              className="comp-link"
            >
              Apadrinhe
            </HashLink>

            <Link to="/loja" className="comp-link">
              Loja
            </Link>
          </nav>

          <div className="comp-acoes">
    <PerfilUsuario />

            <div className="comp-doe-div">
              <Link to="/doe" className="comp-doe">
                <img
                  src="/assets/img/componentes/cabecalho/coracao.png"
                  alt=""
                  className="icone-coracao"
                />

                <span>Doe agora</span>
              </Link>
            </div>
          </div>
        </div>

        <div
          className="comp-aviso"
          role="note"
          aria-hidden={rolou}
        >
          <b>Projeto fictício.</b>

          <span className="comp-aviso-longo">
            A R.O.P. não existe de verdade.
            Este site foi criado para um TCC.
          </span>

          <span className="comp-aviso-curto">
            Site criado para um TCC.
          </span>
        </div>
      </header>

      <div className="comp-espaco" aria-hidden="true" />
    </>
  );
}

export default Cabecalho;