import style from "../css/Avaliacoes.module.css";
import { StarIcon } from "lucide-react";

function CardAvaliacao({ index, nome, area, mediaAvaliacao, qtdAvaliacoes, onAvaliar }) {
    return (
        <div className={style.cardAvaliacao} key={index}>
            <div className={style.infoFunc}>
                <p>{nome}</p>
                <p>{area}</p>
            </div>
            <div className={style.avaliacaoFunc}>
                <div className={style.estrelas}>
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                </div>
                <p>{mediaAvaliacao}</p>
            </div>
            <div className={style.qtdAvaliacoes}>
                <p>{qtdAvaliacoes} avaliação(ões)</p>
            </div>
            <button className={style.btnAvaliarFunc} onClick={onAvaliar}>
                <p>Avaliar</p>
            </button>
        </div>
    )
}

export default CardAvaliacao;

