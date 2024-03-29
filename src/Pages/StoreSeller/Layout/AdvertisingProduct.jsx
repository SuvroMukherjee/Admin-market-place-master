import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Container, Row } from 'react-bootstrap';
import { TiTickOutline } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { getAllCampaignList, getAllCampaignSellerList } from '../../../API/api';
import { ChangeFormatDate2 } from '../../../common/DateFormat';

const AdvertisingProduct = () => {

    const [camplist, setcamplist] = useState([])
    const [createdCamp, setCreatedCamp] = useState([])

    useEffect(() => {
        getCampList();
        getSellerCampaignList();
    }, [])


    async function getCampList() {
        let res = await getAllCampaignList();
        setcamplist(res?.data?.data)
    }


    async function getSellerCampaignList() {
        let res = await getAllCampaignSellerList();
        console.log(res?.data?.data, 'getSellerCampaignList')
        setCreatedCamp(res?.data?.data)
    }

    const navigate = useNavigate()

    const handleCampaingRedirec = (type, id) => {

        if (type == 'Sponsored Products') {
            navigate(`/seller/select-campaign/${id}`)
        } else if (type == 'Sponsored Display') {
            navigate(`/seller/display-campaign/${id}`)
        }

    }

    return (
        <div>
            <Container>
                <Row className='mt-4'>
                    <Col><h4> Choose your campaign type</h4></Col>
                </Row>
                <Row className='mt-4'>
                    {camplist?.length > 0 && camplist?.map((ele) => (
                        <Col>
                            <Card body>
                                <Row className='borderBottom'>
                                    <Col className='p-2 cmpgin-title mx-4'>{ele?.title}</Col>
                                </Row>
                                <Row>
                                    <Col className='text-center p-2'>
                                        <img src={ele?.image?.[0]?.file_path} width={200} height='auto' alt='cmp_img' />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='cmpgin-sub-title'>{ele?.desc}</Col>
                                </Row>
                                <Row>
                                    <Col className='mt-2'>
                                        <button className='w-100 cmpComtinue' onClick={() => handleCampaingRedirec(ele?.title, ele?._id)}>Continue</button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} className='mt-2'>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header> Highlights</Accordion.Header>
                                                <Accordion.Body>
                                                    {ele?.highlight?.map((item) => (
                                                        <li style={{ listStyle: 'none' }}><span className='mx-2'><TiTickOutline className='tickIcon' size={20} /></span> {item}</li>
                                                    ))}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            <Container className='mt-4 p-4' style={{ background: '#e6e5e5' }}>
                <Row>
                    <Col>
                        <p>Previously Created Campaign</p>
                    </Col>
                </Row>
                <Row className='mt-2'>
                    {createdCamp?.length > 0 && createdCamp?.map((ele) => (
                        <Col>
                            <Row>
                                <Col>Campaign Type</Col>
                                <Col>Product</Col>
                                <Col xs={1}>Banners</Col>
                                <Col>Start Date - End Date</Col>
                                <Col>Tragetting</Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h6>{ele?.campaignTypeId.title}</h6>
                                </Col>
                                <Col>
                                    {ele?.[ele?.campaignTypeId.camptype]?.productId?.name}
                                </Col>
                                <Col xs={1}>
                                    <a href={ele?.[ele?.campaignTypeId.camptype]?.image?.[0]?.image_path} target="_blank"><span className=''>Banner</span></a>
                                </Col>
                                <Col>
                                    {ChangeFormatDate2(ele?.[ele?.campaignTypeId.camptype]?.settings?.startdate)} - {ChangeFormatDate2(ele?.[ele?.campaignTypeId.camptype]?.settings?.enddate)}
                                </Col>
                                <Col>
                                    {ele?.[ele?.campaignTypeId.camptype]?.targetValue}
                                </Col>
                            </Row>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    )
}

export default AdvertisingProduct