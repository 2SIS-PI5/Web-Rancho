import { NavLink } from "react-router-dom";
import {
    House,
    CalendarDays,
    WalletCards,
    Users,
    Star,
    History,
    LogOut
} from "lucide-react";

import style from "./css/SideBar.module.css";


function Sidebar() {
    return (
        <aside className={style.sideBar}>
            <div className={style.tituloSideBar}>
                <div className={style.nomePerfil}>
                    <p>RS</p>
                </div>
                <div className={style.nomeRestaurante}>
                    <h1>Rancho do Comanche</h1>
                    <p>Gestão de Pessoas</p>
                </div>
            </div>
            <nav className={style.menu}>
                <NavLink to="/visao-geral" className={({ isActive }) =>
                    isActive ? style.menuActive : style.menuItem}>
                    <House />
                    <span>Visão Geral</span>
                </NavLink>

                <NavLink to="/escala" className={({ isActive }) =>
                    isActive ? style.menuActive : style.menuItem}>
                    <CalendarDays />
                    <span>Escala</span>
                </NavLink>

                <NavLink to="/pagamento" className={({ isActive }) =>
                    isActive ? style.menuActive : style.menuItem}>
                    <WalletCards />
                    <span>Pagamento</span>
                </NavLink>

                <NavLink to="/funcionarios" className={({ isActive }) =>
                    isActive ? style.menuActive : style.menuItem}>
                    <Users />
                    <span>Funcionários</span>
                </NavLink>

                <NavLink to="/avaliacoes" className={({ isActive }) =>
                    isActive ? style.menuActive : style.menuItem}>
                    <Star />
                    <span>Avaliações</span>
                </NavLink>

                <NavLink to="/historico" className={({ isActive }) =>
                    isActive ? style.menuActive : style.menuItem}>
                    <History />
                    <span>Histórico</span>
                </NavLink>
            </nav>
            <div className={style.sideBarFooter}>
                <button className={style.botaoSair}>
                    <LogOut />
                    <p>Sair</p>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;