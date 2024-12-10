import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import CatReqList from "../ProductManagement/Category/CatReqList";
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SubCatReqList from "../ProductManagement/SubCategory/SubCatReqList";
import BrandReqList from "../ProductManagement/Brand/BrandReqList";
import SellerProductManagment from "../SellerProductManagment/SellerProductManagment";

export default function AdminApplications() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const [activeTab, setActiveTab] = React.useState(tab ?? "catgories");

  //   console.log({tab})

  //   useEffect(() => {
  //     if (tab) {
  //       setActiveTab(tab);
  //     }
  //   }, [tab]);

  //   console.log({activeTab})

  return (
    <>
      <div className="productList mt-2 p-4">
        <div className="text-start">
          <h4 className="text-start">Application Request Lists</h4>
        </div>
        <Container className="mt-4 p-4">
          <Row>
            <Col>
              <Tabs
                defaultActiveKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                id="justify-tab-example"
                className="mb-3 custom-tabs"
                justify
              >
                <Tab eventKey="catgories" title="Categories">
                  <CatReqList />
                </Tab>
                <Tab eventKey="sub-categories" title="Sub-Categories">
                  <SubCatReqList />
                </Tab>
                <Tab eventKey="brands" title="Brands">
                  <BrandReqList/> 
                </Tab>
                <Tab eventKey="products" title="Products">
                  <SellerProductManagment/>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>

        <Toaster position="top-right" />
      </div>
    </>
  );
}
