import classnames from "classnames";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { IconContext } from "react-icons";
import { FaBell, FaUserCircle, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { LuUnlock } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import newlogo from "../../assets/zoofilogo.png";
import blackzofi from "../../assets/blackzofi.png";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";
import "./sidebar.css";
import {
  AdminSidebarData,
  KeyManagerSidebarData,
  SellerSidebarData,
} from "./SidebarData";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import { makeAllSeenNotification, makeSeenNotification } from "../../API/api";
import { notificationContext } from "../../context/context";

const Sidebar = ({ notifications, getAdminNotificationHandler }) => {
  const { auth, logout } = useAuth();
  const location = useLocation();

  const navigate = useNavigate();

  const [showNotification, setShowNotification] = useState(false);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const { adminNotification, setAdminNotificationCustom } =
    useContext(notificationContext);

  console.log("notifications", notifications);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        e.target.closest(".admin-notification-dropdown") ||
        e.target.closest(".notification-nav-item") ||
        e.target.closest(".notification-mute-unmute")
      ) {
        return;
      }

      setShowNotification(false);
    };

    document.addEventListener("click", handleClick);
  }, []);

  const handleRedirection = (type, id) => {
    switch (type) {
      case "reg_type":
        navigate("/SellerManagment");
        break;
      case "product_create":
        navigate("/SellerProductManagment");
        break;
      case "brand_created":
        navigate("/Admin/brand-request");
        break;
      case "category_created":
        navigate("/Admin/category-request");
        break;
      case "subcategory_created":
        navigate("/Admin/subcategory-request");
        break;
      default:
        navigate("/");
    }
    updateNotification(id);
    toggleNotification();
  };

  const handleNotificationTitle = (type) => {
    switch (type) {
      case "reg_type":
        return "Registred a new shop - ";
      case "product_create":
        return "Requested for new product for -";
      case "brand_created":
        return "Requested for new brand for -";
      case "category_created":
        return "Request for new category";
      case "subcategory_created":
        return "Request for new sub category";
      default:
        return "New notification";
    }
  };

  const updateNotification = async (id) => {
    // eslint-disable-next-line no-unused-vars
    let res = await makeSeenNotification(id);
    getAdminNotificationHandler();
  };

  const MarkAllRead = async () => {
    let res = await makeAllSeenNotification();

    if (res?.response?.data?.error) {
      console.log("Something went wrong");
    } else {
      getAdminNotificationHandler();
      setTimeout(() => {
        toggleNotification();
      }, 1500);
    }
  };

  const renderSidebarData = (sidebarData, title) => (
    <nav className={classnames("nav-menu", { active: true })}>
      <ul className="nav-menu-items">
        <li className="header-nav-item">
          <img src={blackzofi} alt="zoofi seller" width={150} />
          <h4 className="sidebar-ttile mb-4 mt-2">{title} </h4>
        </li>

        <li
          className="notification-nav-item"
          onClick={(e) => {
            if (notifications?.length > 0) {
              if (e.target.closest(".notification-mute-unmute")) return;
              toggleNotification();
            } else {
              return;
            }
          }}
        >
          <span>
            <FaBell color="red" />
          </span>
          <span>Notifications</span>
          <span
            className="notification-mute-unmute"
            onClick={() => {
              setAdminNotificationCustom(!adminNotification);
            }}
          >
            {adminNotification ? (
              <FaVolumeUp color="black" size={17} />
            ) : (
              <FaVolumeMute color="black" size={17} />
            )}
          </span>
          <span className="notification-badge">{notifications?.length}</span>
        </li>

        {sidebarData.map((item, index) => (
          <li
            key={index}
            className={classnames("nav-text", {
              "nav-text-active": location.pathname === item.path,
            })}
          >
            <Link to={item.path}>
              <item.icon size={20}/>
              <span className="m-2">{item.title} </span>
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
    <>
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

      {showNotification && (
        <div className="admin-notification-dropdown">
          <div className="markRead" onClick={() => MarkAllRead()}>
            Mark As All Read
          </div>
          <ul>
            {notifications?.map((notification, index) => (
              <li
                key={index}
                className="notification-item"
                onClick={() => {
                  handleRedirection(
                    notification?.notification_type,
                    notification?._id
                  );
                }}
              >
                <Row>
                  <Col
                    className="d-flex align-items-center justify-content-center"
                    xs={1}
                  >
                    {notification?.notifyFrom_Id?.Shop_Details_Info
                      ?.pic_of_shope ? (
                      <img
                        src={
                          notification?.notifyFrom_Id?.Shop_Details_Info
                            ?.pic_of_shope?.[0]
                        }
                        alt="shopImage"
                        className="shopNotiImg"
                      />
                    ) : (
                      <FaUserCircle size={20} />
                    )}
                  </Col>
                  <Col>
                    <Row>
                      <Col xs={12} className="notlist-tilte">
                        {notification?.message}
                      </Col>
                      <Col xs={12} className="notlist-main">
                        <strong>
                          {notification?.notifyFrom_Id?.user_name}{" "}
                        </strong>
                        {handleNotificationTitle(
                          notification?.notification_type
                        )}{" "}
                        <strong>
                          {
                            notification?.notifyFrom_Id?.Shop_Details_Info
                              ?.shope_name
                          }
                        </strong>
                      </Col>
                      <Col className="notlist-loc">Kolkata, West Bengal</Col>
                      <Col xs={12} className="notlist-time">
                        {moment(notification?.updatedAt).fromNow()}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;
