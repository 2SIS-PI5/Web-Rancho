import { X, Trash2 } from "lucide-react";
import style from "../css/Funcionarios.module.css";
import { useState } from "react";

function ModalExcluirFuncionario({ aberto, onFechar, funcionario, onConfirmar }) {
    const [erro, setErro] = useState("");

    if (!aberto || !funcionario) {
        return null;
    }

    return (
        <div className={style.overlay} onClick={onFechar}>

            <div
                className={style.modalExcluirFuncionario}
                onClick={(e) => e.stopPropagation()}
            >

                <div className={style.modalExcluirHeader}>
                    <div className={style.iconeExcluir}>
                        <Trash2 />
                    </div>

                    <button
                        className={style.btnFecharModal}
                        onClick={onFechar}
                    >
                        <X />
                    </button>
                </div>

                <div className={style.conteudoModalExcluir}>

                    <h2>Excluir funcionário?</h2>

                    <p>
                        Tem certeza que deseja excluir o funcionário
                        <strong> {funcionario.nome}</strong>?
                    </p>

                    <span>
                        Essa ação não poderá ser desfeita.
                    </span>

                </div>

                <div className={style.btnsModalExcluir}>

                    <button
                        className={style.btnCancelarExclusao}
                        onClick={onFechar}
                    >
                        Cancelar
                    </button>

                    <button
                        className={style.btnConfirmarExclusao}
                        onClick={async () => {
                            setErro("");
                            try { await onConfirmar(); } catch (error) { setErro(error.response?.data?.message || error.response?.data || "Não foi possível desativar o funcionário."); }
                        }}
                    >
                        Excluir
                    </button>

                </div>
                {erro && <p>{erro}</p>}

            </div>

        </div>
    );
}

export default ModalExcluirFuncionario;