import React, { useState } from "react";
import { Alert, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminLogin, SellerLogin } from "../API/api";
import useAuth from "../hooks/useAuth";
import "./loginpage.css";
import toast, { Toaster } from "react-hot-toast";
import { getLocation } from "../Pages/KeyManager/Dashboard/Attendence";
import ReCAPTCHA from "react-google-recaptcha";
import loginbackground from "../assets/wave6.png";
import loginperson from "../assets/login.png";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons


const SellerLoginPage = () => {
  const { setAuth } = useAuth();

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginAsSeller, setLoginAsSeller] = useState(true);
  const [isCaptchaVerified, setCaptchaVerified] = useState(false);


  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await delay(500);
    console.log(`Username: ${inputUsername}, Password: ${inputPassword}`);
    if (inputUsername === "" || inputPassword === "") {
      setShow(true);
    } else {
      let payload = {
        user: inputUsername,
        password: inputPassword,
      };

      if (!loginAsSeller) {
        await AdminLogin(payload)
          .then((res) => {
            console.log(res, "res");
            if (res?.response?.data?.error == true) {
              toast.error(res?.response?.data?.message);
            } else {
              const accessToken = res?.data?.data[1]?.accessToken;
              const role = res?.data?.data[0]?.role;
              console.warn(role, "role");
              if (role?.name == "Key Account Manager") {
                getLocation();
              }

              console.log(res?.data?.data[0]?.name, "api name");

              setAuth((prevAuth) => ({
                ...prevAuth,
                username: res?.data?.data[0]?.name,
                password: res?.data?.data[0]?.password,
                email: res?.data?.data[0]?.email,
                userId: res?.data?.data[0]?._id,
                accessToken,
                role,
              }));

              setLoading(false);

              const authData = {
                username: res?.data?.data[0]?.name,
                password: res?.data?.data[0]?.password,
                email: res?.data?.data[0]?.email,
                userId: res?.data?.data[0]?._id,
                accessToken,
                role,
              };

              localStorage.clear();
              localStorage.setItem(
                "ACCESS_TOKEN",
                JSON.stringify(res?.data?.data[1].accessToken)
              );
              localStorage.setItem("auth", JSON.stringify(authData));
              navigate(from, { replace: true });
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            setShow(true);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        await SellerLogin(payload)
          .then((res) => {
            console.log(res, "res");
            if (res?.response?.data?.error == true) {
              toast.error(res?.response?.data?.message);
            } else {
              const accessToken = res?.data?.data[1]?.accessToken;
              const role = {
                _id: "seller",
                name: "Seller",
              };

              console.log(res?.data?.data[0]?.name, "api name");

              setAuth((prevAuth) => ({
                ...prevAuth,
                username: res?.data?.data[0]?.name,
                password: res?.data?.data[0]?.password,
                email: res?.data?.data[0]?.email,
                accessToken,
                role,
                userId: res?.data?.data[0]?._id,
              }));

              setLoading(false);

              const authData = {
                username: res?.data?.data[0]?.name,
                password: res?.data?.data[0]?.password,
                email: res?.data?.data[0]?.email,
                accessToken,
                role,
                userId: res?.data?.data[0]?._id,
              };

              localStorage.clear();
              localStorage.setItem(
                "ACCESS_TOKEN",
                JSON.stringify(res?.data?.data[1].accessToken)
              );
              localStorage.setItem("auth", JSON.stringify(authData));
              navigate(from, { replace: true });
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            setShow(true);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  };

  const handlePassword = () => {};

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
    }
  };

  return (
    <div
      className="sign-in__wrapper"
      // style={{ backgroundImage: `url('https://img.freepik.com/free-photo/online-shopping-shopping-cart-placed-alongside-notebook-blue_1150-19158.jpg')` }}
    >
      {/* <div className="sign-in__backdrop"></div> */}
      <div class="login-page-background">
        <img src={loginbackground} alt="" />
      </div>
      <Form className="shadow loginForm" onSubmit={handleSubmit}>
        {/* <img
                    className="img-thumbnail mx-auto d-block mb-2"
                    src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn0ivKSgxD_PljXFzpiZIDT-TXhcRNVo4g3Q&usqp=CAU'}
                    alt="logo"
                /> */}
        <img src={loginperson} alt="" />
        <div className="h4 mb-2 text-center">Seller</div>
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect username or password.
          </Alert>
        ) : (
          <div />
        )}
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Email / Phone Number</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Enter your email or phone number"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="password">
          <Form.Label>Password</Form.Label>
          <div style={{ position: "relative" }}>
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={inputPassword}
              placeholder="Enter your password"
              onChange={(e) => setInputPassword(e.target.value)}
              required
              style={{ paddingRight: "2.5rem" }} // Add padding for icon space
            />
            <span
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#6c757d",
              }}
            >
              {showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
            </span>
          </div>
        </Form.Group>
        {/* <Form.Group className="mb-3 mt-3" controlId="checkbox">
                    <Form.Check
                        type="checkbox"
                        label="Login as a seller."
                        checked={loginAsSeller}
                        onChange={(e) => setLoginAsSeller(e.target.checked)}
                    />
                </Form.Group> */}
        <Row>
          <Col className="d-flex justify-content-center">
            <ReCAPTCHA
              sitekey="6Lf2Y4EpAAAAAMIJJIvzy88IybLMRSIjSWS2H7sq"
              onChange={handleCaptchaChange}
            />
          </Col>
        </Row>
        {/* <Form.Group className="mb-2" controlId="checkbox">
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group> */}
        {!loading ? (
          <Button
            className="w-100 mt-2"
            variant="primary"
            type="submit"
            disabled={!isCaptchaVerified}
          >
            Log In
          </Button>
        ) : (
          <Button
            className="w-100 mt-2"
            variant="primary"
            type="submit"
            disabled
          >
            Logging In...
          </Button>
        )}
        <div className="d-grid justify-content-center mt-3" style={{color:'black',fontWeight:'bold',letterSpacing:'0.5px'}}>
          <p>
            Don't have an account?{" "}
            <span onClick={() => navigate("/seller-registration")} className="cursor text-primary font-weight-bold">
              Register Now
            </span>
          </p>
        </div>
        <div
          className="d-grid justify-content-center mt-3"
          onClick={() => navigate("/seller-login/forgot")}
        >
          <Button
            className="p-0 btn-forgot"
            variant="link"
            onClick={handlePassword}
          >
            Forgot password ?
          </Button>
        </div>
      </Form>
      <Toaster position="top-right" />
      {/* Footer */}
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-center">
        Sant Sales| &copy;2023
      </div>
    </div>
  );
};

export default SellerLoginPage;
