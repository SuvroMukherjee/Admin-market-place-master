import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, ListGroup, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { CiEdit } from "react-icons/ci";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosAdd, IoMdCloseCircle } from 'react-icons/io';
import { MdCancel } from "react-icons/md";
import { DeleteProductSpecification, EditSellerOwnProduct, FileUpload, GetProductDetails, ProductSpecificationCreate, UpdateProductSpecification, sellerBrandRequestList, sellerNewAddedProductDtails } from '../../../API/api';
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "ckeditor4-react";
import useAuth from '../../../hooks/useAuth';
import { FaInfoCircle } from "react-icons/fa";

const NewDescription = () => {

    const [formData, setFormData] = useState([]);

    const { id: productId } = useParams();

    const SellerNewProductId = localStorage.getItem("Seller-productId") || "";

    const { auth } = useAuth();

    const navigate = useNavigate()




    useEffect(() => {
        getProductdata()
    }, [])

    

    async function getProductdata() {
        let res = await sellerNewAddedProductDtails(productId || SellerNewProductId);
        console.log(res?.data?.data, 'productData')
        setFormData(res?.data?.data)
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    function createMarkup(val) {
        return { __html: val };
    }


    const handleEditorChange = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            full_desc: event.editor.getData(),
        }));
    };


    const handleFeaturesChange = (e) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            features: value.split(',').map((tag) => tag.trim()),
        }));
    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        formData['sellerId'] = auth?.userId;
       
        // console.log( formData )

        const res = await EditSellerOwnProduct(productId || SellerNewProductId, formData);
        //    console.log(res?.data?.data);
           
        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {
            toast.success('Product Added successfully')
            setTimeout(() => {
                navigate(`/seller/seller-ownproduct-status/new-variations/${res?.data?.data?._id}`)
            }, 1500);
        }
    }


    const resetAll = () =>{
        localStorage.removeItem('Seller-productId');
        navigate('/seller/seller-ownproduct-status/new-add')
    }

    return (
        <div>
            <Container className='stepContent'>
                <Row className='m-4 p-4 justify-content-md-center stepContent paddingConatiner'>
                    {!productId && !SellerNewProductId &&
                        <Row>
                            <Col className='text-center noproductIdText'><span className='mx-4'><FaInfoCircle color='#7D0A0A' size={25} /></span> Product Id is missing.Please Go the First Step and then try to uplaod or <span style={{ cursor: 'pointer', textDecoration: 'underline', color: 'darkred' }} onClick={() => navigate('/seller/seller-ownproduct-status/new-add')}>request for new Product</span></Col>
                        </Row>}
                    <Container>
                        <Form onSubmit={handleSubmit}>
                            <fieldset disabled={!productId && !SellerNewProductId}>
                                <Row className='mt-3'>
                                    <Col xs={12}>
                                        <Form.Group controlId="user_name">
                                            <Row>
                                                <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                                    <Form.Label className='frmLable'> <span className="req mx-1">*</span> Prouduct Description</Form.Label>
                                                </Col>
                                                <Col xs={8}>
                                                    <Form.Control type="text" as="textarea" rows={3} name="desc" className='tapG' placeholder='Enter Product Descroption' size='sm' value={formData?.desc} onChange={handleChange} required autoComplete='off' />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col xs={12}>
                                        <Form.Group controlId="user_name">
                                            <Row>
                                                <Col xs={3} className='d-flex align-items-start justify-content-end'>
                                                    <Form.Label className='frmLable'> <span className="req mx-1">*</span> Full Description</Form.Label>
                                                </Col>
                                                <Col xs={8}>
                                                    <CKEditor
                                                        required
                                                        className='tapG'
                                                        initData={
                                                            <div
                                                                dangerouslySetInnerHTML={createMarkup(formData?.full_desc)}
                                                            />
                                                        }
                                                        onChange={handleEditorChange}
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col xs={12}>
                                        <Form.Group controlId="user_name">
                                            <Row>
                                                <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                                    <Form.Label className='frmLable'>Features</Form.Label>

                                                </Col>
                                                <Col xs={8}>
                                                    <Form.Control type="text" as="textarea" rows={3} name="features" className='tapG' placeholder='Enter Product Features' size='sm' value={formData?.features?.join(', ')} onChange={handleFeaturesChange}  autoComplete='off' />
                                                    <Form.Text className="text-muted">
                                                        Separate Features with commas (e.g., features1, features2).
                                                    </Form.Text>
                                                </Col>

                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-3'>
                                    <Col xs={12}>
                                        <Form.Group controlId="user_name">
                                            <Row>
                                                <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                                    <Form.Label className='frmLable'> Add Video Link</Form.Label>

                                                </Col>
                                                <Col xs={8}>
                                                    <Form.Control type="text" as="textarea" rows={2} name="video_link" className='tapG' placeholder='Enter Product Video Link' size='sm' value={formData?.video_link} onChange={handleChange} autoComplete='off' />
                                                    <Form.Text className="text-muted">
                                                        Add Youtube Video's Embedded Link .
                                                    </Form.Text>
                                                </Col>

                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-4'>
                                    <Col xs={12} className='mt-4'>
                                        <Row>
                                            <Col>
                                                <Button size='sm' variant='secondary' className='cancelbtn' onClick={()=> resetAll()}>Reset All</Button>
                                            </Col>
                                            <Col className='d-flex justify-content-end'>
                                                <Button size='sm' variant='success' type="submit"> Save & NEXT </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </fieldset>
                        </Form>
                    </Container>
                </Row>
            </Container>
        </div>
    )
}

export default NewDescription