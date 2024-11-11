
import React, { useState } from 'react';
import { Alert, Button, Form,Row,Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminLogin, SellerLogin } from '../API/api';
import useAuth from '../hooks/useAuth';
import './loginpage.css';
import toast, { Toaster } from 'react-hot-toast';
import { getLocation } from '../Pages/KeyManager/Dashboard/Attendence';
import ReCAPTCHA from 'react-google-recaptcha';
import loginbackground from '../assets/wave6.png'
import loginperson from '../assets/login.png'


const LoginPage = () => {
    const { setAuth } = useAuth()

    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginAsSeller, setLoginAsSeller] = useState(false);
    const [isCaptchaVerified, setCaptchaVerified] = useState(false);

    const navigate = useNavigate()
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        await delay(500);
        // console.log(`Username: ${inputUsername}, Password: ${inputPassword}`);
        if (inputUsername === "" || inputPassword === "") {
            setShow(true);
        } else {
            let payload = {
                user: inputUsername,
                password: inputPassword
            };

            if (!loginAsSeller) {
                await AdminLogin(payload)
                    .then((res) => {
                        console.log(res, 'res');
                        if (res?.response?.data?.error == true) {
                            toast.error(res?.response?.data?.message)
                        } else {
                            const accessToken = res?.data?.data[1]?.accessToken;
                            const role = res?.data?.data[0]?.role;
                            console.warn(role, 'role')
                            if (role?.name == "Key Account Maneger") {
                                getLocation();
                            }

                            console.log(res?.data?.data[0]?.name, 'api name')

                            setAuth((prevAuth) => ({
                                ...prevAuth,
                                username: res?.data?.data[0]?.name,
                                password: res?.data?.data[0]?.password,
                                email: res?.data?.data[0]?.email,
                                userId: res?.data?.data[0]?._id,
                                accessToken,
                                role
                            }));

                            setLoading(false);

                            const authData = {
                                username: res?.data?.data[0]?.name,
                                password: res?.data?.data[0]?.password,
                                email: res?.data?.data[0]?.email,
                                userId: res?.data?.data[0]?._id,
                                accessToken,
                                role
                            };

                            localStorage.clear();
                            localStorage.setItem(
                                "ACCESS_TOKEN",
                                JSON.stringify(res?.data?.data[1].accessToken)
                            );
                            localStorage.setItem('auth', JSON.stringify(authData));
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
                        console.log(res, 'res');
                        if (res?.response?.data?.error == true) {
                            toast.error(res?.response?.data?.message)
                        } else {
                            const accessToken = res?.data?.data[1]?.accessToken;
                            const role = {
                                _id: 'seller',
                                name: 'Seller',
                            };

                            console.log(res?.data?.data[0]?.name, 'api name')

                            setAuth((prevAuth) => ({
                                ...prevAuth,
                                username: res?.data?.data[0]?.name,
                                password: res?.data?.data[0]?.password,
                                email: res?.data?.data[0]?.email,
                                accessToken,
                                role
                            }));

                            setLoading(false);

                            const authData = {
                                username: res?.data?.data[0]?.name,
                                password: res?.data?.data[0]?.password,
                                email: res?.data?.data[0]?.email,
                                accessToken,
                                role,
                                userId: res?.data?.data[0]?._id
                            };

                            localStorage.clear();
                            localStorage.setItem(
                                "ACCESS_TOKEN",
                                JSON.stringify(res?.data?.data[1].accessToken)
                            );
                            localStorage.setItem('auth', JSON.stringify(authData));
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


    const handlePassword = () => { };

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
     
        >

          
            <div class="login-page-background">
                <img src={loginbackground} alt="" />
            </div>
            <Form className="shadow loginForm" onSubmit={handleSubmit}>
                <img src={loginperson} alt="" />
                <div className="h4 mb-2 text-center">Zoofi's Member Login</div>
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
                    <Form.Control
                        type="password"
                        value={inputPassword}
                        placeholder="Enter your password"
                        onChange={(e) => setInputPassword(e.target.value)}
                        required
                    />
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
                    <Col className='d-flex justify-content-center'>
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
                    <Button className="w-100 mt-2" variant="primary" type="submit" disabled={!isCaptchaVerified}>
                        Log In
                    </Button>
                ) : (
                    <Button className="w-100 mt-2" variant="primary" type="submit" disabled>
                        Logging In...
                    </Button>
                )}
                <div className="d-grid justify-content-center mt-3" onClick={()=>navigate('/forgot')}>
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

export default LoginPage;
