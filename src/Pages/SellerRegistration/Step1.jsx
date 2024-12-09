import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { resendOtp, sellerOwnRegistrationForm, verifyOTP } from "../../API/api";
import toast, { Toaster } from "react-hot-toast";
import { RiShareForwardFill } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import OtpInput from "react-otp-input";

const Step1 = ({ nextStep, getUserdata }) => {
  const [userInfo, setUserInfo] = useState({
    user_name: "",
    email: "",
    phone_no: "",
    password: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

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
      toast.error(response?.response?.data?.message);
    } else {
      getUserdata(response?.data?.data);
      localStorage.setItem(
        "seller-registration",
        JSON.stringify(response?.data?.data)
      );
      toast.success("Personal information Added");
      setShowModal(true);
      // nextStep();
    }

    // setShowModal(true);
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

            <Row>
              <Col className="text-center">
                <Modal
                  size="md"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                  show={showModal}
                  onHide={handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title
                      id="contained-modal-title-vcenter"
                      style={{ textAlign: "left", fontSize: "16px" }}
                    >
                      To Complete the registration process, please verify your
                      Mobile Number and Email
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <OtpContainer
                      userInfo={userInfo}
                      nextStep={nextStep}
                      handleClose={handleClose}
                      getUserdata={getUserdata}
                    />
                  </Modal.Body>
                </Modal>
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

const OtpContainer = ({ userInfo, nextStep, handleClose, getUserdata }) => {
  const [otp, setOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneTimer, setPhoneTimer] = useState(60);
  const [canResendPhoneOtp, setCanResendPhoneOtp] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Verify OTP");

  // Timer for OTP resend
  useEffect(() => {
    if (phoneTimer > 0) {
      const timer = setInterval(() => {
        setPhoneTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResendPhoneOtp(true);
    }
  }, [phoneTimer]);

  const handleResendOtp = async () => {
    setOtp("")
    setEmailOtp("")
    setPhoneTimer(60);
    setCanResendPhoneOtp(false);
    // Logic to resend OTP for phone and email
    let payload = {
      email: userInfo?.email,
      phone_no: userInfo?.phone_no,
    };

    let response = await resendOtp(payload);

    console.log("response", response);

    if (response?.response?.data?.error) {
      toast.error(response?.response?.data?.message || "Something went wrong");
    } else {
      toast.success("Otp resent successfully");
    }
  };

  const handleOtpVerification = async () => {
    setLoadingState(true);
    setLoadingMessage("Verifying OTP");
    try {
      // Replace this with your OTP verification logic
      console.log("Verifying OTP:", { phoneOtp: otp, emailOtp });
      // Navigate or dispatch actions based on the verification result
      let payload = {
        email: userInfo?.email,
        phone_no: userInfo?.phone_no,
        mobileOtp: otp,
        emailOtp: emailOtp,
      };

      let response = await verifyOTP(payload);

      console.log("response", response);

      if (response?.response?.data?.error) {
        toast.error(
          response?.response?.data?.message || "Something went wrong"
        );
        handleResendOtp();
      } else {
        toast.success("Otp verified Successfully");
        // getUserdata(response?.data?.data);
        // localStorage.setItem(
        //   "seller-registration",
        //   JSON.stringify(response?.data?.data)
        // );
        // toast.success("Personal information Added");
        handleClose();
        setTimeout(() => {
          nextStep();
        }, 1000);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      handleResendOtp();
    } finally {
      setLoadingState(false);
      setLoadingMessage("Verify OTP");
    }
  };

  return (
    <div className="content-wrap p-2">
      <div className="content">
        <div className="mb-3">
          <p>
            <span className="mx-2">
              <FaInfoCircle />
            </span>{" "}
            We have sent an SMS with an OTP to your mobile number{" "}
            <strong>{userInfo?.phone_no}</strong>
          </p>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            inputStyle="otp-input"
            containerStyle="otp-input-container-Seller"
          />
        </div>
        <div className="mb-3">
          <p>
            <span className="mx-2">
              <FaInfoCircle />
            </span>{" "}
            We have sent an email with a verification code to your email address{" "}
            <strong>{userInfo?.email}</strong>
          </p>
          <OtpInput
            value={emailOtp}
            onChange={setEmailOtp}
            numInputs={4}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            inputStyle="otp-input"
            containerStyle="otp-input-container-Seller"
          />
        </div>
        <div className="resend-section">
          <p>
            Did not get the verification code?{" "}
            {canResendPhoneOtp ? (
              <span
                onClick={handleResendOtp}
                style={{
                  color: "#219b9d",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                className="resend-link"
              >
                Resend OTP for Phone & Email
              </span>
            ) : (
              <span className="timer">
                <span style={{ color: "darkgreen", fontWeight: "bold" }}>
                  {phoneTimer}
                </span>{" "}
                seconds left to resend OTP
              </span>
            )}
          </p>
        </div>
        <button
          type="submit"
          onClick={handleOtpVerification}
          className="btn btn-login2"
          disabled={loadingState}
        >
          {loadingState ? loadingMessage : "Verify OTP for Email & Phone"}
        </button>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};
