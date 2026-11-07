import style from "../css/Funcionarios.module.css";

import { Pencil, Trash2, Phone, MapPin, Route, KeyRound, Bus, Check, Minus } from "lucide-react";
import { classificarDistanciaKm, formatTelefone, formatCep, formatDistanciaKm, formatValorBRL, onlyDigits } from "../../../utils/formatadores";
import { corDoSetor } from "../../../utils/setores";
import { useEffect, useState } from "react";
import { calcularDistanciaAteRancho } from "../../../services/distancia";

function CardFuncionario({ nome, area, telefone, cep, distanciaKm, chavePix, valorDiaria,
    ajudaTransporte, status, onEditar, onExcluir }) {
    const [copiado, setCopiado] = useState(false);
    const [resultadoDistancia, setResultadoDistancia] = useState({ cep: "", km: null });
    const iniciais = String(nome || "").split(" ").filter(Boolean).slice(0, 2).map((parte) => parte[0]).join("").toUpperCase() || "—";
    const cor = corDoSetor(area);
    const distanciaDaApi = formatDistanciaKm(distanciaKm) !== "Distância indisponível";

    useEffect(() => {
        let ativo = true;
        const cepCompleto = onlyDigits(cep);

        if (distanciaDaApi || cepCompleto.length !== 8) return () => { ativo = false; };

        calcularDistanciaAteRancho(cepCompleto)
            .then((distancia) => { if (ativo) setResultadoDistancia({ cep: cepCompleto, km: distancia }); })
            .catch(() => { if (ativo) setResultadoDistancia({ cep: cepCompleto, km: null }); });

        return () => { ativo = false; };
    }, [cep, distanciaDaApi]);

    const cepCompleto = onlyDigits(cep);
    const resultadoAtual = resultadoDistancia.cep === cepCompleto && cepCompleto.length === 8;
    const distanciaExibida = distanciaDaApi
        ? formatDistanciaKm(distanciaKm)
        : resultadoAtual
            ? formatDistanciaKm(resultadoDistancia.km)
            : cepCompleto.length === 8
                ? "Calculando..."
                : formatDistanciaKm(null);
    const classificacaoDistancia = classificarDistanciaKm(
        distanciaDaApi ? distanciaKm : resultadoAtual ? resultadoDistancia.km : null
    );

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
                <p title="Distância em linha reta até o Rancho"><Route /><span>Distância</span><b>{distanciaExibida}</b>{classificacaoDistancia && <span className={classificacaoDistancia === "Perto" ? style.distanciaPerto : style.distanciaLonge}>{classificacaoDistancia}</span>}</p>
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