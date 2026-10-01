export const formatBRL = (v) =>
    "R$ " +
    v
        .toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        .replace(",", ".");