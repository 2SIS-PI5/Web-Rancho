import { ChevronDown, ChevronUp } from "lucide-react";
import style from "../css/Historico.module.css";
import ColunaSetor from "./ColunaSetor";
import { agruparPorSetor } from "../../../utils/setores";

function ItemData({ data, aberta, onToggle }) {
  return (
    <div className={style.dataItem}>
      <div className={style.cardDataDetalhe} onClick={onToggle}>
        <div className={style.bolinhaLaranja} />

        <div className={style.tituloData}>
          <p className={style.diaDaSemana}>{data.diaSemana}</p>
          <p className={style.diaDaEscala}>{data.data}</p>
        </div>

        <div className={style.qtdFuncDropDown}>
          <p className={style.qtdFunc}>{data.funcionarios.length} func.</p>
          {aberta ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {aberta && (
        <div className={style.listaFuncData}>
          {agruparPorSetor(data.funcionarios).map(([setor, funcs]) => (
            <ColunaSetor key={setor} setor={setor} funcionarios={funcs} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemData;