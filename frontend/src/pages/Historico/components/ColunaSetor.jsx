import style from "../css/Historico.module.css";
import { corDoSetor } from "../../../utils/setores";

function ColunaSetor({ setor, funcionarios }) {
  return (
    <div className={style.colunaSetor} style={{ "--cor": corDoSetor(setor) }}>
      <div className={style.tituloSetor}>
        <span className={style.pontoSetor} />
        {setor} ({funcionarios.length})
      </div>

      <div className={style.chips}>
        {funcionarios.map((f) => (
          <span className={style.chip} key={f.id}>
            {f.nome}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ColunaSetor;