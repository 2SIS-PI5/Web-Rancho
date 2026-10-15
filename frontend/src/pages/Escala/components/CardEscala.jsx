import AreaEscala from "./AreaEscala";

import style from "../css/Escala.module.css";
import { useEffect, useState } from "react";
import { CheckCircle, X, AlertCircle } from "lucide-react";

function CardEscala({
    escala,
    funcionarios,
    areas,
    onSalvar,
    removendo,
    salvando
}) {
    const [selecionados, setSelecionados] = useState(
        escala.funcionarios.map((funcionario) => funcionario.funcionarioId)
    );

    const [turno, setTurno] = useState(escala.turno || "DIA");
    const [selecionadosTemporarios, setSelecionadosTemporarios] = useState(null);
    const [editando, setEditando] = useState(!escala.id);
    const [alertaSucesso, setAlertaSucesso] = useState("");
    const [tipoAlerta, setTipoAlerta] = useState("sucesso");

    useEffect(() => {
        setSelecionados(
            escala.funcionarios.map(
                (funcionario) => funcionario.funcionarioId
            )
        );

        setTurno(escala.turno || "DIA");
    }, [escala.id]);

    useEffect(() => {
        if (!alertaSucesso) return;

        const temporizador = setTimeout(() => {
            setAlertaSucesso("");
        }, 3000);

        return () => clearTimeout(temporizador);
    }, [alertaSucesso]);

    function alternarFuncionario(id) {
        if (!editando) {
            setTipoAlerta("aviso");
            setAlertaSucesso("Clique em Editar para realizar alterações na escala.");
            return;
        }

        setSelecionados((atuais) =>
            atuais.includes(id)
                ? atuais.filter((atual) => atual !== id)
                : [...atuais, id]
        );
    }

    function atualizarSelecionados(novosSelecionados) {
        if (!editando) return;

        setSelecionados(novosSelecionados);
    }

    function avisarModoEdicao() {
        setTipoAlerta("aviso");
        setAlertaSucesso(
            "Clique em Editar para realizar alterações na escala."
        );
    }

    async function alternarEdicao() {
        if (!editando) {
            setEditando(true);
            setAlertaSucesso("");
            return;
        }

        const resultado = await onSalvar({
            ...escala,
            turno,
            funcionariosIds: selecionados
        });

        if (resultado === true) {
            setEditando(false);
            setTipoAlerta("sucesso");

            setAlertaSucesso(
                escala.id
                    ? "Escala atualizada com sucesso!"
                    : "Escala criada com sucesso!"
            );
        }
    }

    const data = new Date(`${escala.dataEscala}T00:00:00`);

    const diaSemana = data.toLocaleDateString("pt-BR", {
        weekday: "long"
    });

    const diaSemanaFormatado =
        diaSemana.charAt(0).toLocaleUpperCase("pt-BR") +
        diaSemana.slice(1);

    const dataFormatada = data.toLocaleDateString("pt-BR");

    return (
        <>
            <div className={style.cardEscala}>
                <div className={style.tituloCard}>
                    <div className={style.informacoesData}>
                        <div className={style.bolinhaData}></div>

                        <p className={style.diaSemanaEscala}>
                            {diaSemanaFormatado}
                        </p>

                        <p className={style.dataEscala}>
                            {dataFormatada}
                        </p>
                    </div>

                    <div className={style.escaladosBtnConfirmar}>
                        <div className={style.selectTurno}>
                            <select
                                value={turno}
                                disabled={salvando}
                                className={!editando ? style.selectDesabilitado : ""}
                                onMouseDown={(e) => {
                                    if (!editando && !salvando) {
                                        e.preventDefault();
                                        avisarModoEdicao();
                                    }
                                }}
                                onChange={(e) => {
                                    if (!editando) {
                                        avisarModoEdicao();
                                        return;
                                    }

                                    setTurno(e.target.value);
                                }}
                            >
                                <option value="DIA">Dia</option>
                                <option value="NOITE">Noite</option>
                            </select>
                        </div>

                        <div className={style.qtdEscalados}>
                            <p>
                                {(selecionadosTemporarios ?? selecionados).length} escalados
                            </p>
                        </div>

                        <button
                            className={`${style.btnConfirmarEscala} ${editando ? style.modoEdicao : ""
                                }`}
                            disabled={salvando}
                            onClick={alternarEdicao}
                        >
                            <p>
                                {salvando
                                    ? "Salvando..."
                                    : editando
                                        ? "Confirmar"
                                        : "Editar"}
                            </p>
                        </button>
                    </div>
                </div>

                {alertaSucesso && (
                    <div
                        className={`${style.alertaSucesso} ${tipoAlerta === "aviso" ? style.alertaAviso : ""
                            }`}
                        role="status"
                        aria-live="polite"
                    >
                        {tipoAlerta === "aviso" ? (
                            <AlertCircle size={20} />
                        ) : (
                            <CheckCircle size={20} />
                        )}

                        <p>{alertaSucesso}</p>

                        <button
                            type="button"
                            onClick={() => setAlertaSucesso("")}
                            aria-label="Fechar alerta"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                <div className={style.areasEscala}>
                    {areas.map((area) => (
                        <AreaEscala
                            key={area.id}
                            area={area}
                            diaSemana={diaSemana}
                            data={dataFormatada}
                            funcionarios={funcionarios}
                            selecionados={selecionados}
                            onToggle={alternarFuncionario}
                            onAtualizarSelecionados={atualizarSelecionados}
                            onAviso={avisarModoEdicao}
                            mutando={salvando || !!removendo}
                            selecionadosTemporarios={selecionadosTemporarios}
                            setSelecionadosTemporarios={setSelecionadosTemporarios}
                            editando={editando}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default CardEscala;