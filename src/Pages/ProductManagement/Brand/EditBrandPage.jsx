import React, { useState } from 'react';
import { useEffect } from 'react';
import { Modal, Button, Form, Col, ButtonGroup, Row } from 'react-bootstrap';
import { EditBrand, UpdateProductCategory } from '../../../API/api';

const EditBrandPage = ({ showModal, handleClose, data }) => {
    const [modalData, setModalData] = useState({});

    useEffect(() => {
        setModalData(data);
    }, [data]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        await EditBrand(modalData,modalData?._id).then((res)=>{
            handleClose()
        }).catch((err)=>{
            console.log(err)
        })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModalData({ ...modalData, [name]: value });
        
    };

    return (
        <div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{data?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className='mt-2'>
                            <Form.Group controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    name="title"
                                    value={modalData?.title}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row className='mt-2'>
                            <Form.Group controlId="image">
                                <Form.Label>Image</Form.Label>
                                <Col>
                                    <img src={modalData?.image} alt={modalData?.image} style={{ width: '100%' }} />
                                </Col>
                                <Col>
                                    <label>Upload New Image</label>
                                    <input type='file' />
                                </Col>
                            </Form.Group>
                        </Row>
                        <Row className='mt-3'>
                            <Col>
                                <ButtonGroup className="d-flex">
                                    <Button
                                        className="btn-block mr-1 mt-1 btn-lg"
                                        variant="warning"
                                        type='submit'
                                        block
                                    >Update Brand</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EditBrandPage;