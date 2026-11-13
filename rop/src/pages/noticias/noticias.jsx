import { useEffect, useMemo, useRef, useState } from 'react';
import './noticias.scss';

import Cabecalho from '../../componentes/cabecalho/cabecalho.jsx';
import Rodape from '../../componentes/rodape/rodape.jsx';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5050').replace(/\/+$/, '');
const TEMPO_SLIDE = 6000;

const banners = [
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem1.png',
    eyebrow: 'FAUNA E CONSERVAÇÃO',
    titulo: 'Informação também é uma forma de proteger a natureza.',
    botao: 'Ver notícias'
  },
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem2.png',
    eyebrow: 'CONHECIMENTO EM MOVIMENTO',
    titulo: 'Acompanhe conteúdos que aproximam pessoas da biodiversidade.',
    botao: 'Explorar conteúdos'
  },
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem3.png',
    eyebrow: 'NATUREZA EM DESTAQUE',
    titulo: 'Entender os impactos é o primeiro passo para transformar atitudes.',
    botao: 'Continuar lendo'
  },
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem4.png',
    eyebrow: 'R.O.P. — RESTAURANDO O PARAÍSO',
    titulo: 'Notícias, conscientização e cuidado com a fauna brasileira.',
    botao: 'Conhecer notícias'
  }
];

function useEntrada() {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    if (!('IntersectionObserver' in window)) {
      setVisivel(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observer.unobserve(entrada.target);
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  return [ref, visivel];
}

function formatarData(valor) {
  if (!valor) return 'Data não informada';

  const texto = String(valor);
  const data = /^\d{4}-\d{2}-\d{2}/.test(texto)
    ? new Date(`${texto.slice(0, 10)}T12:00:00`)
    : new Date(texto);

  if (Number.isNaN(data.getTime())) return 'Data não informada';

  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function obterAno(valor) {
  return valor ? String(valor).slice(0, 4) : '';
}

function obterMes(valor) {
  return valor ? String(valor).slice(5, 7) : '';
}

function normalizarTexto(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function ImagemNoticia({ src, titulo }) {
  const [falhou, setFalhou] = useState(false);

  if (!src || falhou) {
    return (
      <div className="noticia-imagem noticia-imagem-vazia" aria-hidden="true">
        <span>R.O.P.</span>
      </div>
    );
  }

  return (
    <div className="noticia-imagem">
      <img
        src={src}
        alt={`Imagem relacionada à notícia: ${titulo}`}
        onError={() => setFalhou(true)}
      />
    </div>
  );
}

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [ano, setAno] = useState('todos');
  const [mes, setMes] = useState('todos');
  const [ordem, setOrdem] = useState('recentes');
  const [noticiaAberta, setNoticiaAberta] = useState(null);

  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const tempoDecorrido = useRef(0);

  const [apresentacaoRef, apresentacaoVisivel] = useEntrada();
  const [conteudoRef, conteudoVisivel] = useEntrada();

  useEffect(() => {
    let ativo = true;

    async function carregarNoticias() {
      try {
        setCarregando(true);
        setErro('');

        const resposta = await fetch(`${API_URL}/noticias`, {
          headers: { Accept: 'application/json' }
        });

        if (!resposta.ok) {
          const corpo = await resposta.json().catch(() => ({}));
          throw new Error(
            corpo.erro ||
              `Erro ${resposta.status}: não foi possível carregar as notícias.`
          );
        }

        const dados = await resposta.json();

        if (!Array.isArray(dados)) {
          throw new Error('A API não retornou uma lista válida de notícias.');
        }

        if (ativo) setNoticias(dados);
      } catch (e) {
        if (!ativo) return;

        if (e instanceof TypeError) {
          setErro(`Não foi possível conectar com a API em ${API_URL}.`);
        } else {
          setErro(e.message || 'Ocorreu um erro ao buscar as notícias.');
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarNoticias();

    return () => {
      ativo = false;
    };
  }, []);

  function irPara(indice) {
    tempoDecorrido.current = 0;
    setProgresso(0);
    setAtual((indice + banners.length) % banners.length);
  }

  function proximo() {
    irPara(atual + 1);
  }

  function anterior() {
    irPara(atual - 1);
  }

  useEffect(() => {
    if (pausado) return;

    let ultimaAtualizacao = Date.now();

    const intervalo = window.setInterval(() => {
      const agora = Date.now();
      tempoDecorrido.current += agora - ultimaAtualizacao;
      ultimaAtualizacao = agora;

      if (tempoDecorrido.current >= TEMPO_SLIDE) {
        tempoDecorrido.current = 0;
        setProgresso(0);
        setAtual((indice) => (indice + 1) % banners.length);
        return;
      }

      setProgresso((tempoDecorrido.current / TEMPO_SLIDE) * 100);
    }, 50);

    return () => window.clearInterval(intervalo);
  }, [pausado]);

  const anosDisponiveis = useMemo(() => {
    return [
      ...new Set(
        noticias
          .map((noticia) => obterAno(noticia.publicado_em))
          .filter(Boolean)
      )
    ].sort((a, b) => b.localeCompare(a));
  }, [noticias]);

  const noticiasFiltradas = useMemo(() => {
    const termo = normalizarTexto(busca.trim());

    const resultado = noticias.filter((noticia) => {
      const camposPesquisa = [
        noticia.titulo,
        noticia.descricao,
        noticia.local,
        noticia.causas,
        noticia.objetivo,
        noticia.impactos,
        noticia.curiosidade,
        noticia.fonte_texto
      ];

      const correspondeBusca =
        termo === '' ||
        camposPesquisa.some((campo) => normalizarTexto(campo).includes(termo));

      const correspondeAno =
        ano === 'todos' || obterAno(noticia.publicado_em) === ano;

      const correspondeMes =
        mes === 'todos' || obterMes(noticia.publicado_em) === mes;

      return correspondeBusca && correspondeAno && correspondeMes;
    });

    resultado.sort((a, b) => {
      const dataA = new Date(a.publicado_em || 0).getTime();
      const dataB = new Date(b.publicado_em || 0).getTime();

      return ordem === 'recentes' ? dataB - dataA : dataA - dataB;
    });

    return resultado;
  }, [noticias, busca, ano, mes, ordem]);

  function limparFiltros() {
    setBusca('');
    setAno('todos');
    setMes('todos');
    setOrdem('recentes');
  }

  return (
    <div className="pagina-noticias">
      <Cabecalho />

      <main>
        <section
          className="noticias-hero"
          aria-label="Destaques de notícias da R.O.P."
          aria-roledescription="carrossel"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onFocusCapture={() => setPausado(true)}
          onBlurCapture={(evento) => {
            if (!evento.currentTarget.contains(evento.relatedTarget)) {
              setPausado(false);
            }
          }}
        >
          {banners.map((banner, indice) => (
            <div
              key={banner.imagem}
              className={`noticias-hero__slide ${indice === atual ? 'is-active' : ''}`}
              aria-hidden={indice !== atual}
              role="group"
              aria-roledescription="slide"
              aria-label={`${indice + 1} de ${banners.length}`}
            >
              <img
                src={banner.imagem}
                alt=""
                className="noticias-hero__image-bg"
                aria-hidden="true"
              />

              <img
                src={banner.imagem}
                alt=""
                className="noticias-hero__image"
                draggable="false"
              />

              <div className="noticias-hero__shade" aria-hidden="true" />

              <div className="noticias-hero__content">
                <p className="noticias-hero__eyebrow">{banner.eyebrow}</p>
                <h1 className="noticias-hero__title">{banner.titulo}</h1>
                <a
                  href="#noticias-lista"
                  className="noticias-hero__button"
                  tabIndex={indice === atual ? 0 : -1}
                >
                  {banner.botao}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ))}

          <div className="noticias-hero__controls">
            <div className="noticias-hero__dots">
              {banners.map((banner, indice) => (
                <button
                  key={banner.imagem}
                  type="button"
                  className={`noticias-hero__dot ${indice === atual ? 'is-active' : ''}`}
                  aria-label={`Ir para slide ${indice + 1}`}
                  aria-current={indice === atual ? 'true' : undefined}
                  onClick={() => irPara(indice)}
                >
                  {indice === atual && (
                    <span
                      className="noticias-hero__progress"
                      style={{ width: `${progresso}%` }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="noticias-hero__arrows">
              <button type="button" onClick={anterior} aria-label="Slide anterior">
                ‹
              </button>
              <button type="button" onClick={proximo} aria-label="Próximo slide">
                ›
              </button>
            </div>
          </div>
        </section>

        <section
          ref={apresentacaoRef}
          className={`noticias-apresentacao entrada ${
            apresentacaoVisivel ? 'visivel' : ''
          }`}
        >
          <span>NOTÍCIAS R.O.P.</span>
          <h2>Informação para conhecer, entender e proteger.</h2>
          <p>
            Explore conteúdos sobre fauna, conservação e os desafios enfrentados
            pela biodiversidade. A pesquisa abaixo utiliza os dados que chegam da
            API conectada ao banco MySQL do projeto.
          </p>
        </section>

        <section
          id="noticias-lista"
          ref={conteudoRef}
          className={`noticias-conteudo entrada ${conteudoVisivel ? 'visivel' : ''}`}
        >
          <div className="noticias-pesquisa">
            <div className="noticias-pesquisa__topo">
              <div>
                <span className="noticias-pesquisa__rotulo">ENCONTRE UMA NOTÍCIA</span>
                <h2>Pesquisar conteúdos</h2>
              </div>

              {!carregando && !erro && (
                <p className="noticias-contagem">
                  <strong>{noticiasFiltradas.length}</strong>{' '}
                  {noticiasFiltradas.length === 1
                    ? 'resultado encontrado'
                    : 'resultados encontrados'}
                </p>
              )}
            </div>

            <div className="noticias-filtros">
              <label className="noticias-campo noticias-campo--busca">
                <span>Pesquisar</span>
                <div className="noticias-input-wrap">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Ex.: fauna, conservação, queimadas..."
                    value={busca}
                    onChange={(evento) => setBusca(evento.target.value)}
                  />
                </div>
              </label>

              <label className="noticias-campo">
                <span>Ano</span>
                <select value={ano} onChange={(evento) => setAno(evento.target.value)}>
                  <option value="todos">Todos</option>
                  {anosDisponiveis.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="noticias-campo">
                <span>Mês</span>
                <select value={mes} onChange={(evento) => setMes(evento.target.value)}>
                  <option value="todos">Todos</option>
                  <option value="01">Janeiro</option>
                  <option value="02">Fevereiro</option>
                  <option value="03">Março</option>
                  <option value="04">Abril</option>
                  <option value="05">Maio</option>
                  <option value="06">Junho</option>
                  <option value="07">Julho</option>
                  <option value="08">Agosto</option>
                  <option value="09">Setembro</option>
                  <option value="10">Outubro</option>
                  <option value="11">Novembro</option>
                  <option value="12">Dezembro</option>
                </select>
              </label>

              <label className="noticias-campo">
                <span>Ordenar</span>
                <select
                  value={ordem}
                  onChange={(evento) => setOrdem(evento.target.value)}
                >
                  <option value="recentes">Mais recentes</option>
                  <option value="antigas">Mais antigas</option>
                </select>
              </label>

              <button
                type="button"
                className="noticias-limpar"
                onClick={limparFiltros}
              >
                Limpar filtros
              </button>
            </div>
          </div>

          {carregando && (
            <div className="noticias-mensagem">
              <span className="noticias-loader" aria-hidden="true" />
              <strong>Carregando notícias...</strong>
              <p>Consultando a API do projeto.</p>
            </div>
          )}

          {!carregando && erro && (
            <div className="noticias-mensagem noticias-mensagem--erro">
              <strong>Não foi possível carregar as notícias.</strong>
              <p>{erro}</p>
              <small>
                Teste <code>/health</code> e <code>/health/banco</code> na API para
                identificar se o problema está no servidor ou no banco online.
              </small>
            </div>
          )}

          {!carregando && !erro && noticiasFiltradas.length === 0 && (
            <div className="noticias-mensagem">
              <strong>Nenhuma notícia encontrada.</strong>
              <p>Tente outra palavra, outro período ou limpe os filtros.</p>
            </div>
          )}

          {!carregando && !erro && noticiasFiltradas.length > 0 && (
            <div className="noticias-grade">
              {noticiasFiltradas.map((noticia, indice) => {
                const aberta = noticiaAberta === noticia.id_noticia;
                const temDetalhes = Boolean(
                  noticia.local ||
                    noticia.causas ||
                    noticia.objetivo ||
                    noticia.impactos ||
                    noticia.curiosidade ||
                    noticia.fonte_texto
                );

                return (
                  <article
                    className="noticia-card"
                    key={noticia.id_noticia}
                    style={{ animationDelay: `${Math.min(indice, 8) * 70}ms` }}
                  >
                    <ImagemNoticia src={noticia.imagem_url} titulo={noticia.titulo} />

                    <div className="noticia-card__corpo">
                      <div className="noticia-card__meta">
                        <span>NOTÍCIA</span>
                        <time dateTime={String(noticia.publicado_em || '')}>
                          {formatarData(noticia.publicado_em)}
                        </time>
                      </div>

                      <h3>{noticia.titulo || 'Notícia sem título'}</h3>

                      {noticia.local && (
                        <p className="noticia-card__local">{noticia.local}</p>
                      )}

                      <p className="noticia-card__descricao">
                        {noticia.descricao || 'Conteúdo não informado.'}
                      </p>

                      {aberta && temDetalhes && (
                        <div className="noticia-detalhes">
                          {noticia.causas && (
                            <div>
                              <span>Causas</span>
                              <p>{noticia.causas}</p>
                            </div>
                          )}
                          {noticia.objetivo && (
                            <div>
                              <span>Objetivo</span>
                              <p>{noticia.objetivo}</p>
                            </div>
                          )}
                          {noticia.impactos && (
                            <div>
                              <span>Impactos</span>
                              <p>{noticia.impactos}</p>
                            </div>
                          )}
                          {noticia.curiosidade && (
                            <div>
                              <span>Curiosidade</span>
                              <p>{noticia.curiosidade}</p>
                            </div>
                          )}
                          {noticia.fonte_texto && (
                            <div>
                              <span>Fonte</span>
                              <p>{noticia.fonte_texto}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="noticia-card__acoes">
                        {temDetalhes && (
                          <button
                            type="button"
                            onClick={() =>
                              setNoticiaAberta(aberta ? null : noticia.id_noticia)
                            }
                          >
                            {aberta ? 'Mostrar menos' : 'Ler detalhes'}
                            <span aria-hidden="true">{aberta ? '−' : '+'}</span>
                          </button>
                        )}

                        {noticia.fonte_url && (
                          <a
                            href={noticia.fonte_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Ver fonte <span aria-hidden="true">→</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Rodape />
    </div>
  );
}
