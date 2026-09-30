import style from "../css/Avaliacoes.module.css";
import { StarIcon, X } from "lucide-react";
import { useState } from "react";

function ModalAvaliacao({ funcionario, onFechar }) {

    const [nota, setNota] = useState(0);

    return (
        <div className={style.overlayModal}>

            <div className={style.modalAvaliacao}>

                <div className={style.headerModal}>
                    <div>
                        <h2>Nova Avaliação</h2>
                        <p>{funcionario.nome}</p>
                    </div>

                    <button onClick={onFechar}>
                        <X />
                    </button>
                </div>

                <div className={style.conteudoModal}>

                    <p>Como você avalia o desempenho?</p>

                    <div className={style.estrelasModal}>

                        {[1, 2, 3, 4, 5].map((estrela) => (
                            <StarIcon
                                key={estrela}
                                onClick={() => setNota(estrela)}
                                className={estrela <= nota ? style.estrelaSelecionada : ""}
                            />
                        ))}

                    </div>

                    <p>Nota: {nota}</p>

                    <textarea
                        placeholder="Escreva um comentário sobre o desempenho..."
                    />

                </div>

                <div className={style.footerModal}>

                    <button onClick={onFechar}>
                        Cancelar
                    </button>

                    <button>
                        Avaliar
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ModalAvaliacao;