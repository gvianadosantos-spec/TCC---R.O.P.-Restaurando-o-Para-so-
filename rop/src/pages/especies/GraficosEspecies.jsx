
import { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

import "./graficosEspecies.scss";

// CONFIGURAÇÃO
const USAR_API = false;
const URL_API = "http://localhost:3001/animais";
// Troque a porta 3001 pela porta real da sua API.

// Dados de demonstração
const STATUS = [
  { nome: "Vulnerável", quantidade: 13, cor: "#0ea5e9" },
  { nome: "Extinto na Natureza", quantidade: 2, cor: "#ef4444" },
  { nome: "Quase Ameaçado", quantidade: 3, cor: "#94a3b8" },
  { nome: "Menor Preocupação", quantidade: 6, cor: "#10b981" },
  { nome: "Ameaçado", quantidade: 4, cor: "#eab308" },
  { nome: "Criticamente Ameaçado", quantidade: 7, cor: "#f97316" },
  { nome: "Extinto", quantidade: 2, cor: "#ef4444" }
];

const GRUPOS = [
  { nome: "Mamíferos", chave: "mamif", quantidade: 11, cor: "#f59e0b" },
  { nome: "Aves", chave: "ave", quantidade: 11, cor: "#0ea5e9" },
  { nome: "Peixes", chave: "peix", quantidade: 6, cor: "#3b82f6" },
  { nome: "Répteis", chave: "rept", quantidade: 4, cor: "#10b981" },
  { nome: "Anfíbios", chave: "anfib", quantidade: 3, cor: "#22cbe0" },
  { nome: "Invertebrados", chave: "invertebr", quantidade: 2, cor: "#ec65b0" }
];

function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// Cria os dados do gráfico circular
function montarRosca(status) {
  const total = (nome) =>
    status.find((item) => item.nome === nome)?.quantidade || 0;

  return [
    {
      nome: "Extinto",
      quantidade: total("Extinto") + total("Extinto na Natureza"),
      cor: "#ef4444"
    },
    {
      nome: "Ameaçado",
      quantidade:
        total("Vulnerável") +
        total("Ameaçado") +
        total("Criticamente Ameaçado"),
      cor: "#f97316"
    },
    {
      nome: "Outros",
      quantidade:
        total("Quase Ameaçado") +
        total("Menor Preocupação"),
      cor: "#10b981"
    }
  ];
}

// Conta os animais retornados pela API
function processarAnimais(animais) {
  const status = STATUS.map((item) => ({
    ...item,
    quantidade: 0
  }));

  const grupos = GRUPOS.map((item) => ({
    ...item,
    quantidade: 0
  }));

  let semStatus = 0;

  animais.forEach((animal) => {
    const classe = normalizar(animal.classe_especie);

    const grupo = grupos.find((item) =>
      classe.startsWith(item.chave)
    );

    if (grupo) grupo.quantidade++;

    const conservacao = normalizar(animal.status_conservacao);

    const situacao = status.find(
      (item) => normalizar(item.nome) === conservacao
    );

    if (situacao) {
      situacao.quantidade++;
    } else {
      semStatus++;
    }
  });

  return { status, grupos, semStatus };
}

// Faz cada gráfico animar quando aparece na tela
function CartaoGrafico({ titulo, children }) {
  const referencia = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    const elemento = referencia.current;

    if (elemento) observador.observe(elemento);

    return () => observador.disconnect();
  }, []);

  return (
    <section className="grafico-card" ref={referencia}>
      <h3>{titulo}</h3>
      <div className="grafico-conteudo">
        {visivel && children}
      </div>
    </section>
  );
}

const estiloTooltip = {
  backgroundColor: "#08252c",
  border: "1px solid #24434b",
  borderRadius: "12px",
  color: "#ffffff"
};

const animacao = {
  isAnimationActive: "auto",
  animationBegin: 150,
  animationDuration: 1400,
  animationEasing: "ease-out"
};

function GraficosEspecies() {
  const [dados, setDados] = useState(
    USAR_API ? null : {
      status: STATUS,
      grupos: GRUPOS,
      semStatus: 0
    }
  );

  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!USAR_API) return;

    const controlador = new AbortController();

    async function carregarAnimais() {
      try {
        const resposta = await fetch(URL_API, {
          signal: controlador.signal
        });

        if (!resposta.ok) {
          throw new Error("Erro ao consultar a API");
        }

        const resultado = await resposta.json();

        const animais = Array.isArray(resultado)
          ? resultado
          : resultado.animais ?? resultado.data;

        if (!Array.isArray(animais)) {
          throw new Error("Formato da API não reconhecido");
        }

        setDados(processarAnimais(animais));
      } catch (error) {
        if (error.name !== "AbortError") {
          setErro(error.message);
        }
      }
    }

    carregarAnimais();

    return () => controlador.abort();
  }, []);

  if (erro) {
    return <p className="grafico-aviso">{erro}</p>;
  }

  if (!dados) {
    return <p className="grafico-aviso">Carregando gráficos...</p>;
  }

  const { status, grupos, semStatus } = dados;
  const rosca = montarRosca(status);

  const temStatus = status.some((item) => item.quantidade > 0);

  return (
    <>
      <div className="graficos-especies">

        {/* GRÁFICO 1 - HORIZONTAL */}
        <CartaoGrafico titulo="Espécies por status de ameaça">
          {temStatus ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={status}
                layout="vertical"
                margin={{ top: 15, right: 15, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  stroke="#17363d"
                  strokeDasharray="3 3"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: "#91a9af", fontSize: 11 }}
                  axisLine={{ stroke: "#42616a" }}
                />

                <YAxis
                  type="category"
                  dataKey="nome"
                  width={125}
                  tick={{ fill: "#91a9af", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={estiloTooltip}
                  labelStyle={{ color: "#ffffff" }}
                  itemStyle={{ color: "#ffffff" }}
                  cursor={{ fill: "#ffffff08" }}
                  formatter={(valor) => [valor, "Espécies"]}
                />

                <Bar
                  dataKey="quantidade"
                  radius={[0, 6, 6, 0]}
                  barSize={24}
                  {...animacao}
                >
                  {status.map((item) => (
                    <Cell key={item.nome} fill={item.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="grafico-vazio">
              Nenhum status de conservação cadastrado.
            </p>
          )}
        </CartaoGrafico>

        {/* GRÁFICO 2 - VERTICAL */}
        <CartaoGrafico titulo="Espécies por grupo">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={grupos}
              margin={{ top: 15, right: 10, left: -20, bottom: 20 }}
            >
              <CartesianGrid
                stroke="#17363d"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="nome"
                interval={0}
                angle={-25}
                textAnchor="end"
                height={65}
                tick={{ fill: "#91a9af", fontSize: 10 }}
                axisLine={{ stroke: "#42616a" }}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fill: "#91a9af", fontSize: 11 }}
                axisLine={{ stroke: "#42616a" }}
              />

              <Tooltip
                contentStyle={estiloTooltip}
                labelStyle={{ color: "#ffffff" }}
                itemStyle={{ color: "#ffffff" }}
                cursor={{ fill: "#ffffff08" }}
                formatter={(valor) => [valor, "Espécies"]}
              />

              <Bar
                dataKey="quantidade"
                radius={[6, 6, 0, 0]}
                maxBarSize={42}
                {...animacao}
              >
                {grupos.map((item) => (
                  <Cell key={item.nome} fill={item.cor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CartaoGrafico>

        {/* GRÁFICO 3 - ROSCA */}
        <CartaoGrafico titulo="Extinção vs. ameaça">
          {temStatus ? (
            <div className="grafico-rosca">
              <div className="rosca-area">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rosca}
                      dataKey="quantidade"
                      nameKey="nome"
                      cx="50%"
                      cy="50%"
                      innerRadius="48%"
                      outerRadius="78%"
                      paddingAngle={1}
                      stroke="#e5edf0"
                      strokeWidth={1}
                      {...animacao}
                    >
                      {rosca.map((item) => (
                        <Cell key={item.nome} fill={item.cor} />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={estiloTooltip}
                      itemStyle={{ color: "#ffffff" }}
                      formatter={(valor) => [valor, "Espécies"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grafico-legenda">
                {rosca.map((item) => (
                  <div key={item.nome} className="legenda-item">
                    <span style={{ backgroundColor: item.cor }} />
                    <span style={{ color: item.cor }}>
                      {item.nome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="grafico-vazio">
              Nenhum status de conservação cadastrado.
            </p>
          )}
        </CartaoGrafico>
      </div>

      {USAR_API && semStatus > 0 && (
        <p className="grafico-aviso">
          {semStatus} animal(is) sem status reconhecido.
          Os gráficos de ameaça consideram somente os demais.
        </p>
      )}
    </>
  );
}

export default GraficosEspecies;
