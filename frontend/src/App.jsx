import { Navigate, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import VisaoGeral from "./pages/VisaoGeral";
import Escala from "./pages/Escala";
import Pagamento from "./pages/Pagamento";
import Avaliacoes from "./pages/Avaliacoes";
import Historico from "./pages/Historico";

import Layout from "./components/Layout";
import Funcionarios from "./pages/Funcionarios";

function App() {
    return (
        <Routes>

            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Sistema */}
            <Route element={<Layout />}>

                <Route path="/visao-geral" element={<VisaoGeral />} />
                <Route path="/escala" element={<Escala />} />
                <Route path="/pagamento" element={<Pagamento />} />
                <Route path="/funcionarios" element={<Funcionarios />} />
                <Route path="/avaliacoes" element={<Avaliacoes />} />
                <Route path="/historico" element={<Historico />} />

            </Route>

        </Routes>
    );
}

export default App;