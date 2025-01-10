// App.js
import { useState } from "react";
import { Col, Container, Navbar, Row } from "react-bootstrap";
import { Step, Stepper } from "react-form-stepper";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import blackzofi from "../../assets/blackzofi.png";
import "./registration.css";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

function SellerRegistrationPage() {
  const [step, setStep] = useState(0);
  //   const [userData, setUserData] = useState();

  const reg_userdata = JSON.parse(localStorage.getItem("seller-registration"));

  console.log({ reg_userdata });

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const getUserdata = (data) => {
    console.log(data);
    // setUserData(data);
  };

  const navbarStyle = {
    paddingLeft: "0px", // Adjust the left padding
    paddingRight: "10px", // Adjust the right padding
    /* height: '10vh',*/
    backgroundColor: "#F3F3F3  !important",
  };

  const navigate = useNavigate();

  return (
    <div className="App">
      <Navbar expand="lg" className="nvbg sellreg-navbar" style={navbarStyle}>
        <Container>
          {/* <Navbar.Brand ><img src={newlogo} width={80} /></Navbar.Brand> */}
          <Col
            style={{
              color: "#9af064",
              fontWeight: "500",
              textTransform: "uppercase",
              fontSize: "26px",
              letterSpacing: "1px",
            }}
          >
            <img onClick={() => navigate("/")} src={blackzofi} width={150} />
            <span
              className="mx-2"
              style={{
                color: "rgb(193 240 1 / 98%)",
                fontWeight: "500",
                textTransform: "uppercase",
                fontSize: "14px",
                letterSpacing: "1px",
              }}
            >
              seller registration
            </span>
          </Col>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col xs={12}>
            <Stepper
              activeStep={step}
              styleConfig={{
                activeBgColor: "#9af064",
                activeTextColor: "#000",
                activeTitleColor: "#000",
                inactiveBgColor: "#e5faca",
                inactiveTextColor: "#9C9C9C",
                completedBgColor: "#000",
                completedTextColor: "#fff",
                size: "2em",
              }}
            >
              <Step label="Seller Information" />
              <Step label="Business details" />
              <Step label="Documentation" />
              <Step label="Banking Details" />
              <Step label="Interested Categories & Brands" />
            </Stepper>
          </Col>
        </Row>
      </Container>
      <Container className="support-container mt-4 mb-4">
        <Row>
          <Col xs={12} className="text-center  d-flex justify-content-center align-items-center p-2">
           
            <p style={{ fontSize: "15px", color: "black",fontFamily:'sans-serif' }}>
            <i><BsFillInfoSquareFill  size={20} color="black" className="mx-2"/></i> In case of any queries or issues during registration, please feel
              free to reach out to our dedicated seller support team via
              WhatsApp at
              <a
                href="https://wa.me/917505429772"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontWeight: "bold",
                  color: "#25D366",
                  textDecoration: "none",
                  marginLeft: "5px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <i
                  className="fa fa-phone"
                  style={{ marginRight: "5px", fontSize: "16px" }}
                ></i>
                917505429772
              </a>{" "}
              or email us at
              <a
                href="mailto:support@zoofi.in"
                style={{
                  fontWeight: "bold",
                  color: "#25D366",
                  textDecoration: "none",
                  marginLeft: "5px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <i
                  className="fa fa-envelope"
                  style={{ marginRight: "5px", fontSize: "16px" }}
                ></i>
                support@zoofi.in
              </a>
            </p>
          </Col>
        </Row>
      </Container>
      <Container className="stepContent">
        <Row className="mt-2 ml-4 p-4">
          <Col xs={12}>
            {step === 0 && (
              <Step1 nextStep={nextStep} getUserdata={getUserdata} />
            )}
            {step === 1 && (
              <Step2
                nextStep={nextStep}
                prevStep={prevStep}
                reg_userdata={reg_userdata}
                getUserdata={getUserdata}
              />
            )}
            {step === 2 && (
              <Step3
                nextStep={nextStep}
                prevStep={prevStep}
                reg_userdata={reg_userdata}
                getUserdata={getUserdata}
              />
            )}
            {step === 3 && (
              <Step4
                nextStep={nextStep}
                prevStep={prevStep}
                reg_userdata={reg_userdata}
                getUserdata={getUserdata}
              />
            )}
            {step === 4 && (
              <Step5
                prevStep={prevStep}
                reg_userdata={reg_userdata}
                getUserdata={getUserdata}
              />
            )}
          </Col>
        </Row>
      </Container>
     
    </div>
  );
}

export default SellerRegistrationPage;
