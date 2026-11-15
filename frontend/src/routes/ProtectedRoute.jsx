import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
    const { autenticado, inicializando } = useAuth();
    const location = useLocation();

    if (inicializando) return <p>Carregando sessão...</p>;
    if (!autenticado) {
        return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
    }

    return children;
}

export function GestoraRoute({ children }) {
    const { usuario, inicializando } = useAuth();
    if (inicializando) return <p>Carregando sessão...</p>;
    if (usuario?.role !== "GESTOR") {
        return <div role="alert">Acesso negado. Apenas GESTOR pode criar usuários.</div>;
    }
    return children;
}
