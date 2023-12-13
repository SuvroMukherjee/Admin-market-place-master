import React, { useState } from 'react';
import { useEffect } from 'react';
import { Modal, Button, Form, Col, ButtonGroup, Row } from 'react-bootstrap';
import { FileUpload, UpdateProductCategory, UpdateProductSubCategory, allCategoryList } from '../../../API/api';

const EditSubCategory = ({ showModal, handleClose, data }) => {
    const [modalData, setModalData] = useState({});
    const [categorylist, setCategorylist] = useState([]);



    useEffect(() => {
        setModalData(data);
        getCategoryList();
    }, [data]);

    async function getCategoryList() {
        await allCategoryList().then((res) => {
            setCategorylist(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(modalData)
        await UpdateProductSubCategory(modalData, modalData?._id).then((res) => {
            console.log({ res })
            handleClose()
        }).catch((err) => {
            console.log(err)
        })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setModalData({ ...modalData, [name]: value });

    };

    const handleFileChange = async (e) => {
        onFileUpload(e.target.files[0])
    };


    const onFileUpload = async (data) => {
        const formData = new FormData();
        formData.append("file", data);
        await FileUpload(formData)
            .then((res) => {
                console.log(res, "res");
                //setFile(res?.data?.data?.fileurl)
                setTimeout(() => {
                    setModalData({ ...modalData, ['image']: res?.data?.data?.fileurl });
                }, 3000);
            })
            .catch((err) => {
                console.log(err, "err");
            });
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
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter description"
                                    name="description"
                                    value={modalData?.description}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Row>
                        <Row className='mt-2'>
                            <Form.Label>Category </Form.Label>
                            <Form.Select
                                className="newUserSelect"
                                name="category"
                                id="category"
                                value={modalData?.category?._id}
                                onChange={handleInputChange}
                            >

                                <option value="" selected>
                                    {modalData?.category?.title}
                                </option>
                                {categorylist?.length > 0 &&
                                    categorylist?.map((ele) => (
                                        <option key={ele?._id} value={ele?._id} >
                                            {ele?.title}
                                        </option>
                                    ))}
                            </Form.Select>
                        </Row>
                        <Row className='mt-2'>
                            <Form.Group controlId="image">
                                <Form.Label>Image</Form.Label>
                                <Col>
                                    <img src={modalData?.image} alt={'subcategory'} style={{ width: '100%' }} />
                                </Col>
                                <Col>
                                    <label>Upload New Image</label>
                                    <input type='file' onChange={handleFileChange} accept="image/jpeg, image/png, image/gif" />
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
                                    >Update Sub Category</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EditSubCategory;
