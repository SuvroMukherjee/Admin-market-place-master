import React, { useEffect } from 'react'
import { Button, Card, Col, Container, Form, Image, InputGroup, ListGroup, Row, Table, Accordion } from 'react-bootstrap';
import { SellerProductList, getAllCampaignList } from '../../../API/api';
import { useState } from 'react';
import { MdArrowDropDown } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";
import { Outlet, useNavigate } from 'react-router-dom';
import { demoProductData } from '../../../dummyData';
import { ChangeFormatDate2 } from '../../../common/DateFormat';

const CampaignDetails = () => {


    const [formData, setFormdata] = useState([])
    const [data, setData] = useState(demoProductData);
    const [loading, setLoading] = useState(true);
    const [productlists,setproductlists] = useState([])

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    useEffect(() => {
        getProductListFunc();
    }, []);

    const navigate = useNavigate()

    async function getProductListFunc() {
        await SellerProductList(userId).then((res) => {
            console.log(res?.data?.data, 'data')
            const dataWithUniqueIds = res?.data?.data?.SellerProductData?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally((data) => {
            setLoading(false)
        })
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormdata((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
    }

    const addProducttoList = (product) =>{

        setproductlists([...productlists,product])

    }

    console.log({productlists})

    return (
        <div>
           <div>
            <Row>
                <Col><span></span> New Campaign</Col>
                <Col>
                  <Row>Go toast capaigns</Row>
                </Col>
            </Row>
           </div>
            <Container className='mt-4'>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col>Products</Col>
                    </Row>
                    <Row>
                        <Col>
                        <Row className="mt-2">
                    <Col>
                        <Table striped  hover>
                            {/* <thead>
                                <tr>
                                  
                                    <th>Image</th>
                                    <th>SKU</th>
                                    <th>Product Name</th>
                                    <th>Stock Available</th>                                  
                                    <th>Selling Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead> */}
                            <tbody>
                                {data?.length > 0 && data?.map((ele, index) => (
                                    <tr style={{ background: 'red' }}>
                                        <td>
                                            <img src={ele?.specId?.image?.[0]?.image_path} className='adimg'  />
                                        </td>
                                        <td onClick={() => navigate(`/seller/product-deatils/${ele?._id}`)}>{ele?.specId?.skuId}</td>
                                        <td onClick={() => navigate(`/seller/product-deatils/${ele?._id}`)} className="pname">{ele?.productId?.brandId?.title} {ele?.name}</td>
                                        <td className="avaible">
                                            {ele?.available_qty || 0}
                                        </td>
                                        <td>{ele?.price?.toLocaleString()}</td>
                                        <td><Button size='sm' variant='secondary' onClick={()=>addProducttoList(ele)}>Add</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                        </Col>
                        <Col>Added List</Col>
                    </Row>
                    <Row>
                        <Col>Targetting</Col>
                    </Row>
                    <Row>
                        <Col>1</Col>
                        <Col>1</Col>
                    </Row>
                    <Row>
                        <Col>Settings</Col>
                    </Row>
                    <Row>
                        <Col>start </Col>
                        <Col>end </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button>CANCEL</Button>
                            <Button>Laungue Campaign</Button>
                        </Col>
                    </Row>
                </Form>

            </Container>
        </div>
    )
}

export default CampaignDetails