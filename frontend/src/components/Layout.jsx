import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import style from "./css/Layout.module.css";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";


function Layout() {
    const { acessoNegado, limparAcessoNegado } = useAuth();
    const [sidebarRecolhida, setSidebarRecolhida] = useState(
        () => sessionStorage.getItem("rancho.sidebar.recolhida") === "true"
    );

    function alternarSidebar() {
        setSidebarRecolhida((atual) => {
            const novaPreferencia = !atual;
            sessionStorage.setItem("rancho.sidebar.recolhida", String(novaPreferencia));
            return novaPreferencia;
        });
    }

    return (
        <div className={`${style.layout} ${sidebarRecolhida ? style.layoutRecolhida : ""}`}>
            <SideBar recolhida={sidebarRecolhida} onAlternar={alternarSidebar} />

            <main className={style.mainContent}>
                {acessoNegado && <div role="alert">
                    {acessoNegado}
                    <button type="button" onClick={limparAcessoNegado}>Fechar</button>
                </div>}
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;