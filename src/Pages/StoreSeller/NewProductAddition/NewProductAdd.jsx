import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import React from 'react'
import { NavLink } from "react-router-dom";
import './newproduct.css'

const NewProductAdd = () => {

  const [userInfo, setUserInfo] = useState({
    user_name: '',
    email: '',
    phone_no: '',
    password: ''
});

  return (
    <div>
      <Container>
        <Row className='p-4'>
          <Col xs={10}>
            <ul className='d-flex justify-content-evenly liststyle'>
              <li>
                <NavLink to="/">Product Identity</NavLink>
              </li>
              <li>
                <NavLink to="service">Description</NavLink>
              </li>
              <li>
                <NavLink to="about">Product Details</NavLink>
              </li>
              <li>
                <NavLink to="about">Offers</NavLink>
              </li>
              <li>
                <NavLink to="about">Safety & Complains</NavLink>
              </li>
            </ul>
          </Col>
        </Row>

        <Row className='mt-4'>
          <Container>
          <Form >
                        <Row className='mt-3'>
                            <Col xs={6}>
                                <Form.Group controlId="user_name">
                                    <Form.Label className='frmLable'>Company Busniess Name <span className="req">*</span></Form.Label>
                                    <Form.Control type="text" name="user_name" className='tapG' placeholder='Enter Your Username' size='sm' value={userInfo.user_name} onChange={handleChange} required autoComplete='off' />
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group controlId="email">
                                    <Form.Label className='frmLable'>Email <span className="req">*</span> </Form.Label>
                                    <Form.Control type="email" name="email" size='sm' className='tapG' placeholder='Enter Your Email' value={userInfo.email} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-3'>
                            <Col xs={6}>
                                <Form.Group controlId="phone_no">
                                    <Form.Label className='frmLable'>Phone Number <span className="req">*</span> </Form.Label>
                                    <Form.Control type="tel" name="phone_no" size='sm' className='tapG' placeholder='Enter Your Phone No.' value={userInfo.phone_no} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group controlId="password">
                                    <Form.Label className='frmLable'>Password <span className="req">*</span> </Form.Label>
                                    <Form.Control type="password" name="password" size='sm' className='tapG' placeholder='Enter Your Password' value={userInfo.password} onChange={handleChange} required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='mt-5'>
                            <Col className="text-center">
                                <Button size='sm' className='frmLable grnbg' type="submit"> Next Step <span className='mx-2'><RiShareForwardFill /></span> </Button>
                            </Col>
                        </Row>
                    </Form>
          </Container>
        </Row>
      </Container>
    </div>
  )
}

export default NewProductAdd