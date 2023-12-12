import {
    WorkOutline
} from "@mui/icons-material";
import React, { useState } from "react";
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import './Navbar.css';
import { AdminSidebarData, KeyManagerSidebarData } from './SidebarData';
import "./sidebar.css";
import { LuUnlock } from "react-icons/lu";


export default function Sidebar() {
    const { auth, logout } = useAuth();

    const [sidebar, setSidebar] = useState(true);

    const showSidebar = () => setSidebar(!sidebar);

    console.log(auth.role.name, 'role');

    return (
        <div className="sidebar">
            <IconContext.Provider value={{ color: '#fff' }}>
                {auth.role.name == "Admin" &&
                    <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                        <ul className='nav-menu-items'>
                            <li className='navbar-toggle'>
                                <h4 className="sidebar-ttile">Admin DashBoard</h4>
                            </li>
                            {AdminSidebarData.map((item, index) => {
                                return (
                                    <li key={index} className={location.pathname === item.path ? 'nav-text-active' : 'nav-text'}>
                                        <Link to={item.path}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                            <li className="nav-text" onClick={() => logout()}>
                                <Link to={'/'}>
                                    <LuUnlock />
                                    <span>Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>}
                {auth.role.name == "Key Account Maneger" &&
                    <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                        <ul className='nav-menu-items'>
                            <li className='navbar-toggle'>
                                <h6 className="sidebar-ttile2">Key Account Maneger DashBoard</h6>
                            </li>
                            {KeyManagerSidebarData.map((item, index) => {
                                return (
                                    <li key={index} className={location.pathname === item.path ? 'nav-text-active' : 'nav-text'}>
                                        <Link to={item.path}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                            <li className="nav-text" onClick={() => logout()}>
                                <Link to={'/'}>
                                    <LuUnlock />
                                    <span>Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>}
            </IconContext.Provider>
        </div>
    );
}
