import { useRef } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CalendarSearch, Minus } from "lucide-react";
import style from "../css/Historico.module.css";
import { inicioDaSemana, somarDias, formatarData } from "../../../utils/datas";

function SeletorSemana({ inicioSemana, onChange }) {
    const inputDataRef = useRef(null);

    const abrirSeletor = () => {
        const input = inputDataRef.current;
        if (input?.showPicker) input.showPicker();
        else input?.click();
    };

    const escolherData = (e) => {
        if (!e.target.value) return;
        const [ano, mes, dia] = e.target.value.split("-").map(Number);
        onChange(inicioDaSemana(new Date(ano, mes - 1, dia)));
    };

    return (
        <div className={style.manipularSemana}>
            <button
                className={style.btnAnterior}
                onClick={() => onChange(somarDias(inicioSemana, -7))}
            >
                <ArrowLeft />
                <p>Anterior</p>
            </button>

            <div className={style.semanaEscolhida}>
                <CalendarDays />
                <p className={style.periodoEscolhido}>
                    {formatarData(inicioSemana)} <Minus /> {formatarData(somarDias(inicioSemana, 6))}
                </p>

                <button className={style.btnIrParaData} onClick={abrirSeletor}>
                    <CalendarSearch />
                    <p>Ir para data</p>
                </button>

                <input
                    ref={inputDataRef}
                    type="date"
                    className={style.inputData}
                    onChange={escolherData}
                />
            </div>

            <button className={style.btnProxima} onClick={() => onChange(somarDias(inicioSemana, 7))}>
                <p>Próxima</p>
                <ArrowRight />
            </button>
        </div>
    );
}

export default SeletorSemana;