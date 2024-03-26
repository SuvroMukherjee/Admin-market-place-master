import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Container, Row } from 'react-bootstrap';
import { TiTickOutline } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { getAllCampaignList, getAllCampaignSellerList } from '../../../API/api';

const BulkUploadProduct = () => {
  return (
      <div>
          <Container>
              <Row className='mt-4'>
                  <Col><h5>
                      Choose a template to get started
                    </h5></Col>
              </Row>
          </Container>
          <Container className='mt-4'>
            <Row>
                <Col>
                      <Card body>
                          <Row>
                              <Col className='p-2 cmpgin-title'>List products that are not currently in Zoofi's catalogue</Col>
                          </Row>
                          <Row>
                              <Col className='text-center p-4'>
                                  <img src='https://img.freepik.com/free-vector/spreadsheet-laptop-desktop-icons_603843-349.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1709424000&semt=ais' className='upImg' alt='cmp_img' />
                              </Col>
                          </Row>
                          <Row>
                              <Col className='cmpgin-sub-title'>{}</Col>
                          </Row>
                          <Row>
                              <Col className='mt-2'>
                                  <button className='w-100 cmpComtinue'>Continue</button>
                              </Col>
                          </Row>
                      </Card>
                </Col>
                  <Col>
                      <Card body>
                          <Row className='borderBottom'>
                              <Col className='p-2 cmpgin-title mx-4'>Upload variatants of new uploaded products </Col>
                          </Row>
                          <Row>
                              <Col className='text-center p-2'>
                                  <img src='https://support.bigcommerce.com/servlet/rtaImage?eid=aAn4O000000CdIP&feoid=00N4O000006F7bx&refid=0EM4O000001YFvJ' className='upImg' alt='cmp_img' />
                              </Col>
                          </Row>
                          <Row>
                              <Col className='cmpgin-sub-title'>{ }</Col>
                          </Row>
                          <Row>
                              <Col className='mt-2'>
                                  <button className='w-100 cmpComtinue'>Continue</button>
                              </Col>
                          </Row>
                      </Card>
                  </Col>
                  <Col>
                      <Card body>
                          <Row className='borderBottom'>
                              <Col className='p-2 cmpgin-title mx-4'>Mutliple Image converter and upload to spreedsheet</Col>
                          </Row>
                          <Row>
                              <Col className='text-center p-2'>
                                  <img src='https://cdn.setapp.com/blog/images/how-to-copy-paste-and-cut-on-mac-1200-628.png' className='upImg' alt='cmp_img' />
                              </Col>
                          </Row>
                          <Row>
                              <Col className='cmpgin-sub-title'>{ }</Col>
                          </Row>
                          <Row>
                              <Col className='mt-2'>
                                  <button className='w-100 cmpComtinue'>Continue</button>
                              </Col>
                          </Row>
                      </Card>
                  </Col>
            </Row>
         </Container>
      </div>
  )
}

export default BulkUploadProduct