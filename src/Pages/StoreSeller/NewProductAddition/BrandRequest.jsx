import React, { useState } from 'react'
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { AddBrand, AddProductCategory, FileUpload } from '../../../API/api';
import toast, { Toaster } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaList } from "react-icons/fa6";
import Spinner from 'react-bootstrap/Spinner';


const BrandRequest = () => {


    const [modalData, setModalData] = useState()
    const [brandimgloading, setBrandImgLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        console.log('Selected option:', event.target.value);
        setModalData({ ...modalData, ['seller_type']: event.target.value });
    };


    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log({ modalData })


        let res = await AddBrand(modalData);

        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {

            toast.success('Brand Request sent Successfully')

            setTimeout(() => {
                navigate('/seller/approval-request-list?tabtype=brand')
            }, 3000);
        }

    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name == 'email') {
            setModalData({ ...modalData, ['seller_contc_info']: { ...modalData?.seller_contc_info, [name]: value } });
        }
        else if (name == 'phone_no') {
            setModalData({ ...modalData, ['seller_contc_info']: { ...modalData?.seller_contc_info, [name]: value } });
        }
        else {
            setModalData({ ...modalData, [name]: value });
        }

    };

    const handleFileChange = async (e, type) => {
        onFileUpload(e.target.files[0], type)
    };

    const onFileUpload = async (data, type) => {
        setBrandImgLoading(true)
        const formData = new FormData();
        formData.append("file", data);
        await FileUpload(formData)
            .then((res) => {
                console.log(res, "res");
                if (type == "1") {
              setBrandImgLoading(false)
                    setTimeout(() => {
                        setModalData({ ...modalData, ['image']: { image_path: res?.data?.data?.fileurl } });
                    }, 300);
                } else {
                    setTimeout(() => {
                        setModalData({ ...modalData, ['img']: { image_path: res?.data?.data?.fileurl } });
                    }, 300);
                }
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };


    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange2 = (e, type) => {
        console.log(type)
        onFileUpload2(e.target.files[0], type)
    };

    const onFileUpload2 = async (data, type) => {
        const formData = new FormData();
        formData.append("file", data);
        await FileUpload(formData)
            .then((res) => {
                console.log(res, "res");
                alert(type)
                if (type == "distributer") {
                    setTimeout(() => {
                        setModalData({ ...modalData, ['dis_doc']: { ...modalData?.dis_doc, doc: type, doc_file: res?.data?.data?.fileurl } });
                    }, 300);
                } else {
                    setTimeout(() => {
                        setModalData({ ...modalData, ['manu_doc']: { ...modalData?.manu_doc, doc: type, doc_file: res?.data?.data?.fileurl } });
                    }, 300);
                }
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };


    const handleOptionInput = (value, type) => {

        if (type == 'distributer'){
            setModalData({ ...modalData, ['dis_doc']: { ...modalData?.dis_doc, comment: value } });
        }else{
            setModalData({ ...modalData, ['manu_doc']: { ...modalData?.manu_doc, comment: value } });
        } 
    }


    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        setModalData({ ...modalData, ['brand_origin']: !isChecked });
    };


    return (
        <div>
            <Container>
                <Row>
                    <Col xs={6} className='mt-4'>
                        <h4>Selling application for New Brand Listing </h4>
                    </Col>
                    <Col xs={3}></Col>
                    <Col xs={3} className='mt-4'>
                        <Button size='sm' variant='outline-dark' onClick={() => navigate('/seller/approval-request-list')}> <span className='mx-1'><FaList /></span> View All applications</Button>
                    </Col>
                </Row>
                <Form onSubmit={handleSubmit}>
                    <Row className='mt-2'>
                        <Col className='p-4'>
                            <Row className='stepContent'>
                                {/* <Form onSubmit={handleSubmit}> */}
                                <Row className='mt-2'>
                                    <Col xs={12}>
                                        <Form.Group controlId="title">
                                            <Form.Label><span className="req mx-1">*</span>Brand Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                className='tapG'
                                                placeholder="Enter Category Title"
                                                name="title"
                                                size='sm'
                                                value={modalData?.title}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>
                                    <Form.Group controlId="image">
                                        <Col xs={12}>
                                            <Form.Group controlId="title">
                                                <Form.Label><span className="req mx-1">*</span>Brand Image

                                                    {modalData?.image?.image_path ?
                                                        (<a
                                                            href={modalData?.image?.image_path}
                                                            target="_blank"
                                                        >

                                                            <span className='mx-4'>SHOW IMAGE</span>
                                                        </a>)
                                                        :
                                                        <>
                                                        {brandimgloading &&
                                                          <Spinner className='ms-2' animation="border" size="sm" role="status">
                                                          <span className="visually-hidden">Loading...</span>
                                                      </Spinner>
                                                        }
                                                        </>
                                                    }
                                                </Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    className='tapG'
                                                    placeholder="Upload Category Image"
                                                    name="image"
                                                    size='sm'
                                                    required
                                                    // value={modalData?.image}
                                                    onChange={(e) => handleFileChange(e, '1')}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Form.Group>
                                </Row>

                                <Row className='mt-2'>

                                    <Form.Group controlId="title">
                                        <Col xs={12}>
                                            <Form.Label><span className="req mx-1">*</span>Brand Origin  </Form.Label>

                                            <Form.Check
                                                type="checkbox"
                                                id="indianBrandCheckbox"
                                                name="brand_origin"
                                                label="Is It Indian Brand?"
                                                required
                                                checked={isChecked}
                                                onChange={handleCheckboxChange}
                                            />
                                        </Col>
                                   </Form.Group>

                                </Row>

                                {/* <Row className='mt-2'>
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
                                </Row> */}

                                {/* <Row className='mt-2'>
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
                                </Row> */}

                                {/* <Row className='mt-4 bgColor' >
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
                                    </Row> */}

                                {/* </Form> */}
                            </Row>
                            <Row className='mt-4 stepContent'>
                                <Col> <h5>Provide your contact information</h5></Col>
                            </Row>

                            <Row className='mt-2 stepContent'>
                                <Col xs={12}>
                                    <Form.Group controlId="title">
                                        <Form.Label><span className="req">*</span> Alternate Email to contact you</Form.Label>
                                        <Form.Control
                                            type="email"
                                            className='tapG'
                                            placeholder="Enter Email..."
                                            name="email"
                                            size='sm'
                                            // value={modalData?.subtitle}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group controlId="title">
                                        <Form.Label><span className="req">*</span> Alternate Phone to call you for query</Form.Label>
                                        <Form.Control
                                            type="phone"
                                            className='tapG'
                                            placeholder="Enter Phone..."
                                            name="phone_no"
                                            size='sm'
                                            required
                                            // value={modalData?.subtitle}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>

                        <Col className='mt-4 stepContent'>
                            <Row>
                                <Col> <h5>Tell us about your products and business</h5></Col>
                            </Row>
                            <Row>
                                <Col xs={12} className='mt-2 infotext'>
                                    You are requesting approval to sell  brand items
                                </Col>
                                {/* <div className='mt-2'>
                                    <Col xs={6} className='infotext2'>
                                        <Form.Group>
                                            <Form.Check
                                                type='radio'
                                                id='reseller'
                                                label='Reseller/Distributor'
                                                value='distributer'
                                                checked={selectedOption === 'distributer'}
                                                onChange={handleOptionChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} className='infotext2'>
                                        <Form.Group>
                                            <Form.Check
                                                type='radio'
                                                id='manufacturer'
                                                label='Manufacturer'
                                                value='manufracturer'
                                                checked={selectedOption === 'manufracturer'}
                                                onChange={handleOptionChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </div> */}


                            </Row>

                           
                                <div className='mt-4'>
                                    <Row>
                                        <Col>
                                            <h5>Share Documents</h5>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className='mt-2 infotext'>
                                            At least 1 purchase invoice for products from a manufacturer or distributor
                                        </Col>
                                    </Row>
                                    <Row className='mt-2 text-center p-4'>
                                        <Col>
                                        {modalData?.dis_doc?.doc == 'distributer' &&
                                                <span>
                                                    {modalData?.dis_doc?.doc_file &&
                                                        <a
                                                            href={modalData?.dis_doc?.doc_file}
                                                            target="_blank"
                                                        >

                                                            <span className='mx-4 fw-bold'>SHOW FILE</span>
                                                        </a>
                                                    }

                                                </span>
                                            }
                                        </Col>
                                        <Col xs={12}>
                                            <div className='upback'>
                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange2(e, 'distributer')}
                                                    required
                                                />
                                                <label htmlFor="fileInput">
                                                    <Button variant="secondary" className='w-100' size='sm' as="span">
                                                        Upload File
                                                    </Button>
                                                </label>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12}>
                                            <Form.Group controlId="title">
                                                <Form.Label>Optional Comments</Form.Label>
                                                <Form.Control
                                                    type="phone"
                                                    className='tapG'
                                                    placeholder="Add Comments..."
                                                    name="phone"
                                                    size='sm'
                                                    onChange={(e) => handleOptionInput(e?.target?.value, 'distributer')}
                                                // value={modalData?.subtitle}
                                                // onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>

                           
                                <div className='mt-4'>
                                    {/* <Row>
                                        <Col>
                                            <h5>Share Documents</h5>
                                        </Col>
                                    </Row> */}
                                    <Row>
                                        <Col className='mt-2 infotext'>
                                            Upload file for {modalData?.title} Manufacturing License
                                        </Col>
                                    </Row>
                                    <Row className='mt-2 text-center p-4'>
                                        <Col>
                                            {modalData?.manu_doc?.doc == 'manufracturer' &&
                                                <span>
                                                    {modalData?.manu_doc?.doc_file &&
                                                        <a
                                                            href={modalData?.manu_doc?.doc_file}
                                                            target="_blank"
                                                        >

                                                            <span className='mx-4 fw-bold'>SHOW FILE</span>
                                                        </a>
                                                    }

                                                </span>
                                            }
                                        </Col>
                                        <Col xs={12}>
                                            <div className='upback'>
                                                <input
                                                    type="file"
                                                    id="fileInput2"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => handleFileChange2(e, 'manufracturer')}
                                                    required
                                                />
                                                <label htmlFor="fileInput2">
                                                    <Button variant="secondary" className='w-100' size='sm' as="span">
                                                        Upload File
                                                    </Button>
                                                </label>
                                                {selectedFile && <p>Selected file: {selectedFile.name}</p>}
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12}>
                                            <Form.Group controlId="title">
                                                <Form.Label>Optional Comments</Form.Label>
                                                <Form.Control
                                                    type="phone"
                                                    className='tapG'
                                                    placeholder="Add Comments..."
                                                    name="phone"
                                                    size='sm'
                                                    // value={modalData?.subtitle}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>


                            {/* <Row className='mt-4'>
                                <Col> <h5>Provide your contact information</h5></Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col xs={12}>
                                    <Form.Group controlId="title">
                                        <Form.Label>Email addresses Best email to contact you for questions</Form.Label>
                                        <Form.Control
                                            type="email"
                                            className='tapG'
                                            placeholder="Enter Email..."
                                            name="email"
                                            size='sm'
                                            // value={modalData?.subtitle}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col xs={12}>
                                    <Form.Group controlId="title">
                                        <Form.Label>Optional Phone Best number to call you for questions</Form.Label>
                                        <Form.Control
                                            type="phone"
                                            className='tapG'
                                            placeholder="Enter Phone..."
                                            name="phone_no"
                                            size='sm'
                                            // value={modalData?.subtitle}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row> */}
                        </Col>
                    </Row>
                    <Row className='mt-4 mb-4 bgColor stepContent' >
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
                            >Agree & Submit</Button> 
                        </Col>
                    </Row>
                </Form>


            </Container>
            <Toaster position="top-right" />
        </div>
    )
}

export default BrandRequest