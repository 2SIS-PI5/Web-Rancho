import { useEffect, useRef, useState } from "react";
import { Check, Clock, Copy, X } from "lucide-react";
import QRCode from "qrcode";
import style from "../css/Pagamento.module.css";
import { formatBRL } from "../../../utils/formatadores";
import { montarPayloadPix, mascararChavePix, tipoChavePix } from "../../../utils/pix";

function ModalQrPix({ pagamento, chave, tipo, onClose, onPagar }) {
    const [imagem, setImagem] = useState("");
    const [erro, setErro] = useState(false);
    const [tentativa, setTentativa] = useState(0);
    const [copiado, setCopiado] = useState(false);
    const [erroCopia, setErroCopia] = useState("");
    const dialogRef = useRef(null);
    const closeRef = useRef(null);
    const timerCopiaRef = useRef(null);
    const payload = montarPayloadPix({ chave, valor: pagamento.valorTotal, nome: pagamento.nome, cidade: undefined });

    useEffect(() => {
        let cancelado = false;
        setImagem("");
        setErro(false);
        QRCode.toDataURL(payload, { errorCorrectionLevel: "M", margin: 1, width: 360 })
            .then((data) => { if (!cancelado) setImagem(data); })
            .catch(() => { if (!cancelado) setErro(true); });
        return () => { cancelado = true; };
    }, [payload, tentativa]);

    useEffect(() => {
        const overflowAnterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();
        const keydown = (event) => {
            if (event.key === "Escape") onClose();
            if (event.key !== "Tab" || !dialogRef.current) return;
            const focusables = dialogRef.current.querySelectorAll("button, input");
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener("keydown", keydown);
        return () => {
            document.removeEventListener("keydown", keydown);
            document.body.style.overflow = overflowAnterior;
        };
    }, [onClose]);

    useEffect(() => () => window.clearTimeout(timerCopiaRef.current), []);

    async function copiar() {
        let ok = false;
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(payload);
                ok = true;
            }
        } catch { ok = false; }
        if (!ok) {
            const campo = dialogRef.current?.querySelector("#codigoPix");
            campo?.select();
            try { ok = Boolean(document.execCommand("copy")); } catch { ok = false; }
        }
        setCopiado(ok);
        setErroCopia(ok ? "" : "Não foi possível copiar. Selecione o código e copie manualmente.");
        window.clearTimeout(timerCopiaRef.current);
        timerCopiaRef.current = window.setTimeout(() => { setCopiado(false); setErroCopia(""); }, 2000);
    }

    return (
        <div className={style.fundoQr} role="dialog" aria-modal="true" aria-labelledby="tituloQr"
            onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
            <div className={style.cardQr} ref={dialogRef}>
                <div className={style.corpoQr}>
                    <div className={style.faixaQr}>
                        <div className={style.cabecalhoQr}>
                            <div>
                                <h2 id="tituloQr">Pagamento via PIX</h2>
                                <p className={style.destinoQr}>
                                    {pagamento.nome} <span>· {pagamento.area}</span>
                                </p>
                            </div>
                            <button ref={closeRef} type="button" className={style.fecharQr} onClick={onClose} aria-label="Fechar">
                                <X size={16} />
                            </button>
                        </div>
                        <strong className={style.valorQr}>{formatBRL(pagamento.valorTotal)}</strong>
                    </div>

                    <div className={style.centroQr}>
                        <div className={style.molduraQr}>
                            {imagem ? (
                                <img className={style.imagemQr} src={imagem} alt="QR Code PIX" />
                            ) : erro ? (
                                <div className={style.erroQr}>
                                    <p>Não foi possível gerar o QR Code</p>
                                    <button type="button" onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</button>
                                </div>
                            ) : (
                                <div className={style.carregandoQr}>Gerando QR Code...</div>
                            )}
                        </div>
                        <p className={style.statusPagtoQr}><Clock size={14} aria-hidden="true" /> Aguardando pagamento</p>
                        <p className={style.chaveQr}>Chave {tipoChavePix[tipo]} · {mascararChavePix(chave, tipo)}</p>
                    </div>

                    <div className={style.codigoQr}>
                        <div className={style.divisorQr}><span>ou copie o código</span></div>
                        <label className={style.rotuloCodigo} htmlFor="codigoPix">PIX copia e cola</label>
                        <div className={style.campoCopiaQr}>
                            <input id="codigoPix" type="text" readOnly value={payload} onFocus={(event) => event.target.select()} />
                            <button type="button" className={style.btnCopiarQr} onClick={copiar}>
                                {copiado ? <Check size={14} /> : <Copy size={14} />}
                                {copiado ? "Copiado" : "Copiar"}
                            </button>
                        </div>
                        <p className={style.statusCopia} role="status" aria-live="polite">{erroCopia}</p>
                    </div>
                </div>

                <div className={style.acoesQr}>
                    <button type="button" className={style.btnMarcarQr} onClick={() => onPagar(pagamento.id, "PIX")}>
                        <Check size={16} /> Marcar como pago via PIX
                    </button>
                    <button type="button" className={style.btnFecharQr} onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalQrPix;
