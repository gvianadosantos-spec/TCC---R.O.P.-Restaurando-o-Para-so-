import { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell
} from "recharts";
import "./graficosEspecies.scss";

// Estes gráficos recebem os mesmos animais mostrados nos filtros e na pesquisa.
// Não consultam a API diretamente: a página Especies.jsx controla a origem dos dados.
const STATUS = [
  { nome: "Vulnerável", cor: "#0ea5e9" },
  { nome: "Extinto na Natureza", cor: "#ef4444" },
  { nome: "Quase Ameaçado", cor: "#94a3b8" },
  { nome: "Menor Preocupação", cor: "#10b981" },
  { nome: "Ameaçado", cor: "#eab308" },
  { nome: "Criticamente Ameaçado", cor: "#f97316" },
  { nome: "Extinto", cor: "#ef4444" },
  { nome: "Não informado", cor: "#64748b" }
];

const GRUPOS = [
  { nome: "Mamíferos", cor: "#f59e0b" },
  { nome: "Aves", cor: "#0ea5e9" },
  { nome: "Peixes", cor: "#3b82f6" },
  { nome: "Répteis", cor: "#10b981" },
  { nome: "Anfíbios", cor: "#22cbe0" },
  { nome: "Invertebrados", cor: "#ec65b0" },
  { nome: "Não classificado", cor: "#64748b" }
];

function calcularDados(animais) {
  const status = STATUS.map((s) => ({
    ...s, quantidade: animais.filter((a) => a.status_conservacao === s.nome).length
  })).filter((s) => s.quantidade > 0);

  const grupos = GRUPOS.map((g) => ({
    ...g, quantidade: animais.filter((a) => a.grupo === g.nome).length
  })).filter((g) => g.quantidade > 0);

  const contar = (...nomes) => status.reduce((total, s) =>
    total + (nomes.includes(s.nome) ? s.quantidade : 0), 0);

  const rosca = [
    { nome: "Extinto", quantidade: contar("Extinto", "Extinto na Natureza"), cor: "#ef4444" },
    { nome: "Ameaçado", quantidade: contar("Ameaçado", "Vulnerável", "Criticamente Ameaçado"), cor: "#f97316" },
    { nome: "Outros", quantidade: contar("Quase Ameaçado", "Menor Preocupação", "Não informado"), cor: "#10b981" }
  ];

  return { status, grupos, rosca };
}

function CartaoGrafico({ titulo, children }) {
  const referencia = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setVisivel(true);
      return;
    }
    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) {
        setVisivel(true);
        observador.disconnect();
      }
    }, { threshold: 0.15 });
    const elemento = referencia.current;
    if (elemento) observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <section className="grafico-card" ref={referencia}>
      <h3>{titulo}</h3>
      <div className="grafico-conteudo">{visivel && children}</div>
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
  isAnimationActive: true,
  animationBegin: 150,
  animationDuration: 1400,
  animationEasing: "ease-out"
};

function GraficosEspecies({ animais = [] }) {
  const { status, grupos, rosca } = useMemo(() => calcularDados(animais), [animais]);
  // A chave faz a animação começar novamente quando muda o conjunto de animais.
  const chaveDados = animais.map((animal) => animal.id).join("|");

  return (
    <div className="graficos-especies">
      <CartaoGrafico titulo="Espécies por status de ameaça">
        {status.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={status} layout="vertical"
              margin={{ top: 15, right: 15, left: 5, bottom: 5 }}>
              <CartesianGrid stroke="#17363d" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false}
                tick={{ fill: "#91a9af", fontSize: 11 }} axisLine={{ stroke: "#42616a" }} />
              <YAxis type="category" dataKey="nome" width={125}
                tick={{ fill: "#91a9af", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={estiloTooltip} labelStyle={{ color: "#ffffff" }}
                itemStyle={{ color: "#ffffff" }} cursor={{ fill: "#ffffff08" }}
                formatter={(valor) => [valor, "Espécies"]} />
              <Bar key={`status-${chaveDados}`} dataKey="quantidade"
                radius={[0, 6, 6, 0]} barSize={24} {...animacao}>
                {status.map((s) => <Cell key={s.nome} fill={s.cor} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="grafico-vazio">Nenhuma espécie encontrada.</p>}
      </CartaoGrafico>

      <CartaoGrafico titulo="Espécies por grupo">
        {grupos.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grupos}
              margin={{ top: 15, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid stroke="#17363d" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="nome" interval={0} angle={-25} textAnchor="end" height={65}
                tick={{ fill: "#91a9af", fontSize: 10 }} axisLine={{ stroke: "#42616a" }} />
              <YAxis allowDecimals={false} tick={{ fill: "#91a9af", fontSize: 11 }}
                axisLine={{ stroke: "#42616a" }} />
              <Tooltip contentStyle={estiloTooltip} labelStyle={{ color: "#ffffff" }}
                itemStyle={{ color: "#ffffff" }} cursor={{ fill: "#ffffff08" }}
                formatter={(valor) => [valor, "Espécies"]} />
              <Bar key={`grupo-${chaveDados}`} dataKey="quantidade"
                radius={[6, 6, 0, 0]} maxBarSize={42} {...animacao}>
                {grupos.map((g) => <Cell key={g.nome} fill={g.cor} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="grafico-vazio">Nenhuma espécie encontrada.</p>}
      </CartaoGrafico>

      <CartaoGrafico titulo="Extinção vs. ameaça">
        {animais.length ? (
          <div className="grafico-rosca">
            <div className="rosca-area">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie key={`rosca-${chaveDados}`} data={rosca.filter((r) => r.quantidade > 0)}
                    dataKey="quantidade" nameKey="nome" cx="50%" cy="50%"
                    innerRadius="48%" outerRadius="78%" paddingAngle={1}
                    stroke="#e5edf0" strokeWidth={1} {...animacao}>
                    {rosca.filter((r) => r.quantidade > 0).map((r) =>
                      <Cell key={r.nome} fill={r.cor} />)}
                  </Pie>
                  <Tooltip contentStyle={estiloTooltip} itemStyle={{ color: "#ffffff" }}
                    formatter={(valor) => [valor, "Espécies"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grafico-legenda">
              {rosca.map((r) => (
                <div key={r.nome} className="legenda-item">
                  <span style={{ backgroundColor: r.cor }} />
                  <span style={{ color: r.cor }}>{r.nome}</span>
                </div>
              ))}
            </div>
          </div>
        ) : <p className="grafico-vazio">Nenhuma espécie encontrada.</p>}
      </CartaoGrafico>
    </div>
  );
}

export default GraficosEspecies;
