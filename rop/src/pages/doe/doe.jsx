import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";

import Cabecalho from "../../componentes/cabecalho/cabecalho.jsx";
import Rodape from "../../componentes/rodape/rodape.jsx";

import "./doe.scss";

const CHAVE_PIX = "bafecf50-5d98-4c11-a246-c0ea6bda7d76";

const CODIGO_PIX =
  "00020126580014BR.GOV.BCB.PIX0136bafecf50-5d98-4c11-a246-c0ea6bda7d765204000053039865802BR5925Guilherme Andre Viana dos6009SAO PAULO62140510biK9LTV80e6304BA0B";

const VALORES = [10, 25, 50, 100];

const DIVISAO = [
  {
    titulo: "Ferramentas e estudos",
    descricao: "Recursos e aprendizado para desenvolver o projeto.",
    percentual: 60,
    classe: "estudos",
  },
  {
    titulo: "Integrantes da equipe",
    descricao: "Divisão entre os estudantes responsáveis pelo trabalho.",
    percentual: 40,
    classe: "equipe",
  },
];

const PERGUNTAS = [
  {
    pergunta: "A R.O.P. é uma organização real?",
    resposta:
      "Não. A R.O.P. é um projeto fictício desenvolvido para um Trabalho de Conclusão de Curso. A organização, os projetos e os números apresentados fazem parte desse cenário acadêmico.",
  },
  {
    pergunta: "Para quem vai a minha contribuição?",
    resposta:
      "O dinheiro é recebido pelo grupo de estudantes que desenvolveu o site. Nenhum valor é repassado a animais, santuários ou organizações ambientais.",
  },
  {
    pergunta: "Preciso contribuir para acessar o site?",
    resposta:
      "Não. A contribuição é totalmente opcional. Você pode conhecer as páginas e explorar o projeto sem realizar qualquer pagamento.",
  },
  {
    pergunta: "O valor escolhido já está no QR Code?",
    resposta:
      "Não. O QR Code e o código Pix desta página não incluem um valor. Depois de abrir o pagamento no aplicativo do banco, preencha o valor escolhido e confira os dados antes de confirmar.",
  },
  {
    pergunta: "A página confirma quando o Pix é pago?",
    resposta:
      "Não. O site apenas apresenta o QR Code e os dados para pagamento. A confirmação da transferência deve ser consultada no aplicativo do seu banco.",
  },
  {
    pergunta: "E se eu fizer um Pix por engano?",
    resposta:
      "Entre em contato com o grupo pelo telefone ou WhatsApp (11) 93087-5221 para conversar sobre a devolução. Esse atendimento é feito diretamente com a equipe.",
  },
];

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatarValor(centavos) {
  return moeda.format(centavos / 100);
}

function converterParaCentavos(texto) {
  const entrada = texto.trim();

  if (!/^\d+(?:[.,]\d{1,2})?$/.test(entrada)) {
    return null;
  }

  const [inteiros, decimais = ""] = entrada.replace(",", ".").split(".");

  const centavos =
    Number(inteiros) * 100 + Number(decimais.padEnd(2, "0"));

  if (!Number.isSafeInteger(centavos)) {
    return null;
  }

  return centavos;
}

function Icone({ tipo, className = "" }) {
  const caminhos = {
    coracao:
      "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
    seta: "M5 12h14m-6-6 6 6-6 6",
    copiar: "M9 9h11v11H9zM15 9V4H4v11h5",
    check: "m5 12 4 4L19 6",
    folha:
      "M20 4C10 2 3 7 5 15c2 8 15 6 15-11ZM5 20 16 9",
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={caminhos[tipo] || caminhos.coracao} />
    </svg>
  );
}

function Doe() {
  const [valorFixo, setValorFixo] = useState(25);
  const [outroValor, setOutroValor] = useState("");
  const [entendeu, setEntendeu] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarPix, setMostrarPix] = useState(false);
  const [copiado, setCopiado] = useState("");
  const [mensagemCopia, setMensagemCopia] = useState("");

  const painelPixRef = useRef(null);
  const campoOutroRef = useRef(null);
  const confirmacaoRef = useRef(null);
  const tempoCopiaRef = useRef(null);

  const centavos =
    valorFixo !== null
      ? valorFixo * 100
      : converterParaCentavos(outroValor);

  const valorValido = centavos !== null && centavos >= 100;

  const valorFormatado = valorValido
    ? formatarValor(centavos)
    : "um valor";

  const valorEstudos = valorValido
    ? Math.round(centavos * 0.6)
    : null;

  const valorEquipe = valorValido
    ? centavos - valorEstudos
    : null;

  useEffect(() => {
    return () => {
      window.clearTimeout(tempoCopiaRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mostrarPix) return;

    const frame = window.requestAnimationFrame(() => {
      const painel = painelPixRef.current;

      if (!painel) return;

      painel.focus({ preventScroll: true });

      const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      painel.scrollIntoView({
        behavior: reduzirMovimento ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [mostrarPix]);

  function limparPagamento() {
    setMostrarPix(false);
    setErro("");
    setCopiado("");
    setMensagemCopia("");
    window.clearTimeout(tempoCopiaRef.current);
  }

  function escolherValor(valor) {
    limparPagamento();
    setValorFixo(valor);
    setOutroValor("");
  }

  function alterarOutroValor(event) {
    limparPagamento();
    setValorFixo(null);
    setOutroValor(event.target.value);
  }

  function alterarConfirmacao(event) {
    limparPagamento();
    setEntendeu(event.target.checked);
  }

  function continuar(event) {
    event.preventDefault();

    if (!valorValido) {
      setErro(
        "Informe pelo menos R$ 1,00. Use até duas casas decimais, como 12,50."
      );
      campoOutroRef.current?.focus();
      return;
    }

    if (!entendeu) {
      setErro(
        "Confirme que entendeu para quem será destinada a contribuição."
      );
      confirmacaoRef.current?.focus();
      return;
    }

    setErro("");
    setMensagemCopia("");
    setMostrarPix(true);
  }

  async function copiar(tipo, texto) {
    window.clearTimeout(tempoCopiaRef.current);
    setCopiado("");
    setMensagemCopia("");

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Cópia automática indisponível");
      }

      await navigator.clipboard.writeText(texto);

      setCopiado(tipo);
      setMensagemCopia(
        tipo === "codigo"
          ? "Código Pix copiado."
          : "Chave Pix copiada."
      );

      tempoCopiaRef.current = window.setTimeout(() => {
        setCopiado("");
        setMensagemCopia("");
      }, 2500);
    } catch {
      setMensagemCopia(
        "Não foi possível copiar automaticamente. Selecione e copie o texto no campo abaixo."
      );
    }
  }

  return (
    <div className="doe-corpo">
      <Cabecalho />

      <main className="doe-main">
        <section className="doe-hero" aria-labelledby="doe-titulo">
          <div className="doe-container doe-hero__grade">
            <div className="doe-hero__conteudo">
              <Link className="doe-voltar" to="/inicio">
                <span aria-hidden="true">←</span>
                Voltar para o início
              </Link>

              <p className="doe-eyebrow">
                APOIE QUEM CONSTRÓI ESSA IDEIA
              </p>

              <h1 id="doe-titulo">
                Uma ideia ganha vida com{" "}
                <span>gente que acredita.</span>
              </h1>

              <p className="doe-hero__descricao">
                A R.O.P. nasceu no nosso TCC. Se você gostou
                do projeto, pode contribuir voluntariamente
                com os estudantes que estão por trás dele.
              </p>

              <a href="#contribuir" className="doe-btn doe-btn--principal">
                Apoiar o projeto
                <Icone tipo="seta" />
              </a>

              <div className="doe-hero__notas">
                <span>
                  <Icone tipo="check" />
                  Contribuição opcional
                </span>

                <span>
                  <Icone tipo="check" />
                  Pagamento único
                </span>
              </div>
            </div>

            <div className="doe-hero__visual">
              <img
                src="/assets/img/pages/inicio/apadrinhe/onca.png"
                alt="Filhote de onça-pintada entre a vegetação"
              />

              <div className="doe-hero__sombra" />

              <div className="doe-hero__legenda">
                <span>R.O.P. — RESTAURANDO O PARAÍSO</span>
                <p>Uma inspiração na natureza.</p>
                <small>Um projeto criado por estudantes.</small>
              </div>

              <span className="doe-hero__selo">
                <Icone tipo="folha" />
                PROJETO ACADÊMICO
              </span>
            </div>
          </div>
        </section>

        <div className="doe-container">
          <aside className="doe-aviso" aria-labelledby="doe-aviso-titulo">
            <span className="doe-aviso__icone" aria-hidden="true">
              i
            </span>

            <div>
              <h2 id="doe-aviso-titulo">
                A organização é fictícia. A contribuição é real.
              </h2>

              <p>
                O valor vai para o grupo de estudantes que
                desenvolveu este site. Não é destinado a animais,
                santuários ou organizações ambientais.
              </p>
            </div>
          </aside>

          <section
            id="contribuir"
            className="doe-contribuir"
            aria-labelledby="doe-contribuir-titulo"
          >
            <div className="doe-secao-topo">
              <p className="doe-eyebrow">FAÇA PARTE DO PROJETO</p>

              <h2 id="doe-contribuir-titulo">
                Seu apoio faz diferença para a equipe.
              </h2>

              <p>
                Escolha um valor e confira os dados para contribuir
                pelo Pix.
              </p>
            </div>

            <div className="doe-grade">
              <div className="doe-cartao doe-formulario">
                <div className="doe-cartao__topo">
                  <span className="doe-cartao__icone">
                    <Icone tipo="coracao" />
                  </span>

                  <div>
                    <h3>Escolha sua contribuição</h3>
                    <p>Um gesto voluntário, sem cobrança recorrente.</p>
                  </div>
                </div>

                <form onSubmit={continuar} noValidate>
                  <fieldset className="doe-valores">
                    <legend>Quanto você deseja contribuir?</legend>

                    <div className="doe-valores__grade">
                      {VALORES.map((valor) => (
                        <button
                          key={valor}
                          type="button"
                          aria-pressed={valorFixo === valor}
                          onClick={() => escolherValor(valor)}
                        >
                          <span>R$</span>
                          <strong>{valor}</strong>
                          <small>
                            {valorFixo === valor
                              ? "Selecionado"
                              : "Selecionar"}
                          </small>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <label
                    htmlFor="doe-outro-valor"
                    className="doe-label"
                  >
                    Ou informe outro valor
                  </label>

                  <div className="doe-campo-valor">
                    <span aria-hidden="true">R$</span>

                    <input
                      id="doe-outro-valor"
                      ref={campoOutroRef}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="Ex.: 12,50"
                      maxLength={12}
                      value={outroValor}
                      onChange={alterarOutroValor}
                      aria-describedby="doe-valor-ajuda"
                    />
                  </div>

                  <p id="doe-valor-ajuda" className="doe-ajuda">
                    A partir de R$ 1,00. Você pode usar centavos.
                  </p>

                  <label className="doe-confirmacao">
                    <input
                      ref={confirmacaoRef}
                      type="checkbox"
                      checked={entendeu}
                      onChange={alterarConfirmacao}
                    />

                    <span>
                      Entendo que a R.O.P. é fictícia e que minha
                      contribuição será destinada aos estudantes
                      responsáveis pelo site, e não aos animais.
                    </span>
                  </label>

                  {erro && (
                    <p className="doe-erro" role="alert">
                      {erro}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="doe-btn doe-btn--principal doe-btn--largo"
                  >
                    {valorValido
                      ? `Continuar com ${valorFormatado}`
                      : "Continuar para o Pix"}
                    <Icone tipo="seta" />
                  </button>

                  <p className="doe-formulario__nota">
                    Continuar apenas exibe os dados do Pix.
                    Nenhuma cobrança é feita pelo site.
                  </p>
                </form>

                {mostrarPix && (
                  <section
                    ref={painelPixRef}
                    className="doe-pix"
                    tabIndex={-1}
                    aria-labelledby="doe-pix-titulo"
                  >
                    <p className="doe-eyebrow">DADOS PARA PAGAMENTO</p>

                    <h3 id="doe-pix-titulo">
                      Continue no aplicativo do seu banco
                    </h3>

                    <p className="doe-pix__descricao">
                      Escaneie o QR Code ou copie o código Pix.
                      No banco, informe o valor de{" "}
                      <strong>{valorFormatado}</strong>.
                    </p>

                    <div className="doe-pix__valor">
                      <span>Valor escolhido</span>
                      <strong>{valorFormatado}</strong>
                      <small>
                        Preencha este valor no aplicativo do banco.
                      </small>
                    </div>

                    <div
                      className="doe-qr"
                      role="img"
                      aria-label="QR Code Pix para contribuir com a equipe"
                    >
                      <QRCodeSVG
                        value={CODIGO_PIX}
                        size={208}
                        level="M"
                      />
                    </div>

                    <ol className="doe-passos">
                      <li>Abra a área Pix do seu banco.</li>
                      <li>Escaneie ou cole o código abaixo.</li>
                      <li>
                        Informe {valorFormatado} e confira o
                        destinatário antes de confirmar.
                      </li>
                    </ol>

                    <button
                      type="button"
                      className="doe-btn doe-btn--principal doe-btn--largo"
                      onClick={() => copiar("codigo", CODIGO_PIX)}
                    >
                      <Icone
                        tipo={copiado === "codigo" ? "check" : "copiar"}
                      />
                      {copiado === "codigo"
                        ? "Código copiado!"
                        : "Copiar código Pix"}
                    </button>

                    <label
                      className="doe-label"
                      htmlFor="doe-codigo-pix"
                    >
                      Pix Copia e Cola
                    </label>

                    <textarea
                      id="doe-codigo-pix"
                      className="doe-codigo"
                      value={CODIGO_PIX}
                      readOnly
                      rows={4}
                      spellCheck={false}
                      onFocus={(event) => event.target.select()}
                    />

                    <label
                      className="doe-label"
                      htmlFor="doe-chave-pix"
                    >
                      Chave Pix
                    </label>

                    <input
                      id="doe-chave-pix"
                      className="doe-chave"
                      value={CHAVE_PIX}
                      readOnly
                      onFocus={(event) => event.target.select()}
                    />

                    <button
                      type="button"
                      className="doe-btn doe-btn--contorno doe-btn--largo"
                      onClick={() => copiar("chave", CHAVE_PIX)}
                    >
                      <Icone
                        tipo={copiado === "chave" ? "check" : "copiar"}
                      />
                      {copiado === "chave"
                        ? "Chave copiada!"
                        : "Copiar somente a chave"}
                    </button>

                    <p
                      className="doe-copia-status"
                      role="status"
                      aria-live="polite"
                    >
                      {mensagemCopia}
                    </p>

                    <p className="doe-pix__nota">
                      O site não acompanha nem confirma a
                      transferência. Consulte o comprovante
                      no seu banco.
                    </p>
                  </section>
                )}
              </div>

              <aside
                className="doe-transparencia"
                aria-labelledby="doe-destino-titulo"
              >
                <div className="doe-cartao">
                  <p className="doe-eyebrow">TRANSPARÊNCIA</p>

                  <h3 id="doe-destino-titulo">
                    Para onde vai o apoio?
                  </h3>

                  <p className="doe-texto">
                    Esta é a divisão informada pela equipe
                    para as contribuições recebidas.
                  </p>

                  <div className="doe-barra" aria-hidden="true">
                    {DIVISAO.map((item) => (
                      <span
                        key={item.classe}
                        className={item.classe}
                        style={{ width: `${item.percentual}%` }}
                      />
                    ))}
                  </div>

                  <ul className="doe-divisao">
                    {DIVISAO.map((item, indice) => (
                      <li key={item.classe}>
                        <span
                          className={`doe-divisao__ponto ${item.classe}`}
                          aria-hidden="true"
                        />

                        <div>
                          <div className="doe-divisao__titulo">
                            <h4>{item.titulo}</h4>
                            <strong>{item.percentual}%</strong>
                          </div>

                          <p>{item.descricao}</p>

                          {valorValido && (
                            <span className="doe-divisao__valor">
                              {formatarValor(
                                indice === 0
                                  ? valorEstudos
                                  : valorEquipe
                              )}{" "}
                              do valor escolhido
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="doe-recebedor">
                    <h4>Quem recebe?</h4>

                    <p>
                      Os estudantes que projetaram e programaram
                      este site como Trabalho de Conclusão de
                      Curso.
                    </p>
                  </div>
                </div>

                <div className="doe-apoio">
                  <Icone tipo="folha" />

                  <h3>Seu interesse também conta.</h3>

                  <p>
                    Explorar o site, conhecer a proposta e
                    compartilhar o trabalho já são formas
                    de apoiar nossa trajetória.
                  </p>

                  <Link to="/inicio">
                    Conhecer o projeto
                    <Icone tipo="seta" />
                  </Link>
                </div>
              </aside>
            </div>
          </section>

          <section className="doe-faq" aria-labelledby="doe-faq-titulo">
            <div className="doe-faq__introducao">
              <p className="doe-eyebrow">TUDO ÀS CLARAS</p>
              <h2 id="doe-faq-titulo">Antes de contribuir.</h2>

              <p>
                Reunimos as principais respostas para você
                decidir com tranquilidade.
              </p>
            </div>

            <div className="doe-faq__lista">
              {PERGUNTAS.map((item) => (
                <details key={item.pergunta}>
                  <summary>
                    {item.pergunta}
                    <span aria-hidden="true">+</span>
                  </summary>

                  <p>{item.resposta}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="doe-final">
            <span className="doe-final__icone">
              <Icone tipo="coracao" />
            </span>

            <div>
              <h2>Obrigado por conhecer a nossa ideia.</h2>
              <p>
                Cada visita faz parte da história que estamos
                construindo como estudantes.
              </p>
            </div>

            <Link to="/inicio" className="doe-btn doe-btn--contorno">
              Explorar a R.O.P.
              <Icone tipo="seta" />
            </Link>
          </section>
        </div>
      </main>

      <Rodape />
    </div>
  );
}

export default Doe;