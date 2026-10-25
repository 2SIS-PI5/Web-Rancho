import { User, Wallet, Check, Clock, Minus, Sun, Moon } from "lucide-react";
import style from "../css/Historico.module.css";
import { formatBRL } from "../../../utils/formatadores";

function LinhaPagamento({ item }) {
  return (
    <div className={style.tpRow}>
      <div className={style.tpFunc}>
        <span className={style.tpAvatar}>
          <User size={15} strokeWidth={1.75} />
        </span>
        <span className={style.tpNome}>{item.nome}</span>
      </div>

      <div>
        <div className={style.tpDiasQtd}>{item.dias.length} {item.dias.length === 1 ? "dia" : "dias"}</div>
        <div className={style.tpDiasDatas}>{item.dias.slice(0, 3).map((dia) => <span key={dia.data}>{new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" }).format(new Date(`${dia.data}T00:00:00`))} {dia.turno === "NOITE" ? <Moon size={11} /> : dia.turno === "DIA" ? <Sun size={11} /> : null}</span>)}{item.dias.length > 3 && ` +${item.dias.length - 3}`}</div>
      </div>

      <div className={style.tpValor}>{formatBRL(item.status === "PAGO" ? item.valor : item.previsto)}</div>

      <div className={style.tpVia}>
        {item.via ? <><Wallet size={17} strokeWidth={1.75} />{item.via}</> : "—"}
      </div>

      <div className={style.tpStatus}>
        <span className={`${style.tpBadge} ${item.status === "PAGO" ? style.statusPago : item.status === "A_GERAR" ? style.statusAGerar : style.statusPendente}`}>
          {item.status === "PAGO" ? <Check size={15} /> : item.status === "A_GERAR" ? <Minus size={15} /> : <Clock size={15} />}
          {item.status === "PAGO" ? "Pago" : item.status === "A_GERAR" ? "A gerar" : "Pendente"}
        </span>
      </div>
    </div>
  );
}

export default LinhaPagamento;