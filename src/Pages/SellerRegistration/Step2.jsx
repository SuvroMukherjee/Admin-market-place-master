import React, { useState } from 'react';

import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import { FileUpload, UpdatesellerOwnRegistrationForm } from '../../API/api';
import { MdCancel, MdOutlineFileUpload } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';

const Step2 = ({ nextStep, prevStep, reg_userdata, getUserdata }) => {
    const [shopInfo, setShopInfo] = useState({
        shope_name: '',
        shop_address1: '',
        shop_address2: '',
        picup_location: '',
        pin_code: '',
        disict: '',
        state: '',
        pic_of_shope: [],
        old_shope_desc : '',
        total_no_of_unit:''

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShopInfo({ ...shopInfo, [name]: value });
    };

    const handleFileChange = (e) => {
        const { files } = e.target;
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        const selectedFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));

        selectedFiles.forEach((file) => {
            onFileUpload(file);
        });

       // setShopInfo({ ...shopInfo, pic_of_shope: files });
    };


    const onFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        console.log(formData)

        try {
            const res = await FileUpload(formData);
            setTimeout(() => {
                setShopInfo((prevData) => ({
                    ...prevData,
                    pic_of_shope: [...prevData?.pic_of_shope, res?.data?.data?.fileurl],
                }));
            }, 3000);
           // setBtnEnable(false)
        } catch (err) {
            console.error(err, "err");
        }
    };
    

    const handleCancelImage = (url) => {

        let filterData = shopInfo?.pic_of_shope?.filter((e, index) => {
            return e !== url;
        })

        console.log(filterData)

        setShopInfo((prevData) => ({
            ...prevData,
            pic_of_shope: filterData,
        }));

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // You can perform validation here before proceeding to the next step
        console.log({ shopInfo })
        
        let payload = {"Shop_Details_Info" : shopInfo}
        let response = await UpdatesellerOwnRegistrationForm(payload, reg_userdata?._id);

        if (response?.response?.data?.error) {
            toast.error(response?.response?.data?.data)
        } else {
            getUserdata(response?.data?.data)
            localStorage.setItem('seller-registration', JSON.stringify(response?.data?.data))
            toast.success(response?.data?.message)
            nextStep();
        }
        //nextStep();
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Step 2: Shop Details</h2>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="shopName">
                                    <Form.Label>Shop Name</Form.Label>
                                    <Form.Control type="text" name="shope_name" placeholder="Enter shop name" value={shopInfo.shope_name} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="shopAddress1">
                                    <Form.Label>Shop Address 1</Form.Label>
                                    <Form.Control type="text" name="shop_address1" placeholder="Enter shop address 1" value={shopInfo.shop_address1} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="shopAddress2">
                                    <Form.Label>Shop Address 2</Form.Label>
                                    <Form.Control type="text" name="shop_address2" placeholder="Enter shop address 2" value={shopInfo.shop_address2} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="pickupLocation">
                                    <Form.Label>Pickup Location</Form.Label>
                                    <Form.Control type="text" name="picup_location" placeholder="Enter pickup location" value={shopInfo.picup_location} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="pincode">
                                    <Form.Label>Pincode</Form.Label>
                                    <Form.Control type="text" name="pin_code" placeholder="Enter pincode" value={shopInfo.pin_code} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="district">
                                    <Form.Label>District</Form.Label>
                                    <Form.Control type="text" name="disict" placeholder="Enter district" value={shopInfo.disict} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="state">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control type="text" name="state" placeholder="Enter state" value={shopInfo.state} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="shopImages">
                                    <Form.Label>Shop Images</Form.Label>
                                    <Form.Control type="file" name="pic_of_shope" onChange={handleFileChange} multiple required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                {shopInfo?.pic_of_shope?.length > 0 && (
                                    <Container>
                                        <Row>
                                            {shopInfo?.pic_of_shope.map((fileUrl, index) => (
                                                <Col key={index} xs={4} md={2}>
                                                    <span>{index + 1}</span>
                                                    <span>
                                                        <MdCancel
                                                            style={{
                                                                color: 'red',
                                                                fontSize: '20px',
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={() => handleCancelImage(fileUrl)}
                                                        />
                                                    </span>
                                                    <Image src={fileUrl} thumbnail fluid />
                                                    {/* Use fluid prop for responsive images */}
                                                </Col>
                                            ))}
                                        </Row>
                                    </Container>
                                )}
                            </Col>
                        </Row>


                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="old_shope_desc">
                                    <Form.Label>Total Year of Busniess Experience</Form.Label>
                                    <Form.Control type="text" name="old_shope_desc" value={shopInfo.old_shope_desc} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={6}>
                                <Form.Group controlId="total_no_of_unit">
                                    <Form.Label>Total of Units Sold Each Year</Form.Label>
                                    <Form.Control type="text" name="total_no_of_unit" value={shopInfo.total_no_of_unit} onChange={handleChange}  required />
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

export default Step2;
