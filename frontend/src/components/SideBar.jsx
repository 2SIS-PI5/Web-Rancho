import { NavLink } from "react-router-dom";
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
import { useAuth } from "../context/AuthContext";

function Sidebar({ recolhida, onAlternar }) {
    const { usuario, logout } = useAuth();

    return (
        <aside className={`${style.sideBar} ${recolhida ? style.sideBarRecolhida : ""}`}>

            <div className={style.tituloSideBar}>
                <div className={style.nomePerfil}>
                    <p>{usuario?.nome?.slice(0, 2).toUpperCase() || "RS"}</p>
                </div>

                <div className={style.nomeRestaurante}>
                    <h1>Rancho do Comanche</h1>
                    <p>Gestão de Pessoas</p>
                </div>

                <button
                    type="button"
                    className={style.botaoAlternar}
                    onClick={onAlternar}
                    aria-label="Alterar Barra Lateral"
                >
                    {recolhida ? <PanelLeftOpen /> : <PanelLeftClose />}
                </button>
            </div>

            <nav className={style.menu}>

                <NavLink
                    to="/visao-geral"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                    title={recolhida ? "Visão Geral" : undefined}
                >
                    <House />
                    <span>Visão Geral</span>
                </NavLink>

                {usuario?.role === "GESTOR" && <NavLink
                    to="/usuarios"
                    className={({ isActive }) => isActive ? style.menuActive : style.menuItem}
                    title={recolhida ? "Criar usuário" : undefined}
                >
                    <Users />
                    <span>Criar usuário</span>
                </NavLink>}

                <NavLink
                    to="/escala"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                    title={recolhida ? "Escala" : undefined}
                >
                    <CalendarDays />
                    <span>Escala</span>
                </NavLink>

                <NavLink
                    to="/pagamento"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                    title={recolhida ? "Pagamento" : undefined}
                >
                    <WalletCards />
                    <span>Pagamento</span>
                </NavLink>

                <NavLink
                    to="/funcionarios"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                    title={recolhida ? "Funcionários" : undefined}
                >
                    <Users />
                    <span>Funcionários</span>
                </NavLink>

                <NavLink
                    to="/avaliacoes"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                    title={recolhida ? "Avaliações" : undefined}
                >
                    <Star />
                    <span>Avaliações</span>
                </NavLink>

                <NavLink
                    to="/historico"
                    className={({ isActive }) =>
                        isActive ? style.menuActive : style.menuItem
                    }
                    title={recolhida ? "Histórico" : undefined}
                >
                    <History />
                    <span>Histórico</span>
                </NavLink>

            </nav>

            <div className={style.sideBarFooter}>
                <button
                    type="button"
                    className={style.botaoSair}
                    onClick={logout}
                    title={recolhida ? "Sair" : undefined}
                >
                    <LogOut />
                    <p>Sair</p>
                </button>
            </div>

        </aside>
    );
}

export default Sidebar;