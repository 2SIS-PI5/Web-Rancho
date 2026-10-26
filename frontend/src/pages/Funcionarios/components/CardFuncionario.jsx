import style from "../css/Funcionarios.module.css";

import { Pencil, Trash2, Phone, MapPin, KeyRound, Bus, Check, Minus } from "lucide-react";
import { formatTelefone, formatCep, formatValorBRL } from "../../../utils/formatadores";
import { corDoSetor } from "../../../utils/setores";
import { useState } from "react";

function CardFuncionario({ nome, area, telefone, cep, chavePix, valorDiaria,
    ajudaTransporte, status, onEditar, onExcluir }) {
    const [copiado, setCopiado] = useState(false);
    const iniciais = String(nome || "").split(" ").filter(Boolean).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase() || "—";
    const cor = corDoSetor(area);
    const copiarPix = async () => {
        if (!chavePix) return;
        try {
            if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(chavePix);
            else { const auxiliar = document.createElement("textarea"); auxiliar.value = chavePix; document.body.appendChild(auxiliar); auxiliar.select(); document.execCommand("copy"); auxiliar.remove(); }
            setCopiado(true); window.setTimeout(() => setCopiado(false), 1500);
        } catch { setCopiado(false); }
    };
    return (
        <article className={style.cardFuncionario} style={{ "--cor-setor": cor }}>
            <div className={style.nomeAreaLocalizacao}>
                <span className={style.avatarFuncionario}>{iniciais}</span><div className={style.identidadeFuncionario}><p className={style.nomeFuncionario} title={nome}>{nome || "—"}</p><span className={style.areaFuncionario}><i />{area || "—"}</span></div>{status && <span className={status === "ATIVO" ? style.statusAtivo : style.statusInativo}>{status === "ATIVO" ? "Ativo" : "Inativo"}</span>}
            </div>
            <div className={style.destaqueDiaria}><span>Valor da diária</span><strong>{formatValorBRL(valorDiaria) || "—"}</strong></div>
            <div className={style.infosFuncionario}>
                <p><Phone /><span>Telefone</span><b title={formatTelefone(telefone)}>{formatTelefone(telefone) || "—"}</b></p>
                <p><MapPin /><span>CEP</span><b title={formatCep(cep)}>{formatCep(cep) || "—"}</b></p>
                <p><KeyRound /><span>Chave PIX</span><b title={chavePix || ""}>{chavePix || "—"}</b>{chavePix && <button aria-label={copiado ? "Chave PIX copiada" : "Copiar chave PIX"} onClick={copiarPix}>{copiado ? "Copiado!" : "Copiar"}</button>}</p>
                <p><Bus /><span>Transporte</span><b className={ajudaTransporte ? style.transporteSim : style.transporteNao}>{ajudaTransporte ? <><Check />Sim</> : <><Minus />Não</>}</b></p>
            </div>
            <div className={style.btnsCardFuncionario}>
                <button onClick={onEditar}>
                    <Pencil />
                    <p>Editar</p>
                </button>
                <button onClick={onExcluir}>
                    <Trash2 />
                    <p>Excluir</p>
                </button>
            </div>
        </article>
    )
}

export default CardFuncionario;