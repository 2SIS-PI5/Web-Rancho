import { Navigate, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login/Login";
import VisaoGeral from "./pages/VisaoGeral/VisaoGeral";
import Escala from "./pages/Escala/Escala";
import Pagamento from "./pages/Pagamento/Pagamento";
import Avaliacoes from "./pages/Avaliacoes/Avaliacoes";
import Historico from "./pages/Historico/Historico";

import Layout from "./components/Layout";
import Funcionarios from "./pages/Funcionarios/Funcionarios";
import Usuarios from "./pages/Usuarios/Usuarios";
import { GestoraRoute, ProtectedRoute } from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function App() {
    const { autenticado, inicializando } = useAuth();
    const location = useLocation();

    if (inicializando) return <p>Carregando sessão...</p>;

    return (
        <Routes>

            <Route path="/" element={<Navigate to={autenticado ? "/visao-geral" : "/login"} replace />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Sistema */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>

                <Route path="/visao-geral" element={<VisaoGeral />} />
                <Route path="/escala" element={<Escala />} />
                <Route path="/pagamento" element={<Pagamento />} />
                <Route path="/funcionarios" element={<Funcionarios />} />
                <Route path="/avaliacoes" element={<Avaliacoes />} />
                <Route path="/historico" element={<Historico />} />
                <Route path="/usuarios" element={<GestoraRoute><Usuarios /></GestoraRoute>} />

            </Route>

            <Route path="*" element={<Navigate to={autenticado ? "/visao-geral" : "/login"} replace state={{ from: location.pathname }} />} />
        </Routes>
    );
}

export default App;