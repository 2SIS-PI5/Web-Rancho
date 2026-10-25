import { User, Wallet, Banknote, QrCode, Check, Clock, Minus, Sun, Moon } from "lucide-react";
import style from "../css/Historico.module.css";
import { formatBRL } from "../../../utils/formatadores";

function LinhaPagamento({ item }) {
  const iniciais = item.nome.split(" ").filter(Boolean).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase();
  const dias = item.dias || [];
  return (
    <div className={style.tpRow} style={{ "--cor-setor": item.cor || "#64748b" }}>
      <div className={style.tpFunc}>
        <span className={style.tpAvatar}>{iniciais || <User size={15} strokeWidth={1.75} />}</span>
        <span className={style.tpNome}>{item.nome}</span>
        <small className={style.tpSetor}>{item.setor}</small>
      </div>

      <div>
        <div className={style.tpDiasQtd}>{dias.length} {dias.length === 1 ? "dia" : "dias"}</div>
        <div className={style.tpDiasDatas}>{dias.slice(0, 3).map((dia, indice) => <span className={style.tpDataChip} key={dia.data || indice}>{dia.data ? new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" }).format(new Date(`${dia.data}T00:00:00`)) : "Data"} {dia.turno === "NOITE" ? <Moon size={11} /> : dia.turno === "DIA" ? <Sun size={11} /> : null}</span>)}{dias.length > 3 && ` +${dias.length - 3}`}</div>
      </div>

      <div className={style.tpValor}><strong>{formatBRL(item.status === "PAGO" ? item.valor : item.previsto)}</strong>{item.status !== "PAGO" && <small>valor previsto</small>}</div>

      <div className={`${style.tpVia} ${item.via === "PIX" ? style.viaPix : style.viaDinheiro}`}>
        {item.via === "PIX" ? <QrCode size={17} /> : item.via === "DINHEIRO" ? <Banknote size={17} /> : <Wallet size={17} />}{item.via || "—"}
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