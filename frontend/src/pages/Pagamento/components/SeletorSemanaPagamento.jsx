import { useRef } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CalendarSearch, Minus } from "lucide-react";
import style from "../css/Pagamento.module.css";

function inicioDaSemana(data) {
  const dia = data.getDay();
  const resultado = new Date(data);
  resultado.setDate(data.getDate() - ((dia + 6) % 7));
  return resultado;
}

function somarDias(inicio, dias) {
  const [ano, mes, dia] = inicio.split("-").map(Number);
  const resultado = new Date(ano, mes - 1, dia);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

function formatarData(inicio) {
  return new Date(`${inicio}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit"
  });
}

function dataString(data) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

function SeletorSemanaPagamento({
  inicio,
  fim,
  primeiraSemana,
  semanaAtual,
  onChange,
  onPrev,
  onNext
}) {
  const inputRef = useRef(null);
  const anteriorDesabilitado = inicio <= primeiraSemana;
  const proximaDesabilitada = inicio >= semanaAtual;

  function escolherData(event) {
    if (!event.target.value) return;
    const semana = inicioDaSemana(new Date(`${event.target.value}T00:00:00`));
    const novoInicio = `${semana.getFullYear()}-${String(semana.getMonth() + 1).padStart(2, "0")}-${String(semana.getDate()).padStart(2, "0")}`;
    onChange(novoInicio);
  }

  return (
    <div className={style.manipularSemana}>
      <button
        type="button"
        className={style.btnAnterior}
        disabled={anteriorDesabilitado}
        aria-disabled={anteriorDesabilitado}
        onClick={onPrev}
      >
        <ArrowLeft />
        <span>Anterior</span>
      </button>

      <div className={style.semanaEscolhida}>
        <CalendarDays />
        <p className={style.periodoEscolhido}>
          {formatarData(inicio)} <Minus /> {formatarData(fim)}
        </p>
        {inicio === semanaAtual && <span className={style.chipSemanaAtual}>Esta semana</span>}
        <button
          type="button"
          className={style.btnIrParaData}
          aria-label="Ir para data"
          onClick={() => {
            const input = inputRef.current;
            if (input?.showPicker) input.showPicker();
            else input?.click();
          }}
        >
          <CalendarSearch />
          <span>Ir para data</span>
        </button>
        <input
          ref={inputRef}
          type="date"
          className={style.inputData}
          min={primeiraSemana}
          max={dataString(somarDias(semanaAtual, 6))}
          onChange={escolherData}
          aria-label="Escolher data da semana"
        />
      </div>

      <button
        type="button"
        className={style.btnProxima}
        disabled={proximaDesabilitada}
        aria-disabled={proximaDesabilitada}
        onClick={onNext}
      >
        <span>Próxima</span>
        <ArrowRight />
      </button>
    </div>
  );
}

export default SeletorSemanaPagamento;
