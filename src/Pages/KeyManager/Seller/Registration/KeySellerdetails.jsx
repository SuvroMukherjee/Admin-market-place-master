import React, { useEffect, useState } from 'react'
import { allIndiaCities, allcatList, sellerDetails } from '../../../../API/api';
import { useParams } from 'react-router-dom';
import { Button, Col, Container, Row, Form, ButtonGroup, Card, Image, Table } from 'react-bootstrap';
import { GrUpdate } from "react-icons/gr";
import { MdCancel, MdOutlineFileUpload } from 'react-icons/md';
import { IoIosAddCircle } from "react-icons/io";
import { IoSaveSharp } from "react-icons/io5";
// import '../../Layouts/sellerlayout.css';
import { ImProfile } from "react-icons/im";
import { GiShop } from "react-icons/gi";
import { TiDocumentText } from "react-icons/ti";
import { BsBank } from "react-icons/bs";
import { TbCategoryPlus } from "react-icons/tb";
import { BsShop } from "react-icons/bs";
import Spinner from 'react-bootstrap/Spinner';
import { FaFileAlt } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { ChangeFormatDate2 } from '../../../../common/DateFormat';
import { FaHouseUser } from "react-icons/fa";


const KeySellerdetails = () => {

    const [sellerdata, setSellerData] = useState();
    const [loading, setLoading] = useState(true)

    const { id: sellerId } = useParams();

    useEffect(() => {
        getSellerData();
    }, [])

    const getSellerData = async () => {
        let res = await sellerDetails(sellerId)
        setSellerData(res?.data?.data)
        setTimeout(() => {
            setLoading(false)
        }, 3000);
    }

    return (
        <>
            {loading &&
                <div className="productList mt-2 p-4 contentLoader">
                    <Row>
                        <Col>
                            <Spinner animation="border" size="lg" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                </div>}
            <div className="productList mt-2 p-4 mt-4">
                <Container>
                    <Row>
                        <Col><span className='mx-1'><FaHouseUser size={25} /></span> <span className='mx-2' style={{ fontWeight: 'bold', color: '#0C2D57' }}>{sellerdata?.user_name} ({sellerdata?.Shop_Details_Info?.shope_name})</span></Col>
                        <p style={{ fontSize: '12px' }} className='mt-2'>Register on {ChangeFormatDate2(sellerdata?.updatedAt)}</p>
                    </Row>
                </Container>
                <Container className='mb-4 mt-4'>
                    <div className='mt-4'>
                        <Container>
                            <Row>
                                <Col className='hd'> <span className='mx-2'><ImProfile size={25} /></span> Personal Information</Col>
                            </Row>
                            <Row>
                                <Form>
                                    <Row className='mt-2'>
                                        <Col xs={6}>
                                            <Form.Group controlId="user_name">
                                                <Form.Label className='frmLable'>User Name </Form.Label>
                                                <p className='sellv'>{sellerdata?.user_name}</p>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={6}>
                                            <Form.Group controlId="email">
                                                <Form.Label className='frmLable'>Email  </Form.Label>
                                                <p className='sellv'>{sellerdata?.email}</p>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className='mt-2'>
                                        <Col xs={6}>
                                            <Form.Group controlId="phone_no">
                                                <Form.Label className='frmLable'>Phone Number  </Form.Label>
                                                <p className='sellv'>{sellerdata?.phone_no}</p>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Row>
                        </Container>

                    </div>

                    <div className='mt-4'>
                        <ShopInfo userInfo={sellerdata?.Shop_Details_Info} />
                    </div>

                    <div className='mt-4'>
                        <Documentation userInfo={sellerdata?.doc_details} />
                    </div>

                    <div className='mt-4'>
                        <Bankdata userInfo={sellerdata?.bank_details} />
                    </div>

                    <div className='mt-4'>
                        <CategoryAndCommission userInfo={sellerdata?.interest_details} />
                    </div>

                </Container>
            </div>
        </>
    )
}


const ShopInfo = ({ userInfo }) => {

    const [shopInfo, setShopInfo] = useState({
        shope_name: '',
        shop_address1: '',
        shop_address2: '',
        picup_location: '',
        pin_code: '',
        disict: '',
        state: '',
        pic_of_shope: [],
        old_shope_desc: '',
        total_no_of_unit: ''

    });
    const [allstates, setAllStates] = useState([])


    useEffect(() => {
        setShopInfo(userInfo)
    }, [userInfo])

    useEffect(() => {
        getallStates();
    }, [])

    const getallStates = async () => {
        let res = await allIndiaCities();
        setAllStates(res?.data?.data?.states)
    }


    return (
        <Container>
            <Row>
                <Col className='hd'>
                    <span className='mx-2'><BsShop size={25} /></span> Update Shop Deatils
                </Col>
            </Row>
            <Row>
                <Form>
                    <Row className='mt-2'>
                        <Col xs={4}>
                            <Form.Group controlId="shopName">
                                <Form.Label className='frmLable'>Shop Name </Form.Label>
                                <p className='sellv'>{shopInfo?.shope_name}</p>
                            </Form.Group>
                        </Col>

                        <Col xs={4}>
                            <Form.Group controlId="shopAddress1">
                                <Form.Label className='frmLable'>Shop Address 1</Form.Label>
                                <p className='sellv'>{shopInfo?.shop_address1}</p>
                            </Form.Group>
                        </Col>

                        <Col xs={4}>
                            <Form.Group controlId="shopAddress2">
                                <Form.Label className='frmLable'>Shop Address 2</Form.Label>
                                <p className='sellv'>{shopInfo?.shop_address2}</p>
                            </Form.Group>
                        </Col>

                    </Row>

                    <Row className='mt-2'>
                        <Col xs={3}>
                            <Form.Group controlId="pickupLocation">
                                <Form.Label className='frmLable'>Pickup Location</Form.Label>
                                <p className='sellv'>{shopInfo?.picup_location}</p>
                            </Form.Group>
                        </Col>

                        <Col xs={3}>
                            <Form.Group controlId="pincode">
                                <Form.Label className='frmLable'>Pincode</Form.Label>
                                <p className='sellv'>{shopInfo?.pin_code}</p>
                            </Form.Group>
                        </Col>

                        <Col xs={3}>
                            <Form.Group controlId="district">
                                <Form.Label className='frmLable'>District</Form.Label>
                                <p className='sellv'>{shopInfo?.disict}</p>
                            </Form.Group>
                        </Col>

                        <Col xs={3}>
                            <Form.Group controlId="state">
                                <Form.Label className='frmLable'>State</Form.Label>
                                <p className='sellv'>{shopInfo?.state}</p>
                            </Form.Group>
                        </Col>

                    </Row>

                    <Row className='mt-2'>
                        <Col xs={12}>
                            <Form.Group controlId="shopImages">
                                <Form.Label className='frmLable'>Shop Images</Form.Label>
                                {shopInfo?.pic_of_shope?.length > 0 && (
                                    <Container>
                                        <Row>
                                            {shopInfo?.pic_of_shope.map((fileUrl, index) => (
                                                <Col key={index} xs={4} md={2}>
                                                    <Image src={fileUrl} thumbnail fluid />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Container>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className='mt-2'>
                        <Col xs={4}>
                            <Form.Group controlId="old_shope_desc">
                                <Form.Label className='frmLable'>Total Year of Busniess Experience</Form.Label>
                                <p className='sellv'> {shopInfo?.old_shope_desc}</p>
                            </Form.Group>
                        </Col>

                        <Col xs={4}>
                            <Form.Group controlId="total_no_of_unit">
                                <Form.Label className='frmLable'> Total of Units Sold Each Year</Form.Label>
                                <p className='sellv'>{shopInfo?.total_no_of_unit}</p>
                            </Form.Group>
                        </Col>

                    </Row>
                </Form>
            </Row>
        </Container>
    )
}


const Documentation = ({ userInfo }) => {


    const [documentation, setDocumentation] = useState({
        gst_no: '',
        pan_no: '',
        adhar_card: '',
        gst_file: null,
        cancelled_cheque: null,
        msme_certificate: null
    });

    useEffect(() => {
        setDocumentation(userInfo)
    }, [userInfo])





    return (
        <Container>
            <Row>
                <Col className='hd'> <span className='mx-2'><TiDocumentText size={25} /></span> Update Document</Col>
            </Row>
            <Row>
                <Form>
                    <Row className='mt-2'>
                        <Col xs={4}>
                            <Form.Group controlId="gst_no">
                                <Form.Label className='frmLable'>GST Number</Form.Label>
                                <p className='sellv'>{documentation?.gst_no} </p>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group controlId="pan_no">
                                <Form.Label className='frmLable'>PAN Card</Form.Label>
                                <p className='sellv'>{documentation?.pan_no}</p>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group controlId="adhar_card">
                                <Form.Label className='frmLable'>Aadhar Card</Form.Label>
                                <p className='sellv'>{documentation?.adhar_card}</p>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className='mt-2'>
                        <Col xs={4}>
                            <Form.Group controlId="gst_file">
                                <Form.Label className='frmLable'>
                                    GST File
                                </Form.Label>
                                <p>
                                    {documentation?.gst_file &&
                                        <a href={documentation?.gst_file} target="_blank">
                                            <span><FaFileAlt size={25} /></span>
                                        </a>
                                    }</p>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group controlId="cancelled_cheque">
                                <Form.Label className='frmLable'>Cancelled Cheque
                                </Form.Label>
                                <p>
                                    {documentation?.cancelled_cheque &&
                                        <a
                                            href={documentation?.cancelled_cheque}
                                            target="_blank"
                                        >

                                            <span><FaFileInvoice size={25} /></span>
                                        </a>
                                    }
                                </p>
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group controlId="msme_certificate">
                                <Form.Label className='frmLable'>MSME Certificate
                                </Form.Label>
                                <p>
                                    {documentation?.msme_certificate &&
                                        <a
                                            href={documentation?.msme_certificate}
                                            target="_blank"
                                        >

                                            <span><FaFilePdf size={25} /></span>
                                        </a>
                                    }
                                </p>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    )
}

const Bankdata = ({ userInfo }) => {
    const [bankingDetails, setBankingDetails] = useState({
        bank_name: '',
        beneficiary_name: '',
        account_number: '',
        ifsc_code: '',
        bank_branch: '',
        micr_code: ''
    });

    useEffect(() => {
        setBankingDetails(userInfo)
    }, [userInfo])


    return (
        <Container>
            <Row>
                <Col className='hd'> <span className='mx-2'><BsBank size={25} /></span> Bank Details</Col>
            </Row>
            <Row>
                <Form >
                    <Row className='mt-2'>
                        <Col xs={6}>
                            <Form.Group controlId="bankName">
                                <Form.Label className='frmLable'>Bank Name</Form.Label>
                                <p className='sellv'>{bankingDetails?.bank_name}</p>
                            </Form.Group>
                        </Col>

                        <Col xs={6}>
                            <Form.Group controlId="beneficiaryName">
                                <Form.Label className='frmLable'>Beneficiary Name</Form.Label>
                                <p className='sellv'>{bankingDetails?.beneficiary_name}</p>
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row className='mt-2'>
                        <Col xs={6}>
                            <Form.Group controlId="accountNumber">
                                <Form.Label className='frmLable'>Account Number</Form.Label>
                                <p className='sellv'>{bankingDetails?.account_number} </p>
                            </Form.Group>
                        </Col>

                        <Col xs={6}>
                            <Form.Group controlId="ifscCode">
                                <Form.Label className='frmLable'>IFSC Code</Form.Label>
                                <p className='sellv'>{bankingDetails?.ifsc_code}</p>
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row className='mt-2'>
                        <Col xs={6}>
                            <Form.Group controlId="bankBranch">
                                <Form.Label className='frmLable'>Bank Branch</Form.Label>
                                <p className='sellv'>{bankingDetails?.bank_branch}</p>
                            </Form.Group>
                        </Col>

                        <Col xs={6}>
                            <Form.Group controlId="micrCode">
                                <Form.Label className='frmLable'>MICR Code</Form.Label>
                                <p className='sellv'>{bankingDetails?.micr_code}</p>
                            </Form.Group>
                        </Col>

                    </Row>
                </Form>
            </Row>
        </Container>
    )
}

const CategoryAndCommission = ({ userInfo }) => {

    const [formData, setFormData] = useState({
        commission_data: [{ categoryId: '', commission_rate: '' }]
    });
    const [categorylist, setcategorylist] = useState([]);

    console.log({ userInfo })

    useEffect(() => {
        getAllCats()
    }, [])


    useEffect(() => {
        setFormData(userInfo)
        setSelectedCategories(userInfo?.categoryId)
    }, [userInfo])


    async function getAllCats() {
        await allcatList().then((res) => {
            setcategorylist(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    const [selectedCategories, setSelectedCategories] = useState([]);

    const findcatName = (id) => {
        console.log(id)
        let cat = categorylist?.find((ele) => {
            return ele?._id == id
        })

        console.log({ cat })
        return cat?.title
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Row>
                        <Col className='hd'> <span className='mx-2'><TbCategoryPlus size={25} /></span>Interest  Category & Commission</Col>
                    </Row>
                    <Row className='mt-2'>
                        <Row>
                            {categorylist.map((option) => (
                                selectedCategories?.includes(option?._id) && (
                                    <Col key={option?._id} xs={4} className='mt-2'>
                                        <input
                                            type="checkbox"
                                            id={option?._id}
                                            name={option?.title}
                                            checked={selectedCategories?.includes(option?._id)}
                                            onChange={() => handleCheckboxChange(option?._id)} // Assuming you have a function to handle checkbox change
                                        />
                                        <label className='mx-2 frmLable' htmlFor={option?._id}>{option?.title}</label>
                                    </Col>
                                )
                            ))}
                        </Row>
                    </Row>
                </Col>
            </Row>
            <Row className='mt-4'>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className="text-center">Category Title</th>
                                <th className="text-center">Commission Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData?.commission_data?.length > 0 && formData?.commission_data?.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center">{findcatName(item?.categoryId)}</td>
                                    <td className="text-center">{item?.commission_rate}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            {/* <Row className='mt-2'>
                <Row className='mt-2'>
                    <Col xs={8} >
                        <Form.Group controlId="commissionRate">
                            {formData?.commission_data.map((item, index) => (
                                <Row key={index} className="mb-2">
                                    <Col xs={4}>
                                        <Form.Label className='frmLable'>category</Form.Label>
                                        <Form.Select
                                            name="categoryId"
                                            value={item?.categoryId}
                                            size='sm'
                                            required
                                        >
                                            <option value="" disabled>Select category</option>
                                            {categorylist?.length > 0 && categorylist.map((ele) => (
                                                <option value={ele?._id}>{ele?.title}</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={4}>
                                        <Form.Label className='frmLable'>commission(%)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="commission_rate"
                                            value={item?.commission_rate}
                                            placeholder="Commisson rate"
                                            size='sm'
                                            required
                                        />
                                    </Col>
                                </Row>
                            ))}
                        </Form.Group>
                    </Col>
                </Row>
            </Row> */}
        </Container>
    )
}

export default KeySellerdetails