import { Banknote, QrCode, User, Check } from "lucide-react";
import style from "../css/Pagamento.module.css";
import { formatBRL, formatTelefone } from "../../../utils/formatadores";

function CardPgtoFunc({ id, nome, area, statusPagto, telefone, chavePix, diasTrabalhados, valorDiaria, valorTotal, onPagar, pagando }) {
    return (
        <div className={statusPagto === "PAGO" ? style.cardPagtoFuncPago : style.cardPagtoFun}>
            <div className={style.infosPessoais}>
                <div className={style.profileDefault}>
                    <User />
                </div>
                <div className={style.nomeFormaPagto}>
                    <div className={style.nomeFunc}>
                        <p>{nome}</p>
                        <p>{area}</p>
                    </div>
                    <p className={statusPagto === "PAGO" ? style.pago : style.pendente}>
                        {statusPagto === "PAGO" ? "Pago" : "Pendente"}
                    </p>
                </div>
            </div>
            <div className={style.infosPagto}>
                <p className={style.tipoInformacao}>Telefone <span className={style.infoFunc}>{formatTelefone(telefone)}</span></p>
                <p className={style.tipoInformacao}>Chave PIX <span className={style.infoFunc}>{chavePix}</span></p>
                <p className={style.tipoInformacao}>Dias trabalhados <span className={style.infoFunc}>{diasTrabalhados}</span></p>
                <p className={style.tipoInformacao}>Valor diária <span className={style.infoFunc}>{formatBRL(valorDiaria)}</span></p>
                <p className={style.tipoInformacao}>Valor total <span className={style.infoFunc}>{formatBRL(valorTotal)}</span></p>
            </div>
            <div className={style.formasPagto}>
                {statusPagto === "PAGO" ? (
                    <button disabled={true} className={style.btnPagoVia}>
                        <Check /><p>Pago via</p>
                    </button>
                ) : (
                    <>
                        <button className={style.btnPagarEmDinheiro} disabled={pagando} onClick={() => onPagar(id, "DINHEIRO")}>
                            <Banknote />
                            <p>{pagando ? "Pagando..." : "Dinheiro"}</p>
                        </button>

                        <button className={style.btnPagarEmPix} disabled={pagando} onClick={() => onPagar(id, "PIX")}>
                            <QrCode />
                            <p>{pagando ? "Pagando..." : "PIX"}</p>
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default CardPgtoFunc;