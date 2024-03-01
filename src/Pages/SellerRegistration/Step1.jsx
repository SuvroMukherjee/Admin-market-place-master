import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { sellerOwnRegistrationForm } from '../../API/api';
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

        let response = await sellerOwnRegistrationForm(userInfo);

        console.log({ response })

        console.log(response?.data?.data)

        if (response?.response?.data?.error) {
            toast.error(response?.response?.data?.data)
        } else {
            getUserdata(response?.data?.data)
            localStorage.setItem('seller-registration', JSON.stringify(response?.data?.data))
            toast.success('Personal information Added')
            nextStep();
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Row>
                        <Col className='t1'>Register and Start Selling</Col>
                    </Row>
                    <Row>
                        <Col className='tsmall'>Please have the following before you start register
                            <ul>
                                <li>Shop related location,images </li>
                                <li>Bank account details </li>
                                <li>Busniess document with GSt and cancel cheque certificate</li>
                            </ul>
                        </Col>
                    </Row>
                    <Row className='tt mt-2'>
                        <Col>
                            Enter details to strat your registration process
                        </Col>
                    </Row>
                    <Form onSubmit={handleSubmit}>
                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="user_name">
                                    <Form.Label className='frmLable'>Company Busniess Name <span className="req">*</span></Form.Label>
                                    <Form.Control type="text" name="user_name" className='tapG' placeholder='Enter Your Username' size='sm' value={userInfo.user_name} onChange={handleChange} required autoComplete='off'/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="email">
                                    <Form.Label className='frmLable'>Email <span className="req">*</span> </Form.Label>
                                    <Form.Control type="email" name="email" size='sm' className='tapG' placeholder='Enter Your Email' value={userInfo.email} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="phone_no">
                                    <Form.Label className='frmLable'>Phone Number <span className="req">*</span> </Form.Label>
                                    <Form.Control type="tel" name="phone_no" size='sm' className='tapG' placeholder='Enter Your Phone No.' value={userInfo.phone_no} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="password">
                                    <Form.Label className='frmLable'>Password <span className="req">*</span> </Form.Label>
                                    <Form.Control type="password" name="password" size='sm' className='tapG' placeholder='Enter Your Password' value={userInfo.password} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-4'>
                            <Col>
                                <Button  size='sm' className='frmLable grnbg' type="submit"> Next Step <span className='mx-2'><RiShareForwardFill /></span> </Button>
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
