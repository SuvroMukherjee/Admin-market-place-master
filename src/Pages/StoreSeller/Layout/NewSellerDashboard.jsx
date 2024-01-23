import React, { useEffect } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Container, Row, Form, ButtonGroup, Card, Image } from 'react-bootstrap';
import { useState } from 'react';
import { SellerProductList, sellerStockoutlist } from '../../../API/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { ChangeFormatDate } from '../../../common/DateFormat';
import { FaArrowUpRightDots } from "react-icons/fa6";
import { MdBookmarkBorder } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { FaCartFlatbed } from "react-icons/fa6";
import { GoArrowUpRight } from "react-icons/go";
import Dropdown from 'react-bootstrap/Dropdown';

const NewSellerDashboard = () => {
    const navbarStyle = {
        paddingLeft: '0px', // Adjust the left padding
        paddingRight: '10px', // Adjust the right padding
        height: '7vh',
        background: 'black'
    };

    const navigate = useNavigate()

    const [sellingProducts, setSellingProducts] = useState(0);
    const [data,setdata] = useState()
    const [list, setList] = useState([])

    const [totalSales,setTotalSales] = useState(0)
    const [totalcommission,settotalcommission] = useState(0)

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    useEffect(() => {
        SellingProducts()
    }, [])

    const SellingProducts = async () => {
        await SellerProductList(userId).then((res) => {
            console.log(res?.data?.data, 'data')
            setSellingProducts(res?.data?.data?.length)
            setdata(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        }).finally((data) => {

        })
    }

    const NumberBox = ({ icon, number, label }) => {
        return (
            <Card style={{ width: '12rem' }} className='shadowbox'>
                <Card.Body>
                    <p className='dtext'>{label?.toUpperCase()}</p>
                    {label != 'Customer Feedback' && 
                    <h6 className="dtextNumber">{number}</h6>}
                    {label == 'Customer Feedback' && 
                        <h6><FaRegStar color='#FF9843' /> <FaRegStar color='#FF9843' /> <FaRegStar color='#FF9843' /> <FaRegStar color='#FF9843' /> <FaRegStar color='#FF9843' /> </h6>}
                </Card.Body>
            </Card>
        );
    };


   

    useEffect(() => {
        getOrdersist()
    }, [])

    const getOrdersist = async () => {
        let res = await sellerStockoutlist(userId);
        console.log(res?.data?.data, 'order')
        const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
            ...item,
            id: index + 1,
        }));

        setTotalSales(Math.round(res?.data?.totalsellingAmount))
        settotalcommission(Math.round(res?.data?.totalcommission))

        setList(dataWithUniqueIds)
    }

    return (
        <div style={{ background: '#f5f1f1' }}>
            {/* <Navbar expand="lg" className="" style={navbarStyle}>
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ background: 'black' }} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => navigate('/seller/seller-dashboard')} className='dtext'>Home</Nav.Link>
                            <NavDropdown title="Catalogue" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate('/seller/seller-addproduct')}>Add Product <GoArrowUpRight size={20} /> </NavDropdown.Item>
                                <Dropdown.Divider />
                                <NavDropdown.Item onClick={() => navigate('/seller/seller-ownproduct-status')}>Sell Your Product <GoArrowUpRight size={20} /> </NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Inventory" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate('/seller/seller-productList')}>Manage Inventory <GoArrowUpRight size={20} /> </NavDropdown.Item>
                                <Dropdown.Divider />
                            </NavDropdown>
                            <NavDropdown title="Orders" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate('/seller/seller-orderlist')}>Orders Lists <GoArrowUpRight size={20} /> </NavDropdown.Item>
                                <Dropdown.Divider />
                                <NavDropdown.Item onClick={() => navigate('/seller/manage-orders')}>Manage Orders <GoArrowUpRight size={20} /> </NavDropdown.Item>
                            </NavDropdown>
                         
                            <Nav.Link >Customer Feedback</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar> */}
            <Container className='mt-4'>
                <Row>
                    <Col>
                        <NumberBox  label={'Total Orders'} number={list?.length} />
                    </Col>
                    <Col>
                        <NumberBox label={'Selling Products'} number={sellingProducts} />
                    </Col>
                    <Col>
                        <NumberBox label={'Total Sales'} number={totalSales?.toLocaleString()} />
                    </Col>
                    <Col>
                        <NumberBox label={'Customer Feedback'} number={0} />
                    </Col>
                    <Col>
                        <NumberBox label={'Total Balance'} number={totalcommission?.toLocaleString()} />
                    </Col>
                </Row>
            </Container>
            <Container className='mt-4'>
                <Row>
                    <Col className='p-2' xs={7}>
                        <Container>
                            <Row className='mt-4'>
                                <Col className='dtext2'>Top Selling Products <span><FaArrowUpRightDots color='red' size={24} /></span></Col>
                            </Row>
                            <hr/>
                            <Row className='mt-2'>
                                <Col>
                                    <SellingProductList data={data} />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col  className='p-2'>
                        <Container>
                            <Row className='mt-4'>
                                <Col className='dtext2'>Recent Orders <span><FaCartFlatbed color='red' size={24} /></span></Col>
                            </Row>
                            <hr />
                            <Row className='mt-2'>
                                <Col>
                                    <OrderConatiner list={list} />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}


const OrderConatiner = ({ list }) => {
    const navigate = useNavigate()
    return (
        <>
            <Table striped bordered hover responsive className='shadowbox2'>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th className='pname'>Product Image</th>
                        <th className='pname'>SKU</th>
                        <th>Order Quantity</th>
                        <th>Price</th>
                        <th>Order Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((row) => (
                        <tr key={row.id}>
                            <td className='pname' onClick={() => navigate(`/seller/product-deatils/${row?._id}`)}>{row.productId ? row.productId.name : ''}</td>
                            <td>
                                <Image src={row.productId?.specId?.image?.[0]?.image_path} thumbnail width={40} height={40} />
                            </td>
                            <td className='pname' onClick={() => navigate(`/seller/product-deatils/${row?._id}`)}>{row.productId?.specId?.skuId?.toUpperCase()}</td>
                            <td className='avaible'>{row.quantity}</td>
                            <td className='avaible'> {row.productId?.price?.toLocaleString()}</td>
                            <td className='datecolor'>{ChangeFormatDate(row.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

const SellingProductList = ({ data }) =>{

    console.log({data})
    const navigate = useNavigate()
    return (
        <div>
            <Table striped bordered hover  className='shadowbox'>
                <thead>
                    <tr>
                        
                        <th>Image</th>
                        <th>SKU</th>
                        <th>Product Name</th>
                        <th>Selling Price</th>
                        <th>In Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.length > 0 && data?.slice(0,5)?.map((ele, index) => (
                        <tr>
                            
                            <td>
                                <Image src={ele?.specId?.image?.[0]?.image_path} thumbnail width={60} height={60} />
                            </td>
                            <td className='pname' onClick={() => navigate(`/seller/product-deatils/${ele?._id}`)}>{ele?.specId?.skuId?.toUpperCase()}</td>
                            <td className="pname" onClick={() => navigate(`/seller/product-deatils/${ele?._id}`)}>{ele?.name}</td>
                            <td>
                             {ele?.price?.toLocaleString()}
                            </td>
                            <td className='avaible'>
                                {ele?.available_qty || 0}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}


export default NewSellerDashboard