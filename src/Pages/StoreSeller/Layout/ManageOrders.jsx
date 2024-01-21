import React, { useEffect, useState } from 'react'
import { sellerOrderLists, sellerStockoutlist } from '../../../API/api';
import { DataGrid } from "@mui/x-data-grid";
import { Button, Col, Container, Row, Form, ButtonGroup, Card, Image } from 'react-bootstrap';
import { ChangeFormatDate } from '../../../common/DateFormat';
import Table from 'react-bootstrap/Table';
import { MdArrowDropDownCircle } from "react-icons/md";

const ManageOrders = () => {

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    const [list, setList] = useState([])
    const [selectIndex, setSelectIndex] = useState()

    useEffect(() => {
        getOrdersist()
    }, [])

    const getOrdersist = async () => {
        let res = await sellerOrderLists(userId);
        console.log(res?.data?.data, 'seller orders')
        const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
            ...item,
            id: index + 1,
        }));
        setList(dataWithUniqueIds)
    }

    console.log({ list })




    return (
        <div>
            <Container className='mt-4'>
                <Row>
                    <Col className='dtext'>
                        Order List
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Order Amount</th>
                                    <th>Order date & time</th>
                                    <th>Customer Name</th>
                                    <th>Customer Phone</th>
                                    <th>Locality</th>
                                    <th>City</th>
                                    <th>Pincode</th>
                                    <th>Address</th>
                                    <th>Shipping Place</th>
                                    <th>Payment Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list?.length > 0 && list.map((row, index) => (
                                    <tr key={row.id}>
                                        <td className='orderId' onClick={() => setSelectIndex(index)}>{row?.order_no} <MdArrowDropDownCircle size={20}/> </td>
                                        <td className='orderPrice'>₹ {row?.order_price?.toLocaleString()}</td>
                                        <td>{ChangeFormatDate(row?.createdAt)}</td>
                                        <td>{row?.name}</td>
                                        <td>{row?.addressId?.ph_no}</td>
                                        <td>{row?.addressId?.locality}</td>
                                        <td>{row?.addressId?.city}</td>
                                        <td>{row?.addressId?.pincode}</td>
                                        <td>{row?.addressId?.address}</td>
                                        <td>{row?.addressId?.address_type?.toUpperCase()}</td>
                                        <td>{row?.payment_status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </Col>
                </Row>
                {console.log(list[selectIndex]?.order_details, 'l')}
                {selectIndex &&
                    <Row>
                        <Col className='mb-2 dtextOredr'>Order Id : <span style={{ color: '#FF9843' }}>{list[selectIndex]?.order_no}</span>  </Col>
                        <Col xs={12}>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>

                                        <th>Product Name</th>
                                        <th>Image</th>
                                        <th>Order Quantity</th>
                                        <th>SKU</th>
                                        <th>Order Quantity</th>
                                        <th>Price</th>
                                        <th>Shipping Cost</th>
                                        <th>Manage Order</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {list[selectIndex]?.order_details?.length > 0 && list[selectIndex]?.order_details?.map((row, index) => (
                                        <tr>

                                            <td>{row?.proId?.name}</td>
                                            <td><Image src={row?.proId?.specId?.image?.[0]?.image_path} thumbnail width={75}  /></td>
                                            <td>{row?.qty}</td>
                                            <td>{row?.proId?.specId?.skuId?.toUpperCase()}</td>
                                            <td>
                                                {row?.proId?.specId?.spec_det?.map((ele) => (
                                                    <li>{ele?.title} : {ele?.value}</li>
                                                ))}
                                            </td>
                                            <td>₹{row?.price?.toLocaleString()}</td>
                                            <td>{row?.total_shipping_price}</td>
                                            <td className="d-flex flex-column gap-1">

                                                <Button variant='outline-secondary' size="sm" className='orderpadding'>Order Packed</Button>
                                                <Button variant='outline-secondary' size="sm" className='orderpadding'>Order Packed</Button>
                                                <Button variant='outline-secondary' size="sm" className='orderpadding'>Order Packed</Button>
                                                <Button variant='outline-secondary' size="sm" className='orderpadding'>Order Packed</Button>

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>}
            </Container>
        </div>
    )
}

export default ManageOrders