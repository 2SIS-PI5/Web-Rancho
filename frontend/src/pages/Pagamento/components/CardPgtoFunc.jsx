import { Banknote, QrCode, User, Check } from "lucide-react";
import style from "../css/Pagamento.module.css";
import { formatBRL, formatTelefone } from "../../../utils/formatadores";
import { normalizarChavePix, formatarValorPix } from "../../../utils/pix";
import ModalQrPix from "./ModalQrPix";
import PixIcon from "./PixIcon";
import { useRef, useState } from "react";

function CardPgtoFunc({
    id,
    nome,
    area,
    statusPagto,
    formaPagamento,
    telefone,
    chavePix,
    diasTrabalhados,
    valorDiaria,
    valorTotal,
    onPagar,
    pagando,
    onQr
}) {
    const [qrAberto, setQrAberto] = useState(false);
    const qrButtonRef = useRef(null);
    const chave = normalizarChavePix(chavePix);
    const valorValido = Boolean(formatarValorPix(valorTotal));
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
                        {formaPagamento === "PIX" ? <QrCode /> : <Banknote />}
                        <p>Pago via {formaPagamento === "PIX" ? "PIX" : "Dinheiro"}</p>
                        <Check />
                    </button>
                ) : (
                    <>
                        <div className={style.linhaBotoesQr}>
                            <button type="button"
                            className={style.btnPagarEmDinheiro}
                            disabled={pagando}
                            onClick={() => onPagar(id, "DINHEIRO")}
                            >
                                <Banknote />
                                <p>{pagando ? "Pagando..." : "Dinheiro"}</p>
                            </button>

                            <button type="button"
                            className={style.btnPagarEmPix}
                            disabled={pagando}
                            onClick={() => onPagar(id, "PIX")}
                            >
                                <PixIcon />
                                <p>{pagando ? "Pagando..." : "PIX"}</p>
                            </button>
                            <button
                                type="button"
                                className={style.btnQrCode}
                                disabled={pagando || !chave.valida || !valorValido}
                                ref={qrButtonRef}
                                aria-label="Gerar QR Code"
                                title="Gerar QR Code"
                                onClick={() => { setQrAberto(true); onQr?.(); }}
                            >
                                <QrCode />
                                <p>QR Code</p>
                            </button>
                        </div>
                        {(!chave.valida || !valorValido) && <small className={style.ajudaQr}>{!chave.valida ? chave.motivo : "Valor inválido"}</small>}
                    </>
                )}
            </div>
            {qrAberto && chave.valida && valorValido && (
                <ModalQrPix
                    pagamento={{ id, nome, area, valorTotal }}
                    chave={chave.chave}
                    tipo={chave.tipo}
                    onClose={() => { setQrAberto(false); qrButtonRef.current?.focus(); }}
                    onPagar={async (...args) => { await onPagar(...args); setQrAberto(false); }}
                />
            )}
        </div>
    )
}

export default CardPgtoFunc;