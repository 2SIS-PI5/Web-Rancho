const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("rancho_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Não foi possível concluir a operação.");
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  login: (email, senha) => request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  }),
  listarFuncionarios: (busca = "") => request(`/funcionarios${busca ? `?busca=${encodeURIComponent(busca)}` : ""}`),
  criarFuncionario: (dados) => request("/funcionarios", { method: "POST", body: JSON.stringify(dados) }),
  atualizarFuncionario: (id, dados) => request(`/funcionarios/${id}`, { method: "PUT", body: JSON.stringify(dados) }),
  removerFuncionario: (id) => request(`/funcionarios/${id}`, { method: "DELETE" }),
  listarEscalas: (inicio, fim) => request(`/escalas?inicio=${inicio}&fim=${fim}`),
  criarEscala: (dados) => request("/escalas", { method: "POST", body: JSON.stringify(dados) }),
  resumoDashboard: () => request("/dashboard/resumo"),
};

export function salvarSessao(data) {
  localStorage.setItem("rancho_token", data.token);
  localStorage.setItem("rancho_user", JSON.stringify(data.user));
}

export function encerrarSessao() {
  localStorage.removeItem("rancho_token");
  localStorage.removeItem("rancho_user");
}