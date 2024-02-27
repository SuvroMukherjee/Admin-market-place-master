import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { FileUpload, UpdatesellerOwnRegistrationForm } from '../../API/api';


const Step3 = ({ nextStep, prevStep, reg_userdata, getUserdata }) => {
    const [documentation, setDocumentation] = useState({
        gst_no: '',
        pan_no: '',
        adhar_card: '',
        gst_file: null,
        cancelled_cheque: null,
        msme_certificate: null
    });

    console.log({ documentation })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocumentation({ ...documentation, [name]: value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        const name = event.target.name;
        //console.log({name})
        if (file.type === 'application/pdf') {
            if (file.size <= 5 * 1024 * 1024) {
                ongstFileUpload(file, name);
            } else {
                toast.error("File size exceeds 5 MB limit.")
            }
        } else {
            toast.error("Please upload a PDF file..")
        }
        //setDocumentation({ ...documentation, [name]: files[0] });
    };

    const ongstFileUpload = async (file, name) => {
        const formData = new FormData();
        formData.append("file", file);

        console.log(formData)

        try {
            const res = await FileUpload(formData);
            setTimeout(() => {
                setDocumentation((prevData) => ({
                    ...prevData,
                    [name]: res?.data?.data?.fileurl,
                }));
            }, 3000);
            // setBtnEnable(false)
        } catch (err) {
            console.error(err, "err");
        }
    };


    const handleSubmit = async(e) => {
        e.preventDefault();
        // You can perform validation here before proceeding to the next step

        let payload = { "doc_details": documentation }

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
                    <div>
                        <h2>Step 3: Documentation</h2>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col xs={6}>
                                    <Form.Group controlId="gst_no">
                                        <Form.Label>GST Number</Form.Label>
                                        <Form.Control type="text" name="gst_no" placeholder="Enter GST number" value={documentation.gst_no} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group controlId="pan_no">
                                        <Form.Label>PAN Card</Form.Label>
                                        <Form.Control type="text" name="pan_no" placeholder="Enter PAN card number" value={documentation.pan_no} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6}>
                                    <Form.Group controlId="adhar_card">
                                        <Form.Label>Aadhar Card</Form.Label>
                                        <Form.Control type="text" name="adhar_card" placeholder="Enter Aadhar card number" value={documentation.adhar_card} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group controlId="gst_file">
                                        <Form.Label>GST File</Form.Label>
                                        <Form.Control type="file" name="gst_file" onChange={handleFileChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6}>
                                    <Form.Group controlId="cancelled_cheque">
                                        <Form.Label>Cancelled Cheque</Form.Label>
                                        <Form.Control type="file" name="cancelled_cheque" onChange={handleFileChange} required />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group controlId="msme_certificate">
                                        <Form.Label>MSME Certificate</Form.Label>
                                        <Form.Control type="file" name="msme_certificate" onChange={handleFileChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant="secondary" onClick={prevStep}>Previous</Button>{' '}
                            <Button variant="primary" type="submit">Next</Button>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Toaster position="top-right" />
        </Container>

    );
};

export default Step3;
