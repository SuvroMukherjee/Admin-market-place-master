import React, { useEffect } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Container, Row, Form, ButtonGroup, Card } from 'react-bootstrap';
import { useState } from 'react';
import { SellerProductList } from '../../../API/api';

const NewSellerDashboard = () => {
    const navbarStyle = {
        paddingLeft: '0px', // Adjust the left padding
        paddingRight: '10px', // Adjust the right padding
        height: '15vh'
    };

    const [sellingProducts,setSellingProducts ] = useState(0);

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    useEffect(()=>{
        SellingProducts()
    },[])

    const SellingProducts = async() =>{
        await SellerProductList(userId).then((res) => {
            console.log(res?.data?.data, 'data')
            setSellingProducts(res?.data?.data?.length)
        }).catch((err) => {
            console.log(err)
        }).finally((data) => {
            
        })
    }

    const NumberBox = ({ icon, number, label }) => {
        return (
            <Card style={{ width: '10rem' }}>
                <Card.Body>
                    <h6>{label}</h6>
                    <h6 className="small">{number}</h6>
                </Card.Body>
            </Card>
        );
    };

  return (
    <div>
          <Navbar expand="lg" className="bg-body-tertiary" style={navbarStyle}>
              <Container>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" />
                  <Navbar.Collapse id="basic-navbar-nav">
                      <Nav className="me-auto">
                          <Nav.Link href="#home">Home</Nav.Link>
                          <Nav.Link href="#link">Category</Nav.Link>
                          <Nav.Link href="#link">Inventory</Nav.Link>
                          <Nav.Link href="#link">Order</Nav.Link>
                      </Nav>
                  </Navbar.Collapse>
              </Container>
              
          </Navbar>
          <Container className='mt-4'>
            <Row>
                <Col>
                      <NumberBox label={'order'} number={0}/>
                </Col>
                  <Col>
                      <NumberBox label={'Selling Products'} number={sellingProducts} />
                  </Col>
                  <Col>
                      <NumberBox label={'Total Sales'} number={0} />
                  </Col>
                  <Col>
                      <NumberBox label={'Customer Feedback'} number={0} />
                  </Col>
                  <Col>
                      <NumberBox label={'Total Balance'} number={0} />
                  </Col>
            </Row>
          </Container>
    </div>
  )
}

export default NewSellerDashboard