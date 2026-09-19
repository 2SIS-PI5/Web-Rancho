import { useEffect, useState } from "react";
import { api } from "../../services/api";

function VisaoGeral() {
  const [resumo, setResumo] = useState({ funcionariosAtivos: 0, escalasFuturas: 0 });
  const [erro, setErro] = useState("");

  useEffect(() => {
    api.resumoDashboard().then(setResumo).catch((error) => setErro(error.message));
  }, []);

  return (
    <section style={{ padding: "32px" }}>
      <h1>Visão Geral</h1>
      <p>Acompanhe os principais indicadores do Rancho.</p>
      {erro && <p>{erro}</p>}
      <div style={{ display: "flex", gap: "16px", marginTop: "24px", flexWrap: "wrap" }}>
        <article style={{ border: "1px solid #e5e4e7", padding: "24px", minWidth: "220px" }}>
          <p>Funcionários ativos</p>
          <strong>{resumo.funcionariosAtivos}</strong>
        </article>
        <article style={{ border: "1px solid #e5e4e7", padding: "24px", minWidth: "220px" }}>
          <p>Escalas futuras</p>
          <strong>{resumo.escalasFuturas}</strong>
        </article>
      </div>
    </section>
  );
}

export default VisaoGeral;
