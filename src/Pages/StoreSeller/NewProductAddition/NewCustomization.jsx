import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { offerCreate, offerTypeCreate, sellerNewAddedProductDtails, sellerProductDeatils } from '../../../API/api';
import useAuth from '../../../hooks/useAuth';
import { ChangeFormatDate2 } from '../../../common/DateFormat';
import { SlCalender } from "react-icons/sl";
import './newproduct.css'

const NewCustomization = () => {


    const [formData, setFormData] = useState([]);

    const { id: productId } = useParams();

    const { auth } = useAuth();

    const navigate = useNavigate()


    useEffect(() => {
        getProductdata()
    }, [])


    async function getProductdata() {
        let res = await sellerNewAddedProductDtails(productId);
        console.log(res?.data?.data, 'productData')
        setFormData(res?.data?.data)
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        formData['sellerId'] = auth?.userId;

        console.log({ formData })

        // const res = await EditSellerOwnProduct(productId, formData);

        // if (res?.response?.data?.error) {
        //     toast.error(res?.response?.data?.message)
        // } else {
        //     toast.success('Product Added successfully')
        //     setTimeout(() => {
        //         navigate(`/seller/seller-ownproduct-status/new-variations/${res?.data?.data?._id}`)
        //     }, 1500);
        // }
    }

  return (
    <div>
          <Container className='stepContent'>
              <Row className='m-4 p-4 justify-content-md-center stepContent'>
                  <Container>
                      <Form onSubmit={handleSubmit}>
                          <Row className='mt-3'>
                              <Col xs={12}>
                                  <Form.Group controlId="user_name">
                                      <Row>
                                          <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                              <Form.Label>Max Order Quantity</Form.Label>
                                          </Col>
                                          <Col xs={8}>
                                              <Form.Control type="text"  name="desc" className='tapG' placeholder='Enter Product Order Max Quantity' size='sm' value={formData?.desc} onChange={handleChange} required autoComplete='off' />
                                          </Col>
                                      </Row>
                                  </Form.Group>
                              </Col>
                          </Row>

                          <Row className='mt-3'>
                              <Col xs={12}>
                                  <Form.Group controlId="user_name">
                                      <Row>
                                          <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                              <Form.Label>Expected delivery time</Form.Label>
                                          </Col>
                                          <Col xs={8}>
                                              <Form.Control type="text" name="desc" className='tapG' placeholder='Enter in days' size='sm' value={formData?.desc} onChange={handleChange} required autoComplete='off' />
                                          </Col>
                                      </Row>
                                  </Form.Group>
                              </Col>
                          </Row>

                          <Row className='mt-3'>
                              <Col xs={12}>
                                  <Form.Group controlId="user_name">
                                      <Row>
                                          <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                              <Form.Label>Can Be Gift Messaged ?</Form.Label>
                                          </Col>
                                          <Col xs={8}>
                                              <Form.Control type="text" name="desc" className='tapG' placeholder='Enter in days' size='sm' value={formData?.desc} onChange={handleChange} required autoComplete='off' />
                                          </Col>
                                      </Row>
                                  </Form.Group>
                              </Col>
                          </Row>


                          <Row className='mt-3'>
                              <Col xs={12}>
                                  <Form.Group controlId="user_name">
                                      <Row>
                                          <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                              <Form.Label>Is Gift Wrap Available ?</Form.Label>
                                          </Col>
                                          <Col xs={8}>
                                              <Form.Control type="text" name="desc" className='tapG' placeholder='Enter in days' size='sm' value={formData?.desc} onChange={handleChange} required autoComplete='off' />
                                          </Col>
                                      </Row>
                                  </Form.Group>
                              </Col>
                          </Row>
                          
                      </Form>
                  </Container>
              </Row>
          </Container>
    </div>
  )
}

export default NewCustomization