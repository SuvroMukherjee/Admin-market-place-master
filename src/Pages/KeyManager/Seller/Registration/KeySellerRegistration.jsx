// App.js
import React, { useEffect, useState } from "react";
import "./reg.css";
import { Stepper, Step } from "react-form-stepper";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

function KeySellerRegistration() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState();

  const reg_userdata = JSON.parse(localStorage.getItem("seller-registration"));

  console.log({ reg_userdata });

  useEffect(() => {
    if (!reg_userdata?.Shop_Details_Info && reg_userdata?.password) {
      setStep(1);
    } else if (reg_userdata?.Shop_Details_Info && !reg_userdata?.doc_details) {
      setStep(2);
    } else if (reg_userdata?.doc_details && !reg_userdata?.bank_details) {
      setStep(3);
    } else if (reg_userdata?.bank_details && !reg_userdata?.interest_details) {
      setStep(4);
    }
  }, []);

  // useEffect(()=>{

  //     // if (!reg_userdata?.Shop_Details_Info){
  //     //     setStep(1)
  //     // } else if (!reg_userdata?.doc_details && reg_userdata?.Shop_Details_Info && reg_userdata?.password){
  //     //     setStep(2)
  //     // }
  //     if (reg_userdata?.password && !reg_userdata?.Shop_Details_Info){
  //         console.log('call')
  //         setStep(1)
  //     } else if (reg_userdata?.password && reg_userdata?.Shop_Details_Info ){
  //         setStep(2)
  //     }
  // },[])

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const getUserdata = (data) => {
    console.log(data);
    setUserData(data);
  };

  return (
    <div className="App">
      <Container>
        <Row>
          <Col xs={12}>
            <Stepper
              activeStep={step}
              styleConfig={{
                activeBgColor: "#1ec7d6",
                activeTextColor: "#fff",
                activeTitleColor: "#820300",
                inactiveBgColor: "#F5F7F8",
                inactiveTextColor: "#BFC2C6",
                completedBgColor: "#236162",
                completedTextColor: "#fff",
                size: "2em",
              }}
            >
              <Step label="Seller Information" />
              <Step label="Business Details" />
              <Step label="Documentation" />
              <Step label="Banking Details" />
              <Step label="Categoey & Comissions" />
            </Stepper>
          </Col>
        </Row>
      </Container>
      <Container>
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

export default KeySellerRegistration;
