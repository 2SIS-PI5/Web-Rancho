import { Banknote, QrCode, User, Check, Pencil } from "lucide-react";
import style from "../css/Pagamento.module.css";
import { formatBRL, formatTelefone } from "../../../utils/formatadores";
import { normalizarChavePix, formatarValorPix } from "../../../utils/pix";
import ModalQrPix from "./ModalQrPix";
import { useEffect, useRef, useState } from "react";

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
    onDesfazer,
    pagando,
    onQr
}) {
    const [qrAberto, setQrAberto] = useState(false);
    const [confirmando, setConfirmando] = useState(false);
    const [desfazendo, setDesfazendo] = useState(false);
    const qrButtonRef = useRef(null);
    const editarRef = useRef(null);
    const cancelarRef = useRef(null);
    const chave = normalizarChavePix(chavePix);
    const valorValido = Boolean(formatarValorPix(valorTotal));
    const nomeForma = formaPagamento === "PIX" ? "PIX" : "Dinheiro";

    function fecharConfirmacao() {
        setConfirmando(false);
        editarRef.current?.focus();
    }

    async function desfazer() {
        setDesfazendo(true);
        try {
            await onDesfazer(id);
            setConfirmando(false);
        } catch {
            // o componente pai é quem mostra o alerta de erro
        } finally {
            setDesfazendo(false);
        }
    }

    useEffect(() => {
        if (!confirmando) return;
        cancelarRef.current?.focus();
        const keydown = (event) => {
            if (event.key === "Escape" && !desfazendo) fecharConfirmacao();
        };
        document.addEventListener("keydown", keydown);
        return () => document.removeEventListener("keydown", keydown);
    }, [confirmando, desfazendo]);

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
                    <div className={style.btnPagoVia}>
                        <div className={style.infoPagoVia}>
                            {formaPagamento === "PIX" ? <QrCode /> : <Banknote />}
                            <p>Pago via {nomeForma}</p>
                            <Check />
                        </div>
                        {onDesfazer && (
                            <button
                                type="button"
                                ref={editarRef}
                                className={style.btnEditarPagto}
                                aria-label="Alterar forma de pagamento"
                                title="Alterar forma de pagamento"
                                disabled={desfazendo}
                                onClick={() => setConfirmando(true)}
                            >
                                <Pencil size={18} />
                            </button>
                        )}
                    </div>
                ) : (
                    <>

                        <button type="button"
                            className={style.btnPagarEmDinheiro}
                            disabled={pagando}
                            onClick={() => onPagar(id, "DINHEIRO")}
                        >
                            <Banknote />
                            <p>{pagando ? "Pagando..." : "Dinheiro"}</p>
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
            {confirmando && (
                <div
                    className={style.fundoConfirmacao}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`tituloDesfazer-${id}`}
                    onMouseDown={(event) => { if (event.target === event.currentTarget && !desfazendo) fecharConfirmacao(); }}
                >
                    <div className={style.cardConfirmacao}>
                        <h2 id={`tituloDesfazer-${id}`}>Alterar forma de pagamento?</h2>
                        <p>
                            O pagamento de {nome} ({nomeForma}) será desfeito e ele voltará para pendente.
                            Depois você poderá escolher Dinheiro ou QR Code novamente.
                        </p>
                        <div className={style.botoesConfirmacao}>
                            <button type="button" ref={cancelarRef} className={style.btnCancelarConfirmacao} disabled={desfazendo} onClick={fecharConfirmacao}>
                                Cancelar
                            </button>
                            <button type="button" className={style.btnConfirmarConfirmacao} disabled={desfazendo} onClick={desfazer}>
                                {desfazendo ? "Desfazendo..." : "Desfazer pagamento"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CardPgtoFunc;
