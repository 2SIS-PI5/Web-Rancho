import { useState, useEffect } from "react";
import { X } from "lucide-react";
import style from "../css/Funcionarios.module.css";
import api from "../../../services/api";
import { maskTelefone, maskCep, maskMoedaCentavos, onlyDigits } from "../../../utils/formatadores";

function ModalFuncionario({ aberto, onFechar, funcionario, setores, onSalvo }) {

    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cep, setCep] = useState("");
    const [chavePix, setChavePix] = useState("");
    const [area, setArea] = useState("");
    const [valorDiaria, setValorDiaria] = useState("");
    const [ajudaTransporte, setAjudaTransporte] = useState(false);
    const [erro, setErro] = useState("");
    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);

    const modoEdicao = !!funcionario;

    useEffect(() => {
    setErro("");
    setErros({});
    if (funcionario) {
        const valor = Number(String(funcionario.valorDiaria ?? "").replace(",", "."));
        setNome(String(funcionario.nome ?? ""));
        setTelefone(maskTelefone(funcionario.telefone));
        setCep(maskCep(funcionario.cep ?? ""));
        setChavePix(String(funcionario.chavePix ?? ""));
        setArea(String(funcionario.setorId ?? ""));
        setValorDiaria(Number.isFinite(valor) ? maskMoedaCentavos(String(Math.round(valor * 100))) : "");
        setAjudaTransporte(Boolean(funcionario.ajudaTransporte));
    } else {
        setNome("");
        setTelefone("");
        setCep("");
        setChavePix("");
        setArea(setores[0]?.id ?? "");
        setValorDiaria("");
        setAjudaTransporte(false);
    }
}, [funcionario, aberto, setores]);

    if (!aberto) {
        return null;
    }

    function validar() {
        const nomeLimpo = nome.trim();
        const telefoneDigitos = onlyDigits(telefone);
        const cepDigitos = onlyDigits(cep);
        const pixLimpo = chavePix.trim();
        const valor = Number(onlyDigits(valorDiaria)) / 100;
        const novosErros = {};
        if (nomeLimpo.length < 2 || nomeLimpo.length > 100 || !/^[\p{L}][\p{L}\s'-]*$/u.test(nomeLimpo)) novosErros.nome = "Informe um nome válido entre 2 e 100 caracteres.";
        if (![10, 11].includes(telefoneDigitos.length) || Number(telefoneDigitos.slice(0, 2)) < 11) novosErros.telefone = "Informe um telefone válido com DDD.";
        if (cepDigitos.length !== 8) novosErros.cep = "Informe um CEP com 8 dígitos.";
        if (!pixLimpo || pixLimpo.length > 100) novosErros.chavePix = "Informe uma chave PIX de até 100 caracteres.";
        if (!setores.some((setor) => setor.id === Number(area))) novosErros.area = "Selecione uma área válida.";
        if (!valor || valor > 99999.99) novosErros.valorDiaria = "Informe uma diária entre R$ 0,01 e R$ 99.999,99.";
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    async function cadastrarFuncionario() {
        if (!validar()) return;
        setErro("");
        setSalvando(true);
        try {
            const payload = { nome: nome.trim(), telefone: onlyDigits(telefone), cep: onlyDigits(cep), chavePix: chavePix.trim(), setorId: Number(area), valorDiaria: Number(onlyDigits(valorDiaria)) / 100, ajudaTransporte };
            if (modoEdicao) await api.put(`/funcionarios/${funcionario.id}`, payload);
            else await api.post("/funcionarios", payload);
            await onSalvo();
            onFechar();
        } catch (error) {
            const data = error.response?.data;
            setErro(data?.message || (typeof data === "string" ? data : "Não foi possível salvar o funcionário."));
        } finally {
            setSalvando(false);
        }
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
                                maxLength={100}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                            {erros.nome && <span className={style.erroCampo}>{erros.nome}</span>}
                        </div>

                        <div className={style.inputInfo}>
                            <p>Telefone</p>

                            <input
                                type="text"
                                placeholder="(XX) XXXXX-XXXX"
                                inputMode="numeric"
                                autoComplete="tel"
                                maxLength={15}
                                value={telefone}
                                onChange={(e) => setTelefone(maskTelefone(e.target.value))}
                            />
                            {erros.telefone && <span className={style.erroCampo}>{erros.telefone}</span>}
                        </div>
                    </div>

                    <div className={style.duplaInputs}>

                        <div className={style.inputInfo}>
                            <p>CEP</p>

                            <input
                                type="text"
                                placeholder="00000-000"
                                inputMode="numeric"
                                autoComplete="postal-code"
                                maxLength={9}
                                value={cep}
                                onChange={(e) => setCep(maskCep(e.target.value))}
                            />
                            {erros.cep && <span className={style.erroCampo}>{erros.cep}</span>}
                        </div>

                        <div className={style.inputInfo}>
                            <p>Chave PIX</p>

                            <input
                                type="text"
                                maxLength={100}
                                value={chavePix}
                                onChange={(e) => setChavePix(e.target.value)}
                            />
                            {erros.chavePix && <span className={style.erroCampo}>{erros.chavePix}</span>}
                        </div>

                    </div>

                    <div className={style.duplaInputs}>
                        <div className={style.inputInfo}>
                            <p>Área de Atuação</p>

                            <select name="areaFuncionario" id="areaFuncionario" 
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                            >
                                {setores.map((setor) => <option key={setor.id} value={setor.id}>{setor.nome}</option>)}
                            </select>
                            {erros.area && <span className={style.erroCampo}>{erros.area}</span>}
                        </div>

                        <div className={style.inputInfo}>
                            <p>Valor da Diária (R$)</p>

                            <input
                                type="text"
                                placeholder="R$"
                                inputMode="numeric"
                                maxLength={10}
                                value={valorDiaria}
                                onChange={(e) => setValorDiaria(maskMoedaCentavos(e.target.value))}
                            />
                            {erros.valorDiaria && <span className={style.erroCampo}>{erros.valorDiaria}</span>}
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
                    {erro && <p>{erro}</p>}
                    <button onClick={onFechar}>
                        <p>Cancelar</p>
                    </button>

                    <button disabled={salvando} onClick={cadastrarFuncionario}>
                        <p>
                            {salvando ? "Salvando..." : modoEdicao ? "Salvar Alterações" : "Adicionar"}
                        </p>
                    </button>
                </div>

            </div>

        </div>
    );
}

export default ModalFuncionario;