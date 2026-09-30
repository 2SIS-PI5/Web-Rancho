import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import style from "./css/Layout.module.css";


function Layout() {
    return (
        <div className={style.layout}>
            <SideBar />

            <main className={style.mainContent}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;