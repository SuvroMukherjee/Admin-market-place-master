import React, { useState } from 'react';
// import { Container, Form, Button } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Container, Row, Form, ButtonGroup, Card, Image } from 'react-bootstrap';
import { PasswordReset } from '../../../API/api';
import toast, { Toaster } from 'react-hot-toast';

const ResetPassComp = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const [oldPassword,setOldpassowrd] = useState()

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    const handleSubmit = async(e) => {
        e.preventDefault();


        if (password === confirmPassword) {
            // Passwords match, you can proceed with resetting the password
            console.log('Password reset successful!');
            let payload = {
                "old_password": oldPassword,
                "new_password": password
            }


            let res = await PasswordReset(userId, payload);
            if (res?.response?.data?.error){
                toast.error(res.response.data.message);
            }else{
                toast.success('Password reset successfully')
            }
        } else {
            // Passwords don't match, display an error or handle it accordingly
            setIsPasswordMatch(false);
        }


    };

    return (
        <Container className="mt-5">
            <h4>Reset Password</h4>
            <Row className='mt-3'>
               
                <Col>
                    <Form onSubmit={handleSubmit} className='mt-4'>

                        <Row>
                            <Col xs={8}>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>Old Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter old password"
                                        value={oldPassword}
                                        onChange={(e) => setOldpassowrd(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                            </Col>
                        </Row>

                        <Row>
                            <Col xs={8}>
                                <Form.Group controlId="formPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8}>
                                <Form.Group controlId="formConfirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    {!isPasswordMatch && (
                                        <Form.Text className="text-danger">
                                            Passwords do not match.
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit" className='mt-4'>
                            Reset Password
                        </Button>
                    </Form>
                </Col>
                <Col xs={3} className='mb-5'>
                    <Image src='https://t4.ftcdn.net/jpg/04/20/32/53/360_F_420325313_0tgC68egfuhtzKf1OhVlZRHG6Dvv36Xt.jpg' />
                </Col>
            </Row>
            <Toaster position="top-right" />
        </Container>
    );
};


export default ResetPassComp;
