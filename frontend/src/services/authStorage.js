const AUTH_STORAGE_KEY = "rancho.auth";
const ROLES = ["GESTOR", "ADMIN"];

function isValidUser(user) {
    return user
        && (typeof user.id === "number" || typeof user.id === "string")
        && typeof user.nome === "string" && user.nome.trim()
        && typeof user.email === "string" && user.email.trim()
        && ROLES.includes(user.role);
}

export function readStoredAuth() {
    try {
        const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
        if (!stored) return null;

        const auth = JSON.parse(stored);
        if (typeof auth.token !== "string" || !auth.token || !isValidUser(auth.usuario)) {
            clearStoredAuth();
            return null;
        }

        return { token: auth.token, usuario: auth.usuario };
    } catch {
        clearStoredAuth();
        return null;
    }
}

export function saveStoredAuth(token, usuario) {
    if (typeof token !== "string" || !token || !isValidUser(usuario)) {
        throw new Error("Dados de autenticação inválidos.");
    }

    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, usuario }));
}

export function clearStoredAuth() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getStoredToken() {
    return readStoredAuth()?.token || null;
}

export { ROLES };
