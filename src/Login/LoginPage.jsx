
import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { AdminLogin } from '../API/api';
import useAuth from '../hooks/useAuth';
import { Form, Button, Alert } from "react-bootstrap";
import './loginpage.css'

const LoginPage = () => {
    const { setAuth } = useAuth()
    
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        await delay(500);
        console.log(`Username :${inputUsername}, Password :${inputPassword}`);
        if (inputUsername == "" || inputPassword == "") {
            setShow(true);
        } else {
            let paylaod = {
                user: inputUsername,
                password: inputPassword
            }

            await AdminLogin(paylaod).then((res) => {
                console.log(res?.data?.data, 'res')
                const accessToken = res?.data?.data[1]?.accessToken;
                const role = res?.data?.data[0]?.role;
                setAuth({ username, password, accessToken, role })
                setLoading(false)
                localStorage.setItem('auth', JSON.stringify({ username, password, accessToken, role }));
                navigate(from, { replace: true });
                // navigate('/Admin/AdminDashboard');
            }).catch((err) => {
                console.log(err)
                setLoading(false)
                setShow(true);
            }).finally(()=>{
                setLoading(false)
            })
        }
        setLoading(false);
    };

    const handlePassword = () => { };

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }


    return (
        <div
            className="sign-in__wrapper"
            style={{ backgroundImage: `url('https://media.istockphoto.com/id/1341408852/video/colored-smoke-on-a-dark-background-blue-and-red-light-with-smoke.jpg?s=640x640&k=20&c=v2DQUY8IVbli_6FH_9KAs6YWRXlDdYiBJHfp7JFh7NY=')` }}
        >
            <div className="sign-in__backdrop"></div>
            <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
                <img
                    className="img-thumbnail mx-auto d-block mb-2"
                    src={'https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.1222169770.1701648000&semt=ais'}
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
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputUsername}
                        placeholder="Username"
                        onChange={(e) => setInputUsername(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={inputPassword}
                        placeholder="Password"
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
                Made by Hendrik C | &copy;2022
            </div>
        </div>
    );
};

export default LoginPage;
