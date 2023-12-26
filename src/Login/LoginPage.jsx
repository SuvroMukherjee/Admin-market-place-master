
import React, { useState } from 'react';
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminLogin } from '../API/api';
import useAuth from '../hooks/useAuth';
import './loginpage.css';

const LoginPage = () => {
    const { setAuth } = useAuth()
    
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

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

            await AdminLogin(payload)
                .then((res) => {
                    console.log(res?.data?.data, 'res');
                    const accessToken = res?.data?.data[1]?.accessToken;
                    const role = res?.data?.data[0]?.role;

                    setAuth((prevAuth) => ({
                        ...prevAuth,
                        username: inputUsername,
                        password: inputPassword,
                        accessToken,
                        role
                    }));

                    setLoading(false);

                    const authData = {
                        username: inputUsername,
                        password: inputPassword,
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
    };


    const handlePassword = () => { };

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }


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
                <div className="h4 mb-2 text-center">Sign In</div>
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
                <Form.Group className="mb-2" controlId="checkbox">
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                {!loading ? (
                    <Button className="w-100" variant="primary" type="submit">
                        Log In
                    </Button>
                ) : (
                    <Button className="w-100" variant="primary" type="submit" disabled>
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
            {/* Footer */}
            <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
                Sant Sales| &copy;2023
            </div>
        </div>
    );
};

export default LoginPage;
