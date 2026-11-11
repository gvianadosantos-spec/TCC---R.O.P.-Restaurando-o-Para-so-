import { useEffect, useMemo, useState } from "react";
import "./noticias.scss";
import Cabecalho from "../../componentes/cabecalho/cabecalho.jsx";
import Rodape from "../../componentes/rodape/rodape.jsx";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5050";

// Como o SQL ainda não foi enviado, reconhecemos alguns nomes de campos comuns.
function valorDe(item, nomes) {
  for (const nome of nomes) {
    const valor = item?.[nome];
    if (valor !== undefined && valor !== null && String(valor).trim() !== "") {
      return valor;
    }
  }
  return "";
}

function prepararNoticia(item, indice) {
  const dataOriginal = valorDe(item, [
    "data_publicacao", "data_noticia", "data", "created_at", "data_criacao"
  ]);

  const data = dataOriginal
    ? new Date(
        /^\d{4}-\d{2}-\d{2}$/.test(String(dataOriginal))
          ? `${dataOriginal}T12:00:00`
          : dataOriginal
      )
    : null;

  return {
    id: valorDe(item, ["id_noticia", "id", "codigo"]) || indice,
    titulo: valorDe(item, ["titulo", "nome", "title"]) || "Notícia sem título",
    resumo: valorDe(item, [
      "resumo", "descricao", "descrição", "subtitulo", "texto_resumo"
    ]),
    conteudo: valorDe(item, [
      "conteudo", "conteúdo", "texto", "corpo", "noticia", "materia"
    ]),
    categoria: valorDe(item, ["categoria", "tema", "tipo"]) || "Geral",
    imagem: valorDe(item, [
      "imagem", "imagem_url", "url_imagem", "foto", "capa"
    ]),
    fonte: valorDe(item, ["fonte", "autor", "veiculo"]),
    link: valorDe(item, ["link", "url", "url_noticia", "link_externo"]),
    data: data && !Number.isNaN(data.getTime()) ? data : null
  };
}

function formatarData(data) {
  if (!data) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "long", year: "numeric"
  }).format(data);
}

function imagemValida(valor) {
  if (typeof valor !== "string" || !valor.trim()) return "";
  const caminho = valor.trim();
  if (/^(https?:\/\/|\/)/i.test(caminho)) return caminho;
  if (/^[\w.-]+\//.test(caminho)) return `/${caminho}`;
  return "";
}

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [ano, setAno] = useState("Todos");
  const [ordem, setOrdem] = useState("recentes");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function carregarNoticias() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await fetch(`${API_URL}/noticias`, {
          signal: controller.signal,
          headers: { Accept: "application/json" }
        });

        if (!resposta.ok) {
          throw new Error(`Erro HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();
        const lista = Array.isArray(dados)
          ? dados
          : Array.isArray(dados?.noticias)
            ? dados.noticias
            : null;

        if (!lista) {
          throw new Error("A API não retornou uma lista de notícias.");
        }

        setNoticias(lista.map(prepararNoticia));
      } catch (erroConsulta) {
        if (erroConsulta.name !== "AbortError") {
          console.error("Erro ao carregar notícias:", erroConsulta);
          setErro("Não foi possível carregar as notícias. Verifique se a API está funcionando.");
        }
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregarNoticias();
    return () => controller.abort();
  }, []);

  const categorias = useMemo(() => [
    "Todas",
    ...new Set(noticias.map((item) => item.categoria).filter(Boolean))
  ], [noticias]);

  const anos = useMemo(() => {
    const lista = noticias
      .filter((item) => item.data)
      .map((item) => String(item.data.getFullYear()));
    return ["Todos", ...Array.from(new Set(lista)).sort((a, b) => Number(b) - Number(a))];
  }, [noticias]);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    return noticias
      .filter((item) => {
        const texto = `${item.titulo} ${item.resumo} ${item.conteudo} ${item.categoria}`
          .toLocaleLowerCase("pt-BR");
        const buscaOk = !termo || texto.includes(termo);
        const categoriaOk = categoria === "Todas" || item.categoria === categoria;
        const anoOk = ano === "Todos" ||
          (item.data && String(item.data.getFullYear()) === ano);
        return buscaOk && categoriaOk && anoOk;
      })
      .sort((a, b) => {
        const dataA = a.data?.getTime() || 0;
        const dataB = b.data?.getTime() || 0;
        return ordem === "recentes" ? dataB - dataA : dataA - dataB;
      });
  }, [noticias, busca, categoria, ano, ordem]);

  return (
    <div className="noticias-corpo">
      <Cabecalho />

      <main className="noticias-pagina">
        <section className="noticias-apresentacao">
          <span className="noticias-etiqueta">R.O.P. • INFORMAÇÃO E CONSERVAÇÃO</span>
          <h1>Notícias da fauna e da natureza</h1>
          <p>
            Acompanhe informações sobre animais silvestres, conservação,
            resgates, pesquisas e educação ambiental.
          </p>
        </section>

        <section className="noticias-conteudo" aria-label="Lista de notícias">
          <div className="noticias-filtros">
            <label className="noticias-busca">
              <span>Pesquisar</span>
              <input
                type="search"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquise pelo título ou assunto..."
              />
            </label>

            <label>
              <span>Categoria</span>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {categorias.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>

            <label>
              <span>Ano</span>
              <select value={ano} onChange={(e) => setAno(e.target.value)}>
                {anos.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>

            <label>
              <span>Ordenar</span>
              <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
                <option value="recentes">Mais recentes</option>
                <option value="antigas">Mais antigas</option>
              </select>
            </label>
          </div>

          {carregando && <p className="noticias-mensagem" role="status">Carregando notícias...</p>}

          {!carregando && erro && (
            <div className="noticias-erro" role="alert">
              <p>{erro}</p>
              <button type="button" onClick={() => window.location.reload()}>
                Tentar novamente
              </button>
            </div>
          )}

          {!carregando && !erro && noticias.length === 0 && (
            <p className="noticias-mensagem">Ainda não há notícias cadastradas.</p>
          )}

          {!carregando && !erro && noticias.length > 0 && filtradas.length === 0 && (
            <p className="noticias-mensagem">
              Nenhuma notícia corresponde aos filtros selecionados.
            </p>
          )}

          <div className="noticias-lista">
            {filtradas.map((item) => {
              const imagem = imagemValida(item.imagem);

              return (
                <article className="noticia-card" key={item.id}>
                  {imagem ? (
                    <img className="noticia-card__imagem" src={imagem} alt="" loading="lazy" />
                  ) : (
                    <div className="noticia-card__imagem noticia-card__imagem--vazia">
                      <span>R.O.P.</span>
                    </div>
                  )}

                  <div className="noticia-card__texto">
                    <div className="noticia-card__metadados">
                      <span>{item.categoria}</span>
                      <time>{formatarData(item.data)}</time>
                    </div>

                    <h2>{item.titulo}</h2>

                    {item.resumo && <p>{item.resumo}</p>}
                    {!item.resumo && item.conteudo && (
                      <p>
                        {String(item.conteudo).slice(0, 180)}
                        {String(item.conteudo).length > 180 ? "..." : ""}
                      </p>
                    )}

                    {item.fonte && <small>Fonte: {item.fonte}</small>}

                    {item.link && /^https?:\/\//i.test(String(item.link)) && (
                      <a
                        className="noticia-card__link"
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ler notícia completa ↗
                      </a>
                    )}

                    {!item.link && item.conteudo && (
                      <details className="noticia-card__detalhes">
                        <summary>Continuar lendo</summary>
                        <p>{item.conteudo}</p>
                      </details>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Rodape />
    </div>
  );
}
