import React, { useEffect } from 'react'
import { Button, Card, Col, Container, Form, Image, InputGroup, ListGroup, Row, Table, Accordion } from 'react-bootstrap';
import { SellerProductList, campaignCreate, getAllCampaignList } from '../../../API/api';
import { useState } from 'react';
import { MdArrowDropDown } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { demoProductData } from '../../../dummyData';
import { ChangeFormatDate2 } from '../../../common/DateFormat';
import { RxCross2 } from "react-icons/rx";
import toast, { Toaster } from 'react-hot-toast';


const Report = () => {
    return (
        <div>
            <Container className='mt-4'>
                <Row>
                    <Col>Sales Dashboard</Col>
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
                <Row>
                    <Col>
                       
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Report