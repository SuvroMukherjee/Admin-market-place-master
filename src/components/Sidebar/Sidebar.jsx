import classnames from "classnames";
import { IconContext } from "react-icons";
import { LuUnlock } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";
import "./sidebar.css";
import {
  AdminSidebarData,
  KeyManagerSidebarData,
  SellerSidebarData,
} from "./SidebarData";

const Sidebar = () => {
  const { auth, logout } = useAuth();
  const location = useLocation();

  const renderSidebarData = (sidebarData, title) => (
    <nav className={classnames("nav-menu", { active: true })}>
      <ul className="nav-menu-items">
        <li className="navbar-toggle">
          <h4 className="sidebar-ttile">{title}</h4>
        </li>
        {sidebarData.map((item, index) => (
          <li
            key={index}
            className={classnames("nav-text", {
              "nav-text-active": location.pathname === item.path,
            })}
          >
            <Link to={item.path}>
              <item.icon />
              <span className="m-2">{item.title}</span>
            </Link>
          </li>
        ))}
        <li className="nav-text" onClick={() => logout()}>
          <Link to={"/"}>
            <LuUnlock />
            <span className="m-2">Logout</span>
          </Link>
        </li>
      </ul>
    </nav>
  );

  return (
    <div className="sidebar">
      <IconContext.Provider value={{ color: "#fff" }}>
        {auth.role.name === "Admin" &&
          renderSidebarData(AdminSidebarData, "Admin DashBoard")}
        {auth.role.name === "Key Account Maneger" &&
          renderSidebarData(
            KeyManagerSidebarData,
            "Key Account Manager DashBoard"
          )}
        {auth.role.name === "Seller" &&
          renderSidebarData(SellerSidebarData, "Seller DashBoard")}
      </IconContext.Provider>
    </div>
  );
};

export default Sidebar;
