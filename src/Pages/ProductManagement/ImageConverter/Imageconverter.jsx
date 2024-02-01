import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { AddNewProduct, FileUpload, allBrandList, allCategoryList, allSubCategoryList, getSubCategoryByCategory } from '../../../API/api';
import { MdCancel } from "react-icons/md";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";




const Imageconverter = () => {
    const [value, setValue] = useState('');
    const [copied, setCopied] = useState(false);
    const [storeData,setStoreData] = useState('')

    const [formData, setFormData] = useState({
        image: [],
    });

    const handleImageInputChange = (e) => {
        const { files } = e.target;
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        const selectedFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));


        selectedFiles.forEach((file) => {
            onFileUpload(file);
        });
    };

    const onFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await FileUpload(formData);
            setTimeout(() => {
                setFormData((prevData) => ({
                    ...prevData,
                    image: [...prevData.image, res?.data?.data?.fileurl],
                }));
            }, 3000);
        } catch (err) {
            console.error(err, "err");
        }
    };


    const handleCancelImage = (url) => {
        let filterData = formData.image?.filter((e, index) => {
            return e !== url;
        })

        setFormData((prevData) => ({
            ...prevData,
            image: filterData,
        }));

    }


    const separateFunc = (data) =>{
        
    }


    console.log(formData?.image,'image')

    return (
        <div className="productList mt-2 p-4">
            {/* <input
                value={value}
                onChange={({ target: { value } }) => setValue(value, setCopied(false))}
            /> */}

            {/* <CopyToClipboard text={value} onCopy={() => setCopied(true)}>
                <span>Copy to clipboard with span</span>
            </CopyToClipboard> */}

            {/* <CopyToClipboard text={value} onCopy={() => setCopied(true)}>
                <button>Copy to clipboard with button</button>
            </CopyToClipboard> */}

            


           <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h3>Convert Your Images {copied ? <span style={{ color: 'red' }}>Copied.</span> : null}</h3>
                        </Col>
              </Row>
            </Container>         
           <Container>
                    <Row className='mt-2'>
                        <Col xs={6}>
                            <Form.Group controlId="formFileMultiple" className="mb-3">
                                <Form.Label>Multiple Images</Form.Label>
                                <Form.Control type="file" onChange={handleImageInputChange} multiple accept="image/jpeg, image/png, image/gif" />
                                <Form.Text className="text-muted" >
                                    Add images one by one or Select multiple images.
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Row>
                            <Col>
                                {formData.image.length > 0 && (
                                    <Container>
                                        <Row>
                                            {formData?.image.map((fileUrl, index) => (
                                                <Col key={index} xs={4} md={2}>
                                                    <span>{index + 1}</span>
                                                    <span><MdCancel style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }}
                                                        onClick={() => handleCancelImage(fileUrl)}
                                                    /></span>
                                                    <Image src={fileUrl} thumbnail />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Container>
                                )}
                            </Col>
                        </Row>
                    </Row>
                    <Row className='mt-4'>
                        <Col>
                        
                            <Form.Control
                                as="textarea"
                                placeholder="Copy & Paste"
                                style={{ height: '200px' }}
                                value={formData?.image?.toString()}
                                readOnly
                            />
                       
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                      <Col>
                        <CopyToClipboard text={formData?.image?.toString()} onCopy={() => setCopied(true)}>
                            <Button size={copied ? 'md' : 'sm'} variant={copied ? 'success' : 'secondary'}>{copied &&  <FaCheckCircle />}  Copy to clipboard</Button>
                        </CopyToClipboard>
                      </Col>
                    </Row>
           </Container>
        </div>
    );
};

export default Imageconverter;
