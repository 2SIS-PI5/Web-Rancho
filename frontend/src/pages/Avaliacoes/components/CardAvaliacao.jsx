import style from "../css/Avaliacoes.module.css";
import Estrelas from "../../../components/Estrelas";

function CardAvaliacao({ index, nome, area, mediaAvaliacao, qtdAvaliacoes, onAvaliar, onVerAvaliacoes }) {
    const quantidade = Number(qtdAvaliacoes) || 0;
    const media = Number(mediaAvaliacao) || 0;
    return (
        <div className={style.cardAvaliacao} key={index}>
            <div className={style.infoFunc}>
                <p>{nome}</p>
                <p>{area}</p>
            </div>
            <div className={style.avaliacaoFunc}>
                <p>{quantidade > 0 ? media.toFixed(1) : ""}</p><Estrelas valor={quantidade ? media : 0} tamanho={16} />
                {quantidade > 0 && <span className={style.divisor}>|</span>}
                <span>{quantidade > 0 ? `${quantidade} ${quantidade === 1 ? "Avaliação" : "Avaliações"}` : "Sem avaliações"}</span>
            </div>
            <div className={style.acoesAvaliacao}>
            <button className={style.btnVerAvaliacoes} disabled={!quantidade} onClick={onVerAvaliacoes}>Ver avaliações</button>
            <button className={style.btnAvaliarFunc} onClick={onAvaliar}>
                <p>Avaliar</p>
            </button>
            </div>
        </div>
    )
}

export default CardAvaliacao;
