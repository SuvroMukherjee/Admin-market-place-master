import { DataGrid } from "@mui/x-data-grid";
import "./sellerlayout.css";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Form, Card, ListGroup, InputGroup, Image, Table } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { SellerProductAdd, StatusUpdateProduct, allBrandList, allCategoryList, allProductList, deleteProduct, getSubCategoryByCategory, sellerProductDeatils } from "../../../API/api";
import Spinner from 'react-bootstrap/Spinner';
import { categoryData, demoProductData, productRows } from "../../../dummyData";
import Modal from 'react-bootstrap/Modal';
import { IoIosCloseCircle } from "react-icons/io";
import sellerback2 from '../../../assets/sellerback2.jpg'

//new
import Navbar from 'react-bootstrap/Navbar';
import { height } from "@mui/system";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FaSearch } from "react-icons/fa";
import Carousel from 'react-bootstrap/Carousel';
import { FaRegStar } from "react-icons/fa";



const SellerProductDetails = () => {

    const [product, setproduct] = useState()

    const { id: Pid } = useParams()

    useEffect(() => {
        getProductDeatils();
    }, [])

    async function getProductDeatils() {
        let res = await sellerProductDeatils(Pid);
        console.log(res?.data?.data)
        setproduct(res?.data?.data)
    }

    const navbarStyle = {
        paddingLeft: '0px', // Adjust the left padding
        paddingRight: '10px', // Adjust the right padding
        height: '7vh'
    };


    return (
        <div style={{ background: '#ffffff', height: '100vh' }}>
            <div>
                <Navbar expand="lg" className="bg-body-tertiary" style={navbarStyle}>
                    <Container>
                        <Navbar.Brand href="#home" className="Caption" >PRODUCT DETAILS</Navbar.Brand>
                    </Container>
                </Navbar>
            </div>
            <div>
                <Container>
                    <Row>
                        <Col xs={4} className="mt-4 p-4">
                            <SliderImage images={product?.SellerProductData?.specId?.image} />
                        </Col>

                        <Col className="mt-4 p-4">
                            <Row className="mt-2">
                                <Col className="sellerpName">{product?.SellerProductData?.name}</Col>
                            </Row>
                            <Row className="mt-2">
                                <h6><FaRegStar size={25} color='#FF9843' /> <FaRegStar size={25} color='#FF9843' /> <FaRegStar size={25} color='#FF9843' /> <FaRegStar size={25} color='#FF9843' /> <FaRegStar size={25} color='#FF9843' /> </h6>
                            </Row>
                            <Row className="mt-2">
                                <Col className="sellerpName2">
                                    <span> SKU : </span> {product?.SellerProductData?.specId?.skuId?.toUpperCase()}
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col className="sellerpName2">
                                    <span>PRICE : </span> <span className="avaible" style={{fontSize:'24px'}}> ₹ {product?.SellerProductData?.specId?.price?.toLocaleString()} </span>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col xs={12} className="sellerpName2">Description</Col>
                                <Col className="mt-2">
                                    {product?.SellerProductData?.productId.desc}
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col xs={12} className="sellerpName2">Specification</Col>
                                <Col>
                                    {product?.SellerProductData?.specId?.spec_det?.length > 0 && product?.SellerProductData?.specId?.spec_det?.map((ele) => (
                                        <Row className="sellerpName3 m-2">
                                            {ele?.title} : {ele?.value}
                                        </Row>
                                    ))}
                                </Col>
                            </Row>
                        </Col>

                    </Row>
                </Container>
            </div>
        </div>
    )
}


const SliderImage = ({ images }) => {
    return (
        <Carousel fade>
            {images?.length > 0 && images?.map((ele) => (
                <Carousel.Item>
                    <Image src={ele?.image_path} thumbnail fluid />
                </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default SellerProductDetails