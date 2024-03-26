import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { offerCreate, offerTypeCreate, sellerNewAddedProductDtails, sellerProductDeatils } from '../../../API/api';
import useAuth from '../../../hooks/useAuth';
import { ChangeFormatDate2 } from '../../../common/DateFormat';
import { SlCalender } from "react-icons/sl";
import { FaInfoCircle } from "react-icons/fa";
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

    const handleChangeOptions = (e) => {
        const { name, value } = e.target;
        const boolValue = value === 'true'; // Convert value to boolean
        setFormData((prevData) => ({
            ...prevData,
            [name]: boolValue,
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        formData['sellerId'] = auth?.userId;

        console.log({ formData })

        const res = await EditSellerOwnProduct(productId, formData);

        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {
            toast.success('Customization Added successfully')
            setTimeout(() => {
                navigate(`/seller/approval-request-list/`)
            }, 1500);
        }
    }

  return (
    <div>
          <Container className='stepContent'>
            
              <Row className='m-4 p-4 justify-content-md-center stepContent paddingConatiner'>
                {!productId && 
                  <Row>
                          <Col className='text-center noproductIdText'><span className='mx-4'><FaInfoCircle color='#7D0A0A' size={25} /></span> Product Id is missing.Please Go the First Step and then try to uplaod or <span style={{ cursor: 'pointer', textDecoration: 'underline', color: 'darkred' }} onClick={() => navigate('/seller/seller-ownproduct-status/new-add')}>request for new Product</span></Col>
                  </Row>}
                  <Container>
                      <Form onSubmit={handleSubmit} >
                          <fieldset disabled={!productId}>
                          <Row className='mt-3'>
                              <Col xs={12}>
                                  <Form.Group controlId="user_name">
                                      <Row>
                                          <Col xs={3} className='d-flex align-items-center justify-content-end'>
                                              <Form.Label>Max Order Quantity</Form.Label>
                                          </Col>
                                          <Col xs={6}>
                                              <Form.Control type="text" name="max_order_qty" className='tapG' placeholder='Enter Product Order Max Quantity' size='sm' value={formData?.max_order_qty} onChange={handleChange}  autoComplete='off' />
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
                                          <Col xs={6}>
                                              <Form.Control type="text" name="expected_delivery" className='tapG' placeholder='Enter in days' size='sm' value={formData?.expected_delivery} onChange={handleChange}  autoComplete='off' />
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
                                          <Col xs={6}>
                                              <Form.Control
                                                  as="select"
                                                  name="gift_message_avail"
                                                  className="tapG"
                                                  value={formData?.gift_message_avail}
                                                  onChange={handleChangeOptions}
                                                  
                                              >
                                                  <option value="">Select</option>
                                                  <option value="true">Yes</option>
                                                  <option value="false">No</option>
                                              </Form.Control>
                                         
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
                                          <Col xs={6}>
                                              <Form.Control
                                                  as="select"
                                                  name="gift_wrap_avail"
                                                  className="tapG"
                                                  value={formData?.gift_wrap_avail}
                                                  onChange={handleChangeOptions}
                                                  
                                              >
                                                  <option value="">Select</option>
                                                  <option value="true">Yes</option>
                                                  <option value="false">No</option>
                                              </Form.Control>
                                          </Col>
                                      </Row>
                                  </Form.Group>
                              </Col>
                          </Row>

                          <Row className='mt-2'>
                              <Col xs={12} className='mt-4'>
                                  <Row>
                                      <Col>
                                          <Button size='sm' variant='secondary' className='cancelbtn'>CANCEL</Button>
                                      </Col>
                                      <Col className='d-flex justify-content-end'>
                                          <Button size='sm' variant='success' type="submit">SAVE & NEXT </Button>
                                      </Col>
                                  </Row>
                              </Col>
                          </Row>
                              </fieldset>
                      </Form>


                     


                  </Container>
              </Row>
          </Container>
    </div>
  )
}

export default NewCustomization