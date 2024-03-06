
import React, { useState } from 'react';
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminLogin, SellerLogin } from '../API/api';
import useAuth from '../hooks/useAuth';
import './loginpage.css';
import toast, { Toaster } from 'react-hot-toast';
import { getLocation } from '../Pages/KeyManager/Dashboard/Attendence';
import ReCAPTCHA from 'react-google-recaptcha';

const SellerLoginPage = () => {
    const { setAuth } = useAuth()

    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginAsSeller, setLoginAsSeller] = useState(true);
    const [isCaptchaVerified, setCaptchaVerified] = useState(false);

    const navigate = useNavigate()
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
            style={{ backgroundImage: `url('https://img.freepik.com/free-photo/online-shopping-shopping-cart-placed-alongside-notebook-blue_1150-19158.jpg')` }}
        >
            <div className="sign-in__backdrop"></div>
            <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
                <img
                    className="img-thumbnail mx-auto d-block mb-2"
                    src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn0ivKSgxD_PljXFzpiZIDT-TXhcRNVo4g3Q&usqp=CAU'}
                    alt="logo"
                />
                <div className="h4 mb-2 text-center">Sign In Seller</div>
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
                <Form.Group className="mb-2" controlId="username">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputUsername}
                        placeholder="Enter your email"
                        onChange={(e) => setInputUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
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
                <ReCAPTCHA
                    sitekey="6Lf2Y4EpAAAAAMIJJIvzy88IybLMRSIjSWS2H7sq"
                    onChange={handleCaptchaChange}
                />
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
                <div className="d-grid justify-content-end">
                    <Button
                        className="text-muted px-0"
                        variant="link"
                        onClick={handlePassword}
                    >
                        Forgot password?
                    </Button>
                </div>
            </Form>
            <Toaster position="top-right" />
            {/* Footer */}
            <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
                Sant Sales| &copy;2023
            </div>
        </div>
    );
};

export default SellerLoginPage;
