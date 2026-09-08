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

import "./css/SideBar.css";


function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="titulo-side-bar">
                <div className="nome-perfil">
                    <p>RS</p>
                </div>
                <div className="nome-restaurante">
                    <h1>Rancho do Comanche</h1>
                    <p>Gestão de Pessoas</p>
                </div>
            </div>
            <nav className="menu">
                <NavLink to="/visao-geral" className="menu_item">
                    <House />
                    <span>Visão Geral</span>
                </NavLink>

                <NavLink to="/escala" className="menu_item">
                    <CalendarDays />
                    <span>Escala</span>
                </NavLink>

                <NavLink to="/pagamento" className="menu_item">
                    <WalletCards />
                    <span>Pagamento</span>
                </NavLink>

                <NavLink to="/funcionarios" className="menu_item">
                    <Users />
                    <span>Funcionários</span>
                </NavLink>

                <NavLink to="/avaliacoes" className="menu_item">
                    <Star />
                    <span>Avaliações</span>
                </NavLink>

                <NavLink to="/historico" className="menu_item">
                    <History />
                    <span>Histórico</span>
                </NavLink>
            </nav>
            <div className="sidebar-footer">
                <button className="botao-sair">
                    <LogOut />
                    <p>Sair</p>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;