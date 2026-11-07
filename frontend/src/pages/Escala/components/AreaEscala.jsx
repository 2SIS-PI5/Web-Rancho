import style from "../css/Escala.module.css";
import { Plus, X, User, Search, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { classificarDistanciaKm, formatTelefone, formatDistanciaKm, onlyDigits } from "../../../utils/formatadores";
import { calcularDistanciaAteRancho } from "../../../services/distancia";

function DistanciaFuncionario({ cep, distanciaKm }) {
    const [resultado, setResultado] = useState({ cep: "", km: null });
    const cepCompleto = onlyDigits(cep);
    const distanciaDaApi = classificarDistanciaKm(distanciaKm) !== null;

    useEffect(() => {
        let ativo = true;
        if (distanciaDaApi || cepCompleto.length !== 8) return () => { ativo = false; };

        calcularDistanciaAteRancho(cepCompleto)
            .then((km) => { if (ativo) setResultado({ cep: cepCompleto, km }); })
            .catch(() => { if (ativo) setResultado({ cep: cepCompleto, km: null }); });

        return () => { ativo = false; };
    }, [cepCompleto, distanciaDaApi]);

    const resultadoAtual = resultado.cep === cepCompleto && cepCompleto.length === 8;
    const distanciaAtual = distanciaDaApi ? distanciaKm : resultadoAtual ? resultado.km : null;
    const textoDistancia = distanciaDaApi || resultadoAtual
        ? formatDistanciaKm(distanciaAtual)
        : cepCompleto.length === 8
            ? "Calculando..."
            : formatDistanciaKm(null);
    const classificacao = classificarDistanciaKm(distanciaAtual);

    return (
        <span className={style.distanciaFuncionario} title="Distância em linha reta até o Rancho" aria-live="polite">
            <MapPin size={13} aria-hidden="true" />
            {textoDistancia}
            {classificacao && <span className={classificacao === "Perto" ? style.distanciaPerto : style.distanciaLonge}>{classificacao}</span>}
        </span>
    );
}

function AreaEscala({
    area,
    diaSemana,
    data,
    funcionarios,
    selecionados,
    onToggle,
    onAtualizarSelecionados,
    onAviso,
    mutando,
    selecionadosTemporarios,
    setSelecionadosTemporarios,
    editando
}) {

    const [modalAdicionar, setModalAdicionar] = useState(false);
    const [pesquisaFuncionario, setPesquisaFuncionario] = useState("");

    function abrirModalAdicionar() {
        if (mutando) return;

        if (!editando) {
            onAviso();
            return;
        }

        setSelecionadosTemporarios([...selecionados]);
        setModalAdicionar(true);
    }

    function fecharModalAdicionar() {
        setModalAdicionar(false);
        setSelecionadosTemporarios(null);
    }

    function alternarFuncionarioTemporario(id) {
        if (!editando || mutando) return;

        setSelecionadosTemporarios((atuais) => {
            const selecionadosAtuais = atuais ?? [];

            return selecionadosAtuais.includes(id)
                ? selecionadosAtuais.filter((atual) => atual !== id)
                : [...selecionadosAtuais, id];
        });
    }

    function confirmarAdicao() {
        if (!editando || mutando) return;

        onAtualizarSelecionados(selecionadosTemporarios ?? []);

        fecharModalAdicionar();
    }

    function removerFuncionario(id) {
        if (mutando) return;

        if (!editando) {
            onAviso();
            return;
        }

        onToggle(id);
    }

    const funcionariosArea = funcionarios.filter(
        (funcionario) => funcionario.setor === area.nome
    );

    const funcionariosFiltrados = funcionariosArea.filter((f) => {
        const pesquisa = pesquisaFuncionario.toLowerCase().trim();

        return (
            f.nome?.toLowerCase().includes(pesquisa) ||
            f.telefone?.includes(pesquisa)
        );
    });

    const funcionariosEscalados = funcionariosArea
        .filter((funcionario) => selecionados.includes(funcionario.id))
        .map((funcionario) => ({
            id: funcionario.id,
            nome: funcionario.nome
        }));

    const funcionariosEscaladosExibidos = funcionariosArea
        .filter((funcionario) =>
            (selecionadosTemporarios ?? []).includes(funcionario.id)
        )
        .map((funcionario) => ({
            id: funcionario.id,
            nome: funcionario.nome
        }));

    const funcionariosExibidos = modalAdicionar
        ? funcionariosEscaladosExibidos
        : funcionariosEscalados;

    return (
        <div className={style.area}>
            <div className={style.tituloArea}>
                <div className={style.bolinhaArea}></div>

                <p className={style.areaEscala}>{area.nome}</p>

                <p className={style.qtdEscaladosArea}>
                    ({funcionariosExibidos.length})
                </p>
            </div>

            <div className={style.painelEscalados}>
                {funcionariosExibidos.map((func) => (
                    <div key={func.id}
                        className={`${style.cardFuncEscalado} ${area.nome === "Cozinha"
                            ? style.cozinha
                            : area.nome === "Salão"
                                ? style.salao
                                : style.atividades
                            }`}
                    >
                        <p>
                            {func.nome.split(" ")[0]}

                            {funcionariosEscalados.filter(
                                (f) =>
                                    f.nome.split(" ")[0] ===
                                    func.nome.split(" ")[0]
                            ).length > 1 &&
                                ` ${func.nome.split(" ")[1]?.charAt(0)}.`}
                        </p>

                        <button
                            type="button"
                            className={style.btnRemoverFunc}
                            disabled={mutando}
                            onClick={() => removerFuncionario(func.id)}
                            title={
                                !editando
                                    ? "Clique em Editar para realizar alterações"
                                    : "Remover funcionário da escala"
                            }
                        >
                            <X />
                        </button>
                    </div>
                ))}
            </div>

            <div className={style.btnAdicionar}>
                <button
                    type="button"
                    disabled={mutando}
                    onClick={abrirModalAdicionar}
                    className={style.btnAdicionarFuncArea}
                >
                    <Plus />
                    <p>Adicionar {area.nome}</p>
                </button>
            </div>

            {modalAdicionar && editando && (
                <div className={style.overlay} onClick={fecharModalAdicionar}>
                    <div className={style.modalAdicionarFuncionario} onClick={(e) => e.stopPropagation()}>
                        <div className={style.modalHeader}>
                            <div className={style.tituloModalAddFuncArea}>
                                <div className={style.corArea}></div>

                                <h2>{area.nome}</h2>

                                <p> - {diaSemana}, {data}</p>
                            </div>

                            <button
                                type="button"
                                className={style.btnFecharModal}
                                onClick={fecharModalAdicionar}
                            >
                                <X />
                            </button>
                        </div>

                        <div className={style.painelFuncionariosArea}>
                            <div className={style.inputPesquisa}>
                                <Search />

                                <input
                                    type="text"
                                    placeholder="Buscar funcionário..."
                                    value={pesquisaFuncionario}
                                    onChange={(e) => setPesquisaFuncionario(e.target.value)}
                                />
                            </div>

                            <div className={style.listaFuncionarios}>
                                {funcionariosFiltrados.map((f) => (
                                    <label className={style.cardFuncionario} key={f.id}>
                                        <div className={style.fotoFuncionario}>
                                            <User />
                                        </div>

                                        <div className={style.infosFuncionario}>
                                            <p>{f.nome}</p>
                                            <div className={style.contatoDistancia}>
                                                <span>{formatTelefone(f.telefone)}</span>
                                                <DistanciaFuncionario cep={f.cep} distanciaKm={f.distanciaKm} />
                                            </div>
                                        </div>

                                        <div className={style.btnFuncionarioSelecionado}>
                                            <input
                                                type="checkbox"
                                                disabled={!editando || mutando}
                                                checked={(selecionadosTemporarios ?? []).includes(f.id)}
                                                onChange={() => alternarFuncionarioTemporario(f.id)}
                                            />
                                        </div>
                                    </label>
                                ))}

                                {funcionariosFiltrados.length === 0 && (
                                    <p className={style.mensagemVazia}>
                                        Nenhum funcionário encontrado.
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                className={style.btnAddFuncionarioEscala}
                                disabled={!editando || mutando}
                                onClick={confirmarAdicao}
                            >
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