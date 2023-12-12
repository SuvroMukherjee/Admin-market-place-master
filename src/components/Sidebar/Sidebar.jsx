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

export default function Sidebar() {
    const { auth, logout } = useAuth();

    const [sidebar, setSidebar] = useState(true);

    const showSidebar = () => setSidebar(!sidebar);

    return (
        // <div className="sidebar" >
        //     <div className="sidebarWrapper">
        //         <div className="sidebarMenu">
        //             <h3 className="sidebarTitle">Admin Dashboard</h3>
        //             <hr style={{ color: 'white' }} />
        //             {/* <ul className="sidebarList">
        //                 <Link to="/" className="link">
        //                     <li className="sidebarListItem active">
        //                         <LineStyle className="sidebarIcon" />
        //                         Home
        //                     </li>
        //                 </Link>
        //                 <Link to="/roles" className="link">
        //                     <li className="sidebarListItem">
        //                         <PermIdentity className="sidebarIcon" />
        //                         Roles
        //                     </li>
        //                 </Link>
        //                 <Link to="/users" className="link">
        //                     <li className="sidebarListItem">
        //                         <PermIdentity className="sidebarIcon" />
        //                         Users List
        //                     </li>
        //                 </Link>
        //                 <Link to="/AddUser" className="link">
        //                     <li className="sidebarListItem">
        //                         <PermIdentity className="sidebarIcon" />
        //                         Add User
        //                     </li>
        //                 </Link>
        //                 <Link to={'/'} className="link" onClick={() => logout()}>
        //                     <li className="sidebarListItem">
        //                         <WorkOutline className="sidebarIcon" />
        //                         Logout
        //                     </li>
        //                 </Link>
        //             </ul> */}

        //             <ul className="sidebarList">
        //                 <NavLink exact to="/" className="link" activeClassName="active">
        //                     <li className="sidebarListItem">
        //                         <LineStyle className="sidebarIcon" />
        //                         Home
        //                     </li>
        //                 </NavLink>
        //                 <NavLink to="/roles" className="link" activeClassName="active">
        //                     <li className="sidebarListItem">
        //                         <PermIdentity className="sidebarIcon" />
        //                         Roles
        //                     </li>
        //                 </NavLink>
        //                 <NavLink to="/users" className="link" activeClassName="active">
        //                     <li className="sidebarListItem">
        //                         <PermIdentity className="sidebarIcon" />
        //                         Users 
        //                     </li>
        //                 </NavLink>
        //                 {/* <NavLink to="/AddUser" className="link" activeClassName="active">
        //                     <li className="sidebarListItem">
        //                         <PermIdentity className="sidebarIcon" />
        //                         Add User
        //                     </li>
        //                 </NavLink> */}
        //                 <NavLink to="/Admin/category" className="link" activeClassName="active">
        //                     <li className="sidebarListItem">
        //                         <PermIdentity className="sidebarIcon" />
        //                         Category 
        //                     </li>
        //                 </NavLink>
        //                 <NavLink to="/Admin/subcategory" className="link" activeClassName="active">
        //                     <li className="sidebarListItem">
        //                         <PermIdentity className="sidebarIcon" />
        //                         Sub Category 
        //                     </li>
        //                 </NavLink>
        //                 <NavLink to="/Admin/brand" className="link" activeClassName="active">
        //                     <li className="sidebarListItem">
        //                         <PermIdentity className="sidebarIcon" />
        //                         Brand
        //                     </li>
        //                 </NavLink>
        //                 <NavLink to="/Admin/product" className="link" activeClassName="active">
        //                     <li className="sidebarListItem">
        //                         <PermIdentity className="sidebarIcon" />
        //                          Product
        //                     </li>
        //                 </NavLink>
        //                 <NavLink exact to="/" className="link" onClick={() => logout()}>
        //                     <li className="sidebarListItem">
        //                         <WorkOutline className="sidebarIcon" />
        //                         Logout
        //                     </li>
        //                 </NavLink>
        //             </ul>
        //         </div>
        //         </div>
        // </div>
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
                                <li key={index} className={item.cName}>
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
