import style from "../css/Escala.module.css";

import { Plus, X, User, Search } from "lucide-react";

import { useState } from "react";
import { formatTelefone } from "../../../utils/formatadores";

function AreaEscala({ area, diaSemana, data, funcionarios, selecionados, onToggle, onRemover, escalaId, removendo, mutando }) {
    const [modalAdicionar, setModalAdicionar] = useState(null);

    function abrirModalAdicionar(area, dia) {
        setModalAdicionar({ area, dia });
    }

    function fecharModalAdicionar() {
        setModalAdicionar(null);
    }

    const funcionariosArea = funcionarios.filter((funcionario) => funcionario.setor === area.nome);

    return (
        <div className={style.area}>
            <div className={style.tituloArea}>
                <div className={style.bolinhaArea}></div>
                <p className={style.areaEscala}>{area.nome}</p>
                <p className={style.qtdEscaladosArea}>({area.funcionarios.length})</p>
            </div>

            <div className={style.painelEscalados}>
                {area.funcionarios.map((func, index) => (
                    <div
                        key={func.id}
                        className={`${style.cardFuncEscalado} ${area.id === "cozinha"
                                ? style.cozinha
                                : area.id === "salao"
                                    ? style.salao
                                    : style.atividades
                            }`}
                    >
                        <p>{func.nome}</p>

                        <button className={style.btnRemoverFunc} disabled={mutando || removendo === `${escalaId}-${func.id}`} onClick={() => onRemover(func.id)}>
                            <X />
                        </button>
                    </div>
                ))}
            </div>

            <div className={style.btnAdicionar}>
                <button disabled={mutando} onClick={abrirModalAdicionar} className={style.btnAdicionarFuncArea}>
                    <Plus />
                    <p>Adicionar {area.nome}</p>
                </button>
            </div>

            {modalAdicionar && (
                <div className={style.overlay} onClick={fecharModalAdicionar}>
                    <div className={style.modalAdicionarFuncionario} onClick={(e) => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <div className={style.tituloModalAddFuncArea}>
                                <div className={style.corArea}></div>

                                <h2>{area.nome}</h2>

                                <p> - {diaSemana}, {data}</p>
                            </div>

                            <button className={style.btnFecharModal} onClick={fecharModalAdicionar}>
                                <X />
                            </button>
                        </div>

                        <div className={style.painelFuncionariosArea}>
                            <div className={style.inputPesquisa}>
                                <Search />
                                <input
                                    type="text"
                                    placeholder="Buscar funcionário..."
                                />
                            </div>

                            <div className={style.listaFuncionarios}>
                                {funcionariosArea.map((f) => (
                                    <label className={style.cardFuncionario} key={f.id}>
                                        <div className={style.fotoFuncionario}>
                                            <User />
                                        </div>

                                        <div className={style.infosFuncionario}>
                                            <p>{f.nome}</p>
                                            <p>{formatTelefone(f.telefone)}</p>
                                        </div>

                                        <div className={style.btnFuncionarioSelecionado}>
                                            <input type="checkbox" disabled={mutando} checked={selecionados.includes(f.id)} onChange={() => onToggle(f.id)} />
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <button
                                className={style.btnAddFuncionarioEscala}
                                disabled={mutando}
                                onClick={fecharModalAdicionar}>
                                <p>Adicionar</p>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AreaEscala;