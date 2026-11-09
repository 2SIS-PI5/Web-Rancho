const INVALID = "Chave PIX inválida ou não cadastrada";

function cpfValido(digitos) {
  if (!/^\d{11}$/.test(digitos) || /^(\d)\1{10}$/.test(digitos)) return false;
  for (let tamanho = 9; tamanho <= 10; tamanho += 1) {
    let soma = 0;
    for (let i = 0; i < tamanho; i += 1) soma += Number(digitos[i]) * (tamanho + 1 - i);
    const resto = (soma * 10) % 11;
    if ((resto === 10 ? 0 : resto) !== Number(digitos[tamanho])) return false;
  }
  return true;
}

export function normalizarChavePix(raw) {
  const valor = String(raw ?? "").trim();
  if (!valor) return { valida: false, tipo: null, chave: "", motivo: INVALID };
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
    return { valida: true, tipo: "email", chave: valor.toLowerCase(), motivo: "" };
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valor)) {
    return { valida: true, tipo: "aleatoria", chave: valor.toLowerCase(), motivo: "" };
  }
  const digits = valor.replace(/[./-]/g, "");
  if (/^\d{14}$/.test(digits)) return { valida: true, tipo: "cnpj", chave: digits, motivo: "" };
  if (/^\d{11}$/.test(digits) && cpfValido(digits)) {
    return { valida: true, tipo: "cpf", chave: digits, motivo: "" };
  }
  let telefone = valor.replace(/[()\s\-+]/g, "");
  if (telefone.startsWith("55") && [12, 13].includes(telefone.length)) telefone = telefone.slice(2);
  if (/^\d{10,11}$/.test(telefone)) {
    return { valida: true, tipo: "telefone", chave: `+55${telefone}`, motivo: "" };
  }
  return { valida: false, tipo: null, chave: "", motivo: INVALID };
}

export function formatarValorPix(valor) {
  const texto = String(valor ?? "").trim().replace(/\s/g, "");
  const normalizado = texto.includes(",") ? texto.replace(/\./g, "").replace(",", ".") : texto;
  const numero = typeof valor === "number" ? valor : Number(normalizado);
  if (!Number.isFinite(numero) || numero <= 0 || numero > 9999999999.99) return null;
  return numero.toFixed(2);
}

function sanitizarTexto(valor, limite, fallback) {
  const texto = String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limite);
  return texto || fallback;
}

function campo(id, valor) {
  const texto = String(valor);
  return `${id}${String(texto.length).padStart(2, "0")}${texto}`;
}

function crc16(texto) {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(texto)) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i += 1) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function montarPayloadPix({ chave, valor, nome, cidade }) {
  const valorFormatado = formatarValorPix(valor);
  if (!chave || !valorFormatado) return "";
  const nomeSeguro = sanitizarTexto(nome, 25, "FUNCIONARIO");
  const cidadeSegura = sanitizarTexto(
    cidade ?? import.meta.env.VITE_PIX_CIDADE ?? "SAO PAULO",
    15,
    "SAO PAULO"
  );
  const merchant = campo("00", "br.gov.bcb.pix") + campo("01", chave);
  const semCrc = campo("00", "01") + campo("01", "11") + campo("26", merchant)
    + campo("52", "0000") + campo("53", "986") + campo("54", valorFormatado)
    + campo("58", "BR") + campo("59", nomeSeguro) + campo("60", cidadeSegura)
    + campo("62", campo("05", "***")) + "6304";
  return `${semCrc}${crc16(semCrc)}`;
}

export function mascararChavePix(chave, tipo) {
  const valor = String(chave ?? "");
  if (tipo === "email") {
    const [usuario, dominio] = valor.split("@");
    return `${(usuario ?? "").slice(0, 2)}***@${dominio ?? ""}`;
  }
  if (tipo === "aleatoria") return `${valor.slice(0, 4)}***${valor.slice(-4)}`;
  return `***${valor.replace(/\D/g, "").slice(-4)}`;
}

export const tipoChavePix = {
  cpf: "CPF",
  cnpj: "CNPJ",
  telefone: "Telefone",
  email: "E-mail",
  aleatoria: "Aleatória"
};
