import React from 'react'
import { useEffect } from 'react';
import { Button, Col, Container, Row, Form, ButtonGroup, Card, ListGroup, Image, InputGroup } from 'react-bootstrap';
import { OwnProductSellerList } from '../../../API/api';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import noproduct from '../../../assets/noproduct.png'

const OwnproductStatus = () => {

    const [ownProduct, setOwnProduct] = useState([]);

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    useEffect(() => {
        getAllOwnProducts()
    }, [])

    async function getAllOwnProducts() {
        await OwnProductSellerList(userId).then((res) => {
            console.log(res?.data?.data, 'own data');
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            console.log({ dataWithUniqueIds })
            setOwnProduct(dataWithUniqueIds)
        }).catch((err) => {
            console.log(err)
        })
    }

    const navigate = useNavigate()

    return (
       
            <Container className='mt-4 p-4'>
            <Row className='mt-4'>
                    <Col xs={6}>
                        <InputGroup>
                            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            <Form.Control
                                placeholder="Username"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>
                    <Col>
                     <Button size="sm">Search</Button>
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col xs={6}>
                        <ListGroup>
                            {ownProduct?.length > 0 ? ownProduct?.map((ele) => (
                                <ListGroup.Item>{ele?.name}</ListGroup.Item>
                            )) :

                                <ListGroup>
                                    <ListGroup.Item className='text-center'>
                                        <Image src={noproduct} fluid width={200}/>
                                    </ListGroup.Item>
                                    <Button size='sm' onClick={() => navigate('/seller/seller-ownproduct')} variant='warning' className='dtextOredr'>Sell Your Product</Button>
                                </ListGroup>

                            }
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
       
    )
}

export default OwnproductStatus