import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { UpdatesellerOwnRegistrationForm } from '../../API/api';
import toast, { Toaster } from 'react-hot-toast';

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

    const handleSubmit = async(e) => {
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
            nextStep();
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Step 4: Banking Details</h2>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="bankName">
                                    <Form.Label>Bank Name</Form.Label>
                                    <Form.Control type="text" name="bank_name" placeholder="Enter bank name" value={bankingDetails.bank_name} onChange={handleChange} required />
                                </Form.Group>
                            </Col>

                            <Col xs={6}>
                                <Form.Group controlId="beneficiaryName">
                                    <Form.Label>Beneficiary Name</Form.Label>
                                    <Form.Control type="text" name="beneficiary_name" placeholder="Enter beneficiary name" value={bankingDetails.beneficiary_name} onChange={handleChange} required />
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="accountNumber">
                                    <Form.Label>Account Number</Form.Label>
                                    <Form.Control type="text" name="account_number" placeholder="Enter account number" value={bankingDetails.account_number} onChange={handleChange} required />
                                </Form.Group>
                            </Col>

                            <Col xs={6}>
                                <Form.Group controlId="ifscCode">
                                    <Form.Label>IFSC Code</Form.Label>
                                    <Form.Control type="text" name="ifsc_code" placeholder="Enter IFSC code" value={bankingDetails.ifsc_code} onChange={handleChange} required />
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="bankBranch">
                                    <Form.Label>Bank Branch</Form.Label>
                                    <Form.Control type="text" name="bank_branch" placeholder="Enter bank branch" value={bankingDetails.bank_branch} onChange={handleChange} required />
                                </Form.Group>
                            </Col>

                            <Col xs={6}>
                                <Form.Group controlId="micrCode">
                                    <Form.Label>MICR Code</Form.Label>
                                    <Form.Control type="text" name="micr_code" placeholder="Enter MICR code" value={bankingDetails.micr_code} onChange={handleChange} required />
                                </Form.Group>
                            </Col>

                        </Row>
                        <Button variant="secondary" onClick={prevStep}>Previous</Button>{' '}
                        <Button variant="primary" type="submit">Next</Button>
                    </Form>
                </Col>
            </Row>
            <Toaster position="top-right" />
        </Container>
    );
};

export default Step4;
