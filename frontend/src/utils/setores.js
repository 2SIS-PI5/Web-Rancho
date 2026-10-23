// src/utils/setores.js
export const coresSetor = {
  Salão: "#2563eb",
  Cozinha: "#16a34a",
  Atividades: "#9333ea",
  Garçom: "#ea580c",
};

export const corDoSetor = (setor) => coresSetor[setor] || "#6b7280";

export const agruparPorSetor = (funcionarios) =>
  Object.entries(
    funcionarios.reduce((acc, f) => {
      (acc[f.setor] ||= []).push(f);
      return acc;
    }, {})
  );