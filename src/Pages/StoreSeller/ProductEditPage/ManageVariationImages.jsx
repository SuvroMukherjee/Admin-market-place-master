import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { IoIosAdd, IoMdCloseCircle } from 'react-icons/io';
import { MdCancel } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteProductSpecification, FileUpload, ProductSpecificationCreate, UpdateProductSpecification, sellerNewAddedProductDtails, sellerProductDeatils } from '../../../API/api';
import { addOrdinalSuffix } from '../../../common/RatingAvg';
import { FaInfoCircle } from "react-icons/fa";
import './Style.css';
import { height } from '@mui/system';
import { IoIosAddCircle } from "react-icons/io";

const ManageVariationImages = ({ selectedproductid, showModal, handleCloseModal, getProductListFunc }) => {

    const [specifications, setSpecifications] = useState([
        {
            title: '',
            value: '',
            //user_choice: false,
        },
    ]);

    const [productPrice, setproductPrice] = useState(0);

    const [isEdit, setIsEdit] = useState(false);

    const [productImges, setProductImages] = useState([]);

    const [selectedSpecId, setSelectedSpecId] = useState()

    const [addedVariants, setAddedVariants] = useState([])

    const [avaivleOptions, setAvaivleOptions] = useState([])

    const { id: productId } = useParams();

    const [formData, setFormData] = useState({})

    const [productData, setProductData] = useState([])
    useEffect(() => {
        getProductdata()
    }, [])


    const navigate = useNavigate()

    async function getProductdata() {
        let res = await sellerProductDeatils(productId);
        console.log(res?.data?.data?.SellerProductData, 'productData')
        setProductData(res?.data?.data?.SellerProductData)
        setAddedVariants(res?.data?.data?.specificationData)
        setAvaivleOptions(res?.data?.data?.additionalSpec)

    }


    const handleSubmit = async () => {

        console.log(productData?.specId?._id)

        let payload = {
            productId: productId,
            image: [...productData?.specId?.image, ...formData?.image]
        }

        payload['createdby'] = productData?.sellerId?._id

        payload['created_type'] = 'sellers'

        payload['product_type'] = 'SellerProducts'


        let res = await ProductSpecificationCreate(payload);

        if (res?.data?.error) {
            toast.error('Something went wrong..')
        } else {
            console.log({ payload })
            getProductdata();
        }
    };

    const handleFileUpload = (event) => {
        const files = event.target.files;
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
                    image: [...prevData.image || [], { image_path: res?.data?.data?.fileurl }],
                }));
            }, 3000);
        } catch (err) {
            console.error(err, "err");
        }
    };

    console.log({ formData })

    return (

        <Container >
            <Row className='mx-4'>
                <Col className='text-center infotab'><span className='mx-4'><FaInfoCircle color='#013e38' size={25} /></span> When multiple sellers sell the same product through a single detail page, we combine and present the best product data to ensure customers get the best experience.</Col>
            </Row>
            <Row className='m-4 p-4 justify-content-md-start stepContent paddingConatiner' >
                <Row className='mt-2'>
                    <Col className='live mt-2' xs={12}>Live on Zoofi</Col>
                    <Col className='live2 mt-2'> This images are currently used by Zoofi as part of this product listing.</Col>
                </Row>
                {avaivleOptions?.length > 0 ?
                    <Row className='mt-4'>
                        {[...productData?.specId?.image, ...avaivleOptions?.[0]?.image].map((ele) => (
                            <Col xs={2} className='mt-3'>
                                <img src={ele?.image_path} width={100} height={100} className='pimg' alt='image' />
                            </Col>
                        ))}
                    </Row> :
                    <Row className='mt-4'>
                        {productData?.specId?.image?.map((ele) => (
                            <Col xs={3} className='mt-3'>
                                <img src={ele?.image_path} width={150} height={150} className='pimg' alt='image' />
                            </Col>
                        ))}
                    </Row>
                }
                <Row className='mt-4'>
                    <Col xs={12} className='live3 mt-2'>Please upload your Recommanded Images for your prosduct</Col>
                    <Col className='mt-4' xs={6}>
                        <label htmlFor='fileInput' className='infotabNw'>
                            <input
                                type='file'
                                id='fileInput'
                                accept='image/*'
                                multiple
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                            <span className='mx-2'>
                                <IoIosAddCircle size={25} />
                            </span> Upload New Images
                        </label>
                    </Col>
                </Row>
                <Row className='mt-4 mb-2'>
                    {formData?.image?.map((ele) => (
                        <Col xs={3}>
                            <img src={ele?.image_path} width={150} height={150} className='pimg' alt='image' />
                        </Col>
                    ))}
                </Row>
                {formData?.image?.length > 0 &&
                    <Row className='mt-4 mb-4'>
                        <Col className='d-flex justify-content-end'>
                            <Button type='submit' onClick={() => handleSubmit()}>Add <span className='imgeCount'>{formData?.image?.length}</span> Images</Button>
                        </Col>
                    </Row>}
            </Row>
        </Container>
    )
}

export default ManageVariationImages