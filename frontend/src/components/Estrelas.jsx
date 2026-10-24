import { Star } from "lucide-react";
import style from "./Estrelas.module.css";

function Estrelas({ valor, tamanho = 16, interativo = false, onSelecionar, valorVisual }) {
  const nota = Number(valorVisual ?? valor) || 0;
  return (
    <div className={`${style.estrelas} ${interativo ? style.interativo : ""}`} aria-label={`${nota} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((indice) => {
        const preenchimento = Math.max(0, Math.min(1, nota - indice + 1)) * 100;
        return (
          <span key={indice} className={style.estrela} style={{ width: tamanho, height: tamanho }}
            onClick={() => interativo && onSelecionar?.(indice)}>
            <Star size={tamanho} className={style.vazia} />
            <span className={style.cheia} style={{ width: `${preenchimento}%` }}>
              <Star size={tamanho} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default Estrelas;
