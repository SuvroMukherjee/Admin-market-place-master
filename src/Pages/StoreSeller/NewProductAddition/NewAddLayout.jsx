import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import './newproduct.css'

const NewAddLayout = () => {
  return (
    <div>
          <Container>
              <Row className='p-4'>
                  <Col xs={10}>
                      <ul className='d-flex justify-content-evenly liststyle'>
                          <li>
                              <NavLink to="/seller/seller-ownproduct-status/new-add" className={({ isActive }) => (isActive ? 'activeNav' : 'inactive')}>Product Identity</NavLink>
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
          </Container>
        <Outlet/>
    </div>
  )
}

export default NewAddLayout