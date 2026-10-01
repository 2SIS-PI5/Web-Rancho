import style from "./css/VisaoGeral.module.css";
import { FileDown, DollarSign, Wallet, CreditCard, Users } from "lucide-react";
import { useState } from "react";

const periodos = [
  { id: "semanal", label: "Semanal" },
  { id: "mensal", label: "Mensal" },
  { id: "semestral", label: "Semestral" },
  { id: "anual", label: "Anual" },
];

const formatBRL = (v) => "R$ " + v.toFixed(2);

// Dados de exemplo (zerados, como na imagem). Troque pelos dados do backend.
const diasSemana = [
  { dia: "sábado", valor: 0 },
  { dia: "domingo", valor: 0 },
  { dia: "segunda", valor: 0 },
  { dia: "terça", valor: 0 },
  { dia: "quarta", valor: 0 },
  { dia: "quinta", valor: 0 },
  { dia: "sexta", valor: 0 },
];

const setores = [
  { nome: "Cozinha", valor: 0, func: 4, cor: "#2563eb" },
  { nome: "Garçon", valor: 0, func: 4, cor: "#16a34a" },
  { nome: "Atividades", valor: 0, func: 2, cor: "#9333ea" },
];

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

  const totalGasto = setores.reduce((s, x) => s + x.valor, 0);
  const teto = Math.max(4, Math.ceil(Math.max(...diasSemana.map((d) => d.valor))));
  const marcas = Array.from({ length: 5 }, (_, i) => teto - (teto / 4) * i);

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
        <div className={style.gradeVisaoGeral}>
          <div className={style.linhaResumo}>
            <CardResumo variante="azul" icone={<DollarSign size={22} />} titulo="Custo Total" valor="R$ 0.00" />
            <CardResumo variante="laranja" icone={<Wallet size={22} />} titulo="Pago em Dinheiro" valor="R$ 0.00" />
            <CardResumo variante="roxo" icone={<CreditCard size={22} />} titulo="Pago em PIX" valor="R$ 0.00" />
            <CardResumo variante="verde" icone={<Users size={22} />} titulo="Equipe" valor="10 funcionários" />
          </div>

          <Painel titulo="Dias da semana" className={style.painelAlto}>
            <div className={style.grafico}>
              <div className={style.eixoY}>
                {marcas.map((m) => (
                  <span key={m}>R${Math.round(m)}</span>
                ))}
              </div>

              <div className={style.areaBarras}>
                {marcas.map((m) => (
                  <div key={m} className={style.linhaGrade} />
                ))}
                <div className={style.colunas}>
                  {diasSemana.map((d) => (
                    <div key={d.dia} className={style.coluna}>
                      <div className={style.trilhaBarra}>
                        <div
                          className={style.barra}
                          style={{ height: `${(d.valor / teto) * 100}%` }}
                        />
                      </div>
                      <span>{d.dia}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Painel>

          <Painel titulo="Método de pagamento" className={style.painelAlto}>
            <p className={style.vazio}>Sem pagamentos no período</p>
          </Painel>

          <Painel titulo="Custo por funcionário">
            <p className={style.vazio}>Sem dados no período</p>
          </Painel>

          <Painel titulo="Gastos por setor">
            <ul className={style.listaSetores}>
              {setores.map((s) => {
                const pct = totalGasto ? Math.round((s.valor / totalGasto) * 100) : 0;
                return (
                  <li key={s.nome}>
                    <div className={style.setorTopo}>
                      <span>
                        {s.nome}
                        <small className={style.setorInfo}>
                          {pct}% · {s.func} func.
                        </small>
                      </span>
                      <strong>{formatBRL(s.valor)}</strong>
                    </div>
                    <div className={style.trilhaSetor}>
                      <div
                        className={style.preenchimentoSetor}
                        style={{ width: `${pct}%`, background: s.cor }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </Painel>
        </div>
      </div>
    </>
  );
}

export default VisaoGeral;