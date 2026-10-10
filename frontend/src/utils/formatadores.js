export const onlyDigits = (value) => String(value ?? "").replace(/\D/g, "");

export const maskTelefone = (value) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (!digits) return "";
    if (digits.length <= 2) return `(${digits}`;
    const ddd = digits.slice(0, 2);
    const numero = digits.slice(2);
    if (numero.length <= 4) return `(${ddd}) ${numero}`;
    return `(${ddd}) ${numero.slice(0, -4)}-${numero.slice(-4)}`;
};

export const maskCep = (value) => {
    const digits = onlyDigits(value).slice(0, 8);
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
};

export const maskMoedaCentavos = (value) => {
    const digits = onlyDigits(value).slice(0, 8);
    if (!digits) return "";
    return (Number(digits) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export const formatTelefone = (value) => {
    const digits = onlyDigits(value);
    return [10, 11].includes(digits.length) ? maskTelefone(digits) : String(value ?? "");
};

export const formatCep = (value) => {
    const digits = onlyDigits(value);
    return digits.length === 8 ? maskCep(digits) : String(value ?? "");
};

export const formatValorBRL = (value) => {
    const texto = String(value ?? "").trim().replace(/[^\d,.-]/g, "");
    if (typeof value !== "number" && !texto) return "";
    const normalizado = texto.includes(",") ? texto.replace(/\./g, "").replace(",", ".") : texto;
    const numero = typeof value === "number" ? value : Number(normalizado);
    if (!Number.isFinite(numero)) return String(value ?? "");
    return `R$ ${numero.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatBRL = formatValorBRL;