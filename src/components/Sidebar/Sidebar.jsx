import {
    WorkOutline
} from "@mui/icons-material";
import React, { useState } from "react";
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import './Navbar.css';
import { SidebarData } from './SidebarData';
import "./sidebar.css";
import { LuUnlock } from "react-icons/lu";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function Sidebar() {
    const { auth, logout } = useAuth();

    const [sidebar, setSidebar] = useState(true);

    const showSidebar = () => setSidebar(!sidebar);

    return (
        <div className="sidebar">
            <IconContext.Provider value={{ color: '#fff' }}>
                {/* <div className='navbar'>
                    <Link to='#' className='menu-bars'>
                        <FaIcons.FaBars onClick={showSidebar} />
                    </Link>
                </div> */}
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items'>
                        <li className='navbar-toggle'>
                            <h4 className="sidebar-ttile">Admin DashBoard</h4>
                        </li>
                        {SidebarData.map((item, index) => {
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
                </nav>
            </IconContext.Provider>
        </div>
    );
}
