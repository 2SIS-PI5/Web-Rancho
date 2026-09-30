import style from "../css/Escala.module.css";

import { Plus, X, User, Search } from "lucide-react";

import { useState } from "react";

function AreaEscala({ area, diaSemana, data }) {
    const [modalAdicionar, setModalAdicionar] = useState(null);

    function abrirModalAdicionar(area, dia) {
        setModalAdicionar({ area, dia });
    }

    function fecharModalAdicionar() {
        setModalAdicionar(null);
    }

    const funcionariosArea = [
        {
            id: 1,
            nome: "Ryan",
            telefone: "(11) 91077-0886"
        },
        {
            id: 2,
            nome: "Rafael",
            telefone: "(11) 91077-0886"
        },
        {
            id: 3,
            nome: "Heloisa",
            telefone: "(11) 91077-0886"
        },
        {
            id: 4,
            nome: "Felipe",
            telefone: "(11) 91077-0886"
        },
        {
            id: 5,
            nome: "Samuel",
            telefone: "(11) 91077-0886"
        },
        {
            id: 6,
            nome: "Laura",
            telefone: "(11) 91077-0886"
        },


    ]

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
                        key={index}
                        className={`${style.cardFuncEscalado} ${area.id === "cozinha"
                                ? style.cozinha
                                : area.id === "salao"
                                    ? style.salao
                                    : style.atividades
                            }`}
                    >
                        <p>{func.nome}</p>

                        <button className={style.btnRemoverFunc}>
                            <X />
                        </button>
                    </div>
                ))}
            </div>

            <div className={style.btnAdicionar}>
                <button onClick={abrirModalAdicionar} className={style.btnAdicionarFuncArea}>
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
                                {funcionariosArea.map((f, index) => (
                                    <label className={style.cardFuncionario} key={f.id}>
                                        <div className={style.fotoFuncionario}>
                                            <User />
                                        </div>

                                        <div className={style.infosFuncionario}>
                                            <p>{f.nome}</p>
                                            <p>{f.telefone}</p>
                                        </div>

                                        <div className={style.btnFuncionarioSelecionado}>
                                            <input type="checkbox" />
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <button
                                className={style.btnAddFuncionarioEscala}
                                onClick={() => {
                                    alert("Cadastrado com sucesso!");
                                    fecharModalAdicionar();
                                }}>
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