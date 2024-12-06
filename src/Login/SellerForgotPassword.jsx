import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AdminLogin,
  EmailSendForgotSeler,
  SellerLogin,
  SellerResetPassword,
  SellerVerifyOtp,
} from "../API/api";
import useAuth from "../hooks/useAuth";
import "./loginpage.css";
import toast, { Toaster } from "react-hot-toast";
import { getLocation } from "../Pages/KeyManager/Dashboard/Attendence";
import ReCAPTCHA from "react-google-recaptcha";
import loginbackground from "../assets/wave6.png";
import key from "../assets/key.png";
import OTPInput from "react-otp-input";
import OtpInput from "react-otp-input";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SellerForgotPassword = () => {
  const { setAuth } = useAuth();

  const [userEmail, setUserEmail] = useState();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [otp, setOtp] = useState("");
  const [data, setData] = useState();
  const [resetForm, SetResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState("");

  const SendEmailHandler = async (e) => {
    e.preventDefault();

    let payload = {
      user: userEmail,
    };

    console.log(payload, "ppp");

    let res = await EmailSendForgotSeler(payload);

    console.log(res);

    if (res?.response?.data?.error) {
      toast.error(res?.response?.data?.message || "Something went wrong");
    } else {
      toast.success(`Otp has been send to your email ${userEmail}`);
      setData(res?.data?.data);
      setShow(true);
    }
  };

  const OtpHnadlerFunc = async (e) => {
    e.preventDefault();

    let payload = {
      user: userEmail,
      otp: otp,
    };

    console.log({ payload });

    let res = await SellerVerifyOtp(payload);

    if (res?.response?.data?.error) {
      toast.error(res?.response?.data?.message || "Something went wrong");
    } else {
      toast.success(`You can reset Password Now`);
      SetResetForm(true);
    }
  };

  const ResetPassHandler = async (e) => {
    e.preventDefault();

    let payload = {
      email: userEmail,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };

    console.log(payload, "payload");

    let res = await SellerResetPassword(payload);

    if (res?.response?.data?.error) {
      toast.error(res?.response?.data?.message || "Something went wrong");
    } else {
      toast.success(`Password is successfully changed`);
      setTimeout(() => {
        navigate("/seller-login");
      }, 2500);
    }
  };

  const handleChnageConfirmPassword = (e) => {
    console.log(e?.target?.value);

    if (e?.target?.value !== newPassword) {
      console.log("Confirm password is not matching");
      setError("Confirm password is not matching");
    } else {
      setError("");
    }

    setConfirmPassword(e?.target?.value);
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="sign-in__wrapper">
      <div class="login-page-background">
        <img src={loginbackground} alt="" />
      </div>

      {!resetForm ? (
        <>
          {!show ? (
            <Form className="shadow loginForm" onSubmit={SendEmailHandler}>
              <img src={key} alt="" />

              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Enter Your Registred Email</Form.Label>
                <Form.Control
                  type="text"
                  value={userEmail}
                  placeholder="Enter your email"
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                className="w-100 mt-2"
                variant="primary"
                type="submit"
                disabled={!userEmail}
              >
                Send
              </Button>
            </Form>
          ) : (
            <Form className="shadow loginForm" onSubmit={OtpHnadlerFunc}>
              <img src={key} alt="" />

              <Form.Group className="mb-3" controlId="otp">
                <Form.Label className="mb-3">
                  Please Enter Your Otp has been sent to your registered email{" "}
                  {userEmail}{" "}
                </Form.Label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                  containerStyle="otp-input-container" // Add your custom style class
                  inputStyle="otp-input" // Add your custom style class
                />
              </Form.Group>

              <Button
                className="w-100 mt-2"
                variant="primary"
                type="submit"
                disabled={!otp}
              >
                Verify
              </Button>
          
              <p className="mt-2 text-center mt-4">
                <span className="text-muted">
                  Didn't receive the OTP? Send it again.
                </span>
                <Button
                  className="w-100 mt-2"
                  variant="primary"
                  type="submit"
                  onClick={SendEmailHandler}
                >
                  Resend OTP
                </Button>
              </p>

            </Form>
          )}
        </>
      ) : (
        <Form className="shadow loginForm" onSubmit={ResetPassHandler}>
          <img src={key} alt="" />

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Enter New Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={passwordVisible ? "text" : "password"}
                value={newPassword}
                placeholder="Enter your new password"
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="pe-5" // Add padding to prevent text overlap with the icon
              />
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-2"
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer", zIndex: 1 }}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              placeholder="Enter your confirm password"
              onChange={(e) => handleChnageConfirmPassword(e)}
              required
            />
            <Form.Text className="mt-2" style={{ color: "red" }}>
              {error}
            </Form.Text>
          </Form.Group>

          <Button
            className="w-100 mt-2"
            variant="primary"
            type="submit"
            disabled={error}
          >
            Save
          </Button>
        </Form>
      )}

      <Toaster position="top-right" />
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-center">
        Zoofi | &copy;2023
      </div>
    </div>
  );
};

export default SellerForgotPassword;
