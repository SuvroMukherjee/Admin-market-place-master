import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Col, Container, Pagination, Row, Table } from 'react-bootstrap';
import { FaStar } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { SellerProductList } from '../../../API/api';

const Customerfeedback = () => {

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    const [productData,setProductData] = useState();
    const [reviewData,setReviewData] = useState([])

    useEffect(() => {
        SellingProducts()
    }, [])

    const SellingProducts = async () => {
        await SellerProductList(userId).then((res) => {
            console.log(res?.data?.data, 'data')
            setProductData(res?.data?.data?.SellerProductData)
            setReviewData(res?.data?.data?.reviewData)
            // CalculateAvgRating(res?.data?.data?.SellerProductData, res?.data?.data?.reviewData)
        }).catch((err) => {
            console.log(err)
        }).finally((data) => {

        })
    }

    console.log({reviewData})


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
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Customer Feedback</th>
                                    <th>Customer</th>
                                    <th>Rating</th>
                                    <th>product</th>
                                    <th>SKU</th>
                                    <th>Delivery date</th>
                                    <th>Visit on Site</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems?.length ? currentItems.map((row,index) => (
                                    <tr key={row.id}>
                                        <td>{index+1}</td>
                                        <td> 
                                            <div>
                                                <h6>{row?.title}</h6>
                                                <p>{row?.desc}</p>
                                                <p><SlCalender/> {moment(row?.createdAt).fromNow()}</p>
                                            </div>
                                            </td>
                                        <td>
                                           <div>
                                             <p>{row?.user?.name}</p>
                                                <p>{JSON.parse(row?.user?.address)?.state}</p>
                                           </div>
                                        </td>
                                        <td><FaStar /> {row?.rating}</td>
                                        <td>{row?.proId?.name} {row?.proId?.specId?.spec_det?.length > 0 && (
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
                                        )}</td>
                                        <td>{row?.proId?.specId?.skuId}</td>
                                        <td>{row?.proId?.specId?.skuId}</td>
                                        <td>{row?.proId?.specId?.skuId}</td>
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

export default Customerfeedback