import style from "../css/Historico.module.css";
import LinhaPagamento from "./LinhaPagamento";
import { formatBRL } from "../../../utils/formatadores";

function TabelaSetor({ grupo }) {
  const total = grupo.itens.reduce((soma, item) => soma + item.valor, 0);

  return (
    <section className={style.tpWrap}>
      <div className={style.tpGroup}>
        <span className={style.tpDot} style={{ background: grupo.cor }} />
        <span className={style.tpGroupTitle} style={{ color: grupo.cor }}>
          {grupo.setor}
        </span>
        <span className={style.tpGroupCount}>({grupo.itens.length})</span>
      </div>

      <div className={style.tpHead}>
        <div>Funcionário</div>
        <div>Dias / Datas</div>
        <div className={style.valor}>Valor</div>
        <div className={style.via}>Via</div>
        <div className={style.status}>Status</div>
      </div>

      {grupo.itens.map((item) => (
        <LinhaPagamento key={item.id} item={item} />
      ))}

      <div className={style.tpTotal}>
        <span className={style.tpTotalLabel}>Total {grupo.setor}:</span>
        <span className={style.tpTotalValor}>{formatBRL(total)}</span>
      </div>
    </section>
  );
}

export default TabelaSetor;