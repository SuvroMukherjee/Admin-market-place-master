import React, { useState } from 'react'
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { AddProductCategory, FileUpload } from '../../../API/api';
import toast, { Toaster } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaList } from "react-icons/fa6";

const CategoryRequest = () => {


    const [modalData, setModalData] = useState()


    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log({ modalData })


        let res = await AddProductCategory(modalData);

        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {

            toast.success('Category Request sent Successfully')

            setTimeout(() => {
                navigate('/seller/approval-request-list')
            }, 3000);
        }

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModalData({ ...modalData, [name]: value });

    };

    const handleFileChange = async (e, type) => {
        onFileUpload(e.target.files[0], type)
    };


    const onFileUpload = async (data, type) => {
        const formData = new FormData();
        formData.append("file", data);
        await FileUpload(formData)
            .then((res) => {
                console.log(res, "res");
                if (type == "1") {
                    setTimeout(() => {
                        setModalData({ ...modalData, ['image']: { image_path: res?.data?.data?.fileurl } });
                    }, 3000);
                } else {
                    setTimeout(() => {
                        setModalData({ ...modalData, ['img']: { image_path: res?.data?.data?.fileurl } });
                    }, 3000);
                }
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };


    return (
        <div>
            <Container>
                <Row>
                    <Col xs={4}>
                        <h4>Selling application for Category </h4>
                    </Col>
                    <Col xs={5}></Col>
                    <Col xs={3}>
                        <Button size='sm' variant='outline-dark' onClick={() => navigate('/seller/approval-request-list')}> <span className='mx-1'><FaList /></span> View All applications</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row className='stepContent'>
                            <Form onSubmit={handleSubmit}>
                                <Row className='mt-2'>
                                    <Col xs={12}>
                                        <Form.Group controlId="title">
                                            <Form.Label>Category Title <span className="req mx-1">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='tapG'
                                                placeholder="Enter Category Title"
                                                name="title"
                                                size='sm'
                                                value={modalData?.title}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>
                                    <Form.Group controlId="image">
                                        <Col xs={12}>
                                            <Form.Group controlId="title">
                                                <Form.Label>Category Image  <span className="req mx-1">*</span>

                                                    {modalData?.image?.image_path &&
                                                        <a
                                                            href={modalData?.image?.image_path}
                                                            target="_blank"
                                                        >

                                                            <span className='mx-4'>SHOW IMAGE</span>
                                                        </a>
                                                    }
                                                </Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    className='tapG'
                                                    placeholder="Upload Category Image"
                                                    name="image"
                                                    size='sm'
                                                    // value={modalData?.image}
                                                    onChange={(e) => handleFileChange(e, '1')}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className='mt-2'>
                                    <Col xs={12}>
                                        <Form.Group controlId="title">
                                            <Form.Label>Add Subcategory Title for your New Category</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='tapG'
                                                placeholder="Enter Subcategory Title"
                                                name="subtitle"
                                                size='sm'
                                                value={modalData?.subtitle}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>
                                    <Form.Group controlId="image">
                                        <Col xs={12}>
                                            <Form.Group controlId="title">
                                                <Form.Label>SubCategory Image

                                                    {modalData?.img?.image_path &&
                                                        <a
                                                            href={modalData?.img?.image_path}
                                                            target="_blank"
                                                        >

                                                            <span className='mx-4'>SHOW IMAGE</span>
                                                        </a>
                                                    }
                                                </Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    className='tapG'
                                                    placeholder="Upload Category Image"
                                                    name="img"
                                                    size='sm'
                                                    // value={modalData?.image}
                                                    onChange={(e) => handleFileChange(e, '2')}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className='mt-4 bgColor' >
                                    <Col xs={6} className='d-flex align-items-center aggree'>
                                        By clicking on Agree and Submit, I agree to the conditions.
                                    </Col>
                                    <Col className='d-flex justify-content-center'>
                                        <Button
                                            className="btn-block mr-1 mt-1 btn-lg"
                                            variant="warning"
                                            size='sm'
                                            type='submit'
                                            block
                                        >Agress & Submit</Button>
                                    </Col>
                                </Row>

                            </Form>
                        </Row>
                    </Col>

                    <Col>
                        <Row>
                            <Col>Tell us about your products and business</Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                Are you a reseller/distributor or a manufacturer for the products you want to list?
                            </Col>
                            <Col xs={6}>
                                Reseller/Distributor
                            </Col>
                            <Col xs={6}>
                                Manufacturer
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Container>
            <Toaster position="top-right" />
        </div>
    )
}

export default CategoryRequest