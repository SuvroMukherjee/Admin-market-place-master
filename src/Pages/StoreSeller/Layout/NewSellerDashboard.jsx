import React from 'react'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Container, Row, Form, ButtonGroup, Card } from 'react-bootstrap';

const NewSellerDashboard = () => {
    const navbarStyle = {
        paddingLeft: '0px', // Adjust the left padding
        paddingRight: '10px', // Adjust the right padding
        height: '15vh'
    };

    const NumberBox = ({ icon, number, label }) => {
        return (
            <Card style={{ width: '7rem',height:'25vh' }}>
                <Card.Body>
                    <h4>{label}</h4>
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
          <Container>
            <Row>
                <Col>
                      <NumberBox label={'order'} number={10}/>
                </Col>
                  <Col>
                      <NumberBox label={'order'} number={10} />
                  </Col>
                  <Col>
                      <NumberBox label={'order'} number={10} />
                  </Col>
                  <Col>
                      <NumberBox label={'order'} number={10} />
                  </Col>
                  <Col>
                      <NumberBox label={'order'} number={10} />
                  </Col>
            </Row>
          </Container>
    </div>
  )
}

export default NewSellerDashboard