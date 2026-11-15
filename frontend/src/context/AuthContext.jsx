import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { clearStoredAuth, readStoredAuth, saveStoredAuth } from "../services/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario, setUsuario] = useState(null);
    const [inicializando, setInicializando] = useState(true);
    const [acessoNegado, setAcessoNegado] = useState("");
    const redirecionandoRef = useRef(false);

    useEffect(() => {
        const storedAuth = readStoredAuth();
        setUsuario(storedAuth?.usuario || null);
        setInicializando(false);
    }, []);

    useEffect(() => {
        function handleUnauthorized() {
            if (redirecionandoRef.current) return;
            redirecionandoRef.current = true;
            const destino = `${location.pathname}${location.search}`;
            clearStoredAuth();
            setUsuario(null);
            setAcessoNegado("");

            if (location.pathname !== "/login") {
                navigate("/login", { replace: true, state: { from: destino } });
            }
        }

        function handleForbidden(event) {
            setAcessoNegado(event.detail?.message || "Você não tem permissão para realizar esta ação.");
        }

        window.addEventListener("auth:unauthorized", handleUnauthorized);
        window.addEventListener("auth:forbidden", handleForbidden);
        return () => {
            window.removeEventListener("auth:unauthorized", handleUnauthorized);
            window.removeEventListener("auth:forbidden", handleForbidden);
        };
    }, [location.pathname, location.search, navigate]);

    async function login(email, senha) {
        redirecionandoRef.current = false;
        const resposta = await api.post("/login", { email, senha });
        const autenticacao = resposta.data;
        saveStoredAuth(autenticacao.token, autenticacao.usuario);
        setUsuario(autenticacao.usuario);
        return autenticacao.usuario;
    }

    function logout() {
        redirecionandoRef.current = false;
        clearStoredAuth();
        setUsuario(null);
        setAcessoNegado("");
        navigate("/login", { replace: true });
    }

    const value = useMemo(() => ({
        usuario,
        inicializando,
        autenticado: Boolean(usuario),
        acessoNegado,
        limparAcessoNegado: () => setAcessoNegado(""),
        login,
        logout,
    }), [usuario, inicializando, acessoNegado]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
    return context;
}
