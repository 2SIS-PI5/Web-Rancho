import { useState, useEffect } from "react";
import { X } from "lucide-react";
import style from "../css/Funcionarios.module.css";

function ModalFuncionario({ aberto, onFechar, funcionario }) {

    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cep, setCep] = useState("");
    const [chavePix, setChavePix] = useState("");
    const [area, setArea] = useState("");
    const [valorDiaria, setValorDiaria] = useState("");
    const [ajudaTransporte, setAjudaTransporte] = useState(false);

    const modoEdicao = funcionario !== null;

    useEffect(() => {
        if (funcionario) {
            setNome(funcionario.nome);
            setTelefone(funcionario.telefone);
            setCep(funcionario.cep);
            setChavePix(funcionario.chavePix);
            setArea(funcionario.area);
            setValorDiaria(funcionario.valorDiaria);
            setAjudaTransporte(funcionario.ajudaTransporte === "Sim");
        } else {
            setNome("");
            setTelefone("");
            setCep("");
            setChavePix("");
            setArea("");
            setValorDiaria("");
            setAjudaTransporte(false);
        }
    }, [funcionario]);

    if (!aberto) {
        return null;
    }

    function cadastrarFuncionario() {
        alert(modoEdicao ? "Funcionário atualizado com sucesso!" : "Cadastrado com sucesso!");

        onFechar();
    }

    return (
        <div className={style.overlay} onClick={onFechar}>
            <div className={style.modalAdicionarFuncionario} onClick={(e) => e.stopPropagation()}>
                <div className={style.modalHeader}>
                    <div className={style.tituloModalAddFunc}>
                        <h2>{modoEdicao ? "Editar Funcionário" : "Novo Funcionário"}</h2>
                    </div>

                    <button className={style.btnFecharModal} onClick={onFechar}>
                        <X />
                    </button>
                </div>

                <div className={style.painelCadastroInfos}>
                    <div className={style.duplaInputs}>
                        <div className={style.inputInfo}>
                            <p>Nome</p>

                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </div>

                        <div className={style.inputInfo}>
                            <p>Telefone</p>

                            <input
                                type="text"
                                placeholder="(XX) XXXXX-XXXX"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={style.duplaInputs}>

                        <div className={style.inputInfo}>
                            <p>CEP</p>

                            <input
                                type="text"
                                placeholder="00000-000"
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                            />
                        </div>

                        <div className={style.inputInfo}>
                            <p>Chave PIX</p>

                            <input
                                type="text"
                                value={chavePix}
                                onChange={(e) => setChavePix(e.target.value)}
                            />
                        </div>

                    </div>

                    <div className={style.duplaInputs}>
                        <div className={style.inputInfo}>
                            <p>Área de Atuação</p>

                            <select name="areaFuncionario" id="areaFuncionario" 
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                            >
                                <option value="Cozinha">
                                    Cozinha
                                </option>

                                <option value="Salão">
                                    Salão
                                </option>

                                <option value="Atividades">
                                    Atividades
                                </option>
                            </select>
                        </div>

                        <div className={style.inputInfo}>
                            <p>Valor da Diária (R$)</p>

                            <input
                                type="text"
                                placeholder="R$"
                                value={valorDiaria}
                                onChange={(e) =>
                                    setValorDiaria(e.target.value)
                                }
                            />
                        </div>

                    </div>

                    <div className={style.inputCheck}>
                        <label className={style.inputCheck}>
                            <input
                                type="checkbox"
                                checked={ajudaTransporte}
                                onChange={(e) =>
                                    setAjudaTransporte(e.target.checked)
                                }
                            />
                            <p>Possui ajuda de transporte</p>
                        </label>
                    </div>
                </div>

                <div className={style.btnModalCadastro}>
                    <button onClick={onFechar}>
                        <p>Cancelar</p>
                    </button>

                    <button onClick={cadastrarFuncionario}>
                        <p>
                            {modoEdicao ? "Salvar Alterações" : "Adicionar"}
                        </p>
                    </button>
                </div>

            </div>

        </div>
    );
}

export default ModalFuncionario;