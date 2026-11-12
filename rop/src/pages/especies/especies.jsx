import { useEffect, useMemo, useRef, useState } from "react";
import "./especies.scss";
import { Link } from "react-router-dom";
import GraficosEspecies from "./GraficosEspecies";
import Rodape from "../../componentes/rodape/rodape";
import Cabecalho from "../../componentes/cabecalho/cabecalho.jsx";
import {
  ANIMAIS_TESTE, GRUPOS, adaptarAnimaisDaAPI, normalizarTexto
} from "./dadosEspecies";

// A API permanece desligada para que você possa testar tudo sem backend.
// Quando a API estiver pronta, mude para true e ajuste a URL.
const USAR_API = false;
const URL_API = "http://localhost:3001/animais";

const ehExtinto = (animal) =>
  ["Extinto", "Extinto na Natureza"].includes(animal.status_conservacao);

function IconePesquisa() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7.5" /><path d="m20.5 20.5-4.1-4.1" />
    </svg>
  );
}

function IconeFiltro() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
      <circle cx="9" cy="7" r="2" fill="#062128" />
      <circle cx="15" cy="12" r="2" fill="#062128" />
      <circle cx="9" cy="17" r="2" fill="#062128" />
    </svg>
  );
}

const statusClasse = (status) => {
  if (ehExtinto({ status_conservacao: status })) return "extinto";
  if (status === "Criticamente Ameaçado") return "critico";
  if (status === "Ameaçado") return "ameacado";
  if (status === "Vulnerável") return "vulneravel";
  return "outros";
};

function FotoAnimal({ animal, grande = false }) {
  const [falhou, setFalhou] = useState(false);
  // A prop key usada no card faz este componente reiniciar quando troca o animal.
  const temImagem = Boolean(animal.imagem) && !falhou;
  return (
    <div className={`especie-foto ${grande ? "especie-foto-grande" : ""}`}>
      {temImagem ? (
        <img src={animal.imagem} alt={animal.nome_popular}
          onError={() => setFalhou(true)} loading={grande ? "eager" : "lazy"} />
      ) : (
        <div className="especie-sem-foto" role="img" aria-label={`Imagem não cadastrada: ${animal.nome_popular}`}>
          <span className="especie-emoji" aria-hidden="true">{animal.icone || "🐾"}</span>
          <span>Imagem de demonstração</span>
        </div>
      )}
      {!grande && (
        <span className={`especie-badge ${statusClasse(animal.status_conservacao)}`}>
          {animal.status_conservacao}
        </span>
      )}
    </div>
  );
}

function CartaoAnimal({ animal, abrir }) {
  return (
    <button type="button" className="especie-card"
      onClick={() => abrir(animal)} aria-label={`Abrir ficha de ${animal.nome_popular}`}>
      <FotoAnimal animal={animal} />
      <div className="especie-card-texto">
        <span className="especie-grupo">{animal.grupo} · BRASIL</span>
        <strong className="especie-nome">{animal.nome_popular}</strong>
        <em className="especie-cientifico">{animal.nome_cientifico}</em>
        <span className={`especie-situacao ${statusClasse(animal.status_conservacao)}`}>
          ◉ {animal.status_conservacao}
        </span>
      </div>
    </button>
  );
}

function FichaAnimal({ animal, fechar }) {
  const fecharRef = useRef(null);

  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    fecharRef.current?.focus();
    const pressionouTecla = (e) => { if (e.key === "Escape") fechar(); };
    document.addEventListener("keydown", pressionouTecla);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", pressionouTecla);
    };
  }, [fechar]);

  return (
    <div className="especie-modal-fundo" onMouseDown={(e) => {
      if (e.target === e.currentTarget) fechar();
    }}>
      <section className="especie-modal" role="dialog" aria-modal="true"
        aria-labelledby="titulo-ficha-animal">
        <button ref={fecharRef} type="button" className="especie-modal-fechar"
          onClick={fechar} aria-label="Fechar ficha">×</button>
        <FotoAnimal key={animal.id} animal={animal} grande />
        <div className="especie-modal-conteudo">
          <div className="especie-modal-categorias">
            <span className={`especie-badge ${statusClasse(animal.status_conservacao)}`}>
              {animal.status_conservacao}
            </span>
            <span>{animal.grupo}</span>
          </div>
          <h2 id="titulo-ficha-animal">{animal.nome_popular}</h2>
          <em className="especie-modal-cientifico">{animal.nome_cientifico}</em>
          {ehExtinto(animal) && (
            <div className="especie-modal-alerta">
              <strong>Registro de extinção</strong>
              <p>{animal.causa}</p>
            </div>
          )}
          <div className="especie-modal-detalhes">
            <div><small>OCORRÊNCIA</small><strong>{animal.ocorrencia}</strong></div>
            <div><small>POPULAÇÃO</small><strong>{animal.populacao}</strong></div>
            <div><small>TENDÊNCIA</small><strong>{animal.tendencia}</strong></div>
          </div>
          <p className="especie-modal-descricao">{animal.descricao}</p>
        </div>
      </section>
    </div>
  );
}

function SecaoAnimais({ titulo, animais, abrir }) {
  if (animais.length === 0) return null;
  return (
    <section className="especie-secao">
      <div className="especie-titulo-linha">
        <h2>{titulo}</h2>
        <span className="especie-contagem">
          {animais.length} {animais.length === 1 ? "espécie" : "espécies"}
        </span>
      </div>
      <div className="especie-grid">
        {animais.map((animal) => (
          <CartaoAnimal key={animal.id} animal={animal} abrir={abrir} />
        ))}
      </div>
    </section>
  );
}

function Especies() {
  const [animais, setAnimais] = useState(USAR_API ? [] : ANIMAIS_TESTE);
  const [grupoAtivo, setGrupoAtivo] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [buscaFocada, setBuscaFocada] = useState(false);
  const [animalAberto, setAnimalAberto] = useState(null);
  const [carregando, setCarregando] = useState(USAR_API);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!USAR_API) return;
    const controlador = new AbortController();
    async function carregar() {
      try {
        const resposta = await fetch(URL_API, { signal: controlador.signal });
        if (!resposta.ok) throw new Error(`Erro da API: ${resposta.status}`);
        const json = await resposta.json();
        const lista = Array.isArray(json) ? json : (json.animais ?? json.data);
        if (!Array.isArray(lista)) throw new Error("A API deve devolver um array de animais.");
        setAnimais(adaptarAnimaisDaAPI(lista));
      } catch (e) {
        if (e.name !== "AbortError") setErro(e.message);
      } finally {
        if (!controlador.signal.aborted) setCarregando(false);
      }
    }
    carregar();
    return () => controlador.abort();
  }, []);

  const animaisFiltrados = useMemo(() => {
    const termo = normalizarTexto(busca);
    return animais.filter((animal) => {
      if (grupoAtivo !== "Todos" && animal.grupo !== grupoAtivo) return false;
      if (!termo) return true;
      return normalizarTexto(`${animal.nome_popular} ${animal.nome_cientifico}`).includes(termo);
    });
  }, [animais, grupoAtivo, busca]);

  const extintos = animaisFiltrados.filter(ehExtinto);
  const gruposExibidos = grupoAtivo === "Todos" ? GRUPOS.slice(1) : [grupoAtivo];
  const fecharFicha = () => setAnimalAberto(null);
  const abrirFicha = (animal) => {
    setAnimalAberto(animal);
    setBuscaFocada(false);
  };
  const sugestoesAbertas = Boolean(busca.trim()) && buscaFocada;

  return (
    <div className="especies-corpo">
      <Cabecalho />
      <main className="c">
        <div className="container">
          <p className="tt">Animais em Extinção</p>
          <h1>Animais do Brasil</h1>
          <p className="subtitle">
            Um panorama dos animais ameaçados e extintos do Brasil. Explore por grupo,
            pesquise pelo nome comum ou científico e conheça as estatísticas e as causas por trás de cada espécie.
          </p>

          {!USAR_API && <p className="especie-aviso-demo">Demonstração: registros e números ilustrativos para testar o sistema.</p>}
          <GraficosEspecies animais={animaisFiltrados} />

          <section className="especie-guia" aria-labelledby="especie-guia-titulo">
            <span className="especie-guia-etiqueta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <path d="M12 6.5c-2.5-1.8-5.6-2-9-1v13c3.4-1 6.5-.8 9 1 2.5-1.8 5.6-2 9-1v-13c-3.4-1-6.5-.8-9 1Z" />
                <path d="M12 6.5v13" />
              </svg>
              EDUCAÇÃO AMBIENTAL
            </span>
            <h2 id="especie-guia-titulo">Conhecer também é proteger.</h2>
            <p>
              Encontrou um animal silvestre e não sabe como agir? Consulte nossos
              guias educativos e descubra como procurar ajuda especializada.
            </p>
            <Link to="/orientacoes" className="especie-guia-botao">
              Conhecer orientações <span aria-hidden="true">↗</span>
            </Link>
          </section>


          <section className="card-pesquisa" aria-label="Filtros de espécies">
            <div className="opt">
              <span className="icone-filtros"><IconeFiltro /></span>
              <p className="flt">FILTROS</p>
            </div>
            <div className="bots">
              <div className="ani" aria-label="Filtrar por grupo">
                {GRUPOS.map((grupo) => (
                  <button key={grupo} type="button"
                    className={grupoAtivo === grupo ? "ativo" : ""}
                    aria-pressed={grupoAtivo === grupo}
                    onClick={() => { setGrupoAtivo(grupo); setBuscaFocada(false); }}>
                    {grupo}
                  </button>
                ))}
              </div>

              <div className="busca-area" onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setBuscaFocada(false);
              }}>
                <div className="in">
                  <span className="search-icon"><IconePesquisa /></span>
                  <input type="search" value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    onFocus={() => setBuscaFocada(true)}
                    placeholder="Buscar — nome comum ou científico..."
                    aria-label="Buscar animais por nome popular ou científico"
                    aria-haspopup="listbox" />
                  {busca && <button className="limpar-busca" type="button"
                    onClick={() => setBusca("")} aria-label="Limpar pesquisa">×</button>}
                </div>
                {sugestoesAbertas && (
                  <div className="busca-sugestoes">
                    <div className="busca-sugestoes-titulo">ESPÉCIES ENCONTRADAS</div>
                    {animaisFiltrados.length > 0 ? animaisFiltrados.slice(0, 6).map((animal) => (
                      <button type="button" key={animal.id} className="busca-sugestao"
                        onClick={() => abrirFicha(animal)}>
                        <span><strong>{animal.nome_popular}</strong><em>{animal.nome_cientifico}</em></span>
                        <small>{animal.grupo}</small>
                      </button>
                    )) : <p className="busca-sem-resultado">Nenhum animal encontrado.</p>}
                    {animaisFiltrados.length > 6 && <small className="busca-mais">Mais resultados nos cards abaixo.</small>}
                  </div>
                )}
              </div>
            </div>
          </section>

          {erro && <p className="especie-erro" role="alert">{erro}</p>}
          {carregando && <p className="especie-sem-resultados">Carregando espécies...</p>}

          {!carregando && !erro && (
            <>
              {extintos.length > 0 && (
                <section className="especie-secao especie-extincao">
                  <p className="especie-kicker">REGISTROS DE EXTINÇÃO</p>
                  <div className="especie-titulo-linha">
                    <h2>Espécies extintas e suas causas</h2>
                    <span className="especie-contagem">{extintos.length} {extintos.length === 1 ? "espécie" : "espécies"}</span>
                  </div>
                  <div className="especie-grid">
                    {extintos.map((animal) => <CartaoAnimal key={animal.id} animal={animal} abrir={abrirFicha} />)}
                  </div>
                </section>
              )}

              {gruposExibidos.map((grupo) => (
                <SecaoAnimais key={grupo} titulo={grupo}
                  animais={animaisFiltrados.filter((a) => a.grupo === grupo && !ehExtinto(a))}
                  abrir={abrirFicha} />
              ))}
              {grupoAtivo === "Todos" && (
                <SecaoAnimais titulo="Não classificados"
                  animais={animaisFiltrados.filter((a) => a.grupo === "Não classificado" && !ehExtinto(a))}
                  abrir={abrirFicha} />
              )}

              {animaisFiltrados.length === 0 && (
                <div className="especie-sem-resultados">
                  Nenhuma espécie encontrada. Tente outro grupo ou termo de pesquisa.
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Rodape />
      {animalAberto && <FichaAnimal key={animalAberto.id} animal={animalAberto} fechar={fecharFicha} />}
    </div>
  );
}

export default Especies;
