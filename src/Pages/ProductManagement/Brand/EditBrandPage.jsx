import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Form, Modal, Row } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { EditBrand, FileUpload } from '../../../API/api';


const EditBrandPage = ({ showModal, handleClose, data }) => {
    const [modalData, setModalData] = useState({});
    const [isChecked, setChecked] = useState(false);

    console.log(data)

    // const handleCheckboxChange = () => {
    //     setChecked(!isChecked);
    // };

    

    useEffect(() => {
        setModalData(data);
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await EditBrand(modalData, modalData?._id).then((res) => {
            toast.success('Brand updated successfully!');
            handleClose()
        }).catch((err) => {
            console.log(err)
            toast.error('Something went wrong!');
        })
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Check if the input is a checkbox and update the state accordingly
        if (type === 'checkbox') {
            setModalData((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        } else {
            setModalData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleFileChange = async (e) => {
        console.log(e.target.files[0]); 
        onFileUpload(e.target.files[0])
    };


    const onFileUpload = async (data) => {
        const formData = new FormData();
        formData.append("file", data);
        await FileUpload(formData)
            .then((res) => {
                console.log(res?.data?.data, "res");
                setTimeout(() => {
                    //setFile(res?.data?.data?.fileurl)
                    setModalData({ ...modalData, ['image']: {image_path : res?.data?.data?.fileurl} });
                }, 500);
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
                        <div className="addProductItem mt-2">
                            <label>
                                <input
                                    type="checkbox"
                                    name='brand_origin'
                                    checked={modalData?.brand_origin}
                                    onChange={handleInputChange}
                                />
                                {' '}
                                Is It Indian Brand?
                            </label>
                        </div>
                        <Row className='mt-2'>
                            <Form.Group controlId="image">
                                <Form.Label>Image</Form.Label>
                                <Col>
                                    <img src={modalData?.image?.[0]?.image_path} alt='brandlogo' style={{ width: '100%' }} />
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
                                    >
                                        Update Brand
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
            <Toaster position="top-right" />
        </div>
    );
};

export default EditBrandPage;
