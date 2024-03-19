import React, { useEffect } from 'react'
import { Button, Card, Col, Container, Form, Image, InputGroup, ListGroup, Row, Table, Accordion } from 'react-bootstrap';
import { getAllCampaignList } from '../../../API/api';
import { useState } from 'react';
import { MdArrowDropDown } from "react-icons/md";
import { TiTickOutline } from "react-icons/ti";
import { Outlet, useNavigate } from 'react-router-dom';

const CampaignDetails = () => {


    const [formData, setFormdata] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formdata);
    }

    return (
        <div>
           <div>
            <Row>
                <Col><span></span> New Campaign</Col>
                <Col>
                  <Row>Go toast capaigns</Row>
                </Col>
            </Row>
           </div>
            <Container className='mt-4'>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col>Products</Col>
                    </Row>
                    <Row>
                        <Col>list</Col>
                        <Col>Added List</Col>
                    </Row>
                    <Row>
                        <Col>Targetting</Col>
                    </Row>
                    <Row>
                        <Col>1</Col>
                        <Col>1</Col>
                    </Row>
                    <Row>
                        <Col>Settings</Col>
                    </Row>
                    <Row>
                        <Col>start </Col>
                        <Col>end </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button>CANCEL</Button>
                            <Button>Laungue Campaign</Button>
                        </Col>
                    </Row>
                </Form>

            </Container>
        </div>
    )
}

export default CampaignDetails