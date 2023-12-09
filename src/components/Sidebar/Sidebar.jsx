import {
    ChatBubbleOutline,
    DynamicFeed,
    LineStyle,
    MailOutline,
    PermIdentity,
    Report,
    Timeline,
    WorkOutline
} from "@mui/icons-material";
import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import useAuth from "../../hooks/useAuth";
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    const { auth, logout } = useAuth();

    return (
        <div className="sidebar" >
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Admin Dashboard</h3>
                    <hr style={{ color: 'white' }} />
                    {/* <ul className="sidebarList">
                        <Link to="/" className="link">
                            <li className="sidebarListItem active">
                                <LineStyle className="sidebarIcon" />
                                Home
                            </li>
                        </Link>
                        <Link to="/roles" className="link">
                            <li className="sidebarListItem">
                                <PermIdentity className="sidebarIcon" />
                                Roles
                            </li>
                        </Link>
                        <Link to="/users" className="link">
                            <li className="sidebarListItem">
                                <PermIdentity className="sidebarIcon" />
                                Users List
                            </li>
                        </Link>
                        <Link to="/AddUser" className="link">
                            <li className="sidebarListItem">
                                <PermIdentity className="sidebarIcon" />
                                Add User
                            </li>
                        </Link>
                        <Link to={'/'} className="link" onClick={() => logout()}>
                            <li className="sidebarListItem">
                                <WorkOutline className="sidebarIcon" />
                                Logout
                            </li>
                        </Link>
                    </ul> */}

                    <ul className="sidebarList">
                        <NavLink exact to="/" className="link" activeClassName="active">
                            <li className="sidebarListItem">
                                <LineStyle className="sidebarIcon" />
                                Home
                            </li>
                        </NavLink>
                        <NavLink to="/roles" className="link" activeClassName="active">
                            <li className="sidebarListItem">
                                <PermIdentity className="sidebarIcon" />
                                Roles
                            </li>
                        </NavLink>
                        <NavLink to="/users" className="link" activeClassName="active">
                            <li className="sidebarListItem">
                                <PermIdentity className="sidebarIcon" />
                                Users List
                            </li>
                        </NavLink>
                        <NavLink to="/AddUser" className="link" activeClassName="active">
                            <li className="sidebarListItem">
                                <PermIdentity className="sidebarIcon" />
                                Add User
                            </li>
                        </NavLink>
                        <NavLink to="/Admin/category" className="link" activeClassName="active">
                            <li className="sidebarListItem">
                                <PermIdentity className="sidebarIcon" />
                                Category 
                            </li>
                        </NavLink>
                        <NavLink to="/Admin/subcategory" className="link" activeClassName="active">
                            <li className="sidebarListItem">
                                <PermIdentity className="sidebarIcon" />
                                Sub Category 
                            </li>
                        </NavLink>
                        {/* <NavLink to="/Admin/subcategory" className="link" activeClassName="active">
                            <li className="sidebarListItem">
                                <PermIdentity className="sidebarIcon" />
                               Sub Category 
                            </li>
                        </NavLink> */}
                        <NavLink to="/Admin/brand" className="link" activeClassName="active">
                            <li className="sidebarListItem">
                                <PermIdentity className="sidebarIcon" />
                                Brand
                            </li>
                        </NavLink>
                        <NavLink exact to="/" className="link" onClick={() => logout()}>
                            <li className="sidebarListItem">
                                <WorkOutline className="sidebarIcon" />
                                Logout
                            </li>
                        </NavLink>
                    </ul>

                </div>
                </div>
        </div>
    );
}
