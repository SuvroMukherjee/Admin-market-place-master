import React, { useEffect, useState } from 'react';

import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import { FileUpload, UpdatesellerOwnRegistrationForm, allIndiaCities } from '../../API/api';
import { MdCancel, MdOutlineFileUpload } from 'react-icons/md';
import toast, { Toaster } from 'react-hot-toast';
import { RiShareForwardFill } from "react-icons/ri";

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
        old_shope_desc: '',
        total_no_of_unit: ''

    });
    const [allstates, setAllStates] = useState([])


    useEffect(() => {
        getallStates();
    }, [])

    const getallStates = async () => {
        let res = await allIndiaCities();
        setAllStates(res?.data?.data?.states)
    }

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

        let payload = { "Shop_Details_Info": shopInfo }
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

    console.log({ shopInfo })

    return (
        <Container>
            <Row>
                <Col>
                    <Row>
                        <Col className='t1'>Tell us about your busniess</Col>
                    </Row>
                    <Form onSubmit={handleSubmit}>
                        <Row className='mt-3'>
                            <Col xs={6}>
                                <Form.Group controlId="shopName">
                                    <Form.Label className='frmLable'>Shop Name <span className="req">*</span> </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="shop_name"
                                        className='tapG'
                                        placeholder="Enter shop name"
                                        size='sm'
                                        value={shopInfo.shop_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group controlId="shopAddress1">
                                    <Form.Label className='frmLable'>Shop Address 1 <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="shop_address1"
                                        className='tapG'
                                        placeholder="Enter shop address 1"
                                        size='sm'
                                        value={shopInfo.shop_address1}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-3'>
                            <Col xs={6}>
                                <Form.Group controlId="shopAddress2">
                                    <Form.Label className='frmLable'>Shop Address 2</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="shop_address2"
                                        className='tapG'
                                        placeholder="Enter shop address 2"
                                        size='sm'
                                        value={shopInfo.shop_address2}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group controlId="pickupLocation">
                                    <Form.Label className='frmLable'>Pickup Location <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pickup_location"
                                        className='tapG'
                                        placeholder="Enter pickup location"
                                        size='sm'
                                        value={shopInfo.pickup_location}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-3'>
                            <Col xs={6}>
                                <Form.Group controlId="pincode">
                                    <Form.Label className='frmLable'>Pincode <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pincode"
                                        className='tapG'
                                        placeholder="Enter pincode"
                                        size='sm'
                                        value={shopInfo.pincode}
                                        onChange={handleChange}
                                        pattern="[0-9]{6}"
                                        title="Pincode must be a 6-digit number"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group controlId="district">
                                    <Form.Label className='frmLable'>District <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="district"
                                        className='tapG'
                                        placeholder="Enter district"
                                        size='sm'
                                        value={shopInfo.district}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-3'>
                            <Col xs={6}>
                                <Form.Group controlId="state">
                                    <Form.Label className='frmLable'>State <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="state"
                                        className='tapG'
                                        size='sm'
                                        value={shopInfo.state}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option disabled selected>Select State</option>
                                        {allstates?.length > 0 && allstates?.map((ele, index) => (
                                            <option key={index} value={ele?.name}>{ele?.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group controlId="shopImages">
                                    <Form.Label className='frmLable'>Shop Image <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="shop_image"
                                        className='tapG'
                                        onChange={handleFileChange}
                                        size='sm'
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-3'>
                            <Col xs={6}>
                                <Form.Group controlId="totalYearOfBusinessExperience">
                                    <Form.Label className='frmLable'>Total Year of Business Experience <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        size='sm'
                                        className='tapG'
                                        name="total_year_of_business_experience"
                                        placeholder='Total Year of Business Experience'
                                        value={shopInfo.total_year_of_business_experience}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col xs={6}>
                                <Form.Group controlId="totalNumberOfUnits">
                                    <Form.Label className='frmLable'>Total Number of Units Sold Each Year <span className="req">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        size='sm'
                                        className='tapG'
                                        name="total_number_of_units"
                                        placeholder='Total Number of Units Sold Each Year'
                                        value={shopInfo.total_number_of_units}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-5'>
                            <Col className="text-center">
                                <Button size='sm' className='frmLable grnbg' type="submit">Next Step <span className='mx-2'><RiShareForwardFill /></span></Button>
                            </Col>
                        </Row>
                    </Form>

                </Col>
            </Row>
            <Toaster position="top-right" />
        </Container>
    );
};

export default Step2;
