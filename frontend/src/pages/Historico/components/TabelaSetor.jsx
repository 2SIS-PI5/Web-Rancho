import style from "../css/Historico.module.css";
import LinhaPagamento from "./LinhaPagamento";
import { formatBRL } from "../../../utils/formatadores";

function TabelaSetor({ grupo }) {
  const totalPago = grupo.itens.reduce((soma, item) => soma + (item.status === "PAGO" ? item.valor : 0), 0);
  const totalPendente = grupo.itens.reduce((soma, item) => soma + (item.status === "PAGO" ? 0 : item.previsto), 0);
  const total = totalPago + totalPendente;
  const progresso = total > 0 ? (totalPago / total) * 100 : 0;

  return (
    <section className={style.tpWrap}>
      <div className={style.tpGroup} style={{ "--cor-setor": grupo.cor }}>
        <span className={style.tpDot} />
        <span className={style.tpGroupTitle}>
          {grupo.setor}
        </span>
        <span className={style.tpGroupCount}>({grupo.itens.length})</span>
        <span className={style.tpGroupTotal}>{formatBRL(total)}</span>
      </div>
      <div className={style.tpProgress}><span style={{ width: `${progresso}%` }} /></div>

      <div className={style.tpHead}>
        <div>Funcionário</div>
        <div>Dias trabalhados</div>
        <div className={style.valor}>Valor</div>
        <div className={style.via}>Via</div>
        <div className={style.status}>Status</div>
      </div>

      {grupo.itens.map((item) => (
        <LinhaPagamento key={item.id} item={item} />
      ))}

      <div className={style.tpTotal}>
        <span className={style.tpTotalLabel}>Total {grupo.setor}</span>
        <div className={style.tpTotalValor}>
          <span className={style.totalPendente}>Valor a Pagar: <strong>{formatBRL(totalPendente)}</strong></span>
          <span className={style.totalPago}>Valor Pago: <strong>{formatBRL(totalPago)}</strong></span>
        </div>
      </div>
    </section>
  );
}

export default TabelaSetor;