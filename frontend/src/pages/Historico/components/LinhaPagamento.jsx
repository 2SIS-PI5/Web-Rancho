import { User, Wallet, Check } from "lucide-react";
import style from "../css/Historico.module.css";
import { formatBRL } from "../../../utils/formatadores";

function LinhaPagamento({ item }) {
  const dias = item.dias || [];

  return (
    <div className={style.tpRow}>
      <div className={style.tpFunc}>
        <span className={style.tpAvatar}>
          <User size={15} strokeWidth={1.75} />
        </span>
        <span className={style.tpNome}>{item.nome}</span>
      </div>

      <div>
        <div className={style.tpDiasQtd}>{dias.length}d</div>
        <div className={style.tpDiasDatas}>
          {dias.join(", ") || "Sem datas"}
        </div>
      </div>

      <div className={style.tpValor}>
        {formatBRL(item.valor)}
      </div>

      <div className={style.tpVia}>
        <Wallet size={17} strokeWidth={1.75} />
        {item.via}
      </div>

      <div className={style.tpStatus}>
        <span
          className={`${style.tpBadge} ${item.status?.toUpperCase() === "PENDENTE" ? style.tpPendente : ""
            }`}
        >
          {item.status?.toUpperCase() !== "PENDENTE" && (
            <Check size={15} />
          )}
          {item.status}
        </span>
      </div>
    </div>
  );
}

export default LinhaPagamento;