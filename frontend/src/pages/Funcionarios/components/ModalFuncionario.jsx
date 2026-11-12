import { useState, useEffect } from "react";
import { X } from "lucide-react";
import style from "../css/Funcionarios.module.css";
import api from "../../../services/api";
import { maskTelefone, maskCep, maskMoedaCentavos, onlyDigits, formatDistanciaKm } from "../../../utils/formatadores";
import { calcularDistanciaAteRancho } from "../../../services/distancia";

function ModalFuncionario({ aberto, onFechar, funcionario, setores, onSalvo }) {

    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [cep, setCep] = useState("");
    const [chavePix, setChavePix] = useState("");
    const [area, setArea] = useState("");
    const [valorDiaria, setValorDiaria] = useState("");
    const [ajudaTransporte, setAjudaTransporte] = useState(false);
    const [erro, setErro] = useState("");
    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);
    const [distanciaKm, setDistanciaKm] = useState(null);
    const [calculandoDistancia, setCalculandoDistancia] = useState(false);
    const [erroDistancia, setErroDistancia] = useState("");

    const modoEdicao = !!funcionario;

    useEffect(() => {
        setErro("");
        setErros({});
        if (funcionario) {
            const valor = Number(String(funcionario.valorDiaria ?? "").replace(",", "."));
            setNome(String(funcionario.nome ?? ""));
            setTelefone(maskTelefone(funcionario.telefone));
            setEmail(String(funcionario.email ?? ""));
            setCep(maskCep(funcionario.cep ?? ""));
            setChavePix(String(funcionario.chavePix ?? ""));
            setArea(String(funcionario.setorId ?? setores.find((setor) => setor.nome === funcionario.setor)?.id ?? ""));
            setValorDiaria(Number.isFinite(valor) ? maskMoedaCentavos(String(Math.round(valor * 100))) : "");
            setDistanciaKm(Number.isFinite(Number(funcionario.distanciaKm)) ? Number(funcionario.distanciaKm) : null);
            setAjudaTransporte(Boolean(funcionario.ajudaTransporte));
        } else {
            setNome("");
            setTelefone("");
            setEmail("");
            setCep("");
            setChavePix("");
            setArea(setores[0]?.id ?? "");
            setValorDiaria("");
            setDistanciaKm(null);
            setAjudaTransporte(false);
        }
        setCalculandoDistancia(false);
        setErroDistancia("");
    }, [funcionario, aberto, setores]);

    useEffect(() => {
        const cepCompleto = onlyDigits(cep);
        let ativo = true;

        if (!aberto || cepCompleto.length !== 8) {
            setDistanciaKm(null);
            setCalculandoDistancia(false);
            setErroDistancia("");
            return () => { ativo = false; };
        }

        setDistanciaKm(null);
        setCalculandoDistancia(true);
        setErroDistancia("");

        const temporizador = window.setTimeout(async () => {
            try {
                const distancia = await calcularDistanciaAteRancho(cepCompleto);
                if (ativo) setDistanciaKm(distancia);
            } catch (error) {
                if (ativo) setErroDistancia(error.message || "Não foi possível calcular a distância.");
            } finally {
                if (ativo) setCalculandoDistancia(false);
            }
        }, 350);

        return () => {
            ativo = false;
            window.clearTimeout(temporizador);
        };
    }, [cep, aberto]);

    if (!aberto) {
        return null;
    }

    function alternarAjudaTransporte(ativar) {
        const valorAtual = Number(onlyDigits(valorDiaria)) / 100;

        if (ativar) {
            setValorDiaria(
                maskMoedaCentavos(String(Math.round((valorAtual + 11.90) * 100)))
            );
        } else {
            setValorDiaria(
                maskMoedaCentavos(String(Math.max(0, Math.round((valorAtual - 11.90) * 100))))
            );
        }

        setAjudaTransporte(ativar);
    }

    function validar() {
        const nomeLimpo = nome.trim();
        const telefoneDigitos = onlyDigits(telefone);
        const emailLimpo = email.trim().toLowerCase();
        const cepDigitos = onlyDigits(cep);
        const pixLimpo = chavePix.trim();
        const valor = Number(onlyDigits(valorDiaria)) / 100;
        const novosErros = {};
        if (nomeLimpo.length < 2 || nomeLimpo.length > 100 || !/^[\p{L}][\p{L}\s'-]*$/u.test(nomeLimpo)) novosErros.nome = "Informe um nome válido entre 2 e 100 caracteres.";
        if (![10, 11].includes(telefoneDigitos.length) || Number(telefoneDigitos.slice(0, 2)) < 11) novosErros.telefone = "Informe um telefone válido com DDD.";
        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(emailLimpo) || emailLimpo.length > 254) novosErros.email = "E-mail inválido. Ex.: nome@exemplo.com";
        if (cepDigitos.length !== 8) novosErros.cep = "Informe um CEP com 8 dígitos.";
        if (!pixLimpo || pixLimpo.length > 100) novosErros.chavePix = "Informe uma chave PIX de até 100 caracteres.";
        if (!setores.some((setor) => setor.id === Number(area))) novosErros.area = "Selecione uma área válida.";
        if (!valor || valor > 99999.99) novosErros.valorDiaria = "Informe uma diária entre R$ 0,01 e R$ 99.999,99.";
        if (!Number.isFinite(distanciaKm)) novosErros.distanciaKm = erroDistancia || "Aguarde o cálculo da distância até o Rancho.";
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    async function cadastrarFuncionario() {
        if (!validar()) return;
        setErro("");
        setSalvando(true);
        try {
            const payload = { nome: nome.trim(), telefone: onlyDigits(telefone), email: email.trim().toLowerCase(), cep: onlyDigits(cep), chavePix: chavePix.trim(), setorId: Number(area), valorDiaria: Number(onlyDigits(valorDiaria)) / 100, ajudaTransporte, distanciaKm };
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

                        <div className={style.inputInfo}>
                            <p>E-mail</p>
                            <input
                                type="email"
                                inputMode="email"
                                autoComplete="off"
                                maxLength={254}
                                placeholder="nome@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setEmail(email.trim().toLowerCase())}
                            />
                            {erros.email && <span className={style.erroCampo}>{erros.email}</span>}
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
                            {onlyDigits(cep).length === 8 && <span className={erroDistancia || erros.distanciaKm ? style.erroCampo : style.statusDistancia} aria-live="polite">
                                {calculandoDistancia ? "Calculando distância até o Rancho..." : erros.distanciaKm || erroDistancia || `${formatDistanciaKm(distanciaKm)} em linha reta até o Rancho`}
                            </span>}
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
                                onChange={(e) => alternarAjudaTransporte(e.target.checked)}
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

                    <button disabled={salvando || calculandoDistancia} onClick={cadastrarFuncionario}>                        <p>
                        {salvando ? "Salvando..." : modoEdicao ? "Salvar Alterações" : "Adicionar"}
                    </p>
                    </button>
                </div>

            </div>

        </div>
    );
}

export default ModalFuncionario;