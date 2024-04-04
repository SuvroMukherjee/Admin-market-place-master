import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { offerCreate, offerTypeCreate, sellerProductDeatils } from '../../../API/api';
import useAuth from '../../../hooks/useAuth';
import { ChangeFormatDate2 } from '../../../common/DateFormat';
import { SlCalender } from "react-icons/sl";
import '../NewProductAddition/newproduct.css'
import { NavLink } from "react-router-dom";
import { Outlet } from 'react-router-dom';

const EditLayout = () => {

    const [formData, setFormData] = useState();


    const [offers, setOffers] = useState([])

    const { id: productId } = useParams();

    const { auth } = useAuth();

    const navigate = useNavigate();


    const [productData, setProductData] = useState()


    useEffect(() => {
        getProductdata()
    }, [])


    async function getProductdata() {
        let res = await sellerProductDeatils(productId);
        console.log(res?.data?.data, 'data')
        setProductData(res?.data?.data)
        //setProductData(res?.data?.data?.)
        // setFormData(res?.data?.data)
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


    const handleSubmit = async () => {


        formData['sellerId'] = auth?.userId;
        formData['productId'] = productId

        console.log({ formData })

        const res = await offerCreate(formData);

        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {
            toast.success(`${formData?.offerId?.length} Offers Added successfully`)
            // setTimeout(() => {
            //     navigate(`/seller/seller-ownproduct-status/new-variations/${res?.data?.data?._id}`)
            // }, 1500);
            getProductdata();
        }
    }


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {

            console.log(event.target.value);

            // setFormData((prevData) => ({
            //     ...prevData,
            //     offerId: [...prevData.offerId, id],
            // }));

            setOffers([...offers, { 'offer_type_name': event.target.value }])

        }
    }


    const getOfferId = (id) => {

        setFormData((prevData) => ({
            ...prevData,
            offerId: [...prevData?.offerId || [], id],
        }));
    }




    return (
        <div>
            <Container className='pdis'>
                <Row>

                    <Col className='d-flex justify-content-end'>
                        <img src={productData?.SellerProductData?.productId?.image?.[0]?.image_path} className='bgofferProductImg' alt='productImage' />
                    </Col>
                    <Col xs={1}></Col>
                    <Col>
                        <Row>
                            <Col xs={12} className='bgofferProductName'>
                                {productData?.SellerProductData?.productId?.brandId?.title} {productData?.SellerProductData?.name} {productData?.SellerProductData?.specId?.spec_det?.length > 0 && (
                                    <span>
                                        (
                                        {productData?.SellerProductData.specId.spec_det.map((ele, index, array) => (
                                            <span key={index}>
                                                {ele.value}
                                                {index < array.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                        )
                                    </span>
                                )}
                            </Col>
                            <Col className='mt-2 bgofferProductNameOthersValue' xs={12}>
                                <span className='bgofferProductNameOthers'>Price</span> : {productData?.SellerProductData?.price?.toLocaleString()}
                            </Col>
                            <Col className='mt-1 bgofferProductNameOthersValue' xs={12}>
                                <span className='bgofferProductNameOthers'>M.R.P Price</span> : {productData?.SellerProductData?.specId?.price?.toLocaleString()}
                            </Col>
                            <Col className='mt-1 bgofferProductNameOthersValue' xs={12}>
                                <span className='bgofferProductNameOthers'>SKU ID</span> : {productData?.SellerProductData?.specId?.skuId?.toUpperCase()}
                            </Col>
                            <Col className='mt-1 bgofferProductNameOthersValue' xs={12}>
                                <span className='bgofferProductNameOthers'>Product ID</span> : {productData?.SellerProductData?.productId?.productId?.toUpperCase()}
                            </Col>
                            <Col className='mt-4 bgofferProductNameOthers' xs={12}>
                                Competing Zoofi Offers
                            </Col>
                            <Col className='bgofferProductNameOthersValue' xs={12}>
                                {productData?.OfferData?.length ? `${productData?.OfferData?.length} Offers created` : 'No Offers created Yet'}
                            </Col>

                        </Row>
                    </Col>
                    <Col xs={2}></Col>
                </Row>
            </Container>
            <Container className='mt-4'>
                <Row className=' p-1 justify-content-md-center'>
                    <Col xs={10}>
                        <ul className='d-flex justify-content-evenly liststyle'>
                        
                            {/* <li>
                                <NavLink to={`/seller/seller-product-edit/${productId}/new-offers/${productId}`} className={({ isActive }) => (isActive ? 'activeNav' : 'inactivetab')}>Apply Offers</NavLink>
                            </li> */}
                            <li>
                                <NavLink to={`/seller/seller-product-edit/${productId}/new-mainVariants/${productId}`} className={({ isActive }) => (isActive ? 'activeNav' : 'inactivetab')}> New Variations</NavLink>
                            </li> 
                            <li>
                                <NavLink to={`/seller/seller-product-edit/${productId}/manage-images/${productId}`} className={({ isActive }) => (isActive ? 'activeNav' : 'inactivetab')}>Manage Images</NavLink>
                            </li>

                        </ul>
                    </Col>
                </Row>
            </Container>
            <Outlet/>
            {/* <Container>
                <Row className='m-4 p-4 justify-content-md-center stepContent'>
                    <Col>
                        <Row className='mt-3'>
                            <Col xs={12}>
                                <Form.Group controlId="user_name">
                                    <Row>
                                        <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                            <Form.Label className='frmLable'>HSN Code</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                            <Form.Control type="text" name="hsn_code" className='tapG' placeholder='Enter Product HSN Code' size='sm' value={formData?.hsn_code} onChange={handleChange} autoComplete='off' />
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
                                            <Form.Label className='frmLable'>Product-ID</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                            <Form.Control type="text" name="hsn_code" className='tapG' placeholder='Enter Product HSN Code' size='sm' value={productData?.SellerProductData?.productId?.productId} onChange={handleChange} disabled autoComplete='off' />
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
                                            <Form.Label className='frmLable'> <span className="req mx-1">*</span>Product SKU</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                            <Form.Control type="text" name="desc" className='tapG' placeholder='Enter Product Descroption' size='sm' value={productData?.SellerProductData?.specId?.skuId} onChange={handleChange} disabled autoComplete='off' />
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
                                            <Form.Label className='frmLable' > <span className="req mx-1">*</span>Offer Type</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                            <Form.Control
                                                type="text"
                                                name="type"
                                                className='tapG'
                                                placeholder='Enter Product offer Type'
                                                size='sm'
                                                // value={type}
                                                //onChange={handleChange}
                                                onKeyPress={handleKeyPress}  // Add this line

                                                autoComplete='off'
                                            />
                                            <Form.Text className="text-muted">
                                                examples (Bank offers,No cost EMI,Cashbacks,Partner Offers,etc...)
                                            </Form.Text>
                                        </Col>

                                    </Row>

                                </Form.Group>
                            </Col>
                        </Row>
                    </Col>

                    <Col xs={4} className='bgoffer'>
                        <Row>
                            <Col className='text-center specHeader2'>Current Offers</Col>
                        </Row>
                        <Row className='p-2'>
                            {productData?.OfferData?.[0]?.offerId?.map((ele) => (
                                <Col xs={12}>
                                    <div className='specText2Rest'>
                                        <span className='specText2'>{ele?.offer_type_name}</span> offer {ele?.discount_percentage}% discount on {ele?.offer_on?.bank_name}-
                                        {ele?.offer_on.card_type} Card</ div>
                                    <div className='specTextsmall'><span className='mx-1'><SlCalender size={12} /></span>{ChangeFormatDate2(ele?.offer_start_date)} - <span className='mx-1'><SlCalender size={12} /></span>{ChangeFormatDate2(ele?.offer_end_date)}</div>
                                    <hr />
                                </Col>

                                // <li class="_16eBzU col"><span class="u8dYXW">Bank Offer</span><span>10% Upto ₹2500 off on Samsung Axis Bank Signature credit card</span><div class="Bv11UC _1qNw3R"><span class="fGhUR2">T&amp;C</span></div></li>

                            ))}
                        </Row>
                    </Col>

                    <Row>
                        {offers?.map((ele) => (
                            <Col xs={6}>
                                <OfferForm offer={ele} getOfferId={getOfferId} />
                            </Col>

                        ))}
                    </Row>

                    <Row className='mt-4'>
                        <Col xs={12} className='mt-4'>
                            <Row>
                                <Col>
                                    <Button size='sm' variant='secondary' className='cancelbtn'>CANCEL</Button>
                                </Col>
                                <Col className='d-flex justify-content-end'>
                                    <Button size='sm' variant='success' type="submit" onClick={() => handleSubmit()}>NEXT </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Row>
            </Container> */}
            <Toaster position="top-right" />
        </div>
    )
}


const OfferForm = ({ offer, getOfferId }) => {
    const [formData, setFormData] = useState({
        offer_type_name: offer?.offer_type_name,
        discount_percentage: '',
        offer_on: {
            bank_name: '',
            card_type: ''
        },
        max_amount: '',
        min_amount: '',
        offer_start_date: '',
        offer_end_date: '',
        terms_cond: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prevFormData => ({
                ...prevFormData,
                [parent]: {
                    ...prevFormData[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
        let res = await offerTypeCreate(formData);

        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {
            getOfferId(res?.data?.data?._id)
            toast.success(`${formData?.offer_type_name} offer Added successfully`)
        }


    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="offerTypeName">
                <Form.Label>Offer Type Name:</Form.Label>
                <Form.Control type="text" className='tapG' name="offer_type_name" disabled value={formData.offer_type_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="discountPercentage">
                <Form.Label>Discount Percentage:</Form.Label>
                <Form.Control type="number" className='tapG' name="discount_percentage" value={formData.discount_percentage} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="offerOnBankName">
                <Form.Label>Offer On Bank Name:</Form.Label>
                <Form.Control type="text" className='tapG' name="offer_on.bank_name" value={formData.offer_on.bank_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="offerOnCardType">
                <Form.Label>Offer On Card Type:</Form.Label>
                <Form.Control type="text" className='tapG' name="offer_on.card_type" value={formData.offer_on.card_type} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="maxAmount">
                <Form.Label>Max Amount:</Form.Label>
                <Form.Control type="number" className='tapG' name="max_amount" value={formData.max_amount} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="minAmount">
                <Form.Label>Min Amount:</Form.Label>
                <Form.Control type="number" className='tapG' name="min_amount" value={formData.min_amount} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="offerStartDate">
                <Form.Label>Offer Start Date:</Form.Label>
                <Form.Control type="date" className='tapG' name="offer_start_date" value={formData.offer_start_date} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="offerEndDate">
                <Form.Label>Offer End Date:</Form.Label>
                <Form.Control type="date" className='tapG' name="offer_end_date" value={formData.offer_end_date} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="termsCond">
                <Form.Label>Terms and Conditions:</Form.Label>
                <Form.Control type="text" className='tapG' name="terms_cond" value={formData.terms_cond} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className='mt-2'>
                Submit
            </Button>
        </Form>
    );
};

export default EditLayout