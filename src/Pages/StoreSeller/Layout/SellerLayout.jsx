import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { Col, Dropdown } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { FaUserCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Outlet, useNavigate } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { FaBars } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { sellerDetails } from "../../../API/api";
import newlogo from "../../../assets/zoofilogo.png";
import useAuth from "../../../hooks/useAuth";

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
    const { password, ...filteredData } = res?.data?.data;
    console.log(filteredData, "ss");
    setUserInfo(filteredData);
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigate = useNavigate();

  // const [menuAnchor, setMenuAnchor] = useState(null);
  // const [menuAnchor2, setMenuAnchor2] = useState(null);

  // const handleMenuClick = (event) => {
  //     setMenuAnchor(event.currentTarget);
  // };

  // const handleMenuClose = () => {
  //     setMenuAnchor(null);
  // };

  // const handleMenuClick2 = (event) => {
  //     setMenuAnchor2(event.currentTarget);
  // };

  // const handleMenuClose2 = () => {
  //     setMenuAnchor2(null);
  // };

  // const navbarStyle = {
  //     height: '18vh',
  // };

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

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
  };

  return (
    <div>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        className="sidebatsellerBoard"
      >
        <div className="sellSide mt-4 mb-4">
          <div className="text-center">
            <img src={newlogo} alt="zoofi seller" width={120} />
          </div>
          <div className="">
            <h5 className="text-center">Seller Dashboard</h5>
          </div>
          <Col
            className="p-2 mx-2 text-left boldtext clos"
            onClick={toggleDrawer}
          >
            <Row >
              <Col
                xs={8}
                className="d-flex justify-content-start align-items-center"
              >
                CLOSE
              </Col>
              <Col className="d-flex justify-content-end align-items-center">
              <MdCancel color="" size={25} />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Seller Dashboard")}
          >
            <Row>
              <Col xs={8}>Home</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Add Product")}
          >
            <Row>
              <Col xs={8}>Add Products</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Product Request")}
          >
            <Row>
              <Col xs={8}>Request New Product</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Add Product Via Upload")}
          >
            <Row>
              <Col xs={8}>Add Product via Upload</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Brand Request")}
          >
            <Row>
              <Col xs={8}>Brand Request</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Category Request")}
          >
            <Row>
              <Col xs={8}>Category Request</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Track Your Application")}
          >
            <Row>
              <Col xs={8}>View Applications</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Inventory Manage")}
          >
            <Row>
              <Col xs={8}>Manage Inventory</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Recent Order List")}
          >
            <Row>
              <Col xs={8}>Orders Lists</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Return Orders Request List")}
          >
            <Row>
              <Col xs={8}>Return Request</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Return Orders List")}
          >
            <Row>
              <Col xs={8}>Return Orders</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Manage Orders")}
          >
            <Row>
              <Col xs={8}>Manage Orders</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Advertising Campaign")}
          >
            <Row>
              <Col xs={8}>Advertising</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Busniess Report")}
          >
            <Row>
              <Col xs={8}>Report</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Customer Feedback")}
          >
            <Row>
              <Col xs={8}>Customer Feedback</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
          <Col
            className="p-2 mx-2 text-left boldtext"
            onClick={() => navigateFunction("Service Feedback")}
          >
            <Row>
              <Col xs={8}>Service Feedback</Col>
              <Col className="d-flex justify-content-end align-items-center">
                <FaAngleRight color="" />
              </Col>
            </Row>
          </Col>
        </div>
      </Drawer>

      <Navbar expand="lg">
        <Col>
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={8}>
              <Row>
                <Col
                  className="d-flex justify-content-center align-items-center"
                  xs={1}
                  onClick={() => toggleDrawer()}
                  style={{ cursor: "pointer" }}
                >
                  <FaBars color="white" size={20} />
                </Col>
                <Col
                  xs={2}
                  onClick={() => navigateFunction("Seller Dashboard")}
                >
                  <img src={newlogo} alt="zoofi seller" width={120} />
                </Col>
                <Col
                  xs={4}
                  className="d-flex align-items-center justify-content-center sidebarHeaderName"
                >
                  {HeaderTitle}
                </Col>
              </Row>
            </Col>
            <Col>
              {isDropdownOpen && (
                <Dropdown show={isDropdownOpen} onClose={handleDropdownClose}>
                  <Dropdown.Menu className="dropdownMenus">
                    <Dropdown.Item onClick={() => navigate("/seller/reset")}>
                      Change Passowrd
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/seller/profile")}>
                      Update Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => logout()}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
              {/* <div onClick={() => handleDropdownClose()}>close</div> */}
              <Row>
                <Col></Col>
                <Col
                  style={{ cursor: "pointer" }}
                  xs={2}
                  onClick={handleDropdownToggle}
                >
                  <IoSettings color="white" size={25} />{" "}
                  <span>
                    <IoMdArrowDropdown color="#9af064" />
                  </span>
                </Col>

                <Col className="d-flex justify-content-center">
                  <span>
                    <FaUserCircle color="#9af064" size={30} />
                  </span>{" "}
                  <span
                    style={{ color: "white", fontSize: "12px" }}
                    className="mx-2"
                  >
                    {userInfo?.email || auth?.email}
                    <br />
                    {userInfo?.shope_name}
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default MyNavbar;
