import style from "../css/Funcionarios.module.css";

import { Pencil, Trash2, Route, Star, Mail } from "lucide-react";
import { formatTelefone, formatCep, formatDistanciaKm, formatValorBRL, onlyDigits } from "../../../utils/formatadores";
import { useEffect, useState } from "react";
import { calcularDistanciaAteRancho } from "../../../services/distancia";

function CardFuncionario({ nome, area, mediaAvaliacao, qtdAvaliacoes, telefone, cep, distanciaKm, chavePix, valorDiaria,
    ajudaTransporte, email, onEditar, onExcluir }) {
    const quantidade = Number(qtdAvaliacoes) || 0;
    const mediaNumerica = Number(mediaAvaliacao) || 0;
    const estrelasPreenchidas = Math.max(0, Math.min(5, Math.round(mediaNumerica)));
    const [resultadoDistancia, setResultadoDistancia] = useState({ cep: "", km: null });
    const distanciaDaApi = formatDistanciaKm(distanciaKm) !== "Indisponível";

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

    return (
        <div className={style.cardFuncionario}>
            <div className={style.nomeAreaLocalizacao}>
                <p className={style.nomeFuncionario}>{nome}</p>
                <p className={style.areaFuncionario}>{area}</p>
            </div>
            <div className={style.estrelasFuncionario}>
                {[1, 2, 3, 4, 5].map((estrela) => (
                    <Star
                        key={estrela}
                        fill={estrela <= estrelasPreenchidas ? "currentColor" : "none"}
                    />
                ))}

                <p>{quantidade > 0 ? mediaNumerica.toFixed(1) : "Sem avaliações"}</p>
            </div>
            <div className={style.infosFuncionario}>
                <p>Telefone: <span className={style.telefoneFuncionario}>{formatTelefone(telefone)}</span></p>
                <p><Mail size={15} /> E-mail: <span title={email || ""} className={style.telefoneFuncionario} style={{ display: "inline-block", maxWidth: "125px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", verticalAlign: "bottom" }}>{email || "—"}</span></p>
                <p>CEP: <span className={style.cepFuncionario}>{formatCep(cep)} - <b
                    className={
                        distanciaExibida === "Indisponível"
                            ? style.distanciaIndisponivel
                            : style.distanciaKmFuncionario
                    }
                >
                    {distanciaExibida}
                </b>
                </span></p>
                <p>Chave PIX:: <span className={style.cepFuncionario}>{chavePix}</span></p>
                <p>Valor Diária: <span className={style.valorDiariaFuncionario}>{formatValorBRL(valorDiaria)}</span></p>
                <p>
                    Ajuda Transporte:{" "}
                    <span className={ajudaTransporte ? style.transporteSim : style.transporteNao}>
                        {ajudaTransporte ? "Sim" : "Não"}
                    </span>
                </p>
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
        </div>
    )
}

export default CardFuncionario;