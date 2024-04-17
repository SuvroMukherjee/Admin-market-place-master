import React from 'react'
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';

const TempleteUploader = () => {
    return (
        <div className="productList mt-2 p-4">
            <Container>
                <Row>
                    <Col xs={6}>

                     <input type='file' />

                    </Col>
                    <Col xs={6}>
                        <Row className='mt-2'>
                            <Button>Copy All Categories</Button>
                        </Row>
                        <Row className='mt-2'>
                            <Button>Copy All Sub-Categories</Button>
                        </Row>

                        <Row>
                            <Button>Copy All Brands</Button>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default TempleteUploader