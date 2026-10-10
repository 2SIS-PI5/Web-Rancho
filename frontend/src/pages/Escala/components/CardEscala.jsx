import AreaEscala from "./AreaEscala";

import style from "../css/Escala.module.css";
import { useEffect, useState } from "react";

function CardEscala({ escala, funcionarios, areas, onSalvar, onRemover, removendo, salvando }) {
    const [selecionados, setSelecionados] = useState(escala.funcionarios.map((funcionario) => funcionario.funcionarioId));
    const [turno, setTurno] = useState(escala.turno || "DIA");

    useEffect(() => {
        setSelecionados(escala.funcionarios.map((funcionario) => funcionario.funcionarioId));
        setTurno(escala.turno || "DIA");
    }, [escala]);

    function alternarFuncionario(id) {
        setSelecionados((atuais) => atuais.includes(id) ? atuais.filter((atual) => atual !== id) : [...atuais, id]);
    }

    const data = new Date(`${escala.dataEscala}T00:00:00`);
    const diaSemana = data.toLocaleDateString("pt-BR", { weekday: "long" });
    const dataFormatada = data.toLocaleDateString("pt-BR");
    return (
        <>
            <div className={style.cardEscala}>

                <div className={style.tituloCard}>
                    <div className={style.informacoesData}>
                        <div className={style.bolinhaData}></div>
                        <p className={style.diaSemanaEscala}>{diaSemana}</p>
                        <p className={style.dataEscala}>{dataFormatada}</p>
                    </div>
                    <div className={style.escaladosBtnConfirmar}>
                        <div className={style.qtdEscalados}>
                            <p>{selecionados.length} escalados</p>
                        </div>
                        <select value={turno} onChange={(e) => setTurno(e.target.value)}>
                            <option value="DIA">Dia</option>
                            <option value="NOITE">Noite</option>
                        </select>
                        <button className={style.btnConfirmarEscala} disabled={salvando} onClick={() => onSalvar({ ...escala, turno, funcionariosIds: selecionados })}>
                            <p>{salvando ? "Salvando..." : "Confirmar"}</p>
                        </button>
                    </div>
                </div>

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
                            onRemover={onRemover}
                            escalaId={escala.id}
                            removendo={removendo}
                            mutando={salvando || !!removendo}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default CardEscala;