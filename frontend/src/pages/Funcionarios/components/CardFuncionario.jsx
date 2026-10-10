import style from "../css/Funcionarios.module.css";

import { Star, Pencil, Trash2 } from "lucide-react";
import { formatTelefone, formatCep, formatValorBRL } from "../../../utils/formatadores";

function CardFuncionario({ nome, area, media, qtdAvaliacoes, telefone, cep, chavePix, valorDiaria,
    ajudaTransporte, onEditar, onExcluir }) {
    const quantidade = Number(qtdAvaliacoes) || 0;
    const mediaNumerica = Number(media) || 0;
    const estrelasPreenchidas = Math.max(0, Math.min(5, Math.round(mediaNumerica)));
    return (
        <div className={style.cardFuncionario}>
            <div className={style.nomeAreaLocalizacao}>
                <p className={style.nomeFuncionario}>{nome}</p>
                <p className={style.areaFuncionario}>{area}</p>
            </div>
            <div className={style.estrelasFuncionario}> 
                {[1, 2, 3, 4, 5].map((estrela) => <Star key={estrela} fill={estrela <= estrelasPreenchidas ? "currentColor" : "none"} />)}
                <p>{quantidade > 0 ? `${mediaNumerica.toFixed(1)} (${quantidade} ${quantidade === 1 ? "avaliação" : "avaliações"})` : "Sem avaliações"}</p>
            </div>
            <div className={style.infosFuncionario}>
                <p>Telefone: <span className={style.telefoneFuncionario}>{formatTelefone(telefone)}</span></p>
                <p>CEP: <span className={style.cepFuncionario}>{formatCep(cep)}</span></p>
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