import { useEffect, useMemo, useRef, useState } from 'react';
import './noticias.scss';

import Cabecalho from '../../componentes/cabecalho/cabecalho.jsx';
import Rodape from '../../componentes/rodape/rodape.jsx';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

const TEMPO_SLIDE = 6000;

const banners = [
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem1.png',
    eyebrow: 'NOTÍCIAS R.O.P.',
    titulo: 'Informação que transforma',
    texto: 'Acompanhe notícias e ações relacionadas à proteção da natureza.'
  },
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem2.png',
    eyebrow: 'PRESERVAÇÃO E CONSCIÊNCIA',
    titulo: 'Cuidar da natureza é cuidar do futuro',
    texto: 'Conheça os acontecimentos que ajudam a construir um mundo melhor.'
  },
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem3.png',
    eyebrow: 'FAUNA E BIODIVERSIDADE',
    titulo: 'A natureza precisa de todos nós',
    texto: 'Informação e conscientização também são formas de proteção.'
  },
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem4.png',
    eyebrow: 'ACONTECE NA NATUREZA',
    titulo: 'Fique por dentro',
    texto: 'Leia, compartilhe conhecimento e participe dessa causa.'
  }
];

function formatarData(data) {
  if (!data) return 'Data não informada';

  const valor = String(data).slice(0, 10);
  const partes = valor.split('-');

  if (partes.length !== 3) return valor;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obterAno(data) {
  return data ? String(data).slice(0, 4) : '';
}

function obterMes(data) {
  return data ? String(data).slice(5, 7) : '';
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
  const [slideAtual, setSlideAtual] = useState(0);
  const [carrosselPausado, setCarrosselPausado] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const tempoDecorrido = useRef(0);

  useEffect(() => {
    async function carregarNoticias() {
      try {
        setCarregando(true);
        setErro('');

        const resposta = await fetch(`${API_URL}/noticias`);

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar as notícias.');
        }

        const dados = await resposta.json();

        if (!Array.isArray(dados)) {
          throw new Error('A API não retornou uma lista válida de notícias.');
        }

        setNoticias(dados);
      } catch (error) {
        setErro(error.message || 'Ocorreu um erro ao buscar as notícias.');
      } finally {
        setCarregando(false);
      }
    }

    carregarNoticias();
  }, []);

  function irParaSlide(indice) {
    tempoDecorrido.current = 0;
    setProgresso(0);
    setSlideAtual((indice + banners.length) % banners.length);
  }

  function proximoSlide() {
    irParaSlide(slideAtual + 1);
  }

  function slideAnterior() {
    irParaSlide(slideAtual - 1);
  }

  useEffect(() => {
    if (carrosselPausado) return;

    let ultimaAtualizacao = Date.now();
    const intervalo = window.setInterval(() => {
      const agora = Date.now();
      tempoDecorrido.current += agora - ultimaAtualizacao;
      ultimaAtualizacao = agora;

      if (tempoDecorrido.current >= TEMPO_SLIDE) {
        tempoDecorrido.current = 0;
        setProgresso(0);
        setSlideAtual((indice) => (indice + 1) % banners.length);
        return;
      }

      setProgresso((tempoDecorrido.current / TEMPO_SLIDE) * 100);
    }, 50);

    return () => window.clearInterval(intervalo);
  }, [carrosselPausado]);

  const anosDisponiveis = useMemo(() => {
    return [...new Set(noticias.map((noticia) => obterAno(noticia.data_noticia)).filter(Boolean))]
      .sort((a, b) => b.localeCompare(a));
  }, [noticias]);

  const noticiasFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');

    const resultado = noticias.filter((noticia) => {
      const correspondeBusca = [
        noticia.titulo,
        noticia.local,
        noticia.acontecimento,
        noticia.causas,
        noticia.objetivo,
        noticia.impactos,
        noticia.curiosidade,
        noticia.fonte
      ].some((campo) => String(campo || '').toLocaleLowerCase('pt-BR').includes(termo));

      const correspondeAno = ano === 'todos' || obterAno(noticia.data_noticia) === ano;
      const correspondeMes = mes === 'todos' || obterMes(noticia.data_noticia) === mes;

      return correspondeBusca && correspondeAno && correspondeMes;
    });

    resultado.sort((a, b) => {
      const dataA = String(a.data_noticia || '');
      const dataB = String(b.data_noticia || '');
      return ordem === 'recentes'
        ? dataB.localeCompare(dataA)
        : dataA.localeCompare(dataB);
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
          className="noticias-carrossel"
          aria-label="Destaques das notícias R.O.P."
          aria-roledescription="carrossel"
          onMouseEnter={() => setCarrosselPausado(true)}
          onMouseLeave={() => setCarrosselPausado(false)}
          onFocusCapture={() => setCarrosselPausado(true)}
          onBlurCapture={(evento) => {
            if (!evento.currentTarget.contains(evento.relatedTarget)) {
              setCarrosselPausado(false);
            }
          }}
        >
          {banners.map((banner, indice) => (
            <div
              key={banner.imagem}
              className={`noticias-carrossel__slide ${indice === slideAtual ? 'is-active' : ''}`}
              aria-hidden={indice !== slideAtual}
              role="group"
              aria-roledescription="slide"
              aria-label={`${indice + 1} de ${banners.length}`}
            >
              <img
                src={banner.imagem}
                alt=""
                className="noticias-carrossel__image-bg"
                aria-hidden="true"
              />
              <img
                src={banner.imagem}
                alt=""
                className="noticias-carrossel__image"
                draggable="false"
              />
              <div className="noticias-carrossel__shade" aria-hidden="true" />

              <div className="noticias-carrossel__content">
                <p className="noticias-carrossel__eyebrow">{banner.eyebrow}</p>
                <h1 className="noticias-carrossel__title">{banner.titulo}</h1>
                <p className="noticias-carrossel__text">{banner.texto}</p>
                <a
                  href="#lista-noticias"
                  className="noticias-carrossel__button"
                  tabIndex={indice === slideAtual ? 0 : -1}
                >
                  Ver notícias <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ))}

          <div className="noticias-carrossel__controls">
            <div className="noticias-carrossel__dots">
              {banners.map((banner, indice) => (
                <button
                  key={banner.imagem}
                  type="button"
                  className={`noticias-carrossel__dot ${indice === slideAtual ? 'is-active' : ''}`}
                  aria-label={`Ir para slide ${indice + 1}`}
                  aria-current={indice === slideAtual ? 'true' : undefined}
                  onClick={() => irParaSlide(indice)}
                >
                  {indice === slideAtual && (
                    <span
                      className="noticias-carrossel__progress"
                      style={{ width: `${progresso}%` }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="noticias-carrossel__arrows">
              <button type="button" onClick={slideAnterior} aria-label="Slide anterior">‹</button>
              <button type="button" onClick={proximoSlide} aria-label="Próximo slide">›</button>
            </div>
          </div>
        </section>

        <section className="noticias-introducao">
          <span className="noticias-sobretitulo">FIQUE INFORMADO</span>
          <h2>Notícias e atualizações</h2>
          <p>
            Acompanhe informações sobre acontecimentos, iniciativas e temas ligados
            à preservação ambiental e à proteção dos animais.
          </p>
        </section>

        <section className="noticias-conteudo" id="lista-noticias">
          <div className="noticias-filtros">
            <label className="noticias-busca">
              <span>Buscar notícia</span>
              <input
                type="search"
                placeholder="Digite uma palavra..."
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
              />
            </label>

            <label>
              <span>Ano</span>
              <select value={ano} onChange={(evento) => setAno(evento.target.value)}>
                <option value="todos">Todos</option>
                {anosDisponiveis.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
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

            <label>
              <span>Ordenar por</span>
              <select value={ordem} onChange={(evento) => setOrdem(evento.target.value)}>
                <option value="recentes">Mais recentes</option>
                <option value="antigas">Mais antigas</option>
              </select>
            </label>

            <button type="button" className="noticias-limpar" onClick={limparFiltros}>
              Limpar filtros
            </button>
          </div>

          {carregando && (
            <p className="noticias-mensagem">Carregando notícias...</p>
          )}

          {!carregando && erro && (
            <div className="noticias-mensagem noticias-erro">
              <p>{erro}</p>
              <span>Confira se a API está ligada e se o endereço configurado está correto.</span>
            </div>
          )}

          {!carregando && !erro && noticiasFiltradas.length === 0 && (
            <p className="noticias-mensagem">
              Nenhuma notícia encontrada. Tente alterar a busca ou os filtros.
            </p>
          )}

          {!carregando && !erro && noticiasFiltradas.length > 0 && (
            <div className="noticias-grade">
              {noticiasFiltradas.map((noticia) => {
                const aberta = noticiaAberta === noticia.id_noticia;

                return (
                  <article className="noticia-card" key={noticia.id_noticia}>
                    <div className="noticia-card-topo">
                      <span className="noticia-categoria">NOTÍCIA</span>
                      <time>{formatarData(noticia.data_noticia)}</time>
                    </div>

                    <h3>{noticia.titulo || 'Notícia sem título'}</h3>

                    {noticia.local && (
                      <p className="noticia-local">📍 {noticia.local}</p>
                    )}

                    <div className="noticia-resumo">
                      <h4>O que aconteceu?</h4>
                      <p>{noticia.acontecimento || 'Informação não disponível.'}</p>
                    </div>

                    {aberta && (
                      <div className="noticia-detalhes">
                        {noticia.causas && (
                          <div>
                            <h4>Causas</h4>
                            <p>{noticia.causas}</p>
                          </div>
                        )}
                        {noticia.objetivo && (
                          <div>
                            <h4>Objetivo</h4>
                            <p>{noticia.objetivo}</p>
                          </div>
                        )}
                        {noticia.impactos && (
                          <div>
                            <h4>Impactos</h4>
                            <p>{noticia.impactos}</p>
                          </div>
                        )}
                        {noticia.curiosidade && (
                          <div>
                            <h4>Curiosidade</h4>
                            <p>{noticia.curiosidade}</p>
                          </div>
                        )}
                        {noticia.fonte && (
                          <div>
                            <h4>Fonte</h4>
                            <p>{noticia.fonte}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      className="noticia-ler-mais"
                      onClick={() => setNoticiaAberta(aberta ? null : noticia.id_noticia)}
                    >
                      {aberta ? 'Mostrar menos' : 'Ler notícia completa'}
                      <span>{aberta ? '−' : '+'}</span>
                    </button>
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
