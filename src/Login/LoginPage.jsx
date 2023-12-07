// Login.js
import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Container, Paper } from '@mui/material';
import { AdminLogin } from '../API/api';
import AuthContext from '../context/auth';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
    const { setAuth } = useAuth()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleLogin = async () => {

        if (username && password) {

            let paylaod = {
                user: username,
                password: password
            }

            await AdminLogin(paylaod).then((res) => {
                console.log(res?.data?.data, 'res')
                const accessToken = res?.data?.data[1]?.accessToken;
                const role = res?.data?.data[0]?.role;
                setAuth({ username, password, accessToken, role })
                localStorage.setItem('auth', JSON.stringify({ username, password, accessToken, role }));
                navigate(from, { replace: true });
            }).catch((err) => {
                consoe.log(err)
            })

        } else {
            alert('Fill')
        }


    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '50px' }}>
                <h2>Login</h2>
                <form>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleLogin}>
                        Login
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default LoginPage;
