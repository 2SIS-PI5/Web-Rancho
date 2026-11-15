import axios from "axios";
import { getStoredToken } from "./authStorage";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080"
});

api.interceptors.request.use((config) => {
    const isLoginRequest = config.url === "/login" || config.url?.endsWith("/login");
    const token = getStoredToken();

    if (!isLoginRequest && token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || "";
        const isLoginRequest = requestUrl === "/login" || requestUrl.endsWith("/login");

        if (status === 401 && !isLoginRequest) {
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        } else if (status === 403) {
            window.dispatchEvent(new CustomEvent("auth:forbidden", {
                detail: { message: error.response?.data?.message || "Acesso negado." }
            }));
        }

        return Promise.reject(error);
    }
);

export default api;
