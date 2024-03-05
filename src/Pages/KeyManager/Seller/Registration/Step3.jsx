import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { FileUpload, UpdatesellerOwnRegistrationForm } from '../../../../API/api';
import { RiShareForwardFill } from "react-icons/ri";


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


    const handleSubmit = async (e) => {
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
            setTimeout(() => {
                nextStep();
            }, 2000);
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <div>
                        {/* <Row>
                            <Col>
                                Documentation
                            </Col>
                        </Row> */}
                        <Form onSubmit={handleSubmit}>
                            <Row className='mt-2'>
                                <Col xs={6}>
                                    <Form.Group controlId="gst_no">
                                        <Form.Label className='frmLable'>GST Number <span className="req">*</span></Form.Label>
                                        <Form.Control type="text" name="gst_no" size='sm' placeholder="Enter GST number" value={documentation.gst_no} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group controlId="pan_no">
                                        <Form.Label className='frmLable'>PAN Card <span className="req">*</span></Form.Label>
                                        <Form.Control type="text" name="pan_no" size='sm' placeholder="Enter PAN card number" value={documentation.pan_no} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col xs={6}>
                                    <Form.Group controlId="adhar_card">
                                        <Form.Label className='frmLable'>Aadhar Card <span className="req">*</span></Form.Label>
                                        <Form.Control type="text" name="adhar_card" size='sm' placeholder="Enter Aadhar card number" value={documentation.adhar_card} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group controlId="gst_file">

                                        <Form.Label className='frmLable'>GST File <span className="req">*</span>
                                            {documentation?.gst_file &&
                                                <a
                                                    href={documentation?.gst_file}
                                                    target="_blank"
                                                >

                                                    <span className='mx-4'>SHOW FILE</span>
                                                </a>
                                            }
                                        </Form.Label>
                                        <Form.Control type="file" name="gst_file" size='sm' onChange={handleFileChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col xs={6}>
                                    <Form.Group controlId="cancelled_cheque">
                                        <Form.Label className='frmLable'>Cancelled Cheque <span className="req">*</span>
                                            {documentation?.cancelled_cheque &&
                                                <a
                                                    href={documentation?.cancelled_cheque}
                                                    target="_blank"
                                                >

                                                    <span className='mx-4'>SHOW FILE</span>
                                                </a>
                                            }
                                        </Form.Label>
                                        <Form.Control type="file" name="cancelled_cheque" size='sm' onChange={handleFileChange} required />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group controlId="msme_certificate">
                                        <Form.Label className='frmLable'>MSME Certificate <span className="req">*</span>
                                            {documentation?.msme_certificate &&
                                                <a
                                                    href={documentation?.msme_certificate}
                                                    target="_blank"
                                                >

                                                    <span className='mx-4'>SHOW FILE</span>
                                                </a>
                                            }
                                        </Form.Label>
                                        <Form.Control type="file" name="msme_certificate" size='sm' onChange={handleFileChange} required />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* <Button variant="secondary" onClick={prevStep}>Previous</Button>{' '} */}
                            <Row className='mt-4'>
                                <Col>
                                    <Button variant="warning" size='sm' className='frmLable grnbg' type="submit">Next Step <span className='mx-2'><RiShareForwardFill /></span></Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Toaster position="top-right" />
        </Container>

    );
};

export default Step3;
