import React, { useState } from "react";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import { sellerOwnRegistrationForm } from "../../API/api";
import toast, { Toaster } from "react-hot-toast";
import { RiShareForwardFill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Step1 = ({ nextStep, getUserdata }) => {
  const [userInfo, setUserInfo] = useState({
    user_name: "",
    email: "",
    phone_no: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ userInfo });
    // You can perform validation here before proceeding to the next step

    let response = await sellerOwnRegistrationForm(userInfo);

    console.log({ response });

    console.log(response?.data?.data);

    if (response?.response?.data?.error) {
      toast.error(response?.response?.data?.data);
    } else {
      getUserdata(response?.data?.data);
      localStorage.setItem(
        "seller-registration",
        JSON.stringify(response?.data?.data)
      );
      toast.success("Personal information Added");
      nextStep();
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col className="t1">Register and Start Selling</Col>
          </Row>
          <Row>
            <Col className="">
              <p>Please have the following before you start register</p>
              <ul>
                <li>Shop related location,images </li>
                <li>Bank account details </li>
                <li>
                  Business document with GST and cancelled cheque certificate
                </li>
              </ul>
            </Col>
          </Row>
          <Row className="tt mt-4">
            <Col>
              <h4>Enter details to start your registration process</h4>
            </Col>
          </Row>
          <Form onSubmit={handleSubmit}>
            <Row className="mt-3">
              <Col xs={6}>
                <Form.Group controlId="user_name">
                  <Form.Label className="frmLable">
                    Company Business Name <span className="req">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="user_name"
                    className="tapG"
                    placeholder="Enter Username"
                    size="sm"
                    value={userInfo.user_name}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="email">
                  <Form.Label className="frmLable">
                    Email <span className="req">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    size="sm"
                    className="tapG"
                    placeholder="Enter Email"
                    value={userInfo.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col xs={6}>
                <Form.Group controlId="phone_no">
                  <Form.Label className="frmLable">
                    Phone Number <span className="req">*</span>{" "}
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone_no"
                    size="sm"
                    className="tapG"
                    placeholder="Enter Phone No."
                    value={userInfo.phone_no}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    title="Phone number must be a 10-digit number"
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="password">
                  <Form.Label className="frmLable">
                    Password <span className="req">*</span>{" "}
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      size="sm"
                      className="tapG"
                      placeholder="Enter Password"
                      value={userInfo.password}
                      onChange={handleChange}
                      pattern=".{6,}"
                      title="Password must be at least 6 characters long"
                      required
                    />
                    <InputGroup.Text
                      onClick={togglePasswordVisibility}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mt-5">
              <Col className="text-center">
                <Button size="sm" className="frmLable grnbg" type="submit">
                  {" "}
                  Next Step{" "}
                  <span className="mx-2">
                    <RiShareForwardFill />
                  </span>{" "}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Toaster position="top-right" />
    </Container>
  );
};

export default Step1;
