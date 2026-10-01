import { useState } from "react";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import style from "../css/Historico.module.css";
import TabelaSetor from "./TabelaSetor";

function QuemTrabalhou({ grupos }) {
  const [aberto, setAberto] = useState(false);

  const totalFuncionarios = grupos.reduce((soma, g) => soma + g.itens.length, 0);

  return (
    <>
      <div className={style.quemTrabalhou} onClick={() => setAberto(!aberto)}>
        <div className={style.tituloCardQuemTrabalhou}>
          <Users />
          <p>Quem trabalhou esta semana</p>
          <p>({totalFuncionarios} funcionários)</p>
        </div>

        {aberto ? <ChevronUp /> : <ChevronDown />}
      </div>

      {aberto && (
        <div className={style.tpList}>
          {grupos.map((grupo) => (
            <TabelaSetor key={grupo.setor} grupo={grupo} />
          ))}
        </div>
      )}
    </>
  );
}

export default QuemTrabalhou;