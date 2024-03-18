import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import './newproduct.css'

const NewAddLayout = () => {
  return (
    <div>
          <Container className='mt-4'>
              <Row className=' p-1 justify-content-md-center'>
                  <Col xs={10}>
                      <ul className='d-flex justify-content-evenly liststyle'>
                          <li>
                              <NavLink to="/seller/seller-ownproduct-status/new-add" className={({ isActive }) => (isActive ? 'activeNav' : 'inactivetab')}>Product Identity</NavLink>
                          </li>
                          <li>
                              <NavLink to="/seller/seller-ownproduct-status/new-variations" className={({ isActive }) => (isActive ? 'activeNav' : 'inactivetab')}>Variations</NavLink>
                          </li>
                          <li>
                              <NavLink to="/seller/seller-ownproduct-status/new-description" className={({ isActive }) => (isActive ? 'activeNav' : 'inactivetab')}>Product Details & Videos</NavLink>
                          </li>
                          <li>
                              <NavLink to="/seller/seller-ownproduct-status/new-customization" className={({ isActive }) => (isActive ? 'activeNav' : 'inactivetab')} >Customized</NavLink> 
                          </li>
                          {/* <li>
                              <NavLink to="about">Safety & Complains</NavLink>
                          </li> */}
                      </ul>
                  </Col>
              </Row>
          </Container>
          {/* <hr/> */}
        <Outlet/>
    </div>
  )
}

export default NewAddLayout