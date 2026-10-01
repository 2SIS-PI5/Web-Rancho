export const INICIO_SEMANA = 6; // 0 = domingo ... 6 = sábado

export const inicioDaSemana = (data) => {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  const diferenca = (d.getDay() - INICIO_SEMANA + 7) % 7;
  d.setDate(d.getDate() - diferenca);
  return d;
};

export const somarDias = (data, dias) => {
  const d = new Date(data);
  d.setDate(d.getDate() + dias);
  return d;
};

export const formatarData = (d) =>
  d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });