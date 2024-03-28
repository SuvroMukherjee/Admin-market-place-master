import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Container, Row } from 'react-bootstrap';
import { TiTickOutline } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { getAllCampaignList, getAllCampaignSellerList } from '../../../API/api';

const AdvertisingProduct = () => {
    
    const [camplist, setcamplist] = useState([])

    useEffect(() => {
        getCampList();
        getSellerCampaignList();
    }, [])


    async function getCampList() {
        let res = await getAllCampaignList();
        setcamplist(res?.data?.data)
    }


    async function getSellerCampaignList(){
        let res = await getAllCampaignSellerList();
        console.log(res?.data?.data, 'data')
    }

    const navigate = useNavigate()


    const handleCampaingRedirec = (type,id) =>{
     
        if (type == 'Sponsored Products'){
            navigate(`/seller/select-campaign/${id}`)
        } else if(type == 'Sponsored Display'){
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
                                        <button className='w-100 cmpComtinue' onClick={() => handleCampaingRedirec(ele?.title,ele?._id)}>Continue</button>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} className='mt-2'>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header> Highlights</Accordion.Header>
                                                <Accordion.Body>
                                                    {ele?.highlight?.map((item) => (
                                                        <li style={{ listStyle: 'none' }}><span className='mx-2'><TiTickOutline className='tickIcon' size={20}/></span> {item}</li>
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
        </div>
    )
}

export default AdvertisingProduct