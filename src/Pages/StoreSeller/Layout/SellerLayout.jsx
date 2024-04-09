import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import { FaAngleRight, FaUserCircle } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { Outlet, useNavigate } from "react-router-dom";
import { sellerDetails } from "../../../API/api";
import newlogo from "../../../assets/zoofilogo.png";
import useAuth from "../../../hooks/useAuth";
import { ScrollToTop } from "../../../components/scrollToTop/ScrollToTop";

const MyNavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { auth, logout } = useAuth();
  const [HeaderTitle, setHeaderTitle] = useState("Seller Dashboard");
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    if (auth) {
      getProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    // close menu on click outside
    const handleClick = (e) => {
      if (
        e.target.closest(".custom-nav-right .profile") ||
        e.target.closest(".dropdown")
      ) {
        return;
      }
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
      case "Return Orders Request List":
        navigate("/seller/seller-return-order-request-list");
        setHeaderTitle(pathName);
        break;
      case "Return Orders List":
        navigate("/seller/seller-return-order-list");
        setHeaderTitle(pathName);
        break;
      case "Manage Orders":
        navigate("/seller/manage-orders");
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
            onClick={() => navigateFunction("Manage Orders")}
          >
            <div className="title">Manage Orders</div>
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
