import React, { useEffect } from 'react'
import { BrandApproval, SubcategoryApproval, allBrandreqList, allCategoryeqList, categoryApproval } from '../../../API/api';
import { Button, Container, Row, Col, Table } from 'react-bootstrap';
import { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { ChangeFormatDate2 } from '../../../common/DateFormat';
import "../product.css";
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

export default function BrandReqList() {
    const [loading, setLoading] = useState(true)
    const [BrandApplicqation, setbrandApplication] = useState([])

    useEffect(() => {
        getCatsList();
    }, [])


    const getCatsList = async () => {

        let res = await allBrandreqList();

        console.log(res?.data?.data, 'all cats list')
        setbrandApplication(res?.data?.data)
        setLoading(false)
    }

    const navigate = useNavigate()


    const handleUpdateFunction = async (data) => {

        let payload = {
            is_approved: !data?.is_approved
        }

        let res = await BrandApproval(payload, data?._id);
        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {
            toast.success('Brand Request updated')
            getCatsList();
        }

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
            <div className="productList mt-2 p-4">
                <div className='text-center'><h4>Category Request Lists</h4></div>
                <Container className='mt-4'>
                    <Row>
                        <Col xs={12}>Total Data : {BrandApplicqation?.length}</Col>
                        <Col>
                            <Table responsive hover striped >
                                <thead>
                                    <tr>
                                        <th>Requestd By (seller)</th>
                                        <th>Brand Name</th>
                                        <th>Changed</th>
                                        <th>Contact Details</th>
                                        <th>Documents</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody className='mt-2 '>

                                    {BrandApplicqation?.length > 0 && BrandApplicqation?.map((ele) => (
                                        <tr>
                                            <td>{ele?.user?.shope_name} <br /> <span className='viewSeller' onClick={() => navigate(`/SellerDetails/${ele?.user?._id}`)}>view
                                                <FaLongArrowAltRight /> </span></td>
                                            <td>{ele?.title}<br />
                                                <a
                                                    href={ele?.image?.[0]?.image_path}
                                                    target="_blank"
                                                >

                                                    <span className=''>image</span>
                                                </a>
                                            </td>
                                            <td>{ChangeFormatDate2(ele?.createdAt)}</td>
                                            <th>{ele?.seller_contc_info?.email} | {ele?.seller_contc_info?.phone_no}</th>
                                            <th>
                                                <ul>
                                                    <li>
                                                        {ele?.manu_doc?.doc_file &&
                                                            <a
                                                                href={ele?.manu_doc?.doc_file}
                                                                target="_blank"
                                                            >

                                                                <span className=''><IoDocumentTextOutline size={20} /> <span>{ele?.manu_doc?.doc}</span> </span>
                                                            </a>
                                                        }
                                                    </li>
                                                    <li>
                                                        {ele?.dis_doc?.doc_file &&
                                                            <a
                                                                href={ele?.dis_doc?.doc_file}
                                                                target="_blank"
                                                            >

                                                                <span className=''><IoDocumentTextOutline size={20} /> <span>{ele?.dis_doc?.doc}</span> </span>
                                                            </a>
                                                        }
                                                    </li>
                                                </ul>
                                            </th>
                                            <td>{ele?.is_approved ? <span>Approved</span> : <span>Pending</span>}</td>
                                            <td>
                                                {ele?.is_approved ?
                                                    <Button size='sm' variant='outline-error' onClick={() => handleUpdateFunction(ele)}>Reject</Button>
                                                    :
                                                    <Button size='sm' variant='outline-success' onClick={() => handleUpdateFunction(ele)}>Approve</Button>
                                                }

                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
                <Toaster position="top-right" />
            </div>
        </>
    )
}
