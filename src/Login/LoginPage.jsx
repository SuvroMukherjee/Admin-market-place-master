// Login.js
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Paper } from '@mui/material';
import { AdminLogin } from '../API/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {

        if (username && password) {

            let paylaod = {
                user: username,
                password: password
            }

            await AdminLogin(paylaod).then((res) => {
                console.log(res, 'res')
               // navigate('/')
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
