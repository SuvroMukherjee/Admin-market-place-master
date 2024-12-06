import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { addNewsSeller, sellerOwnRegistrationForm } from '../../../../API/api';
import toast, { Toaster } from 'react-hot-toast';
import { RiShareForwardFill } from "react-icons/ri";

const Step1 = ({ nextStep, getUserdata }) => {
    const [userInfo, setUserInfo] = useState({
        user_name: '',
        email: '',
        phone_no: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ userInfo })
        // You can perform validation here before proceeding to the next step

        let response = await addNewsSeller(userInfo);

        if (response?.response?.data?.error) {
            toast.error(response?.response?.data?.data)
        } else {
            getUserdata(response?.data?.data)
            localStorage.setItem('seller-registration', JSON.stringify(response?.data?.data))
            toast.success('Personal information Added')
            setTimeout(() => {
                nextStep();
            }, 2000);
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    {/* <Row>
                        <Col>Register and Start Selling</Col>
                    </Row> */}
                    <Form onSubmit={handleSubmit}>
                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="user_name">
                                    <Form.Label className='frmLable'>User Name <span className="req">*</span></Form.Label>
                                    <Form.Control type="text" name="user_name" placeholder='Enter Username' size='sm' value={userInfo.user_name} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="email">
                                    <Form.Label className='frmLable'>Email <span className="req">*</span> </Form.Label>
                                    <Form.Control type="email" name="email" size='sm' placeholder='Enter Email' value={userInfo.email} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="phone_no">
                                    <Form.Label className='frmLable'>Phone Number <span className="req">*</span> </Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone_no"
                                        size='sm'
                                        placeholder='Enter Phone No.'
                                        value={userInfo.phone_no}
                                        onChange={handleChange}
                                        pattern="[0-9]{0,10}"
                                        title="Please enter a valid phone number with at most 10 digits"
                                        required
                                    />

                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="password">
                                    <Form.Label className='frmLable'>Password <span className="req">*</span> </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        size='sm'
                                        placeholder='Enter Password'
                                        value={userInfo.password}
                                        onChange={handleChange}
                                        pattern=".{6,}"
                                        title="Password must be at least 6 characters long"
                                        required
                                    />

                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-4'>
                            <Col>
                                <Button variant="success" size='sm' className='frmLable grnbg' type="submit"> Next Step <span className='mx-2'><RiShareForwardFill /></span> </Button>
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
