import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Col, Container, Pagination, Row, Table } from 'react-bootstrap';
import { FaStar } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { SellerProductList, sellerDetails } from '../../../API/api';
import calender from '../../../assets/calendar.png'
import user from '../../../assets/user.png'
import placeholder from '../../../assets/placeholder.png'
import useAuth from '../../../hooks/useAuth';

const ServicesFeedback = () => {

    const { auth } = useAuth();
    const [productData, setProductData] = useState();
    const [reviewData, setReviewData] = useState([]);
    const [orderdata, setOrderdata] = useState()

    useEffect(() => {
        SellingProducts()
    }, [])

    const SellingProducts = async () => {

        await sellerDetails(auth?.userId).then((res) => {
            console.log(res?.data, 'data')
            setProductData(res?.data?.data?.SellerProductData)
            setReviewData(res?.data?.sellerReviewData)
            // CalculateAvgRating(res?.data?.data?.SellerProductData, res?.data?.data?.reviewData)
            setOrderdata(res?.data?.data?.orderData)
        }).catch((err) => {
            console.log(err)
        }).finally((data) => {

        })
    }

    console.log({ reviewData })


    const itemsPerPage = 5;  // You can adjust this based on your preference
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reviewData?.slice(indexOfFirstItem, indexOfLastItem);

    console.log(reviewData?.length)

    const totalPages = Math.ceil(reviewData?.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    const findOrderdate = (id) => {
        // let filter = orderdata?.map((ele) => {
        //     // Filter out order_details array based on sellerId
        //     ele.order_details = ele.order_details?.filter((item) => {
        //         if (item.proId?.available_qty == 48){
        //             alert('call',item)
        //         }
        //     });

        //     return ele;
        // }).filter(ele => ele.order_details.length > 0); // Remove objects with empty order_details array

        // console.log({filter})
    }

    return (
        <div>
            <Container className='mt-4'>
                <Row>
                    <Col className='dtext'>
                        Customer Feedback
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col>
                        <Table responsive>
                            <thead>
                                <tr>

                                    {/* <th>Customer Feedback</th> */}
                                    <th>Feedback</th>
                                    <th>User</th>
                                    <th>Rating</th>
                                    {/* <th>product</th>
                                    <th>SKU</th> */}
                                    {/* <th>Delivery date</th>
                                    <th>Visit on Site</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems?.length > 0 ? currentItems.map((row, index) => (
                                    <tr key={row.id} className='cusfeedtd'>

                                        <td className='cusfeedtd'>
                                            <div>
                                                <h4 className='cusfeedtd' style={{ width: '450px' }}>{row?.desc}</h4>
                                                <p className='cusfeedtd'><img src={calender} width={20} />  {moment(row?.createdAt).fromNow()}</p>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <p><img src={user} /> {row?.user?.name}</p>
                                                <p><img src={placeholder} width={15} /> {row?.user?.state}</p>
                                            </div>
                                        </td>
                                        <td><FaStar size={30} color='gold' /> {row?.rating}</td>
                                        {/* <td>{row?.proId?.name} {row?.proId?.specId?.spec_det?.length > 0 && (
                                            <span>
                                                (
                                                {row?.proId?.specId?.spec_det.map((ele, index, array) => (
                                                    <span key={index}>
                                                        {ele.value}
                                                        {index < array.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                                )
                                            </span>
                                        )}</td> */}
                                        {/* <td>{row?.proId?.specId?.skuId}</td> */}
                                        {/* <td>{row?.proId?.specId?.skuId} {findOrderdate(row?.proId?._id)} </td>
                                        <td>{row?.proId?.specId?.skuId}</td> */}
                                    </tr>
                                )) : <div>No Feedback Yet</div>}
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
            </Container>
        </div>
    )
}

export default ServicesFeedback