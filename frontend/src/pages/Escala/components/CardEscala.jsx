import AreaEscala from "./AreaEscala";

import style from "../css/Escala.module.css";

function CardEscala({ diaSemana, data, areas}) {
    return (
        <>
            <div className={style.cardEscala}>

                <div className={style.tituloCard}>
                    <div className={style.informacoesData}>
                        <div className={style.bolinhaData}></div>
                        <p className={style.diaSemanaEscala}>{diaSemana}</p>
                        <p className={style.dataEscala}>{data}</p>
                    </div>
                    <div className={style.escaladosBtnConfirmar}>
                        <div className={style.qtdEscalados}>
                            <p>0 escalados</p>
                        </div>

                        <button className={style.btnConfirmarEscala}>
                            <p>Confirmar</p>
                        </button>
                    </div>
                </div>

                <div className={style.areasEscala}>
                    {areas.map((area) => (
                        <AreaEscala
                            key={area.id}
                            area={area}
                            diaSemana={diaSemana}
                            data={data}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export default CardEscala;