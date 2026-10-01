// src/utils/setores.js
export const coresSetor = {
  Cozinha: "#2563eb",
  Garçon: "#16a34a",
  Salão: "#16a34a",
  Atividades: "#9333ea",
};

export const corDoSetor = (setor) => coresSetor[setor] || "#6b7280";

export const agruparPorSetor = (funcionarios) =>
  Object.entries(
    funcionarios.reduce((acc, f) => {
      (acc[f.setor] ||= []).push(f);
      return acc;
    }, {})
  );