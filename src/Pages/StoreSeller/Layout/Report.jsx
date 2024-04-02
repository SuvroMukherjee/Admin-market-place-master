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

        // let p = 0;

        // let s = 0 ;

        // res?.data?.data?.forEach(element => {
        //     element?.order_details?.forEach((ele) => {
        //         if (ele?.order_status == 'delivered'){
        //             s = s + (ele?.price * ele?.qty)
        //         }
        //     })
        // });

        // res?.data?.data?.forEach(element => {
        //     element?.order_details?.forEach((ele)=>{
        //         if (ele?.order_status == 'delivered') {
        //         p = p + ((ele?.price - ele?.proId?.comission_price) * ele?.qty)
        //         }
        //     })
        // });

        // console.log(s, 'total Sales')
        // console.log(p,'total profit')
    }


    const handleDateChange = (e) => {
        const { name, value } = e.target;
        // console.log({ value })
        // console.log({ maindata })
        //handledateOperation(value, type)

        setReportDate((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    console.log({ reportDate })

    const handledateOperation = async () => {
        console.log(reportDate?.start, reportDate?.end)

        let res = await ReportListsWithDate(reportDate?.start, reportDate?.end);

        console.log(res?.data?.data)
        setReports(res?.data)

        // let filterData = maindata?.filter((ele) => {
        //     const updatedAtDate = new Date(ele?.updatedAt);
        //     return updatedAtDate > targetDateStart && updatedAtDate < targetDateEnd;
        // });
        // console.log({ filterData })
        // setData(filterData)

    }

    console.log({ allorders })

    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

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
                                {/* <Col className='retext2'>Avg. units/order item</Col>
                                <Col className='retext2'>Avg. sales/order item</Col> */}
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
                                {/* <Col className='retext3'>{reports?.totalOrder}</Col>
                                <Col className='retext3'>{reports?.totalOrder}</Col> */}
                            </Row>
                        </Col>
                    </Row>
                </div>
                {/* <OrdersChart orders={allorders} /> */}
                <Row style={{ height: '100vh' }} className='mt-4'>
                    <Col xs={1} className='d-flex align-items-start justify-content-center'>Sales</Col>
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
                                <Bar dataKey="sales" fill="#31363F" activeBar={<Rectangle fill="orange" stroke="blue" />} />
                                <Bar dataKey="income" fill="#43ae00" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                    <Col xs={1} className='d-flex align-items-center justify-content-center'>Orders</Col>
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
                                {/* <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} /> */}
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

const OrdersChart = ({ orders }) => {
    // Extracting data from orders



    const orderLabels = orders.map(order => order._id); // Using order ID as labels
    const orderPrices = orders.map(order => order.price);

    console.log({ orderLabels })

    // Data for the chart
    const data = {
        labels: orderLabels,
        datasets: [
            {
                label: 'Total Price',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.4)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: orderPrices,
            },
        ],
    };

    return (
        <div>
            <h2>Orders Total Price Bar Chart</h2>
            <Bar
                data={data}
                width={100}
                height={50}
                options={{
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            type: 'category', // Specify the scale type as 'category'
                            ticks: {
                                autoSkip: false, // Prevent automatic skipping of labels
                            },
                        }],
                    },
                }}
            />
        </div>
    );
};

export default Report