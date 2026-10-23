import style from "../css/Avaliacoes.module.css";
import { StarIcon } from "lucide-react";

function CardAvaliacao({ index, nome, area, mediaAvaliacao, qtdAvaliacoes, ultimaDescricao, onAvaliar }) {
    const quantidade = Number(qtdAvaliacoes) || 0;
    const media = Number(mediaAvaliacao) || 0;
    const estrelasPreenchidas = Math.max(0, Math.min(5, Math.round(media)));
    return (
        <div className={style.cardAvaliacao} key={index}>
            <div className={style.infoFunc}>
                <p>{nome}</p>
                <p>{area}</p>
            </div>
            <div className={style.avaliacaoFunc}>
                <div className={style.estrelas}>
                    {[1, 2, 3, 4, 5].map((estrela) => <StarIcon key={estrela} fill={estrela <= estrelasPreenchidas ? "currentColor" : "none"} />)}
                </div>
                <p>{quantidade > 0 ? media.toFixed(1) : ""}</p>
            </div>
            <div className={style.qtdAvaliacoes}>
                <p>{quantidade > 0 ? `${quantidade} ${quantidade === 1 ? "avaliação" : "avaliações"}` : "Sem avaliações"}</p>
                {ultimaDescricao && <p>{ultimaDescricao}</p>}
            </div>
            <button className={style.btnAvaliarFunc} onClick={onAvaliar}>
                <p>Avaliar</p>
            </button>
        </div>
    )
}

export default CardAvaliacao;
