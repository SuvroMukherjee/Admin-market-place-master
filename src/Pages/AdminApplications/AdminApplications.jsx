import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import CatReqList from "../ProductManagement/Category/CatReqList";

export default function AdminApplications() {
  
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
                defaultActiveKey="catgories"
                id="justify-tab-example"
                className="mb-3 custom-tabs"
                justify
              >
                <Tab eventKey="catgories" title="Categories">
                  <CatReqList />
                </Tab>
                <Tab eventKey="profile" title="Profile">
                  Tab content for Profile
                </Tab>
                <Tab eventKey="longer-tab" title="Loooonger Tab">
                  Tab content for Loooonger Tab
                </Tab>
                <Tab eventKey="contact" title="Contact">
                  Tab content for Contact
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
