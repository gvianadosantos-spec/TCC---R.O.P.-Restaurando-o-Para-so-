import { useEffect, useMemo, useState } from 'react';
import './noticias.scss';

import Cabecalho from '../../componentes/cabecalho/cabecalho.jsx';
import Rodape from '../../componentes/rodape/rodape.jsx';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5050').replace(/\/+$/, '');

const banners = [
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem1.png',
    titulo: 'Informação que protege',
    texto: 'Acompanhe notícias e conteúdos ligados à preservação, fauna e natureza.'
  },
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem2.png',
    titulo: 'Conhecimento também transforma',
    texto: 'Entenda acontecimentos e iniciativas que ajudam a cuidar do meio ambiente.'
  },
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem3.png',
    titulo: 'Natureza em destaque',
    texto: 'Notícias, conservação e conscientização em um só lugar.'
  },
  {
    imagem: '/assets/img/pages/inicio/carrosel/imagem4.png',
    titulo: 'R.O.P. em movimento',
    texto: 'Informação para aproximar pessoas da causa ambiental.'
  }
];

function formatarData(valor) {
  if (!valor) return 'Data não informada';

  const texto = String(valor);
  const data = /^\d{4}-\d{2}-\d{2}/.test(texto)
    ? new Date(`${texto.slice(0, 10)}T12:00:00`)
    : new Date(texto);

  if (Number.isNaN(data.getTime())) return 'Data não informada';

  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function obterAno(valor) {
  return valor ? String(valor).slice(0, 4) : '';
}

function obterMes(valor) {
  return valor ? String(valor).slice(5, 7) : '';
}

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [busca, setBusca] = useState('');
  const [ano, setAno] = useState('todos');
  const [mes, setMes] = useState('todos');
  const [ordem, setOrdem] = useState('recentes');

  const [slideAtual, setSlideAtual] = useState(0);
  const [carrosselPausado, setCarrosselPausado] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarNoticias() {
      try {
        setCarregando(true);
        setErro('');

        const resposta = await fetch(`${API_URL}/noticias`);

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
        if (ativo) {
          if (e instanceof TypeError) {
            setErro(`Não foi possível conectar com a API em ${API_URL}.`);
          } else {
            setErro(e.message || 'Ocorreu um erro ao buscar as notícias.');
          }
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

  useEffect(() => {
    if (carrosselPausado) return;

    const timer = window.setInterval(() => {
      setSlideAtual((atual) => (atual + 1) % banners.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [carrosselPausado]);

  const anosDisponiveis = useMemo(() => {
    return [...new Set(
      noticias
        .map((noticia) => obterAno(noticia.publicado_em))
        .filter(Boolean)
    )].sort((a, b) => b.localeCompare(a));
  }, [noticias]);

  const noticiasFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');

    const resultado = noticias.filter((noticia) => {
      const correspondeBusca = [
        noticia.titulo,
        noticia.descricao
      ].some((campo) =>
        String(campo || '')
          .toLocaleLowerCase('pt-BR')
          .includes(termo)
      );

      const correspondeAno =
        ano === 'todos' || obterAno(noticia.publicado_em) === ano;

      const correspondeMes =
        mes === 'todos' || obterMes(noticia.publicado_em) === mes;

      return correspondeBusca && correspondeAno && correspondeMes;
    });

    resultado.sort((a, b) => {
      const dataA = new Date(a.publicado_em || 0).getTime();
      const dataB = new Date(b.publicado_em || 0).getTime();

      return ordem === 'recentes'
        ? dataB - dataA
        : dataA - dataB;
    });

    return resultado;
  }, [noticias, busca, ano, mes, ordem]);

  function anterior() {
    setSlideAtual((atual) => (atual - 1 + banners.length) % banners.length);
  }

  function proximo() {
    setSlideAtual((atual) => (atual + 1) % banners.length);
  }

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
          onMouseEnter={() => setCarrosselPausado(true)}
          onMouseLeave={() => setCarrosselPausado(false)}
          onFocusCapture={() => setCarrosselPausado(true)}
          onBlurCapture={() => setCarrosselPausado(false)}
        >
          <div className="noticias-carrossel-fundo">
            <img
              key={`fundo-${slideAtual}`}
              src={banners[slideAtual].imagem}
              alt=""
              aria-hidden="true"
            />
          </div>

          <div className="noticias-carrossel-slides">
            {banners.map((banner, indice) => (
              <article
                key={banner.imagem}
                className={`noticias-slide ${indice === slideAtual ? 'ativo' : ''}`}
                aria-hidden={indice !== slideAtual}
              >
                <img
                  className="noticias-slide-imagem"
                  src={banner.imagem}
                  alt=""
                />

                <div className="noticias-slide-sombra" />

                <div className="noticias-slide-conteudo">
                  <span>R.O.P. • RESTAURANDO O PARAÍSO</span>
                  <h1>{banner.titulo}</h1>
                  <p>{banner.texto}</p>

                  <a href="#noticias-lista">
                    Ver notícias
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="noticias-carrossel-controles">
            <div className="noticias-carrossel-indicadores">
              {banners.map((banner, indice) => (
                <button
                  key={`indicador-${banner.imagem}`}
                  type="button"
                  className={indice === slideAtual ? 'ativo' : ''}
                  onClick={() => setSlideAtual(indice)}
                  aria-label={`Ir para o banner ${indice + 1}`}
                >
                  <span />
                </button>
              ))}
            </div>

            <div className="noticias-carrossel-setas">
              <button
                type="button"
                onClick={anterior}
                aria-label="Banner anterior"
              >
                ←
              </button>

              <button
                type="button"
                onClick={proximo}
                aria-label="Próximo banner"
              >
                →
              </button>
            </div>
          </div>
        </section>

        <section className="noticias-apresentacao animar-entrada">
          <span className="noticias-sobretitulo">FIQUE INFORMADO</span>
          <h2>Notícias e atualizações</h2>
          <p>
            Acompanhe conteúdos ligados à natureza, conservação e proteção da fauna.
          </p>
        </section>

        <section
          className="noticias-area animar-entrada animar-atraso-1"
          id="noticias-lista"
        >
          <div className="noticias-filtros">
            <label className="noticias-campo noticias-campo-busca">
              <span>Pesquisar</span>
              <div className="noticias-input-wrapper">
                <span className="noticias-lupa" aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Pesquise pelo título ou descrição..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </label>

            <label className="noticias-campo">
              <span>Ano</span>
              <select value={ano} onChange={(e) => setAno(e.target.value)}>
                <option value="todos">Todos</option>
                {anosDisponiveis.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="noticias-campo">
              <span>Mês</span>
              <select value={mes} onChange={(e) => setMes(e.target.value)}>
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
              <span>Ordem</span>
              <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
                <option value="recentes">Mais recentes</option>
                <option value="antigas">Mais antigas</option>
              </select>
            </label>

            <button
              type="button"
              className="noticias-botao-limpar"
              onClick={limparFiltros}
            >
              Limpar
            </button>
          </div>

          {!carregando && !erro && (
            <div className="noticias-resultado-resumo">
              <strong>{noticiasFiltradas.length}</strong>
              <span>
                {noticiasFiltradas.length === 1
                  ? ' notícia encontrada'
                  : ' notícias encontradas'}
              </span>
            </div>
          )}

          {carregando && (
            <div className="noticias-mensagem">
              <span className="noticias-loader" />
              <p>Carregando notícias...</p>
            </div>
          )}

          {!carregando && erro && (
            <div className="noticias-mensagem noticias-erro">
              <strong>Não foi possível carregar as notícias.</strong>
              <p>{erro}</p>
              <small>
                Confira se a API está ligada e se o banco configurado é o mesmo do SQL.
              </small>
            </div>
          )}

          {!carregando && !erro && noticiasFiltradas.length === 0 && (
            <div className="noticias-mensagem">
              <strong>Nenhuma notícia encontrada.</strong>
              <p>
                Tente outra palavra ou limpe os filtros.
              </p>
            </div>
          )}

          {!carregando && !erro && noticiasFiltradas.length > 0 && (
            <div className="noticias-grade">
              {noticiasFiltradas.map((noticia, indice) => (
                <article
                  className="noticia-card"
                  key={noticia.id_noticia}
                  style={{ animationDelay: `${Math.min(indice, 8) * 70}ms` }}
                >
                  {noticia.imagem_url ? (
                    <div className="noticia-imagem">
                      <img
                        src={noticia.imagem_url}
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="noticia-imagem noticia-imagem-vazia">
                      <span>R.O.P.</span>
                    </div>
                  )}

                  <div className="noticia-corpo">
                    <div className="noticia-meta">
                      <span>NOTÍCIA</span>
                      <time dateTime={String(noticia.publicado_em || '')}>
                        {formatarData(noticia.publicado_em)}
                      </time>
                    </div>

                    <h3>{noticia.titulo}</h3>

                    <p>{noticia.descricao}</p>

                    {noticia.fonte_url && (
                      <a
                        href={noticia.fonte_url}
                        target="_blank"
                        rel="noreferrer"
                        className="noticia-fonte"
                      >
                        Ver fonte
                        <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Rodape />
    </div>
  );
}
