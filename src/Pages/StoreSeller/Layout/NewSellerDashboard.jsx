import React, { useEffect } from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Container, Row, Form, ButtonGroup, Card } from 'react-bootstrap';
import { useState } from 'react';
import { SellerProductList } from '../../../API/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NewSellerDashboard = () => {
    const navbarStyle = {
        paddingLeft: '0px', // Adjust the left padding
        paddingRight: '10px', // Adjust the right padding
        height: '15vh'
    };

    const navigate = useNavigate()

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
            <Card style={{ width: '12rem' }}>
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
                          <Nav.Link onClick={() => navigate('/seller/seller-dashboard')} >Home</Nav.Link>
                          <NavDropdown title="Catalogue" id="basic-nav-dropdown">
                              <NavDropdown.Item onClick={() => navigate('seller/seller-addproduct')}>Add Product</NavDropdown.Item>
                          </NavDropdown>
                          <NavDropdown title="Inventory" id="basic-nav-dropdown">
                              <NavDropdown.Item onClick={() => navigate('/seller/seller-productList')}>Manage Inventory</NavDropdown.Item>
                          </NavDropdown>
                          <Nav.Link onClick={() => navigate('/seller/seller-orderlist')}>Order</Nav.Link>
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
          <Container className='mt-4'> 
            <Row>
                <Col style={{height:'50vh',background:'red'}}>
                   <Container style={{background:'black'}}>
                      <Row>
                        data
                      </Row>
                   </Container>
                </Col>
                  <Col style={{ height: '50vh', background: 'blue' }}>
                      <Container style={{ background: 'grey' }}>
                          <Row>
                              <Col>Top Selling products</Col>
                          </Row>
                          <Row>
                            <Col></Col>
                          </Row>
                      </Container>
                  </Col>
            </Row>
          </Container>
    </div>
  )
}

export default NewSellerDashboard