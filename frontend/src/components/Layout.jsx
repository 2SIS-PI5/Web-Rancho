import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import SideBar from "./SideBar";
import style from "./css/Layout.module.css";

function Layout() {
    const [colapsada, setColapsada] = useState(() => {
        try { return localStorage.getItem("rancho.sidebar.colapsada") === "true"; } catch { return false; }
    });
    const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches);
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        const media = window.matchMedia("(max-width: 1023px)");
        const atualizar = (event) => { setMobile(event.matches); if (!event.matches) setMenuAberto(false); };
        media.addEventListener?.("change", atualizar);
        return () => media.removeEventListener?.("change", atualizar);
    }, []);

    useEffect(() => {
        try { localStorage.setItem("rancho.sidebar.colapsada", String(colapsada)); } catch { /* storage unavailable */ }
    }, [colapsada]);

    useEffect(() => {
        const fecharComEscape = (event) => { if (event.key === "Escape") setMenuAberto(false); };
        document.addEventListener("keydown", fecharComEscape);
        document.body.style.overflow = mobile && menuAberto ? "hidden" : "";
        return () => { document.removeEventListener("keydown", fecharComEscape); document.body.style.overflow = ""; };
    }, [mobile, menuAberto]);

    function alternarMenu() {
        if (mobile) setMenuAberto((aberto) => !aberto);
        else setColapsada((valor) => !valor);
    }

    return (
        <div className={`${style.layout} ${colapsada ? style.layoutColapsado : ""}`}>
            <SideBar colapsada={colapsada} mobile={mobile} aberta={menuAberto} onToggle={alternarMenu} onNavigate={() => setMenuAberto(false)} />

            {mobile && <button className={style.mobileMenu} aria-label="Abrir menu" aria-expanded={menuAberto} aria-controls="sidebar-principal" onClick={alternarMenu}><Menu /></button>}
            {mobile && menuAberto && <button className={style.overlayMenu} aria-label="Fechar menu" onClick={() => setMenuAberto(false)} />}
            <main className={style.mainContent}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;