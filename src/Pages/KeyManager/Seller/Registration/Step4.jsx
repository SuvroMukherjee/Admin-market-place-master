import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { UpdatesellerOwnRegistrationForm }  from '../../../../API/api';
import toast, { Toaster } from 'react-hot-toast';
import { RiShareForwardFill } from "react-icons/ri";

const Step4 = ({ nextStep, prevStep, reg_userdata, getUserdata }) => {
    const [bankingDetails, setBankingDetails] = useState({
        bank_name: '',
        beneficiary_name: '',
        account_number: '',
        ifsc_code: '',
        bank_branch: '',
        micr_code: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBankingDetails({ ...bankingDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // You can perform validation here before proceeding to the next step
        let payload = { "bank_details": bankingDetails }

        let response = await UpdatesellerOwnRegistrationForm(payload, reg_userdata?._id);

        if (response?.response?.data?.error) {
            toast.error(response?.response?.data?.data)
        } else {
            getUserdata(response?.data?.data)
            localStorage.setItem('seller-registration', JSON.stringify(response?.data?.data))
            toast.success(response?.data?.message)
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
                        <Col>Bank Details</Col>
                    </Row> */}
                    <Form onSubmit={handleSubmit}>
                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="bankName">
                                    <Form.Label className='frmLable'>Bank Name <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bank_name"
                                        placeholder="Enter bank name"
                                        size='sm'
                                        value={bankingDetails.bank_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={6}>
                                <Form.Group controlId="beneficiaryName">
                                    <Form.Label className='frmLable'>Beneficiary Name <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="beneficiary_name"
                                        placeholder="Enter beneficiary name"
                                        size='sm'
                                        value={bankingDetails.beneficiary_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="accountNumber">
                                    <Form.Label className='frmLable'>Account Number <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="account_number"
                                        placeholder="Enter account number"
                                        size='sm'
                                        value={bankingDetails.account_number}
                                        onChange={handleChange}
                                        pattern="[0-9]{9,18}"
                                        title="Account number must be between 9 and 18 digits"
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={6}>
                                <Form.Group controlId="ifscCode">
                                    <Form.Label className='frmLable'>IFSC Code <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ifsc_code"
                                        placeholder="Enter IFSC code"
                                        size='sm'
                                        value={bankingDetails.ifsc_code}
                                        onChange={handleChange}
                                        pattern="[A-Za-z]{4}[0-9]{7}"
                                        title="IFSC code must be in the format ABCD0123456"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="bankBranch">
                                    <Form.Label className='frmLable'>Bank Branch <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bank_branch"
                                        placeholder="Enter bank branch"
                                        size='sm'
                                        value={bankingDetails.bank_branch}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={6}>
                                <Form.Group controlId="micrCode">
                                    <Form.Label className='frmLable'>MICR Code <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="micr_code"
                                        placeholder="Enter MICR code"
                                        size='sm'
                                        value={bankingDetails.micr_code}
                                        onChange={handleChange}
                                        pattern="[0-9]{9}"
                                        title="MICR code must be a 9-digit number"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col>
                                <Button variant="warning" size='sm' className='frmLable grnbg' type="submit">Next Step <span className='mx-2'><RiShareForwardFill /></span></Button>
                            </Col>
                        </Row>
                    </Form>

                </Col>
            </Row>
            <Toaster position="top-right" />
        </Container>
    );
};

export default Step4;
