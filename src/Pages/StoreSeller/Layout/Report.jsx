import React, { useEffect } from 'react'
import { Button, Card, Col, Container, Form, Image, InputGroup, ListGroup, Row, Table, Accordion } from 'react-bootstrap';
import { ReportLists, ReportListsWithDate, SellerProductList, campaignCreate, getAllCampaignList } from '../../../API/api';
import { useState } from 'react';
import { MdArrowDropDown } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { demoProductData } from '../../../dummyData';
import { ChangeFormatDate2, formatDateRemoveTime } from '../../../common/DateFormat';
import { RxCross2 } from "react-icons/rx";
import toast, { Toaster } from 'react-hot-toast';
// import { Bar } from 'react-chartjs-2';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Report = () => {

    const [reports, setReports] = useState([])
    const [reportDate, setReportDate] = useState([])
    const [allorders, setAllorders] = useState([])

    useEffect(() => {
        getReportListFunc();
    }, [])

    const getReportListFunc = async () => {
        let res = await ReportLists();
        console.log(res?.data?.data, 'reports')
        setReports(res?.data)
        let d = [];
        res?.data?.data.forEach((ele) => {
            ele?.order_details?.forEach((item,index) => {
                if (item?.order_status == 'delivered') {
                    console.log(item,index)
                    d.push({ order_id: item?._id, sales: item?.price * item?.qty, income: (item?.proId?.comission_price) * item?.qty, Quantiy: item?.qty, date: item?.order_delivery ? formatDateRemoveTime(item?.order_delivery) : formatDateRemoveTime(new Date()) })
                }
            })
        })

        setAllorders(d)
    }


    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setReportDate((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handledateOperation = async () => {
        console.log(reportDate?.start, reportDate?.end)

        let res = await ReportListsWithDate(reportDate?.start, reportDate?.end);
        let d = [];
        res?.data?.data.forEach((ele) => {
            ele?.order_details?.forEach((item, index) => {
                if (item?.order_status == 'delivered') {
                    console.log(item, index)
                    d.push({ order_id: item?._id, sales: item?.price * item?.qty, income: (item?.proId?.comission_price) * item?.qty, Quantiy: item?.qty, date: item?.order_delivery ? formatDateRemoveTime(item?.order_delivery) : formatDateRemoveTime(new Date()) })
                }
            })
        })

        setAllorders(d)
        setReports(res?.data)

    }

    console.log({ allorders })

    return (
        <div>
            <Container className='mt-4'>
                <Row>
                    <Col className='retext'>Sales Dashboard</Col>
                    <Col xs={4}>
                        <Row>
                            <Col>
                                <Button>Refresh</Button>
                            </Col>
                            <Col>
                                <Button>Download</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className='p-4 mt-4 mx-2 cont'>
                    <Row className='cont'>

                        <Col xs={4}>
                            <Form.Group controlId="date-to">
                                <Form.Label className="customDatelable">Start Date:</Form.Label>
                                <Form.Control type="date" className='tapG' name="start" onChange={(e) => handleDateChange(e)} />
                            </Form.Group>
                        </Col>
                        <Col xs={4}>
                            <Form.Group controlId="date-form">
                                <Form.Label className="customDatelable">End Date:</Form.Label>
                                <Form.Control
                                    type="date"
                                    className='tapG'
                                    name="end"
                                    // size="sm"
                                    onChange={(e) => handleDateChange(e)}
                                />
                            </Form.Group>
                        </Col>
                        <Col className="d-flex justify-content-start align-items-end cursor">
                            <Button size="sm" variant="secondary" onClick={() => handledateOperation()}>Apply</Button>
                        </Col>

                    </Row>
                </Row>
                <div className='mt-4 reptContainer'>
                    <Row className='reptContainerBtn mx-1 p-2'>
                        <Col className='retext'>Sales Snapshot</Col>
                    </Row>
                    <Row>
                        <Col className='p-2 mx-4'>
                            <Row>
                                <Col className='retext2'>Total orders</Col>
                                <Col className='retext2'>Unit Orders</Col>
                                <Col className='retext2'>Delivered Orders</Col>
                                <Col className='retext2'>Total Sales</Col>
                                <Col className='retext2'>Revenue</Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='p-2 mx-4'>
                            <Row>
                                <Col className='retext3'>{reports?.totalOrder}</Col>
                                <Col className='retext3'>{reports?.totalQuantity}</Col>
                                <Col className='retext3'>{reports?.totalDeliver}</Col>
                                <Col className='retext3'>₹ {reports?.totalsell?.toLocaleString()}</Col>
                                <Col className='retext3'>₹ {reports?.totalProfit?.toLocaleString()}</Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <Row className='mt-4 p-2'>
                    <Col className='d-flex align-items-center retext'>Campare Sales</Col>
                    <Col xs={6}></Col>
                    <Col xs={3}>
                      <Row>
                            <Col className='select-view'>Graph View</Col>
                            <Col className='not-select-view'>Table View</Col>
                      </Row>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col className='text-center ght'>Sale's Graph</Col>
                    <Col className='text-center ght'>Order's Graph</Col>
                </Row>
                <Row style={{ height: '100vh' }} className='mt-2'>
                    <Col  >
                        <ResponsiveContainer width="100%" height="60%">
                            <BarChart
                                width={1600}
                                height={600}
                                data={allorders}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#31363F" activeBar={<Rectangle fill="orange" stroke="blue" />} />
                                <Bar dataKey="income" fill="#43ae00" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>

                    <Col>
                        <ResponsiveContainer width="100%" height="60%">
                            <BarChart
                                width={1600}
                                height={600}
                                data={allorders}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Quantiy" fill="#007F73" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Report