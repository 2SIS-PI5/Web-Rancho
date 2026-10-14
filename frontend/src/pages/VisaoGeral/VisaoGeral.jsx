import style from "./css/VisaoGeral.module.css";
import { FileDown, DollarSign, Wallet, CreditCard, Users } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../services/api";
import { corDoSetor } from "../../utils/setores";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PERIODOS = {
  semanal: "SEMANAL",
  mensal: "MENSAL",
  semestral: "SEMESTRAL",
  anual: "ANUAL",
};

const periodos = Object.keys(PERIODOS).map((id) => ({
  id,
  label: id[0].toUpperCase() + id.slice(1),
}));

const formatBRL = (valor) => Number(valor || 0).toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const possuiValores = (dados, campos) => dados.some((item) => campos.some((campo) => Number(item[campo] || 0) > 0));

function CardResumo({ icone, titulo, valor, variante }) {
  return (
    <div className={style.cardResumo}>
      <div className={`${style.iconeResumo} ${style[variante]}`}>{icone}</div>
      <div className={style.textoResumo}>
        <p>{titulo}</p>
        <strong>{valor}</strong>
      </div>
    </div>
  );
}

function Painel({ titulo, className = "", children }) {
  return (
    <section className={`${style.painel} ${className}`}>
      <h2 className={style.tituloPainel}>{titulo}</h2>
      {children}
    </section>
  );
}

function VisaoGeral() {
  const [periodo, setPeriodo] = useState("semanal");
  const [kpis, setKpis] = useState(null);
  const [custosPeriodo, setCustosPeriodo] = useState([]);
  const [custosSetor, setCustosSetor] = useState([]);
  const [evolucaoSetor, setEvolucaoSetor] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    setErro("");
    Promise.all([
      api.get("/visao-geral/kpis", { params: { periodo: PERIODOS[periodo] }, signal: controller.signal }),
      api.get("/visao-geral/custos-periodo", { params: { periodo: PERIODOS[periodo] }, signal: controller.signal }),
      api.get("/visao-geral/custos-setor", { params: { periodo: PERIODOS[periodo] }, signal: controller.signal }),
      api.get("/visao-geral/evolucao-custos-setor", { params: { periodo: PERIODOS[periodo] }, signal: controller.signal }),
    ]).then(([kpisResposta, periodoResposta, setorResposta, evolucaoResposta]) => {
      setKpis(kpisResposta.data || null);
      setCustosPeriodo(Array.isArray(periodoResposta.data) ? periodoResposta.data : []);
      setCustosSetor(Array.isArray(setorResposta.data) ? setorResposta.data : []);
      setEvolucaoSetor(Array.isArray(evolucaoResposta.data) ? evolucaoResposta.data : []);
    }).catch((error) => {
      if (!controller.signal.aborted) setErro(error.response?.data?.message || (typeof error.response?.data === "string" ? error.response.data : "Não foi possível carregar a visão geral."));
    }).finally(() => {
      if (!controller.signal.aborted) setCarregando(false);
    });
    return () => controller.abort();
  }, [periodo, tentativa]);

  const metodos = kpis ? [
    { nome: "Dinheiro", valor: Number(kpis.pagoDinheiro || 0), cor: "#f04a00" },
    { nome: "PIX", valor: Number(kpis.pagoPix || 0), cor: "#9333ea" },
  ] : [];
  const totalGasto = custosSetor.reduce((total, setor) => total + Number(setor.custoTotal || 0), 0);
  const dadosEvolucao = evolucaoSetor.map((item) => ({ ...item, periodo: item.periodo || item.dataInicio || "" }));
  const setoresEvolucao = [
    { nome: "Cozinha", campo: "custoCozinha" },
    { nome: "Salão", campo: "custoSalao" },
    { nome: "Atividades", campo: "custoAtividades" },
  ];
  const valorOuVazio = (valor) => Number(valor || 0) > 0 ? formatBRL(valor) : "Sem dados no período";

  return (
    <>
      <div className={style.headerVisaoGeral}>
        <div className={style.tituloVisaoGeral}>
          <h1>Visão Geral</h1>
          <p>Acompanhamento de escalas, desempenho e custos</p>
        </div>
        <div className={style.areaFiltros}>
          <div className={style.grupoPeriodo}>
            {periodos.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`${style.btnPeriodo} ${periodo === p.id ? style.btnPeriodoAtivo : ""
                  }`}
                onClick={() => setPeriodo(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button type="button" className={style.btnExportar}>
            <FileDown size={16} />
            Exportar PDF
          </button>
        </div>
      </div>
      <div className={style.containerVisaoGeral}>
        {carregando && <p>Carregando visão geral...</p>}
        {!carregando && erro && <div><p>{erro}</p><button type="button" onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</button></div>}
        {!carregando && !erro && <div className={style.gradeVisaoGeral}>
          <div className={style.linhaResumo}>
            <CardResumo variante="azul" icone={<DollarSign size={22} />} titulo="Custo Total" valor={valorOuVazio(kpis?.custoTotalMaoObra)} />
            <CardResumo variante="laranja" icone={<Wallet size={22} />} titulo="Pago em Dinheiro" valor={valorOuVazio(kpis?.pagoDinheiro)} />
            <CardResumo variante="roxo" icone={<CreditCard size={22} />} titulo="Pago em PIX" valor={valorOuVazio(kpis?.pagoPix)} />
            <CardResumo variante="verde" icone={<Users size={22} />} titulo="Equipe" valor={kpis?.totalFuncionarios ? `${kpis.totalFuncionarios} funcionários` : "Sem dados no período"} />
          </div>

          <Painel titulo="Dias da semana" className={style.painelAlto}>
            {possuiValores(custosPeriodo, ["valor"]) ? <div className={style.grafico}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={custosPeriodo} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#eef0f3" />
                  <XAxis dataKey="periodo" axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 13 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a1a1aa", fontSize: 13 }}
                    tickFormatter={(v) => `R$${v}`} />
                  <Tooltip formatter={(v) => formatBRL(v)} cursor={{ fill: "#f8f9fb" }} />
                  <Bar dataKey="valor" fill="#f04a00" radius={[6, 6, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div> : <p className={style.vazio}>Sem dados no período</p>}
          </Painel>

          <Painel titulo="Método de pagamento" className={style.painelAlto}>
            {possuiValores(metodos, ["valor"]) ? <div className={style.grafico}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={metodos} dataKey="valor" nameKey="nome" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
                    {metodos.map((m) => <Cell key={m.nome} fill={m.cor} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatBRL(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div> : <p className={style.vazio}>Sem dados no período</p>}
          </Painel>

          <Painel titulo="Custo por funcionário">
            <p className={style.vazio}>Sem dados no período</p>
          </Painel>

          <Painel titulo="Gastos por setor">
            {custosSetor.length && totalGasto > 0 ? <ul className={style.listaSetores}>
              {custosSetor.map((s) => {
                const pct = Number(s.porcentagem || (totalGasto ? (Number(s.custoTotal || 0) / totalGasto) * 100 : 0));
                return (
                  <li key={s.setor}>
                    <div className={style.setorTopo}>
                      <span>
                        {s.setor}
                        <small className={style.setorInfo}>
                          {Math.round(pct)}% · {s.qtdFuncionarios || 0} func.
                        </small>
                      </span>
                      <strong>{formatBRL(s.custoTotal)}</strong>
                    </div>

                    <div className={style.trilhaSetor}>
                      <div
                        className={style.preenchimentoSetor}
                        style={{ width: `${pct}%`, background: corDoSetor(s.setor) }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul> : <p className={style.vazio}>Sem dados no período</p>}
          </Painel>
          <Painel titulo="Evolução de custos por setor">
            {possuiValores(dadosEvolucao, setoresEvolucao.map((setor) => setor.campo)) ? <div className={style.grafico}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosEvolucao}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#eef0f3" />
                  <XAxis dataKey="periodo" axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(valor) => `R$${valor}`} />
                  <Tooltip formatter={(valor) => formatBRL(valor)} />
                  {setoresEvolucao.map((setor) => <Line key={setor.nome} type="monotone" dataKey={setor.campo} stroke={corDoSetor(setor.nome)} />)}
                </LineChart>
              </ResponsiveContainer>
            </div> : <p className={style.vazio}>Sem dados no período</p>}
          </Painel>
        </div>
        }
      </div>
    </>
  );
}

export default VisaoGeral;