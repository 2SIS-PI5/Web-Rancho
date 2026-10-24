import style from "../css/Avaliacoes.module.css";
import { X } from "lucide-react";
import { useState } from "react";
import api from "../../../services/api";
import Estrelas from "../../../components/Estrelas";

function ModalAvaliacao({ funcionario, onFechar, onSalvo }) {

    const [nota, setNota] = useState(0);
    const [descricao, setDescricao] = useState("");
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [notaHover, setNotaHover] = useState(0);

    async function salvar() {
        if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
            setErro("A nota deve ser um número inteiro entre 1 e 5.");
            return;
        }
        if (descricao.length > 255) {
            setErro("A descrição deve ter até 255 caracteres.");
            return;
        }
        setSalvando(true);
        setErro("");
        try {
            const payload = { nota: Number(nota) };
            const descricaoTratada = descricao.trim();
            if (descricaoTratada) payload.descricao = descricaoTratada;
            await api.post(`/avaliacao/${funcionario.funcionarioId}`, payload);
            await onSalvo();
            onFechar();
        } catch (error) {
            const data = error.response?.data;
            setErro(data?.message || (typeof data === "string" ? data : "Não foi possível salvar a avaliação."));
        } finally {
            setSalvando(false);
        }
    }

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

                    <div className={style.estrelasModal} onMouseLeave={() => setNotaHover(0)}
                        onMouseMove={(event) => setNotaHover(Math.ceil((event.nativeEvent.offsetX / event.currentTarget.offsetWidth) * 5))}>
                        <Estrelas valor={nota} valorVisual={notaHover || nota} tamanho={30} interativo onSelecionar={setNota} />
                    </div>

                    <p>Nota: {nota}</p>

                    <textarea
                        placeholder="Escreva um comentário sobre o desempenho..."
                        value={descricao}
                        maxLength={255}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                    <p>{descricao.length}/255</p>
                    {erro && <p>{erro}</p>}

                </div>

                <div className={style.footerModal}>

                    <button onClick={onFechar}>
                        Cancelar
                    </button>

                    <button disabled={salvando} onClick={salvar}>
                        {salvando ? "Salvando..." : "Avaliar"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ModalAvaliacao;