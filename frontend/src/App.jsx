import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import VisaoGeral from "./pages/VisaoGeral/VisaoGeral";
import Escala from "./pages/Escala/Escala";
import Pagamento from "./pages/Pagamento/Pagamento";
import Avaliacoes from "./pages/Avaliacoes/Avaliacoes";
import Historico from "./pages/Historico/Historico";

import Layout from "./components/Layout";
import Funcionarios from "./pages/Funcionarios/Funcionarios";

function App() {
    return (
        <Routes>

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