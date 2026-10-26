import { NavLink, useNavigate } from "react-router-dom";
import {
    House,
    CalendarDays,
    WalletCards,
    Users,
    Star,
    History,
    LogOut,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";

import style from "./css/SideBar.module.css";

function Sidebar({ colapsada, mobile, aberta, onToggle, onNavigate }) {
    const navigate = useNavigate();
    const menuExpandido = mobile ? aberta : !colapsada;

    return (
        <aside id="sidebar-principal" className={`${style.sideBar} ${colapsada ? style.sideBarColapsada : ""} ${mobile && aberta ? style.sideBarAberta : ""}`}>

            <div className={style.tituloSideBar}>
                <button className={style.btnToggleSidebar} aria-label={menuExpandido ? "Recolher menu" : "Expandir menu"} aria-expanded={menuExpandido} aria-controls="sidebar-principal" onClick={onToggle}>{menuExpandido ? <PanelLeftClose /> : <PanelLeftOpen />}</button>
                <div className={style.nomePerfil}>
                    <p>RS</p>
                </div>

                <div className={style.nomeRestaurante}>
                    <h1>Rancho do Comanche</h1>
                    <p>Gestão de Pessoas</p>
                </div>
            </div>

            <nav className={style.menu}>

                <NavLink onClick={onNavigate}
                    title="Visão Geral" aria-label="Visão Geral"
                    to="/visao-geral"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                >
                    <House />
                    <span>Visão Geral</span>
                </NavLink>

                <NavLink onClick={onNavigate}
                    title="Escala" aria-label="Escala"
                    to="/escala"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                >
                    <CalendarDays />
                    <span>Escala</span>
                </NavLink>

                <NavLink onClick={onNavigate}
                    title="Pagamento" aria-label="Pagamento"
                    to="/pagamento"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                >
                    <WalletCards />
                    <span>Pagamento</span>
                </NavLink>

                <NavLink onClick={onNavigate}
                    title="Funcionários" aria-label="Funcionários"
                    to="/funcionarios"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                >
                    <Users />
                    <span>Funcionários</span>
                </NavLink>

                <NavLink onClick={onNavigate}
                    title="Avaliações" aria-label="Avaliações"
                    to="/avaliacoes"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                >
                    <Star />
                    <span>Avaliações</span>
                </NavLink>

                <NavLink onClick={onNavigate}
                    title="Histórico" aria-label="Histórico"
                    to="/historico"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                >
                    <History />
                    <span>Histórico</span>
                </NavLink>

            </nav>

            <div className={style.sideBarFooter}>
                <button
                    className={style.botaoSair}
                    title="Sair"
                    aria-label="Sair"
                    onClick={() => { onNavigate(); navigate("/login"); }}
                >
                    <LogOut />
                    <p>Sair</p>
                </button>
            </div>

        </aside>
    );
}

export default Sidebar;