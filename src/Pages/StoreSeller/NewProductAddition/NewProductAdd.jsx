import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import React, { useEffect } from 'react'
import { NavLink } from "react-router-dom";
import './newproduct.css'
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { RiShareForwardFill } from "react-icons/ri";
import '../../SellerRegistration/registration.css'
import { FileUpload, SellerCreateOwn, allBrandList, allCategoryList, getSubCategoryByCategory } from '../../../API/api';
import useAuth from '../../../hooks/useAuth';
import { Outlet, useNavigate } from 'react-router-dom';

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
            toast.success('Commission Added successfully')
        }
    }


    // const handleFileChange = async (e) => {
    //     onFileUpload(e.target.files[0])
    // };


    // const onFileUpload = async (data) => {
    //     const formData = new FormData();
    //     formData.append("file", data);
    //     await FileUpload(formData)
    //         .then((res) => {
    //             console.log(res, "res");
    //             setTimeout(() => {
    //                 // setFile(res?.data?.data?.fileurl)
    //                 setcatReqdata((prevData) => ({
    //                     ...prevData,
    //                     ['image']: {image_path : res?.data?.data?.fileurl}, 
    //                 }));
    //             }, 3000);
    //             //setFile(res?.data?.data?.fileurl)
    //         })
    //         .catch((err) => {
    //             console.log(err, "err");
    //         });
    // };


    // const [categoryReqdata,setcatReqdata] = useState()


    // const handleCatChange = (e) =>{
    //     const { name, value } = e.target;

    //     setcatReqdata((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //     }));
    // }


    // const handleCategoryRequestSubmit = async(e) =>{
    //     console.log('call')
    //     e.preventDefault();
    //     console.log({ categoryReqdata })
    // }

    return (
        <div>
            <Container>
                {/* <Row className='p-4'>
                    <Col xs={10}>
                        <ul className='d-flex justify-content-evenly liststyle'>
                            <li>
                                <NavLink to="/">Product Identity</NavLink>
                            </li>
                            <li>
                                <NavLink to="service">Description</NavLink>
                            </li>
                            <li>
                                <NavLink to="about">Product Details</NavLink>
                            </li>
                            <li>
                                <NavLink to="about">Offers</NavLink>
                            </li>
                            <li>
                                <NavLink to="about">Safety & Complains</NavLink>
                            </li>
                        </ul>
                    </Col>
                </Row> */}

                <Row className='m-4 p-4 justify-content-md-center stepContent'>

                    <Container>
                        <Form onSubmit={handleSubmit} >
                            <Row className='mt-3'>
                                <Col xs={12}>
                                    <Form.Group controlId="user_name">
                                        <Row>
                                            <Col xs={3}>
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
                                <Col xs={12}>
                                    <Form.Group controlId="email">
                                        <Row>
                                            <Col xs={3}>
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
                                <Col xs={12}>
                                    <Row>
                                        <Col xs={5}>
                                            <Form.Group controlId="email">
                                                <Row>
                                                    <Col xs={3}>
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
                                        <Col xs={6}>
                                            <Form.Group controlId="email">
                                                <Row>
                                                    <Col xs={3}>
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
                                <Col xs={5} className='text-end' onClick={() => navigate('/seller/category-request/')}>Request for New Category?</Col>
                            </Row>

                            {openNewCat &&
                                <Row style={{backgroundColor:'grey'}}>
                                    <Col xs={6}>
                                        <Form onSubmit={handleCategoryRequestSubmit}>
                                            <Row className='mt-2'>
                                                <Form.Group controlId="title">
                                                    <Form.Label>Category Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        size='sm'
                                                        placeholder="Enter title"
                                                        name="title"
                                                        value={categoryReqdata?.title}
                                                        onChange={handleCatChange}
                                                    />
                                                </Form.Group>
                                            </Row>
                                            <Row className='mt-2'>
                                                <Form.Group controlId="image">
                                                    <Form.Label>Image</Form.Label>
                                                    <Col>
                                                        {/* <img src={modalData?.image?.[0]?.image_path} alt={"category"} style={{ width: '100%' }} /> */}
                                                    </Col>
                                                    <Col>
                                                        <Form.Control type='file' size='sm' onChange={handleFileChange} accept="image/jpeg, image/png, image/gif" />
                                                    </Col>
                                                </Form.Group>
                                            </Row>
                                            <Row className='mt-3'>
                                                <Col>

                                                    <Button
                                                        variant="warning"
                                                        size='sm'
                                                        type='submit'
                                                        
                                                    >Update Category</Button>

                                                </Col>
                                            </Row>

                                        </Form>
                                    </Col>
                                    

                                </Row>
                            }


                        

                            <Row className='mt-3'>
                                <Col xs={12}>
                                    <Form.Group controlId="email">
                                        <Row>
                                            <Col xs={3}>
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
                                <Col className='text-end' onClick={() => setOpenNewCatBrand(!openNewBrand)}>Request for New Brand Listing?</Col>
                            </Row>

                            {openNewBrand && 
                            <Form >
                                <Row className='mt-2'>
                                    <Form.Group controlId="title">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter title"
                                            name="title"
                                            // value={modalData?.title}
                                            // onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Row>
                                <div className="addProductItem mt-2">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name='brand_origin'
                                            // checked={modalData?.brand_origin}
                                            // onChange={handleInputChange}
                                        />
                                        {' '}
                                        Is It Indian Brand?
                                    </label>
                                </div>
                                <Row className='mt-2'>
                                    <Form.Group controlId="image">
                                        <Form.Label>Image</Form.Label>
                                        <Col>
                                            {/* <img src={modalData?.image?.[0]?.image_path} alt={modalData?.image} style={{ width: '100%' }} /> */}
                                        </Col>
                                        <Col>
                                          
                                            <input type='file' onChange={handleFileChange} accept="image/jpeg, image/png, image/gif" />
                                        </Col>
                                    </Form.Group>
                                </Row>
                                <Row className='mt-3'>
                                    <Col>
                                      
                                            <Button
                                                className="btn-block mr-1 mt-1 btn-lg"
                                                variant="warning"
                                                type='submit'
                                                block
                                            >
                                                Update Brand
                                            </Button>
                                       
                                    </Col>
                                </Row>
                            </Form>}

                            <Row className='mt-4'>
                                <Col>
                                    <Button size='sm' variant='secondary'>CANCEL</Button>
                                </Col>
                                <Col>
                                    <Button size='sm' variant='success' type="submit">NEXT <span className='mx-2'><RiShareForwardFill /></span> </Button>
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