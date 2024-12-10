import React from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import "./newproduct.css";

const NewAddLayout = () => {
  const SellerNewProductId = localStorage.getItem("Seller-productId") || "";

  return (
    <div>
      <Container className="mt-4">
        <Row className="p-1 justify-content-md-center">
          <Col xs={10}>
            <ul className="d-flex justify-content-evenly liststyle">
              <li>
                <NavLink
                  to="/seller/seller-ownproduct-status/new-add"
                  className={({ isActive }) =>
                    isActive ? "activeNav" : "inactivetab"
                  }
                >
                  Product Identity
                </NavLink>
              </li>
              <li className={SellerNewProductId === "" ? "disabledTab" : ""}>
                <NavLink
                  to="/seller/seller-ownproduct-status/new-description"
                  className={({ isActive }) =>
                    SellerNewProductId === ""
                      ? "disabledLink"
                      : isActive
                      ? "activeNav"
                      : "inactivetab"
                  }
                  aria-disabled={SellerNewProductId === ""}
                  onClick={(e) => {
                    if (SellerNewProductId === "") {
                      e.preventDefault(); // Prevent navigation
                    }
                  }}
                >
                  Product Details & Videos
                </NavLink>
              </li>
              <li className={SellerNewProductId === "" ? "disabledTab" : ""}>
                <NavLink
                  to="/seller/seller-ownproduct-status/new-variations"
                  className={({ isActive }) =>
                    SellerNewProductId === ""
                      ? "disabledLink"
                      : isActive
                      ? "activeNav"
                      : "inactivetab"
                  }
                  aria-disabled={SellerNewProductId === ""}
                  onClick={(e) => {
                    if (SellerNewProductId === "") {
                      e.preventDefault(); // Prevent navigation
                    }
                  }}
                >
                  Variations
                </NavLink>
              </li>
              <li className={SellerNewProductId === "" ? "disabledTab" : ""}>
                <NavLink
                  to="/seller/seller-ownproduct-status/new-customization"
                  className={({ isActive }) =>
                    SellerNewProductId === ""
                      ? "disabledLink"
                      : isActive
                      ? "activeNav"
                      : "inactivetab"
                  }
                  aria-disabled={SellerNewProductId === ""}
                  onClick={(e) => {
                    if (SellerNewProductId === "") {
                      e.preventDefault(); // Prevent navigation
                    }
                  }}
                >
                  Additional Details
                </NavLink>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="productaddBack">
        <Outlet />
      </div>
    </div>
  );
};

export default NewAddLayout;
