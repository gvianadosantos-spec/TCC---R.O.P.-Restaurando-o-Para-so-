import "./inicio.scss";
import { useEffect, useRef, useState } from "react";
import Cabecalho from "../../componentes/cabecalho/cabecalho.jsx";
import Rodape from "../../componentes/rodape/rodape.jsx"
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";

const slides = [
  {
    image: "/assets/img/pages/inicio/carrosel/imagem1.png",
    eyebrow: "FAUNA BRASILEIRA",
    title: "Proteger a fauna começa por conhecer quem vive ao nosso lado.",
    button: "Ver espécies",
    href: "/especies",
  },
  {
    image: "/assets/img/pages/inicio/carrosel/imagem2.png",
    eyebrow: "PROJETOS EM CAMPO",
    title: "Pesquisa, monitoramento e cuidado com os animais na natureza.",
    button: "Ver projetos",
    href: "/inicio#projetos",
  },
  {
    image: "/assets/img/pages/inicio/carrosel/imagem3.png",
    eyebrow: "EM BUSCA DA CONEXÃO COM A BIODIVERSIDADE AO NOSSO REDOR",
    title: "Vamos juntos construir uma relação harmônica e valorizar a fauna livre?",
    button: "Visitar",
    href: "/inicio#projetos",
  },
  {
    image: "/assets/img/pages/inicio/carrosel/imagem4.png",
    eyebrow: "CONHECE A AMPARA STORE?",
    title: "Produtos com propósito! Toda a renda é revertida para os nossos projetos. Compre e ajude a fauna brasileira.",
    button: "Conhecer a loja",
    href: "/loja",
  },
];

const impactos = [
  { numero: "+1.400", descricao: "animais silvestres diretamente impactados" },
  { numero: "4M", descricao: "de pessoas tocadas por campanhas de conscientização em 2023" },
  { numero: "+50 mil", descricao: "pessoas diretamente impactadas com ações de educação" },
  { numero: "8", descricao: "ODS da ONU contempladas em nossas ações" },
];

const projetos = [
  {
    imagem: "/assets/img/pages/inicio/projetos/image1.png",
    categoria: "EDUCAÇÃO",
    titulo: "Binóculos da Liberdade",
    descricao: "O projeto busca a educação e sensibilização, para que valorizemos os animais em seu habitat natural, respeitando seus comportamentos característicos e desempenhando seus papéis ecológicos.",
    alt: "Arara verde sobre um galho na floresta",
  },
  {
    imagem: "/assets/img/pages/inicio/projetos/image2.png",
    categoria: "BEM-ESTAR",
    titulo: "Mantenedor da Fauna",
    descricao: "Abrigamos animais silvestres que não podem retornar à natureza: onças, araras, tucanos, corujas e papagaios resgatados do tráfico e de acidentes. Este projeto visa promover o bem-estar dos animais que dependem totalmente dos nossos cuidados.",
    alt: "Onça-pintada cercada por vegetação",
  },
  {
    imagem: "/assets/img/pages/inicio/projetos/image3.png",
    categoria: "RESGATE",
    titulo: "Base de Atendimento Ampara Pantanal (BAAP)",
    descricao: "Criada para amparar a fauna no Pantanal Norte após os grandes incêndios de 2020. Esta área de 100 ha de vegetação nativa conta com recintos para reabilitação e soltura de animais silvestres e toda a estrutura para atendimento emergencial veterinário.",
    alt: "Vista aérea de uma área de conservação no Pantanal",
  },
  {
    imagem: "/assets/img/pages/inicio/projetos/image4.png",
    categoria: "CONSERVAÇÃO",
    titulo: "Coexistência humano-fauna",
    descricao: "O projeto busca soluções para a proteção de espécies como onças, tamanduás, gaviões e corujas, que sofrem com ameaças como choque em redes elétricas, atropelamentos, conflitos e tráfico.",
    alt: "Tamanduá-bandeira caminhando em campo aberto",
  },
  {
    imagem: "/assets/img/pages/inicio/projetos/image5.png",
    categoria: "SOLTURA",
    titulo: "De volta para casa",
    descricao: "O Projeto De Volta para a Casa visa o retorno de animais silvestres para a natureza! Sejam oriundos do tráfico, resgatados ou de cativeiro, como mutuns, araras, bugios e tamanduás.",
    alt: "Arara voando sobre a floresta",
  },
  {
    imagem: "/assets/img/pages/inicio/projetos/image6.png",
    categoria: "CONSERVAÇÃO",
    titulo: "Life print — Fauna",
    descricao: "O projeto visa captar recursos para investir no bem-estar de animais que estão em reabilitação e também em ações de conservação com o objetivo de reintrodução à vida livre.",
    alt: "Pássaro sobre um galho com uma cidade ao fundo",
  },
];

const animaisApadrinhamento = [
  {
    id: 1,
    nome: "Guarani",
    especie: "ONÇA-PINTADA",
    descricao: "Guarani é um filhote curioso que, nesta história fictícia, foi acolhido após perder o contato com sua mãe. Ele recebe cuidados especializados e oportunidades de explorar um espaço seguro enquanto sua recuperação é acompanhada.",
    imagem: "/assets/img/pages/inicio/animais/animal01.webp",
    posicao: "52% 50%",
  },
  {
    id: 2,
    nome: "Rubi",
    especie: "LOBO-GUARÁ",
    descricao: "Rubi chegou ao centro de cuidados depois de ser encontrado próximo a uma rodovia. Com rotina tranquila, acompanhamento e alimentação adequada, ele recupera a confiança aos poucos. Sua história faz parte da simulação do R.O.P.",
    imagem: "/assets/img/pages/inicio/animais/animal02.webp",
    posicao: "53% 45%",
  },
  {
    id: 3,
    nome: "Tito",
    especie: "TAMANDUÁ-BANDEIRA",
    descricao: "Tito é um tamanduá-bandeira que, na narrativa fictícia do projeto, foi resgatado de uma área afetada por queimadas. Hoje recebe atenção veterinária e permanece em um ambiente pensado para seus hábitos naturais.",
    imagem: "/assets/img/pages/inicio/animais/animal03.webp",
    posicao: "50% 45%",
  },
  {
    id: 4,
    nome: "Nina",
    especie: "ANTA",
    descricao: "Nina é uma anta tranquila que foi encontrada desorientada após mudanças no ambiente onde vivia. Na história do TCC, ela passa por avaliações e cuidados diários enquanto a equipe planeja as próximas etapas do acolhimento.",
    imagem: "/assets/img/pages/inicio/animais/animal04.webp",
    posicao: "52% 48%",
  },
  {
    id: 5,
    nome: "Bento",
    especie: "TATU-BOLA",
    descricao: "Bento gosta de explorar discretamente os cantos do seu espaço. Nesta história ilustrativa, ele chegou depois de ser encontrado em uma região de passagem de veículos e agora vive sob observação e cuidados.",
    imagem: "/assets/img/pages/inicio/animais/animal05.webp",
    posicao: "50% 52%",
  },
  {
    id: 6,
    nome: "Sol",
    especie: "MICO-LEÃO-DOURADO",
    descricao: "Sol é um mico-leão-dourado cheio de energia. Na narrativa fictícia do R.O.P., ele recebe enriquecimento ambiental e acompanhamento para estimular comportamentos naturais e garantir seu bem-estar.",
    imagem: "/assets/img/pages/inicio/animais/animal06.webp",
    posicao: "48% 50%",
  },
  {
    id: 7,
    nome: "Mel",
    especie: "BICHO-PREGUIÇA",
    descricao: "Mel foi acolhida após a queda de uma árvore próxima a uma área urbana, segundo a história criada para o TCC. Em um local calmo, ela descansa, se alimenta e é acompanhada até recuperar sua rotina.",
    imagem: "/assets/img/pages/inicio/animais/animal07.webp",
    posicao: "48% 45%",
  },
  {
    id: 8,
    nome: "Amora",
    especie: "QUATI",
    descricao: "Amora é uma filhote curiosa e observadora. Em sua história fictícia, foi levada para avaliação depois de ser encontrada sozinha e agora recebe cuidados em um ambiente apropriado para um animal silvestre jovem.",
    imagem: "/assets/img/pages/inicio/animais/animal08.webp",
    posicao: "49% 45%",
  },
  {
    id: 9,
    nome: "Jaci",
    especie: "JAGUATIRICA",
    descricao: "Jaci é uma jaguatirica atenta ao que acontece ao redor. No cenário fictício do projeto, chegou após ser encontrada em uma área de risco e permanece em acompanhamento especializado para assegurar seu bem-estar.",
    imagem: "/assets/img/pages/inicio/animais/animal09.webp",
    posicao: "53% 49%",
  },
  {
    id: 10,
    nome: "Flor",
    especie: "JABUTI-PIRANGA",
    descricao: "Flor é uma jabuti-piranga que adora ficar entre plantas e pequenas áreas ensolaradas. Na história ilustrativa do R.O.P., ela recebe cuidados depois de ser entregue ao centro por moradores da região.",
    imagem: "/assets/img/pages/inicio/animais/animal10.webp",
    posicao: "50% 45%",
  },
  {
    id: 11,
    nome: "Vento",
    especie: "EMA",
    descricao: "Vento é uma ema de passos rápidos que, nesta simulação, foi acolhida após um acidente em uma cerca. Ela recebe atenção veterinária e permanece em uma área ampla para recuperar seus movimentos com segurança.",
    imagem: "/assets/img/pages/inicio/animais/animal11.webp",
    posicao: "47% 52%",
  },
  {
    id: 12,
    nome: "Serena",
    especie: "SERIEMA",
    descricao: "Serena é uma seriema que costuma observar tudo ao seu redor. Na história fictícia, ela passou por um período de reabilitação e agora vive em um espaço tranquilo, com estímulos adequados à espécie.",
    imagem: "/assets/img/pages/inicio/animais/animal12.webp",
    posicao: "49% 50%",
  },
];

const santuarios = [
  {
    id: "eden-das-asas",
    nome: "Éden das Asas",
    grupo: "AVES",
    descricao: "Reabilitação e soltura de aves silvestres.",
    detalhe: "Neste santuário fictício, aves que necessitam de acolhimento passariam por avaliação veterinária, cuidados específicos e reabilitação. Quando possível e seguro, a proposta prevê o retorno à natureza.",
    logo: "/assets/img/pages/inicio/santuarios/logo1.png",
  },
  {
    id: "refugio-da-selva",
    nome: "Refúgio da Selva",
    grupo: "MAMÍFEROS",
    descricao: "Cuidado de felinos, antas e primatas silvestres.",
    detalhe: "O Refúgio da Selva representa, no TCC, um espaço para o acolhimento de mamíferos silvestres. A proposta inclui cuidados veterinários, enriquecimento ambiental e acompanhamento individualizado.",
    logo: "/assets/img/pages/inicio/santuarios/logo2.png",
  },
  {
    id: "oasis-das-escamas",
    nome: "Oásis das Escamas",
    grupo: "RÉPTEIS",
    descricao: "Reabilitação de jacarés, cobras e lagartos.",
    detalhe: "Nesta unidade ilustrativa, répteis resgatados receberiam cuidados em recintos apropriados, com atenção à temperatura, à alimentação e à recuperação de comportamentos naturais.",
    logo: "/assets/img/pages/inicio/santuarios/logo3.png",
  },
  {
    id: "charco-umido",
    nome: "Charco Úmido",
    grupo: "ANFÍBIOS",
    descricao: "Conservação de sapos e pererecas.",
    detalhe: "O Charco Úmido é um santuário fictício dedicado a anfíbios, com ambientes que representam as condições de umidade e abrigo necessárias ao cuidado e à preservação desses animais.",
    logo: "/assets/img/pages/inicio/santuarios/logo4.png",
  },
  {
    id: "fonte-das-aguas",
    nome: "Fonte das Águas",
    grupo: "PEIXES",
    descricao: "Recuperação de peixes e quelônios.",
    detalhe: "A Fonte das Águas ilustra um espaço de cuidado de animais aquáticos, com monitoramento da qualidade da água e condições adequadas de recuperação e bem-estar.",
    logo: "/assets/img/pages/inicio/santuarios/logo5.png",
  },
  {
    id: "jardim-das-cores",
    nome: "Jardim das Cores",
    grupo: "INVERTEBRADOS",
    descricao: "Conservação de borboletas, abelhas e moluscos.",
    detalhe: "O Jardim das Cores representa ações educativas e de conservação de invertebrados, ressaltando a importância da polinização, da biodiversidade e da proteção de seus habitats.",
    logo: "/assets/img/pages/inicio/santuarios/logo6.png",
  },
];

const parceiros = [
  {
    id: "cetas",
    nome: "CETAS",
    categoria: "IBAMA",
    descricao: "Centros de Triagem de Animais Silvestres do IBAMA: recebem animais resgatados, apreendidos ou entregues voluntariamente, realizam triagem, tratamento, recuperação e reabilitação e, quando possível, a soltura na natureza.",
    logo: "/assets/img/pages/inicio/parceiros/cetas.webp",
  },
  {
    id: "gremar",
    nome: "Instituto Gremar",
    categoria: "RESGATE & MARINHOS",
    descricao: "ONG que atua com resgate, atendimento veterinário e reabilitação de animais silvestres e marinhos, além de monitoramento e educação ambiental.",
    logo: "/assets/img/pages/inicio/parceiros/gremar.webp",
  },
  {
    id: "pet-terapia",
    nome: "Pet Terapia da UFPel",
    categoria: "TERAPIA ASSISTIDA",
    descricao: "Projeto universitário que desenvolve intervenções assistidas por animais em instituições de saúde e educação, envolvendo profissionais de diferentes áreas.",
    logo: "/assets/img/pages/inicio/parceiros/pet-terapia.webp",
  },
  {
    id: "inataa",
    nome: "INATAA",
    categoria: "TERAPIA POR ANIMAIS",
    descricao: "Instituto Nacional de Ações e Terapia Assistida por Animais: realiza atividades e terapias com animais, principalmente cães, buscando benefícios físicos, emocionais e sociais.",
    logo: "/assets/img/pages/inicio/parceiros/inataa.webp",
  },
  {
    id: "escola-verde",
    nome: "Projeto Escola Verde",
    categoria: "EDUCAÇÃO AMBIENTAL",
    descricao: "Leva educação ambiental para escolas por meio do plantio de árvores nativas, atividades educativas e participação dos alunos no cuidado com a biodiversidade.",
    logo: "/assets/img/pages/inicio/parceiros/escola-verde.webp",
  },
  {
    id: "cidadao-legal",
    nome: "Projeto Cidadão Legal",
    categoria: "PRAIA GRANDE",
    descricao: "Ensina crianças sobre cuidado com animais, descarte correto de resíduos, reciclagem, respeito à natureza e hábitos sustentáveis.",
    logo: "/assets/img/pages/inicio/parceiros/cidadao-legal.webp",
  },
  {
    id: "com-vida",
    nome: "Com-Vida",
    categoria: "ESCOLAS BRASILEIRAS",
    descricao: "Iniciativa presente em escolas brasileiras que estimula estudantes a participar de ações sobre clima, biodiversidade, riscos ambientais e qualidade de vida.",
    logo: "/assets/img/pages/inicio/parceiros/com-vida.webp",
  },
];

const TEMPO_SLIDE = 6000;

function Inicio() {
  const [atual, setAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const tempoDecorrido = useRef(0);
  const impactosRef = useRef(null);
  const [impactosVisiveis, setImpactosVisiveis] = useState(false);
  const apresentacaoRef = useRef(null);
  const [apresentacaoVisivel, setApresentacaoVisivel] = useState(false);
  const projetosRef = useRef(null);
  const [projetosVisiveis, setProjetosVisiveis] = useState(false);
  const apadrinheRef = useRef(null);
  const [apadrinheVisivel, setApadrinheVisivel] = useState(false);
  const animaisRef = useRef(null);
  const [animaisVisiveis, setAnimaisVisiveis] = useState(false);
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const botaoFecharRef = useRef(null);
  const focoAnteriorRef = useRef(null);
  const santuariosRef = useRef(null);
  const [santuariosVisiveis, setSantuariosVisiveis] = useState(false);
  const [santuarioSelecionado, setSantuarioSelecionado] = useState(null);
  const botaoFecharSantuarioRef = useRef(null);
  const focoAnteriorSantuarioRef = useRef(null);
  const parceirosRef = useRef(null);
  const [parceirosVisiveis, setParceirosVisiveis] = useState(false);

  function abrirAnimal(animal) {
    focoAnteriorRef.current = document.activeElement;
    setAnimalSelecionado(animal);
  }

  function fecharAnimal() {
    setAnimalSelecionado(null);
    window.requestAnimationFrame(() => focoAnteriorRef.current?.focus?.());
  }

  function abrirSantuario(santuario) {
    focoAnteriorSantuarioRef.current = document.activeElement;
    setSantuarioSelecionado(santuario);
  }

  function fecharSantuario() {
    setSantuarioSelecionado(null);
    window.requestAnimationFrame(() => focoAnteriorSantuarioRef.current?.focus?.());
  }

  function irPara(indice) {
    tempoDecorrido.current = 0;
    setProgresso(0);
    setAtual((indice + slides.length) % slides.length);
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
    const intervalo = setInterval(() => {
      const agora = Date.now();
      tempoDecorrido.current += agora - ultimaAtualizacao;
      ultimaAtualizacao = agora;
      if (tempoDecorrido.current >= TEMPO_SLIDE) {
        tempoDecorrido.current = 0;
        setProgresso(0);
        setAtual((i) => (i + 1) % slides.length);
        return;
      }
      setProgresso((tempoDecorrido.current / TEMPO_SLIDE) * 100);
    }, 50);
    return () => clearInterval(intervalo);
  }, [pausado]);

  useEffect(() => {
    const elemento = impactosRef.current;
    if (!elemento) return;
    if (!("IntersectionObserver" in window)) {
      setImpactosVisiveis(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImpactosVisiveis(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elemento = apresentacaoRef.current;
    if (!elemento) return;
    if (!("IntersectionObserver" in window)) {
      setApresentacaoVisivel(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setApresentacaoVisivel(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -45px 0px" }
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const elemento = projetosRef.current;
    if (!elemento) return;
    if (!("IntersectionObserver" in window)) {
      setProjetosVisiveis(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setProjetosVisiveis(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -45px 0px" }
    );
    observer.observe(elemento);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elemento = apadrinheRef.current;
    if (!elemento) return;
    if (!("IntersectionObserver" in window)) {
      setApadrinheVisivel(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setApadrinheVisivel(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elemento = animaisRef.current;
    if (!elemento) return;
    if (!("IntersectionObserver" in window)) {
      setAnimaisVisiveis(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimaisVisiveis(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -45px 0px" }
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!animalSelecionado) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => botaoFecharRef.current?.focus());

    function aoPressionarTecla(event) {
      if (event.key === "Escape") {
        fecharAnimal();
        return;
      }
      if (event.key === "Tab") {
        const painel = document.querySelector(".animais__modal");
        if (!painel) return;
        const focaveis = Array.from(
          painel.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
        );
        if (!focaveis.length) return;
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        if (event.shiftKey && document.activeElement === primeiro) {
          event.preventDefault();
          ultimo.focus();
        } else if (!event.shiftKey && document.activeElement === ultimo) {
          event.preventDefault();
          primeiro.focus();
        }
      }
    }

    document.addEventListener("keydown", aoPressionarTecla);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [animalSelecionado]);


  useEffect(() => {
    const elemento = santuariosRef.current;
    if (!elemento) return;
    if (!("IntersectionObserver" in window)) {
      setSantuariosVisiveis(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSantuariosVisiveis(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -45px 0px" }
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!santuarioSelecionado) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => botaoFecharSantuarioRef.current?.focus());

    function aoPressionarTecla(event) {
      if (event.key === "Escape") {
        fecharSantuario();
        return;
      }
      if (event.key !== "Tab") return;
      const painel = document.querySelector(".santuarios__modal");
      if (!painel) return;
      const focaveis = Array.from(
        painel.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
      );
      if (!focaveis.length) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", aoPressionarTecla);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [santuarioSelecionado]);

  useEffect(() => {
    const elemento = parceirosRef.current;
    if (!elemento) return;
    if (!("IntersectionObserver" in window)) {
      setParceirosVisiveis(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setParceirosVisiveis(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -45px 0px" }
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="corpo-inicio">
      <Cabecalho />
      <main className="topo">
        <section
          className="inicio"
          aria-label="Destaques do R.O.P."
          aria-roledescription="carrossel"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onFocusCapture={() => setPausado(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setPausado(false);
            }
          }}
        >
          {slides.map((slide, indice) => (
            <div
              key={indice}
              className={`inicio__slide ${indice === atual ? "is-active" : ""}`}
              aria-hidden={indice !== atual}
              role="group"
              aria-roledescription="slide"
              aria-label={`${indice + 1} de ${slides.length}`}
            >
              <img
                src={slide.image}
                alt=""
                className="inicio__image-bg"
                aria-hidden="true"
              />
              <img
                src={slide.image}
                alt=""
                className="inicio__image"
                draggable="false"
              />
              <div className="inicio__shade" />
              <div className="inicio__content">
                <p className="inicio__eyebrow">{slide.eyebrow}</p>
                <h1 className="inicio__title">{slide.title}</h1>
                <a
                  href={slide.href}
                  className="inicio__button"
                  tabIndex={indice === atual ? 0 : -1}
                >
                  {slide.button} <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ))}
          <div className="inicio__controls">
            <div className="inicio__dots">
              {slides.map((slide, indice) => (
                <button
                  key={indice}
                  type="button"
                  className={`inicio__dot ${indice === atual ? "is-active" : ""}`}
                  aria-label={`Ir para slide ${indice + 1}`}
                  aria-current={indice === atual ? "true" : undefined}
                  onClick={() => irPara(indice)}
                >
                  {indice === atual && (
                    <span
                      className="inicio__progress"
                      style={{ width: `${progresso}%` }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="inicio__arrows">
              <button type="button" onClick={anterior} aria-label="Slide anterior">‹</button>
              <button type="button" onClick={proximo} aria-label="Próximo slide">›</button>
            </div>
          </div>
        </section>
        <div
          id="impactos"
          ref={impactosRef}
          className={`impactos ${impactosVisiveis ? "visivel" : ""}`}
        >
          <div className="impactos__container">
            <div className="impactos__cabecalho">
              <p className="impactos__subtitulo">NOSSOS IMPACTOS</p>
              <h2 className="impactos__titulo">
                Cada número é uma vida, uma consciência desperta.
              </h2>
            </div>
            <div className="impactos__painel">
              {impactos.map((item, index) => (
                <div
                  className="impactos__item"
                  key={index}
                  style={{ "--delay": `${index * 0.15}s` }}
                >
                  <strong className="impactos__numero">{item.numero}</strong>
                  <p className="impactos__descricao">{item.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          id="apresentacao"
          ref={apresentacaoRef}
          className={`apresentacao ${apresentacaoVisivel ? "visivel" : ""}`}
        >
          <div className="apresentacao__container">
            <div className="apresentacao__visual">
              <div className="apresentacao__imagem">
                <img
                  src="/assets/img/pages/inicio/mato.png"
                  alt="Mata brasileira com árvores e vegetação verde"
                  loading="lazy"
                />
              </div>
              <div className="apresentacao__selo">
                <strong>R.O.P.</strong>
                <span>RESTAURANDO O PARAÍSO</span>
              </div>
            </div>
            <div className="apresentacao__conteudo">
              <div className="apresentacao__cabecalho">
                <p className="apresentacao__subtitulo">APRESENTAÇÃO</p>
                <h2 className="apresentacao__titulo">
                  Cuidamos da fauna que perdeu seu lar — e devolvemos o paraíso.
                </h2>
              </div>
              <div className="apresentacao__textos">
                <p>
                  Nossa proposta é cuidar de animais silvestres necessitados que
                  perderam seus habitats por causas naturais ou humanas. Juntamente
                  com órgãos parceiros — como <strong>CETAS</strong> e{" "}
                  <strong>Instituto Gremar</strong> — ajudamos a recuperar esses
                  animais e, quando estão prontos, os devolvemos à natureza.
                </p>
                <p>
                  Quando o habitat não é adequado, eles seguem para santuários,
                  onde vivem tranquilamente; e, quando necessário, mantemos o animal
                  em cuidado prolongado. Com animais tratados e em parceria com
                  órgãos de cuidado a pessoas com deficiência, participamos do
                  atendimento aos pacientes, com o auxílio de animais e profissionais
                  aptos ao trabalho conjunto.
                </p>
                <p>
                  Oferecemos também aulas voltadas ao cuidado com a vida e a natureza,
                  com nossos parceiros <strong>Projeto Escola Verde</strong>,{" "}
                  <strong>Projeto Cidadão Legal</strong> e <strong>Com-Vida</strong>,
                  para ensinar aos alunos a cuidar da fauna brasileira que tanto amamos.
                </p>
              </div>
              <div className="apresentacao__cards">
                <div className="apresentacao__card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="9" cy="7" r="3" />
                    <path d="M3 20v-2a6 6 0 0 1 12 0v2" />
                    <path d="M17 5a3 3 0 0 1 0 6" />
                    <path d="M19 20v-2a6 6 0 0 0-2-4.5" />
                  </svg>
                  <span>IDADE</span>
                  <strong>14+ anos</strong>
                </div>
                <div className="apresentacao__card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
                  </svg>
                  <span>GÊNERO</span>
                  <strong>Todos</strong>
                </div>
                <div className="apresentacao__card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m12 2 2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2Z" />
                    <path d="m19 17 .8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z" />
                  </svg>
                  <span>CLASSE SOCIAL</span>
                  <strong>Todas as classes</strong>
                </div>
                <div className="apresentacao__card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18" />
                    <path d="M12 3a15 15 0 0 1 0 18" />
                    <path d="M12 3a15 15 0 0 0 0 18" />
                  </svg>
                  <span>REGIÃO</span>
                  <strong>Brasil / Sul-Americana</strong>
                </div>
              </div>
              <HashLink smooth to="/inicio#parceiros" className="apresentacao__botao">
                Conheça nossos parceiros
                <span aria-hidden="true">→</span>
              </HashLink>
            </div>
          </div>
        </div>
        <div
          id="projetos"
          ref={projetosRef}
          className={`projetos ${projetosVisiveis ? "visivel" : ""}`}
        >
          <div className="projetos__container">
            <div className="projetos__cabecalho">
              <div className="projetos__chamada">
                <p className="projetos__subtitulo">NOSSA ATUAÇÃO</p>
                <h2 className="projetos__titulo">Projetos</h2>
              </div>
              <p className="projetos__aviso">
                Os projetos apresentados são fictícios e foram criados exclusivamente
                para ilustrar as propostas do R.O.P. neste Trabalho de Conclusão de
                Curso (TCC). Não representam iniciativas reais.
              </p>
            </div>
            <div className="projetos__grade">
              {projetos.map((projeto, index) => (
                <article
                  className="projetos__card"
                  key={projeto.titulo}
                  style={{ "--delay": `${index * 0.1}s` }}
                >
                  <div className="projetos__imagem">
                    <img src={projeto.imagem} alt={projeto.alt} loading="lazy" />
                    <span className="projetos__categoria">{projeto.categoria}</span>
                  </div>
                  <div className="projetos__informacoes">
                    <h3>{projeto.titulo}</h3>
                    <p>{projeto.descricao}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div
          id="apadrinhe"
          ref={apadrinheRef}
          className={`apadrinhe ${apadrinheVisivel ? "visivel" : ""}`}
        >
          <div className="apadrinhe__container">
            <div className="apadrinhe__visual">
              <img
                src="/assets/img/pages/inicio/apadrinhe/onca.png"
                alt="Filhote de onça-pintada entre a vegetação"
                loading="lazy"
              />
            </div>
            <div className="apadrinhe__conteudo">
              <p className="apadrinhe__subtitulo">APADRINHAMENTO</p>
              <h2 className="apadrinhe__titulo">Por que ser um padrinho?</h2>
              <div className="apadrinhe__textos">
                <p>
                  Os animais sob os nossos cuidados são <strong>vítimas da interferência humana</strong> e
                  não poderão retornar para a natureza. Trabalhamos diariamente para oferecer uma vida digna,
                  o mais próximo da realidade natural desses animais!
                </p>
                <p>
                  Ao apadrinhar, você estará auxiliando nos <strong>cuidados e qualidade de vida</strong> destes animais,
                  e nos ajudando a proporcionar as melhores condições para uma vida digna,
                  o mais próximo da natureza!
                </p>
              </div>
              <HashLink smooth to="/inicio#animais" className="apadrinhe__botao">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
                </svg>
                Apadrinhar
                <span aria-hidden="true">→</span>
              </HashLink>
            </div>
          </div>
        </div>
        <section
          id="animais"
          ref={animaisRef}
          className={`animais ${animaisVisiveis ? "visivel" : ""}`}
          aria-labelledby="animais-titulo"
        >
          <div className="animais__container">
            <div className="animais__cabecalho">
              <p className="animais__subtitulo">CONHEÇA NOSSOS ANIMAIS</p>
              <h2 id="animais-titulo" className="animais__titulo">Apadrinhe um Animal</h2>
              <p className="animais__descricao">
                Cada um tem uma história de superação. Conheça os animais e descubra
                como o cuidado com a fauna pode transformar vidas.
              </p>
              <p className="animais__nota">
                Personagens, histórias e apadrinhamentos fictícios, apresentados para fins de TCC.
              </p>
            </div>
            <div className="animais__grade">
              {animaisApadrinhamento.map((animal, indice) => (
                <button
                  key={animal.id}
                  type="button"
                  className="animais__card"
                  style={{ "--atraso": `${indice * 0.07}s` }}
                  onClick={() => abrirAnimal(animal)}
                  aria-label={`Conhecer ${animal.nome}, ${animal.especie.toLowerCase()}`}
                >
                  <img
                    src={animal.imagem}
                    alt={animal.especie.toLowerCase()}
                    loading="lazy"
                    style={{ objectPosition: animal.posicao }}
                  />
                  <span className="animais__sombra" aria-hidden="true" />
                  <span className="animais__seta" aria-hidden="true">↗</span>
                  <span className="animais__info">
                    <span className="animais__especie">{animal.especie}</span>
                    <span className="animais__nome">{animal.nome}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
        <section
          id="santuarios"
          ref={santuariosRef}
          className={`santuarios ${santuariosVisiveis ? "visivel" : ""}`}
          aria-labelledby="santuarios-titulo"
        >
          <div className="santuarios__container">
            <div className="santuarios__cabecalho">
              <p className="santuarios__subtitulo">SANTUÁRIOS</p>
              <h2 id="santuarios-titulo" className="santuarios__titulo">Uma casa para cada espécie</h2>
              <p className="santuarios__descricao">
                Conheça os santuários dedicados ao cuidado de cada grupo de animais silvestres.
                As unidades e os exemplos de atendimento são fictícios, criados para este TCC.
              </p>
            </div>
            <div className="santuarios__grade">
              {santuarios.map((santuario, indice) => (
                <article
                  key={santuario.id}
                  className="santuarios__card"
                  style={{ "--atraso": `${indice * 0.09}s` }}
                >
                  <div className="santuarios__logo">
                    <img src={santuario.logo} alt={`Santuário ${santuario.nome}`} loading="lazy" />
                  </div>
                  <div className="santuarios__corpo">
                    <p className="santuarios__grupo">{santuario.grupo}</p>
                    <p className="santuarios__texto">{santuario.descricao}</p>
                    <button
                      type="button"
                      className="santuarios__link"
                      onClick={() => abrirSantuario(santuario)}
                      aria-label={`Ver informações sobre resgates de ${santuario.grupo.toLowerCase()}`}
                    >
                      Ver resgates <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="parceiros"
          ref={parceirosRef}
          className={`parceiros ${parceirosVisiveis ? "visivel" : ""}`}
          aria-labelledby="parceiros-titulo"
        >
          <div className="parceiros__container">
            <div className="parceiros__cabecalho">
              <p className="parceiros__subtitulo">PARCEIROS</p>
              <h2 id="parceiros-titulo" className="parceiros__titulo">Juntos pelo paraíso da fauna</h2>
              <p className="parceiros__descricao">
                Estas organizações e iniciativas são apresentadas como referências educativas para o TCC.
                O R.O.P. é um projeto fictício e não possui parcerias oficiais com elas.
              </p>
            </div>
            <div className="parceiros__grade">
              {parceiros.map((parceiro, indice) => (
                <article
                  className="parceiros__card"
                  key={parceiro.id}
                  style={{ "--atraso": `${indice * 0.1}s` }}
                >
                  <div className="parceiros__identidade">
                    <div className="parceiros__emblema">
                      <img src={parceiro.logo} alt={`Logotipo de ${parceiro.nome}`} loading="lazy" />
                    </div>
                    <div className="parceiros__nome-bloco">
                      <h3 className="parceiros__nome">{parceiro.nome}</h3>
                      <p className="parceiros__categoria">{parceiro.categoria}</p>
                    </div>
                  </div>
                  <p className="parceiros__texto">{parceiro.descricao}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      {animalSelecionado && (
        <div
          className="animais__modal-fundo"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) fecharAnimal();
          }}
        >
          <div
            className="animais__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`animal-titulo-${animalSelecionado.id}`}
            aria-describedby={`animal-descricao-${animalSelecionado.id}`}
          >
            <div className="animais__modal-imagem">
              <img src={animalSelecionado.imagem} alt={animalSelecionado.especie.toLowerCase()} />
            </div>
            <div className="animais__modal-conteudo">
              <button
                type="button"
                className="animais__modal-fechar"
                onClick={fecharAnimal}
                ref={botaoFecharRef}
                aria-label="Fechar detalhes do animal"
              >
                ×
              </button>
              <p className="animais__modal-especie">{animalSelecionado.especie}</p>
              <h2 id={`animal-titulo-${animalSelecionado.id}`} className="animais__modal-titulo">
                {animalSelecionado.nome}
              </h2>
              <p id={`animal-descricao-${animalSelecionado.id}`} className="animais__modal-texto">
                {animalSelecionado.descricao}
              </p>
              <p className="animais__modal-nota">História ilustrativa do projeto fictício R.O.P.</p>
              <Link to="/doe" className="animais__modal-botao">
                Apadrinhar {animalSelecionado.nome}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      )}
      {santuarioSelecionado && (
        <div
          className="santuarios__modal-fundo"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) fecharSantuario();
          }}
        >
          <div
            className="santuarios__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="santuario-modal-titulo"
            aria-describedby="santuario-modal-descricao"
          >
            <button
              type="button"
              ref={botaoFecharSantuarioRef}
              className="santuarios__modal-fechar"
              onClick={fecharSantuario}
              aria-label="Fechar informações do santuário"
            >
              ×
            </button>
            <img
              src={santuarioSelecionado.logo}
              className="santuarios__modal-logo"
              alt={`Logo do Santuário ${santuarioSelecionado.nome}`}
            />
            <p className="santuarios__modal-grupo">{santuarioSelecionado.grupo}</p>
            <h2 id="santuario-modal-titulo">{santuarioSelecionado.nome}</h2>
            <p id="santuario-modal-descricao">{santuarioSelecionado.detalhe}</p>
            <p className="santuarios__modal-aviso">
              Conteúdo demonstrativo: os santuários e os atendimentos apresentados são fictícios.
            </p>
            <button type="button" onClick={fecharSantuario} className="santuarios__modal-voltar">
              Voltar aos santuários
            </button>
          </div>
        </div>
      )}
      <Rodape/>

    </div>
  );
}
export default Inicio;
