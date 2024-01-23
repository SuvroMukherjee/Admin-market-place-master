import React, { useEffect, useState } from 'react'
import { orderStatusUpdate, sellerOrderLists, sellerStockoutlist } from '../../../API/api';
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


    const handleStatusUpdate = async (OId, product, status) => {

        let payload = {

            "proId": product,
            "order_status": status

        }

        let res = await orderStatusUpdate(payload, OId);

        console.log(res)


    }


    const IsallOrderPackedFunc = (data) => {
        console.log(data)
        return (data.order_status == 'order_packed');
    }


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
                                    {/* <th>Customer Name</th>
                                    <th>Customer Phone</th>
                                    <th>Locality</th>
                                    <th>City</th> */}
                                    <th>Pincode</th>
                                    <th>Address</th>
                                    {/* <th>Shipping Place</th> */}
                                    <th>Payment Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list?.length > 0 && list.map((row, index) => (
                                    <tr key={row.id}>
                                        <td className='orderId' onClick={() => setSelectIndex(index)}>{row?.order_no} <MdArrowDropDownCircle size={20} /> </td>
                                        <td className='orderPrice'>₹ {row?.order_price?.toLocaleString()}</td>
                                        <td>{ChangeFormatDate(row?.createdAt)}</td>
                                        {/* <td>{row?.name}</td>
                                        <td>{row?.addressId?.ph_no}</td>
                                        <td>{row?.addressId?.locality}</td>
                                        <td>{row?.addressId?.city}</td> */}
                                        <td>{row?.addressId?.pincode}</td>
                                        <td>{row?.addressId?.address}</td>
                                        {/* <td>{row?.addressId?.address_type?.toUpperCase()}</td> */}
                                        <td>{row?.payment_status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                    </Col>
                </Row>
                {list[selectIndex]?.order_details?.length > 0 &&
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
                                        <th>Estimated Date & Time</th>
                                        <th>Manage Order</th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {list[selectIndex]?.order_details?.length > 0 && list[selectIndex]?.order_details?.map((row, index) => (
                                        <>

                                            <tr>

                                                <td>{row?.proId?.name}</td>
                                                <td><Image src={row?.proId?.specId?.image?.[0]?.image_path} thumbnail width={100} /></td>
                                                <td>{row?.qty}</td>
                                                <td>{row?.proId?.specId?.skuId?.toUpperCase()}</td>
                                                <td>
                                                    {row?.proId?.specId?.spec_det?.map((ele) => (
                                                        <li>{ele?.title} : {ele?.value}</li>
                                                    ))}
                                                </td>
                                                <td>₹{row?.price?.toLocaleString()}</td>
                                                <td>{row?.total_shipping_price}</td>
                                                <td>{ChangeFormatDate(row?.estimited_delivery)}</td>
                                                <td className="d-flex flex-column gap-1">
                                                    {/* <Button variant={row?.order_status == 'confirmed' ? 'secondary' : 'outline-success'} size="sm" className='orderpadding' onClick={() => handleStatusUpdate(list[selectIndex]?._id, row?.proId?._id, 'confirmed')} disabled={row?.order_status == 'confirmed'}>Confirm Order</Button> */}

                                                    <Button variant={row?.order_status == 'order_packed' ? 'secondary' : 'outline-success'} size="sm" className='orderpadding' onClick={() => handleStatusUpdate(list[selectIndex]?._id, row?.proId?._id, 'order_packed')} disabled={row?.order_status == 'order_packed'}>Order Packed</Button>

                                                    <Button variant={row?.order_status == 'shipped' ? 'secondary' : 'outline-success'} size="sm" className='orderpadding' onClick={() => handleStatusUpdate(list[selectIndex]?._id, row?.proId?._id, 'shipped')} disabled={row?.order_status == 'shipped'}>Order Shipped</Button>

                                                    <Button variant={row?.order_status == 'delivered' ? 'secondary' : 'outline-success'} size="sm" className='orderpadding' onClick={() => handleStatusUpdate(list[selectIndex]?._id, row?.proId?._id, 'delivered')} disabled={row?.order_status == 'delivered'}>Order Deliverd</Button>

                                                    <Button variant={row?.order_status == 'cancel' ? 'secondary' : 'outline-success'} size="sm" className='orderpadding' onClick={() => handleStatusUpdate(list[selectIndex]?._id, row?.proId?._id, 'cancel')} disabled={row?.order_status == 'cancel'}>Order Cancel</Button>

                                                    <Button variant='outline-secondary' size="sm" className='orderpadding'>Order Refund</Button>
                                                    <Button variant='outline-secondary' size="sm" className='orderpadding'>Print Tax Invoice</Button>

                                                </td>
                                            </tr>

                                        </>



                                    ))}
                                </tbody>
                                

                            </Table>
                        </Col>
                    </Row>}
                    
                    {list[selectIndex]?.order_details?.every(IsallOrderPackedFunc) &&
                    <Row className='p-4 mt-2 mb-4 cdetailsbg'>
                            <Col className='dtext' xs={5}>
                                <Row>
                                    <Col>Customer Details</Col>
                                </Row>
                                <Row className='mt-3'>
                                    <Col className='orderId'> {list[selectIndex]?.order_no}</Col>
                                </Row>
                            </Col>
                            <Col>
                            <Row >
                                    <Col className='dtext'>Name</Col>
                                    <Col className='dtext'>Phone</Col>
                                    <Col className='dtext'>City</Col>
                                    <Col className='dtext' xs={3}>Locality</Col>
                                    <Col className='dtext'>Shipping Place</Col>
                              </Row>
                              <Row>
                                    <Col className='cdetails'>{list[selectIndex]?.addressId?.name}</Col>
                                    <Col className='cdetails'>{list[selectIndex]?.addressId?.ph_no}</Col>
                                    <Col className='cdetails'>{list[selectIndex]?.addressId?.city}</Col>
                                    <Col xs={3} className='cdetails'>{list[selectIndex]?.addressId?.locality}</Col>
                                    <Col className='cdetails'>{list[selectIndex]?.addressId?.address_type}</Col>
                                    
                              </Row>
                            </Col>
                        </Row>
                    }
                    
            </Container>
        </div>
    )
}

export default ManageOrders