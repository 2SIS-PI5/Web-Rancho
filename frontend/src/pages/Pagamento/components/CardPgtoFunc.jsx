import { Banknote, QrCode, User, Check } from "lucide-react";
import style from "../css/Pagamento.module.css";

function CardPgtoFunc({ index, nome, area, statusPagto, telefone, chavePix, diasTrabalhados, valorTotal }) {
    return (
        <div className={statusPagto === "Pago" ? style.cardPagtoFuncPago : style.cardPagtoFun} key={index}>
            <div className={style.infosPessoais}>
                <div className={style.profileDefault}>
                    <User />
                </div>
                <div className={style.nomeFormaPagto}>
                    <div className={style.nomeFunc}>
                        <p>{nome}</p>
                        <p>{area}</p>
                    </div>
                    <p className={statusPagto === "Pago" ? style.pago : style.pendente}>
                        {statusPagto}
                    </p>
                </div>
            </div>
            <div className={style.infosPagto}>
                <p className={style.tipoInformacao}>Telefone <p className={style.infoFunc}>{telefone}</p></p>
                <p className={style.tipoInformacao}>Chave PIX <p className={style.infoFunc}>{chavePix}</p></p>
                <p className={style.tipoInformacao}>Dias trabalhados<p className={style.infoFunc}>{diasTrabalhados}</p></p>
                <p className={style.tipoInformacao}>Valor total <p className={style.infoFunc}>{valorTotal}</p></p>
            </div>
            <div className={style.formasPagto}>
                {statusPagto === "Pago" ? (
                    <button disabled={true} className={style.btnPagoVia}>
                        <Check /><p>Pago via</p>
                    </button>
                ) : (
                    <>
                        <button className={style.btnPagarEmDinheiro}>
                            <Banknote />
                            <p>Dinheiro</p>
                        </button>

                        <button className={style.btnPagarEmPix}>
                            <QrCode />
                            <p>PIX</p>
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default CardPgtoFunc;