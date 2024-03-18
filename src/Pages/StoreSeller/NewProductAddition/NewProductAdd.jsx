import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { SellerCreateOwn, allBrandList, allCategoryList, getSubCategoryByCategory } from '../../../API/api';
import useAuth from '../../../hooks/useAuth';
import '../../SellerRegistration/registration.css';
import './newproduct.css';

const NewProductAdd = () => {

    const [formData, setFormData] = useState();

    const [loading, setLoading] = useState(true)

    const [allcategoryList, setAllCategoryList] = useState([]);
    const [allSubcategorylist, setSubCatgoryList] = useState([]);
    const [allbrandList, setAllBrandList] = useState([]);
    const [openNewCat, setOpenNewCat] = useState(false)
    const [openNewBrand, setOpenNewCatBrand] = useState(false)

    const { auth } = useAuth();

    const navigate = useNavigate()

    useEffect(() => {
        getCategoryList();
        getBrandList();
    }, [])

    async function getCategoryList() {
        await allCategoryList().then((res) => {
            setAllCategoryList(res?.data?.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    };


    async function getSubCategoryList(CategoryId) {
        console.log(CategoryId)
        await getSubCategoryByCategory(CategoryId).then((res) => {
            setSubCatgoryList(res?.data?.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == 'categoryId') {
            getSubCategoryList(value)
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };



    async function getBrandList() {
        await allBrandList().then((res) => {
            setAllBrandList(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }





    const handleSubmit = async (e) => {

        e.preventDefault();
        formData['sellerId'] = auth?.userId;

        const res = await SellerCreateOwn(formData);

        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {
            toast.success('Product Added successfully')
            setTimeout(() => {
                navigate(`/seller/seller-ownproduct-status/new-variations/${res?.data?.data?._id}`)
            }, 1500);
        }
    }



    return (
        <div>
            <Container>
                
                <Row className='m-4 p-4 justify-content-md-center stepContent paddingConatiner'>

                    <Container >
                        <Form onSubmit={handleSubmit} >
                            <Row className='mt-3'>
                                <Col xs={12}>
                                    <Form.Group controlId="user_name">
                                        <Row>
                                            <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                                <Form.Label className='frmLable'> <span className="req mx-1">*</span> Prouduct Name</Form.Label>
                                            </Col>
                                            <Col xs={8}>
                                                <Form.Control type="text" name="name" className='tapG' placeholder='Enter Product Name' size='sm' value={formData?.name} onChange={handleChange} required autoComplete='off' />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className='mt-3'>
                                <Col xs={12} >
                                    <Form.Group controlId="email">
                                        <Row>
                                            <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                                <Form.Label className='frmLable'><span className="req mx-1">*</span> Product Type </Form.Label>
                                            </Col>
                                            <Col xs={8}>
                                                <Form.Control type="text" name="type" size='sm' className='tapG' placeholder='Enter Product Type' value={formData?.type} onChange={handleChange} required />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className='mt-3'>
                                <Col xs={12} >
                                    <Row >
                                        <Col xs={12} >
                                            <Form.Group controlId="email">
                                                <Row>
                                                    <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                                        <Form.Label className='frmLable'><span className="req mx-1">*</span> Category </Form.Label>
                                                    </Col>
                                                    <Col xs={8}>
                                                        <Form.Control as="select" name="categoryId" size='sm' className='tapG' value={formData?.categoryId} onChange={handleChange} required>
                                                            <option value="" disabled selected>
                                                                Select Category
                                                            </option>
                                                            {allcategoryList?.length > 0 && allcategoryList?.map((ele) => (
                                                                <option key={ele?._id} value={ele?._id}>{ele?.title}</option>
                                                            ))}
                                                        </Form.Control>
                                                    </Col>
                                                </Row>
                                            </Form.Group>

                                        </Col>
                                        <Col xs={12} className='mt-2'>
                                            <Form.Group controlId="email">
                                                <Row>
                                                    <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                                        <Form.Label className='frmLable'><span className="req">*</span> subcategory  </Form.Label>
                                                    </Col>
                                                    <Col xs={8}>
                                                        <Form.Control as="select" name="subcategoryId" size='sm' value={formData?.subcategoryId} onChange={handleChange} >
                                                            <option value="" disabled selected>
                                                                Select Sub Category
                                                            </option>
                                                            {allSubcategorylist?.length > 0 && allSubcategorylist?.map((ele) => (
                                                                <option key={ele?._id} value={ele?._id}>{ele?.title}</option>
                                                            ))}
                                                        </Form.Control>
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col xs={6}></Col>
                                <Col xs={5} className='text-end reqText' onClick={() => navigate('/seller/category-request/')}>Request for New Category?</Col>
                            </Row>


                            <Row className='mt-3'>
                                <Col xs={12}>
                                    <Form.Group controlId="email">
                                        <Row>
                                            <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                                <Form.Label className='frmLable'><span className="req mx-1">*</span> Brand </Form.Label>
                                            </Col>
                                            <Col xs={8}>
                                                <Form.Control as="select" name="brandId" size='sm' value={formData?.brandId} onChange={handleChange} >
                                                    <option value="" disabled selected>
                                                        Select Brand
                                                    </option>
                                                    {allbrandList?.length > 0 && allbrandList?.map((ele) => (
                                                        <option key={ele?._id} value={ele?._id}>{ele?.title}</option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Row className='mt-2'>
                                <Col xs={6}></Col>
                                <Col xs={5} className='text-end reqText' onClick={() => navigate('/seller/brand-request/')}>Request for New Brand Listing?</Col>
                            </Row>

                           

                            <Row className='mt-4'>
                                <Col xs={12} className='mt-4'>
                                    <Row>
                                        <Col>
                                            <Button size='sm' variant='secondary' className='cancelbtn'>CANCEL</Button>
                                        </Col>
                                        <Col className='d-flex justify-content-end'>
                                            <Button size='sm' variant='success' type="submit">NEXT </Button>
                                        </Col>
                                    </Row>        
                                </Col>
                            </Row>

                            {/* <Row className='mt-5'>
                                <Col className="text-center">
                                    <Button size='sm' className='frmLable grnbg' type="submit"> Next Step <span className='mx-2'><RiShareForwardFill /></span> </Button>
                                </Col>
                            </Row> */}
                        </Form>
                    </Container>
                </Row>
            </Container>
            <Toaster position="top-right" />
        </div>
    )
}

export default NewProductAdd