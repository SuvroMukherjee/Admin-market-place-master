import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Container, Row } from 'react-bootstrap';
import { TiTickOutline } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { FileUpload, getAllCampaignList, getAllCampaignSellerList, sellerProductBulkUpload, sellerVariationsBulkUpload } from '../../../API/api';
import { saveAs } from 'file-saver';
import { MdOutlineFileUpload } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import Spinner from 'react-bootstrap/Spinner';
import Papa from 'papaparse';
import toast, { Toaster } from 'react-hot-toast';

const BulkUploadProduct = () => {

    const [loading, setLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState()
    const [variloading, setvariLoading] = useState(false);



    const downloadCSV = () => {

        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

        const data = [
            ['type', 'name', 'desc', 'categoryId', 'subcategoryId', 'brandId', 'image', 'tags']
        ];

        const csvContent = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `products_${formattedDate}.csv`);
    };


    const handleFileChange = (event) => {

        const file = event.target.files[0];
        if (file) {
            setLoading(true)
            Papa.parse(file, {
                complete: (result) => {
                    // Access the parsed data in result.dat
                    console.log({ result })
                },
                header: true, // Set this to true if your CSV file has headers
            });
            onFileUpload(file)
        }
    }


    const onFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await FileUpload(formData);
            console.log(res?.data?.data)

            setTimeout(() => {
                setUploadedFile(res?.data?.data);
                productBulkUpload(res?.data?.data?.fileName)
            }, 3000);
        } catch (err) {
            console.error(err, "err");
        }
    };


    const productBulkUpload = async (file) => {

        let payload = {
            'file': file
        }

        let res = await sellerProductBulkUpload(payload);
        console.log(res?.data?.data)
        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
            setLoading(false)
        } else {

            toast.success('Products Added Successfully')
            setLoading(false)
        }

    }


    const handleFileChangeForVariations = (event) =>{
        const file = event.target.files[0];
        if (file) {
            setvariLoading(true)
            Papa.parse(file, {
                complete: (result) => {
                    // Access the parsed data in result.dat
                    console.log({ result })
                },
                header: true, // Set this to true if your CSV file has headers
            });
            onFileUploadVariations(file)
        }
    }

    const onFileUploadVariations = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await FileUpload(formData);
            console.log(res?.data?.data)

            setTimeout(() => {
                setUploadedFile(res?.data?.data);
                productvariationsBulkUpload(res?.data?.data?.fileName)
            }, 3000);
        } catch (err) {
            console.error(err, "err");
        }
    };


    const productvariationsBulkUpload = async (file) => {

        let payload = {
            'file': file
        }

        let res = await sellerVariationsBulkUpload(payload);
        console.log(res?.data?.data)
        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
            setvariLoading(false)
        } else {

            toast.success('Products Added Successfully')
            setvariLoading(false)
        }

    }


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
                            <Row className='me-2'>
                                <Col className='cmpgin-title'>List products that are not currently in Zoofi's catalogue</Col>
                            </Row>
                            <Row className='mt-2 me-2'>
                                <Col className='cmpgin-sub-title'>Provide your product details and offer information to create new products in Zoofi's catalogue.</Col>
                            </Row>
                            <Row className='mb-2 mt-2'>
                                <Col className='text-center'>
                                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUno6QRWvDY5RAbL3R-uqbJR5VxAxYMrSIGP41rDa8Lw&s' className='upImg' alt='cmp_img' />
                                </Col>
                            </Row>
                            <Row>
                                <Col className='cmpgin-sub-title'>{ }</Col>
                            </Row>
                            <Row>
                                <Col className='mt-2'>
                                    <button className='w-100 cmpComtinue-temp' onClick={downloadCSV} ><span><MdOutlineFileDownload size={25} /></span>Download Template</button>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='mt-2'>
                                    <label htmlFor='fileInput' className='w-100 cmpComtinue text-center'>
                                        {loading ? <Spinner className='mx-2' size='sm' /> : <span><MdOutlineFileUpload size={25} /></span>}
                                        Upload Spreadsheet
                                    </label>
                                    <input
                                        id='fileInput'
                                        type='file'
                                        accept='.xls,.xlsx,.ods,.csv' // Specify accepted file types here
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col>
                        <Card body>
                            <Row className='me-2'>
                                <Col className='cmpgin-title'>Listing various iterations by uploading your Product ID</Col>
                            </Row>
                            <Row className='mt-2 me-2'>
                                <Col className='cmpgin-sub-title'>Provide your product details and offer information to create new products in Zoofi's catalogue.</Col>
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
                                    <button className='w-100 cmpComtinue-temp' onClick={downloadCSV} ><span><MdOutlineFileDownload size={25} /></span>Download Template</button>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='mt-2'>
                                    <label htmlFor='fileInputvariations' className='w-100 cmpComtinue text-center'>
                                        {variloading ? <Spinner className='mx-2' size='sm' /> : <span><MdOutlineFileUpload size={25} /></span>}
                                        Upload Variations sheet
                                    </label>
                                    <input
                                        id='fileInputvariations'
                                        type='file'
                                        accept='.xls,.xlsx,.ods,.csv' // Specify accepted file types here
                                        style={{ display: 'none' }}
                                        onChange={handleFileChangeForVariations}
                                    />
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
            <Toaster/>
        </div>
    )
}

export default BulkUploadProduct