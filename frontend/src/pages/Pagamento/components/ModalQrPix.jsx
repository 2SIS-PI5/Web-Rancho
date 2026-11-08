import { useEffect, useRef, useState } from "react";
import { Copy, X } from "lucide-react";
import QRCode from "qrcode";
import style from "../css/Pagamento.module.css";
import { formatBRL } from "../../../utils/formatadores";
import { montarPayloadPix, mascararChavePix, tipoChavePix } from "../../../utils/pix";

function ModalQrPix({ pagamento, chave, tipo, onClose, onPagar }) {
  const [imagem, setImagem] = useState("");
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [copiado, setCopiado] = useState("");
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const payload = montarPayloadPix({ chave, valor: pagamento.valorTotal, nome: pagamento.nome, cidade: undefined });

  useEffect(() => {
    let cancelado = false;
    setImagem("");
    setErro(false);
    QRCode.toDataURL(payload, { errorCorrectionLevel: "M", margin: 2, width: 320 })
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
      const focusables = dialogRef.current.querySelectorAll("button, textarea");
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

  async function copiar() {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
        ok = true;
      }
    } catch { ok = false; }
    if (!ok) {
      const textarea = dialogRef.current?.querySelector("textarea");
      textarea?.select();
      try { ok = Boolean(document.execCommand("copy")); } catch { ok = false; }
    }
    setCopiado(ok ? "Copiado!" : "Não foi possível copiar. Selecione e copie manualmente.");
    window.setTimeout(() => setCopiado(""), 1500);
  }

  return (
    <div className={style.fundoQr} role="dialog" aria-modal="true" aria-labelledby="tituloQr"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className={style.cardQr} ref={dialogRef}>
        <div className={style.cabecalhoQr}>
          <h2 id="tituloQr">Pagamento via PIX</h2>
          <button ref={closeRef} type="button" className={style.fecharQr} onClick={onClose} aria-label="Fechar"><X /></button>
        </div>
        <p className={style.destinoQr}>{pagamento.nome} · {pagamento.area}</p>
        {imagem ? <img className={style.imagemQr} src={imagem} alt="QR Code PIX" /> : erro ? (
          <div className={style.erroQr}><p>Não foi possível gerar o QR Code</p><button type="button" onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</button></div>
        ) : <div className={style.carregandoQr}>Gerando QR Code...</div>}
        <strong className={style.valorQr}>{formatBRL(pagamento.valorTotal)}</strong>
        <p>Nome: {pagamento.nome}</p>
        <p>Chave: {mascararChavePix(chave, tipo)} ({tipoChavePix[tipo]})</p>
        <label className={style.rotuloCodigo} htmlFor="codigoPix">PIX copia e cola</label>
        <textarea id="codigoPix" readOnly value={payload} />
        <button type="button" className={style.btnCopiarQr} onClick={copiar}><Copy size={16} /> Copiar código</button>
        {copiado && <p className={style.statusCopia}>{copiado}</p>}
        <div className={style.acoesQr}>
          <button type="button" className={style.btnMarcarQr} onClick={() => onPagar(pagamento.id, "PIX")}>Marcar como pago via PIX</button>
          <button type="button" className={style.btnFecharQr} onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalQrPix;
