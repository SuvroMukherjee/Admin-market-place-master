import { Drawer } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { toast } from "react-toastify";
import { FaAngleRight, FaUserCircle } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { MdCancel, MdCircleNotifications } from "react-icons/md";
import { Outlet, useNavigate } from "react-router-dom";
import {
  getAdminNotification,
  makeAllSeenNotification,
  makeSeenNotification,
  sellerDetails,
} from "../../../API/api";
import notificationSoundTone from "../../../assets/notification.wav";
import newlogo from "../../../assets/zoofilogo.png";
import { ScrollToTop } from "../../../components/scrollToTop/ScrollToTop";
import useAuth from "../../../hooks/useAuth";

const MyNavbar = ({ socket }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { auth, logout } = useAuth();
  const [HeaderTitle, setHeaderTitle] = useState("Seller Dashboard");
  const [userInfo, setUserInfo] = useState();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (auth) {
      getProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAdminNotificationHandler();
  }, []);

  async function getAdminNotificationHandler() {
    let res = await getAdminNotification();
    console.log(res?.data?.data, "notice");
    setNotifications(res?.data?.data);
  }

  useEffect(() => {
    if (socket) {
      const handleAdminNotification = (data) => {
        console.log(data, "SELLER_NOTIFICATION");
        const notificationSound = new Audio(notificationSoundTone);
        notificationSound.play();
        setTimeout(() => {
          toast.info(data);
        }, 1000);
        getAdminNotificationHandler();
      };

      socket.on("SELLER_NOTIFICATION", handleAdminNotification);

      return () => {
        socket.off("SELLER_NOTIFICATION", handleAdminNotification);
      };
    }
  }, [socket]);

  async function getProfileData() {
    let res = await sellerDetails(auth?.userId);
    if (res) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      const { ...filteredData } = res?.data?.data;
      console.log(filteredData, "ss");
      setUserInfo(filteredData);
    }
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigate = useNavigate();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleNotificationDropDown = () => {
    setNotificationOpen(!isNotificationOpen);
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  useEffect(() => {
    // close menu on click outside
    const handleClick = (e) => {
      if (
        e.target.closest(".custom-nav-right .profile") ||
        e.target.closest(".dropdown") ||
        e.target.closest(".custom-nav-right .notify") ||
        e.target.closest(".notification-dropdown")
      ) {
        return;
      }

      handleNotificationClose();
      handleDropdownClose();
    };

    document.addEventListener("click", handleClick);
  }, []);

  const navigateFunction = (pathName) => {
    switch (pathName) {
      case "Seller Dashboard":
        navigate("/seller/seller-dashboard");
        setHeaderTitle(pathName);
        break;
      case "Add Product":
        navigate("/seller/seller-addproduct");
        setHeaderTitle(pathName);
        break;
      case "Product Request":
        navigate("/seller/seller-ownproduct-status/new-add");
        setHeaderTitle(pathName);
        break;
      case "Brand Request":
        navigate("/seller/brand-request/");
        setHeaderTitle(pathName);
        break;
      case "Category Request":
        navigate("/seller/category-request/");
        setHeaderTitle(pathName);
        break;
      case "Track Your Application":
        navigate("/seller/approval-request-list/");
        setHeaderTitle(pathName);
        break;
      case "Inventory Manage":
        navigate("/seller/seller-productList");
        setHeaderTitle(pathName);
        break;
      case "Recent Order List":
        navigate("/seller/seller-orderlist");
        setHeaderTitle(pathName);
        break;
      case "Manage Orders":
        navigate("/seller/manage-orders");
        setHeaderTitle(pathName);
        break;
      case "Return Orders Request List":
        navigate("/seller/seller-return-order-request-list");
        setHeaderTitle(pathName);
        break;
      case "Return Orders List":
        navigate("/seller/seller-return-order-list");
        setHeaderTitle(pathName);
        break;

      case "Customer Feedback":
        navigate("/seller/customer-feedback");
        setHeaderTitle(pathName);
        break;
      case "Service Feedback":
        navigate("/seller/service-feedback");
        setHeaderTitle(pathName);
        break;
      case "Advertising Campaign":
        navigate("/seller/advertising-campaign");
        setHeaderTitle(pathName);
        break;
      case "Add Product Via Upload":
        navigate("/seller/bulk-product-upload");
        setHeaderTitle(pathName);
        break;
      case "Busniess Report":
        navigate("/seller/seller-report");
        setHeaderTitle(pathName);
    }
    toggleDrawer();
  };

  //Notidfication
  const handleRedirection = (type, id) => {
    switch (type) {
      case "cat_apprv":
        navigate("/seller/approval-request-list/");
        break;
      case "brand_apprv":
        navigate("/seller/approval-request-list/");
        break;
      case "product_apprv":
        navigate("/seller/approval-request-list/");
        break;
      case "pro_review":
        navigate("/Admin/category-request");
        break;
      default:
        navigate("/");
    }
    updateNotification(id);
    handleNotificationDropDown();
  };

  const handleNotificationTitle = (type, data) => {
    switch (type) {
      case "cat_apprv":
        return "Your Category has benn approved by Zoofi";
      case "brand_apprv":
        return "Your Brand has benn approved by Zoofi";
      case "product_apprv":
        return "Your Product has benn approved by Zoofi";
      case "pro_review":
        return `${data?.notifyFrom_Id?.name}  gives rating and review your product`;
      case "seller_rev":
        return `${data?.notifyFrom_Id?.name} shares service related feedback`;
      case "placed_order":
        return `New Order Requested from ${data?.notifyFrom_Id?.name}`;
      case "return_req":
        return `Return Order from ${data?.notifyFrom_Id?.name}`;
      default:
        return "New notification";
    }
  };

  const updateNotification = async (id) => {
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
        handleNotificationDropDown();
      }, 1500);
    }
  };

  const RenderIconHandler = (type) => {
    switch (type) {
      case "cat_apprv":
        return (
          <img
            src="https://cdn-icons-png.flaticon.com/512/6781/6781224.png"
            alt="category Image"
            className="shopNotiImg"
          />
        );
      case "brand_apprv":
        return (
          <img
            src="https://cdn-icons-png.flaticon.com/512/5309/5309779.png"
            alt="category Image"
            className="shopNotiImg"
          />
        );
      case "product_apprv":
        return (
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1WNR-p4FoKdaYCwUb1-59r5_qeerIhA7VEhjQGbRV8w&s"
            alt="category Image"
            className="shopNotiImg"
          />
        );
      case "pro_review":
        return (
          <img
            src="https://i.pinimg.com/originals/a3/6b/42/a36b422bb2bebcbd77bba846b83ddf5d.png"
            alt="category Image"
            className="shopNotiImg"
          />
        );
      case "seller_rev":
        return (
          <img
            src="https://cdn-icons-png.flaticon.com/512/470/470238.png"
            alt="category Image"
            className="shopNotiImg"
          />
        );
      case "placed_order":
        return (
          <img
            src="https://cdn-icons-png.flaticon.com/512/8865/8865579.png"
            alt="category Image"
            className="shopNotiImg"
          />
        );
      case "return_req":
        return (
          <img
            src="https://cdn-icons-png.flaticon.com/512/1440/1440524.png"
            alt="category Image"
            className="shopNotiImg"
          />
        );

      default:
        return (
          <img
            src="https://static.vecteezy.com/system/resources/previews/009/394/760/original/bell-icon-transparent-notification-free-png.png"
            alt="category Image"
            className="shopNotiImg"
          />
        );
    }
  };

  return (
    <div>
      <ScrollToTop />

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        className="sidebatsellerBoard"
      >
        <div className="sellSide">
          <div className="text-center">
            <img src={newlogo} alt="zoofi seller" width={120} />
          </div>
          <div>
            <h5 className="text-center">Seller Dashboard</h5>
          </div>
          <div
            className="sidebar-menu-option sidebar-menu-option-close"
            onClick={() => {
              toggleDrawer();
            }}
          >
            <div className="title">Close</div>
            <div className="Icon">
              <MdCancel size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Seller Dashboard")}
          >
            <div className="title">Home</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Add Product")}
          >
            <div className="title">Add Products</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Product Request")}
          >
            <div className="title">Request New Product</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Add Product Via Upload")}
          >
            <div className="title">Add Product via Upload</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Brand Request")}
          >
            <div className="title">Brand Request</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Category Request")}
          >
            <div className="title">Category Request</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Track Your Application")}
          >
            <div className="title">View Applications</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Inventory Manage")}
          >
            <div className="title">Manage Inventory</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Recent Order List")}
          >
            <div className="title">Orders Lists</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Manage Orders")}
          >
            <div className="title">Manage Orders</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Return Orders Request List")}
          >
            <div className="title">Return Request</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Return Orders List")}
          >
            <div className="title">Return Orders</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Advertising Campaign")}
          >
            <div className="title">Advertising</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Busniess Report")}
          >
            <div className="title">Report</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Customer Feedback")}
          >
            <div className="title">Customer Feedback</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>

          <div
            className="sidebar-menu-option"
            onClick={() => navigateFunction("Service Feedback")}
          >
            <div className="title">Service Feedback</div>
            <div className="Icon">
              <FaAngleRight size={25} />
            </div>
          </div>
        </div>
      </Drawer>

      <Navbar expand="lg">
        <div className="custom-nav">
          <div className="custom-nav-left">
            <div className="menu">
              <FaBars size={25} onClick={toggleDrawer} />
            </div>
            <div
              className="logo"
              onClick={() => {
                navigate("/");
              }}
            >
              <img src={newlogo} alt="zoofi seller" width={120} />
            </div>
            <div className="page-desc flex-justify-center-align-center custom-font-size-lg">
              {HeaderTitle}
            </div>
          </div>
          <div className="custom-nav-right">
            {/* notification */}
            <div className="notify">
              <MdCircleNotifications
                size={36}
                onClick={handleNotificationDropDown}
              />
              <span>{notifications?.length}</span>
            </div>
            {isNotificationOpen && (
              <div className="notification-dropdown">
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
                          xs={2}
                        >
                          {RenderIconHandler(notification?.notification_type)}
                        </Col>
                        <Col>
                          <Row>
                            <Col xs={12} className="notlist-tilte">
                              {notification?.message}
                            </Col>
                            <Col xs={12} className="notlist-main">
                              {handleNotificationTitle(
                                notification?.notification_type,
                                notification
                              )}
                            </Col>
                            <Col xs={12} className="notlist-time">
                              {moment(notification?.updatedAt).fromNow()}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    navigate("/seller/notification");
                  }}
                  className="custom-btn-2"
                >
                  View All
                </button>
              </div>
            )}

            {/* profile */}
            <div className="profile">
              <FaUserCircle size={30} onClick={handleDropdownToggle} />
            </div>
            {isDropdownOpen && (
              <div className="dropdown">
                <div className="profile-info">
                  {userInfo?.email || auth?.email}
                  <br />
                  {userInfo?.shope_name}
                </div>
                <ul>
                  <li
                    onClick={() => {
                      navigate("/seller/reset");
                      handleDropdownClose();
                    }}
                  >
                    Change Password
                  </li>
                  <li
                    onClick={() => {
                      navigate("/seller/profile");
                      handleDropdownClose();
                    }}
                  >
                    Update Profile
                  </li>
                  <li
                    onClick={() => {
                      logout();
                      handleDropdownClose();
                    }}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default MyNavbar;
