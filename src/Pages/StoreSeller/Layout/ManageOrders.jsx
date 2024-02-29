import React, { useEffect, useState } from 'react'
import { commandOnOrder, orderStatusUpdate, sellerOrderLists, sellerStockoutlist } from '../../../API/api';
import { DataGrid } from "@mui/x-data-grid";
import { Button, Col, Container, Row, Form, ButtonGroup, Card, Image } from 'react-bootstrap';
import { ChangeFormatDate } from '../../../common/DateFormat';
import { Table, Pagination } from 'react-bootstrap';
import { MdArrowDropDownCircle } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";

const ManageOrders = () => {

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    const [list, setList] = useState([])
    const [selectIndex, setSelectIndex] = useState()
    const [showCommentIndex,setCommentIndx] = useState();
    const [showCommentBoxText, SetshowCommentBoxText] = useState('')

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

        console.log({ dataWithUniqueIds })

        // let filteredOrders = dataWithUniqueIds?.map((ele) => {
        //     // Filter out order_details array based on sellerId
        //     ele.order_details = ele.order_details?.filter((item) => {
        //         return item.sellerId === "65bb2b0949aa020e01f2c1cb";
        //     });

        //     return ele;
        // }).filter(ele => ele.order_details.length > 0); // Remove objects with empty order_details array

        // console.log({filteredOrders});

        // let f = dataWithUniqueIds?.map((ele) => {
        //     ele?.order_details?.filter((item) => {
        //         if (item?.sellerId != "65bb2b0949aa020e01f2c1cb") {
        //             // console.log(ele, 'ele');
        //             return ele;
        //         }
        //         // Make sure to return something from the filter callback

        //     });
        // });


        // console.log({f})

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
        // window.location.reload();
        getOrdersist();





    }


    const IsallOrderPackedFunc = (data) => {
        console.log(data?.order_status,'o')
        console.log(data.order_status != 'order_placed' && data?.order_status != 'cancel','ll')
        return (data.order_status != 'order_placed' && data?.order_status != 'cancel' );
    }


    const itemsPerPage = 5;  // You can adjust this based on your preference
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = list?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(list?.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const OrderSequence = (status) => { //"order_placed"
        switch (status) {
            case "order_placed":
                return "Pack Your Order";
            case "order_packed":
                return "Shipping Order";
            case "shipped":
                return "Deliver Order";
            case "delivered":
                return "Order Delivered";
            case "cancel":
                return "Order Cancel";
            default:
                return "Unknown Status";
        }
    }


    const OrderSequenceStatus = (status) => {
        switch (status) {
            case "order_placed":
                return "order_packed";
            case "order_packed":
                return "shipped";
            case "shipped":
                return "delivered";
            case "delivered":
                return "Order Delivered";
            case "cancel":
                return "Order Cancel";
            default:
                return "Unknown Status";
        }
    }


    function calculateDateDifference(startDateString, endDateString) {
        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString);

        const timeDifference = Math.abs(endDate - startDate);
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference >= 1) {
            return `${daysDifference} day${daysDifference > 1 ? 's' : ''}`;
        } else {
            const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
            return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''}`;
        }
    }


    const showCommentBox = (index) =>{
        setCommentIndx(index)
    }


    const handleCommand = async(orderId,proId) =>{
        console.log({ orderId })
        let payload = {
            proId: proId,
            comment: showCommentBoxText
        }

        let res = await commandOnOrder(orderId,payload);
        
        console.log(res,'res')

        getOrdersist();
        
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
                                {currentItems?.length > 0 && currentItems.map((row, index) => (
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
                                        <td>{row?.payment_status == 'unpaid' ? 'COD' : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Pagination size="sm">
                            <Pagination.Prev
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item

                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </Col>
                </Row>

                {list[selectIndex]?.order_details?.length > 0 &&
                    <Row>
                        <Col className='mb-2 dtextOredr'>Order Id : <span style={{ color: '#FF9843' }}>{list[selectIndex]?.order_no}</span>  </Col>
                        {list[selectIndex]?.order_details?.every(IsallOrderPackedFunc) &&
                            <Row className='p-2 mt-2 mb-4 cdetailsbg'>
                                <Col className='dtext' xs={4}>
                                    <Row>
                                        <Col>Customer Details</Col>
                                    </Row>
                                    <Row className='mt-3'>
                                        <Col className='orderId'> {list[selectIndex]?.order_no}</Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row >
                                        <Col className='dtext' xs={3}>Name</Col>
                                        <Col className='dtext'>Phone</Col>
                                        <Col className='dtext'>City</Col>
                                        <Col className='dtext' xs={3}>Locality</Col>
                                        <Col className='dtext'>Shipping Place</Col>
                                    </Row>
                                    <Row>
                                        <Col className='cdetails' xs={3}>{list[selectIndex]?.addressId?.name}</Col>
                                        <Col className='cdetails'>{list[selectIndex]?.addressId?.ph_no}</Col>
                                        <Col className='cdetails'>{list[selectIndex]?.addressId?.city}</Col>
                                        <Col xs={3} className='cdetails'>{list[selectIndex]?.addressId?.locality}</Col>
                                        <Col className='cdetails'>{list[selectIndex]?.addressId?.address_type}</Col>

                                    </Row>
                                </Col>
                            </Row>

                        }
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
                                {console.log(list[selectIndex], 'index')}
                                <tbody>
                                    {list[selectIndex]?.order_details?.length > 0 && list[selectIndex]?.order_details?.map((row, index) => (
                                        <>

                                            <tr>

                                                <td>{row?.proId?.name}</td>
                                                <td><Image src={row?.proId?.specId?.image?.[0]?.image_path} thumbnail width={100} style={{ objectFit: 'contain', height: '120px' }} /></td>
                                                <td>{row?.qty}</td>
                                                <td>{row?.proId?.specId?.skuId?.toUpperCase()}</td>
                                                <td>
                                                    {row?.proId?.specId?.spec_det?.map((ele) => (
                                                        <li>{ele?.title} : {ele?.value}</li>
                                                    ))}
                                                </td>
                                                <td>₹{row?.price?.toLocaleString()}</td>
                                                <td>{row?.total_shipping_price}</td>

                                                <td className='estTime'>
                                                    {/* {row?.order_delivery && row?.order_status == 'delivered' && ChangeFormatDate(row?.estimited_delivery) }  */}
                                                    <p style={{ color: 'green' }}>
                                                        {/* {OrderSequence(row?.order_status)} Estimation */}
                                                        {row?.order_status != 'delivered' && ` ${OrderSequence(row?.order_status)} Estimation`} <br/>
                                                        {row?.order_status != 'delivered' && ChangeFormatDate(row?.estimited_delivery)} 
                                                        {/* {row?.order_delivery && row?.order_status == 'delivered' ? `Delivery date: ${ChangeFormatDate(row?.order_delivery)}` : ''} */}
                                                    </p>
                                                    {row?.order_delivery && row?.order_status == 'delivered' && <span>Delivered : {ChangeFormatDate(row?.order_delivery)}</span>}
                                                    {row?.order_delivery && row?.order_status == 'delivered' ?
                                                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'black', textTransform: 'uppercase' }}> (Delivered In <span style={{ color:'#2874f0'}}>{calculateDateDifference(row?.order_delivery, list[selectIndex]?.createdAt)}</span> )</span> 
                                                        : ''}

       
                                                    <div onClick={() => showCommentBox(row?._id)} style={{cursor:'pointer'}}>
                                                        <IoIosInformationCircle size={20} color='black'/> <span className='mx-2' style={{color:'black'}}>Add your Reason</span>
                                                    </div>
                                                    {showCommentIndex == row?._id && 
                                                    <>
                                                        <div className='mt-2'>
                                                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                                                <Form.Control size='sm' placeholder='Enter your comment..' onChange={(e) => SetshowCommentBoxText(e.target.value)} as="textarea" rows={3} />
                                                            </Form.Group>
                                                        </div>
                                                        <button onClick={() => handleCommand(list[selectIndex]?._id,row?.proId?._id)} className='savebtn'>save</button>
                                                    </>
                                                    }
                                                    {row?.comment}
                                                </td>

                                                <td className="d-flex flex-column gap-2">
                                                    <Button
                                                        variant='success'
                                                        size='sm'
                                                        className='orderpadding'
                                                        onClick={() => handleStatusUpdate(list[selectIndex]?._id, row?.proId?._id, OrderSequenceStatus(row?.order_status))}
                                                        disabled={row?.order_status == 'cancel'}
                                                    >
                                                        {OrderSequence(row?.order_status)}
                                                    </Button>

                                                    <Button variant="danger" size="sm" className='orderpadding' onClick={() => handleStatusUpdate(list[selectIndex]?._id, row?.proId?._id, 'cancel')} >Order Cancel</Button>

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
            </Container>
        </div>
    )
}

export default ManageOrders