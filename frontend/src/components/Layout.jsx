import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import "./css/Layout.css";


function Layout() {
    return (
        <div className="layout">
            <SideBar />

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;