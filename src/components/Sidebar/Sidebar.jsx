import React, { useState, useEffect } from "react";
import { IconContext } from 'react-icons';
import { LuUnlock } from "react-icons/lu";
import { Link, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import useAuth from "../../hooks/useAuth";
import { AdminSidebarData, KeyManagerSidebarData, SellerSidebarData } from './SidebarData';
import "./Navbar.css";
import "./sidebar.css";

const Sidebar = () => {
    const { auth, logout } = useAuth();
    const location = useLocation();

    const [sidebar, setSidebar] = useState(true);

    const showSidebar = () => setSidebar(!sidebar);

    useEffect(() => {
      
    }, [auth, sidebar]);

    const renderSidebarData = (sidebarData, title) => (
        <nav className={classnames('nav-menu', { 'active': sidebar })}>
            <ul className='nav-menu-items'>
                <li className='navbar-toggle'>
                    <h4 className="sidebar-ttile">{title}</h4>
                </li>
                {sidebarData.map((item, index) => (
                    <li key={index} className={classnames('nav-text', { 'nav-text-active': location.pathname === item.path })}>
                        <Link to={item.path}>
                            <item.icon/>
                            <span>{item.title}</span>
                        </Link>
                    </li>
                ))}
                <li className="nav-text" onClick={() => logout()}>
                    <Link to={'/'}>
                        <LuUnlock />
                        <span>Logout</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );

    return (
        <div className="sidebar">
            <IconContext.Provider value={{ color: '#fff' }}>
                {auth.role.name === "Admin" && renderSidebarData(AdminSidebarData, "Admin DashBoard")}
                {auth.role.name === "Key Account Maneger" && renderSidebarData(KeyManagerSidebarData, "Key Account Maneger DashBoard")}
                {auth.role.name === "Seller" && renderSidebarData(SellerSidebarData, "Seller DashBoard")}
            </IconContext.Provider>
        </div>
    );
}

export default Sidebar;
