import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./rodape.scss";

/* Páginas internas: precisam existir nas suas <Route>. */
const ROTAS = {
  inicio: "/",
  impactos: "/impactos",
  projetos: "/projetos",
  publicacoes: "/publicacoes",
  apadrinhe: "/apadrinhe",
  doe: "/doe",
  loja: "/loja",
};

/* Links externos: deixe "" enquanto não tiver o endereço.
   Vazio = o clique não faz nada. Preenchido = abre o link. */
const URLS = {
  doar: "",
  apadrinhar: "",
  binoculos: "",
  instagram: "",
  facebook: "",
  youtube: "",
  email: "", // exemplo: "mailto:contato@seudominio.com"
};

const irParaTopo = () => window.scrollTo(0, 0);

function LinkExterno({ url, className, ariaLabel, children }) {
  const temUrl = Boolean(url);
  const abreNovaAba = temUrl && !url.startsWith("mailto:");
  const destino = url || "#";

  const aoClicar = (e) => {
    if (!temUrl) e.preventDefault();
  };

  return (
    <a
      href={destino}
      className={className}
      aria-label={ariaLabel}
      onClick={aoClicar}
      target={abreNovaAba ? "_blank" : undefined}
      rel={abreNovaAba ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function SetaExterna() {
  return (
    <svg className="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  );
}

export default function Rodape() {
  useEffect(() => {
    document.title = "R.O.P. — Restaurando o Paraíso";
  }, []);

  return (
    <div className="rop">
      <div className="main-container">
        {/* Hero Box */}
        <section className="hero">
          <h1 className="hero-title">
            Salve vidas. Restaure o paraíso.
            <span>Junte-se a nós pela</span>
            <span>biodiversidade.</span>
          </h1>
          <div className="hero-buttons">
            <Link to={ROTAS.doe} className="btn btn-primary" onClick={irParaTopo}>
              Doe agora
            </Link>
            <Link to={ROTAS.apadrinhe} className="btn btn-secondary" onClick={irParaTopo}>
              Apadrinhe
            </Link>
          </div>
        </section>

        {/* Footer Main */}
        <footer className="footer-content">
          <div className="footer-grid">
            {/* Column 1: Brand Info */}
            <div className="brand-col">
              <div className="brand-header">
                <img
                  className="brand-logo-img"
                  src={`${process.env.PUBLIC_URL}/assets/componentes/cabecalho/logo.png`}
                  alt="R.O.P. — Restaurando o Paraíso"
                />
              </div>
              <p className="brand-description">
                R.O.P. — Restaurando/Recuperando o Paraíso. Cuidamos de animais silvestres que
                perderam seus habitats, recuperamos vidas e educamos para a fauna brasileira que
                tanto amamos.
              </p>
            </div>

            {/* Column 2: Navegação */}
            <div>
              <h2 className="col-title">Navegação</h2>
              <ul className="nav-list">
                <li>
                  <Link to={ROTAS.inicio} onClick={irParaTopo}>Início</Link>
                </li>
                <li>
                  <Link to={ROTAS.impactos} onClick={irParaTopo}>Impactos</Link>
                </li>
                <li>
                  <Link to={ROTAS.projetos} onClick={irParaTopo}>Projetos</Link>
                </li>
                <li>
                  <Link to={ROTAS.publicacoes} onClick={irParaTopo}>Publicações</Link>
                </li>
                <li>
                  <Link to={ROTAS.apadrinhe} onClick={irParaTopo}>Apadrinhe</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Como ajudar */}
            <div>
              <h2 className="col-title">Como ajudar</h2>
              <ul className="nav-list">
                <li>
                  <LinkExterno url={URLS.doar}>
                    Doar
                    <SetaExterna />
                  </LinkExterno>
                </li>
                <li>
                  <LinkExterno url={URLS.apadrinhar}>
                    Apadrinhar
                    <SetaExterna />
                  </LinkExterno>
                </li>
                <li>
                  <Link to={ROTAS.loja} onClick={irParaTopo}>Loja</Link>
                </li>
                <li>
                  <LinkExterno url={URLS.binoculos}>
                    Binóculos da Liberdade
                    <SetaExterna />
                  </LinkExterno>
                </li>
              </ul>
            </div>

            {/* Column 4: Conecte-se */}
            <div>
              <h2 className="col-title">Conecte-se</h2>
              <div className="social-icons">
                {/* Instagram */}
                <LinkExterno url={URLS.instagram} className="social-btn" ariaLabel="Instagram">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </LinkExterno>
                {/* Facebook */}
                <LinkExterno url={URLS.facebook} className="social-btn" ariaLabel="Facebook">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </LinkExterno>
                {/* YouTube */}
                <LinkExterno url={URLS.youtube} className="social-btn" ariaLabel="YouTube">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </LinkExterno>
                {/* Email */}
                <LinkExterno url={URLS.email} className="social-btn" ariaLabel="Email">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </LinkExterno>
              </div>
            </div>
          </div>
        </footer>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <div>© 2026 R.O.P. — Restaurando o Paraíso. Todos os direitos reservados.</div>
          <div>Reescrito com cuidado pela fauna brasileira.</div>
        </div>
      </div>
    </div>
  );
}