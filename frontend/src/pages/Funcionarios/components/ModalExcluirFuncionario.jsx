import { X, Trash2 } from "lucide-react";
import style from "../css/Funcionarios.module.css";

function ModalExcluirFuncionario({ aberto, onFechar, funcionario, onConfirmar }) {

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
                        onClick={onConfirmar}
                    >
                        Excluir
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ModalExcluirFuncionario;