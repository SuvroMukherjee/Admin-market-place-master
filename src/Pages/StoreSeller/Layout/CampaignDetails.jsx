import React, { useEffect } from 'react'
import { Button, Card, Col, Container, Form, Image, InputGroup, ListGroup, Row, Table, Accordion } from 'react-bootstrap';
import { SellerProductList, getAllCampaignList } from '../../../API/api';
import { useState } from 'react';
import { MdArrowDropDown } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";
import { Outlet, useNavigate } from 'react-router-dom';
import { demoProductData } from '../../../dummyData';
import { ChangeFormatDate2 } from '../../../common/DateFormat';
import { RxCross2 } from "react-icons/rx";

const CampaignDetails = () => {


    const [formData, setFormdata] = useState([])
    const [data, setData] = useState(demoProductData);
    const [loading, setLoading] = useState(true);
    const [productlists, setproductlists] = useState([])
    const [searchtext, setSearchtext] = useState();
    const [selectedOption, setSelectedOption] = useState('');

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

    const addProducttoList = (product) => {

        setproductlists([...productlists, product]);

    }

    const handleRemove = (id) => {

        let filterData = productlists?.filter((ele) => {
            return ele?._id != id;
        })
        setproductlists(filterData)
    }

    const isAdded = (id) => {
        let d = productlists?.find((ele) => {
            return ele?._id == id
        })

        return d ? true : false;
    }

    const handleSearch = () => {

        let filterData = data?.filter((ele) => {
            return ele?.name?.toLowerCase()?.includes(searchtext?.toLowerCase()) || ele?.specId?.skuId?.toLowerCase()?.includes(searchtext?.toLowerCase())
        })

        console.warn({ filterData });
        setData(filterData);
    }

    console.log({ productlists })

    return (
        <div className='stepContent'>
            <div className='campHead'>
                <Row className='mt-4'>
                    <Col><span className='mx-4'><RxCross2 size={25} /></span> New Campaign</Col>
                    <Col xs={4}>
                        <Row>
                            <Col className='campback text-center d-flex align-items-center'>Go back to campaigns</Col>
                            <Col className='cmplunch text-center'>Launch campaign</Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <Container className=''>
                <Form onSubmit={handleSubmit}>
                    <Row className='boredrCol mt-4'>
                        <Col className='mt-2'><h4>Products</h4></Col>
                         <hr/>
                        <Row className='p-4 mx-2'>
                            <Col className='boredrCol'>
                                <Row className="mt-4">
                                    <Col xs={6}>
                                        <Form.Control
                                            type="text"
                                            size="sm"
                                            placeholder="Search by SKU or Product name"
                                            name="searchtext"
                                            required
                                            value={searchtext}
                                            onChange={(e) => setSearchtext(e.target.value)}
                                        />
                                    </Col>
                                    <Col xs={2}>
                                        <Button variant="warning" size="sm" onClick={() => handleSearch()}>Search</Button>
                                    </Col>
                                    <Col xs={4}>
                                        <Button variant="dark" size="sm" onClick={() => { getProductListFunc(); setSearchtext('') }}>See All</Button>
                                    </Col>
                                </Row>
                                <hr/>
                                <Row className='plist'>
                                    <Col>
                                        <Row className="mt-2">
                                            <Col>
                                                <Table striped hover>
                                                    <tbody>
                                                        {data?.length > 0 && data?.map((ele, index) => (
                                                            <tr style={{ background: 'red' }}>
                                                                <td>
                                                                    <img src={ele?.specId?.image?.[0]?.image_path} className='adimg' />
                                                                </td>
                                                                <td onClick={() => navigate(`/seller/product-deatils/${ele?._id}`)}>{ele?.specId?.skuId}</td>
                                                                <td onClick={() => navigate(`/seller/product-deatils/${ele?._id}`)} className="pname">{ele?.productId?.brandId?.title} {ele?.name}</td>
                                                                <td className="avaible">
                                                                    {ele?.available_qty || 0}
                                                                </td>
                                                                <td>{ele?.price?.toLocaleString()}</td>
                                                                <td><Button size='sm' variant='secondary' onClick={() => addProducttoList(ele)} disabled={isAdded(ele?._id)}>
                                                                    {isAdded(ele?._id) ? 'Added' : 'Add'}</Button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className='boredrCol'>
                                <Row className='mt-2 p-2'>
                                    <Col xs={8}>{productlists?.length} Products Selected</Col>
                                    <Col onClick={() => setproductlists([])}>Remove All</Col>
                                </Row>
                                <hr/>
                                <Row className='mt-4 plist '>
                                    <Col >
                                        {productlists?.length > 0 && productlists?.map((ele, index) => (
                                            <>
                                                <Row>
                                                    <Col xs={1}> <img src={ele?.specId?.image?.[0]?.image_path} className='adimg' /></Col>
                                                    <Col xs={8} className='selectedPname d-flex align-items-center'>{ele?.name} {ele?.specId?.spec_det?.length > 0 && (
                                                        <span>
                                                            (
                                                            {ele?.specId?.spec_det.map((ele, index, array) => (
                                                                <span key={index}>
                                                                    {ele.value}
                                                                    {index < array.length - 1 ? ', ' : ''}
                                                                </span>
                                                            ))}
                                                            )
                                                        </span>

                                                    )} </Col>
                                                    <Col xs={1}><RxCross2 size={20} color='black' onClick={() => handleRemove(ele?._id)} style={{ cursor: 'pointer' }} /></Col>
                                                </Row>
                                                <hr />
                                            </>
                                        ))}

                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Row>


                    <Row className='boredrCol mt-4'>
                        <Row>
                            <Col className='mt-2'>
                                <h4>Targeting</h4>
                                </Col>
                        </Row>
                        <hr/>
                        <Row className='p-4'>

                            <Col xs={12} className="d-flex justify-content-start align-items-center">
                                <Form.Check
                                    type="radio"
                                    label="Automatic targeting"
                                    name="options"
                                    id="allRadio"
                                    className="customRadio"
                                    value="All"
                                    checked={selectedOption === 'All'}
                                    onChange={handleChange}
                                />
                                <Form.Text className='mx-2'>Amazon will target keywords and products that are similar to the product in your ad.</Form.Text>
                            </Col>
                            <Col xs={12} className="d-flex justify-content-start align-items-center">
                                <Form.Check
                                    type="radio"
                                    label="Manual targeting"
                                    name="options"
                                    id="inactiveRadio"
                                    className="customRadio"
                                    value="InActive"
                                    checked={selectedOption === 'InActive'}
                                    onChange={handleChange}
                                />
                                <Form.Text>Choose keywords or products to target shopper searches and set custom bids.</Form.Text>
                            </Col>
                        </Row>
                    </Row>

                    <Row className='boredrCol mt-4'>
                        <Row className='mt-2'>
                            <Col> <h4>Campaign Settings</h4></Col>
                        </Row>
                        <hr/>
                        <Row className='p-4'>
                            <Col xs={4}>
                                <Form.Group controlId="offerStartDate">
                                    <Form.Label> Start Date:</Form.Label>
                                    <Form.Control type="date" className='tapG' name="offer_start_date" value={formData.offer_start_date} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group controlId="offerStartDate">
                                    <Form.Label> Start Date:</Form.Label>
                                    <Form.Control type="date" className='tapG' name="offer_start_date" value={formData.offer_start_date} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                         </Row>
                    </Row>
                    <Row className='mt-4 mb-4'>
                        <Col xs={9}></Col>
                        <Col xs={3} style={{textAlign:'right'}}>
                            <button className='cmplunch2'>Launch Campaign</button></Col>
                    </Row>
                </Form>

            </Container>
        </div>
    )
}

export default CampaignDetails