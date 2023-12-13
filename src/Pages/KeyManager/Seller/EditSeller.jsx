import React from 'react'
import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { productRows } from "../../../dummyData";
import "./listStyle.css";
import { FileUpload, UpdateSellerData, addNewsSeller, allSellerList, sellerDetails } from "../../../API/api";
import { useEffect } from "react";
import { AiOutlinePlus, AiTwotoneEdit } from "react-icons/ai";
import { Button, Col, Container, Row, Form, Image } from 'react-bootstrap';
import { DataGrid } from "@mui/x-data-grid";
import { MdCancel, MdOutlineFileUpload } from 'react-icons/md';

const EditSeller = () => {
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        phone_no: '',
        email: '',
        password: '',
        address: '',
        pic_of_shope: [],
        gst_no: '',
        picup_location: '',
        commission_rate: 0,
        status: '',
    });

    const { id: SellerId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            getSellerDetails();
        }, 3000);
    },[])

    async function getSellerDetails(){
        await sellerDetails(SellerId).then((res)=>{
            console.log(res)
            setFormData(res?.data?.data)
            setLoading(false)
        }).catch((err)=>[
            console.group(err)
        ]).finally(()=>{
            setLoading(false)
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = Object.values(formData).every((value) => value !== '');

        if (isFormValid) {
            console.log(formData);
            await UpdateSellerData(SellerId,formData).then((res) => {
                console.log(res)
                toast.success('Seller updated successfully!');
                navigate('/key/seller')
            }).catch((err) => {
                console.log(err)
                toast.error('Something went wrong!');
            })
        } else {
            console.error('Please fill in all the required fields.');
        }
    };

    const handleImageInputChange = (e) => {
        const { files } = e.target;
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        const selectedFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));

        selectedFiles.forEach((file) => {
            onFileUpload(file);
        });
    };

    const onFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await FileUpload(formData);
            setTimeout(() => {
                setFormData((prevData) => ({
                    ...prevData,
                    pic_of_shope: [...prevData?.pic_of_shope, res?.data?.data?.fileurl],
                }));
            }, 3000);
        } catch (err) {
            console.error(err, "err");
        }
    };

    const handleCancelImage = (url) => {

        let filterData = formData?.pic_of_shope?.filter((e, index) => {
            return e !== url;
        })

        console.log(filterData)

        setFormData((prevData) => ({
            ...prevData,
            pic_of_shope: filterData,
        }));

    }


    return (
        <>
            {loading &&
                <div className="productList mt-2 p-4 contentLoader">
                    <Row>
                        <Col>
                            <Spinner animation="border" size="lg" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                </div>}
            <div className="productList mt-2 p-4">
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <h3>Edit Seller</h3>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col>
                            <Form onSubmit={handleSubmit}>
                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId="phoneNo">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phone_no"
                                                placeholder='Enter your phone number'
                                                value={formData.phone_no}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder='Enter your email '
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>
                                    {/* <Col>
                                        <Form.Group controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="password"
                                                placeholder='Enter your Password'
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col> */}
                                    <Col>
                                        <Form.Group controlId="address">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                placeholder='Enter your Address'
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group controlId="gstNo">
                                            <Form.Label>GST Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="gst_no"
                                                value={formData.gst_no}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                </Row>
                                <Row className='mt-2'>
                                    
                                    <Col>
                                        <Form.Group controlId="pickupLocation">
                                            <Form.Label>Pickup Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="picup_location"
                                                value={formData.picup_location}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group controlId="commissionRate">
                                            <Form.Label>Commission Rate(%)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="commission_rate"
                                                value={formData.commission_rate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                               
                                <Row className="mt-2">
                                    <Col xs={6}>
                                        <Form.Group controlId="formFileMultiple" className="mb-3">
                                            <Form.Label>Shop Images</Form.Label>
                                            <Form.Control
                                                type="file"
                                                onChange={handleImageInputChange}
                                                multiple
                                                accept="image/jpeg, image/png, image/gif"
                                                required
                                            />
                                            <Form.Text className="text-muted">
                                                Add images one by one or select multiple images.
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Row>
                                        <Col>
                                            {formData?.pic_of_shope?.length > 0 && (
                                                <Container>
                                                    <Row>
                                                        {formData?.pic_of_shope.map((fileUrl, index) => (
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
                                </Row>

                                <Row className='mt-4'>
                                    <Col>
                                        <div className="d-grid gap-2">
                                            <Button variant="success" size="lg" type="submit">
                                                <AiTwotoneEdit /> Edit Seller
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>

                            </Form>
                        </Col>
                    </Row>
                </Container>
                <Toaster position="top-right" />
            </div>
        </>
    )
}

export default EditSeller