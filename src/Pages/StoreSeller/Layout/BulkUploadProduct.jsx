import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Container, Row, Modal, Button, ListGroup,Form,Image } from 'react-bootstrap';
import { TiTickOutline } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { FileUpload, getAllCampaignList, getAllCampaignSellerList, OwnProductSellerList, sellerProductBulkUpload, sellerVariationsBulkUpload } from '../../../API/api';
import { saveAs } from 'file-saver';
import { MdOutlineFileUpload } from "react-icons/md";
import { MdOutlineFileDownload } from "react-icons/md";
import Spinner from 'react-bootstrap/Spinner';
import Papa from 'papaparse';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import { LuClipboardSignature } from "react-icons/lu";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdOutlineLaunch } from "react-icons/md";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdCancel } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { SlClose } from "react-icons/sl";
import { HiDownload } from "react-icons/hi";

const BulkUploadProduct = () => {

    const [loading, setLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState()
    const [variloading, setvariLoading] = useState(false);
    const [productList, setProductList] = useState([])

    const [show, setShow] = useState(false);
    const [showConverter, setshowConverter] = useState(false)
    const [blkProducts,SetBlkproducts] = useState([])

    const { auth } = useAuth();

    const handleClose = () => setShow(false);
    const handleShow = () => {
        getReqPorducts()
        setShow(true)
    };


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
                    SetBlkproducts(result?.data)
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


    const handleFileChangeForVariations = (event) => {
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

    const getReqPorducts = async () => {
        let res = await OwnProductSellerList(auth?.userId);
        console.log(res?.data?.data, 'pDara')
        setProductList(res?.data?.data)
    }




    return (
        <div>
            <Container>
                <Row className='mt-4'>
                    <Col><h4>
                        Choose a template to get started
                    </h4></Col>
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
                                    <img src='https://media.dev.to/cdn-cgi/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fkfdzyhxhae8c95nwi6go.jpg' className='upImg' alt='cmp_img' />
                                </Col>
                            </Row>
                            <Row>
                                <Col className='cmpgin-sub-title'>{ }</Col>
                            </Row>
                            <Row>
                                <Col className='mt-2'>
                                    <a href='https://firebasestorage.googleapis.com/v0/b/hire2inspire-62f96.appspot.com/o/MARKETPLACE_1711604427285.csv?alt=media'>
                                    <button className='w-100 cmpComtinue-temp'><span><MdOutlineFileDownload size={25} /></span>Download Template</button> </a>
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
                            {loading && 
                            <Row className='mt-2'>
                                <Col className='text-center upl'>Uploading... {blkProducts?.length - 1} Products</Col>
                            </Row>}
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
                                    <button className='w-100 cmpComtinue-temp' onClick={handleShow} ><span><MdOutlineFileDownload size={25} /></span>Download Template</button>
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
                        <ShowVariationSheets show={show} handleClose={handleClose} productList={productList} />
                    </Col>

                    <Col>
                        <Card body>
                            <Row className='me-2'>
                                <Col className='cmpgin-title'>Mutliple Image converter and upload to spreedsheet</Col>
                            </Row>
                            <Row className='mt-2 me-2'>
                                <Col className='cmpgin-sub-title'>Provide your product details and offer information to create new products in Zoofi's catalogue.</Col>
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
                                {!showConverter ? <Col className='mt-2' onClick={() => setshowConverter(!showConverter)}>
                                    <button className='w-100 cmpComtinue'><span><MdOutlineLaunch size={25} /></span> Launch Converter</button>
                                </Col> : 
                                <Col className='mt-2' onClick={() => setshowConverter(!showConverter)}>
                                        <button className='w-100 cmpComtinue'><span><SlClose size={25}/></span> Close Converter</button>
                                </Col>}
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Container className='mt-4 p-4 mb-4'>
                <ImageConveter showConverter={showConverter} />
            </Container>
            <Toaster />
        </div>
    )
}


const ShowVariationSheets = ({ show, handleClose, productList }) => {


    const [copied, setCopied] = useState(false);
    const [copiedindex, setCopiedIndex] = useState('');

    const copyTextToClipboard = (text, index) => {
        setCopiedIndex(index)
        const textToCopy = text;
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        // Set the text content to be copied
        textarea.value = textToCopy;
        // Append the textarea to the body
        document.body.appendChild(textarea);
        // Select the text within the textarea
        textarea.select();
        // Copy the selected text to the clipboard
        document.execCommand('copy');
        // Remove the temporary textarea
        document.body.removeChild(textarea);
        // Set copied state to true
        setCopied(true);
        // Reset copied state after 2 seconds
        setTimeout(() => {
            setCopied(false);
            setCopiedIndex('');
        }, 2000);
    };


    const downloadVariationCSV = (ele) => {

        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

        const data = [
            ['productId', 'title', 'value', 'price', 'image'],
            [`${ele?.sellerProId}`]
        ];

        const csvContent = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, `products_${ele?.sellerProId}.csv`);
    };


    const [clickIndex, setClickIndex] = useState();

    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                size='lg'
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <p className='cmpgin-title'>Download Variation Template Sheet Accoding to Your Product</p>
                </Modal.Header>
                <Modal.Body style={{ height: '70vh', overflow: 'scroll' }}>
                    <ListGroup size="sm">
                        {productList?.length > 0 && productList?.map((ele, index) => (
                            <ListGroup.Item className='mt-2'>
                                <Row className='vHead'>
                                    <Col>Product Name</Col>
                                    <Col>Status</Col>
                                    <Col className='text-center'>Image</Col>
                                    <Col>Product ID</Col>
                                    <Col>Cateogry</Col>
                                    <Col>Brand</Col>
                                    <Col>Variants</Col>
                                    <Col xs={2}>Action</Col>
                                </Row>
                                <Row className='vData mt-2'>
                                    <Col>{ele?.name}</Col>
                                    <Col>{ele?.is_approved}</Col>
                                    <Col className='text-center'> <img src={ele?.image?.[0]?.image_path} className='appPhoto' width={30} height={30} /></Col>
                                    <Col>
                                        {ele?.sellerProId}
                                        <span className='mx-4'>
                                            {(copied && copiedindex == index) ?
                                                <>
                                                    <BsClipboard2CheckFill size={20} color="green" /><span style={{ fontSize: '10px', color: 'green' }}>Copied</span>
                                                </>
                                                :
                                                <>
                                                    <FaRegCopy style={{ cursor: 'pointer', color: 'darkgoldenrod' }} onClick={() => copyTextToClipboard(ele?.sellerProId, index)} size={18} />
                                                </>
                                            }
                                        </span>
                                    </Col>
                                    <Col>{ele?.categoryId?.title}</Col>
                                    <Col>{ele?.brandId?.title}</Col>
                                    <Col className='text-center'>
                                        <Row>
                                            <Col xs={12}>{ele?.specId?.length}</Col>
                                            {ele?.specId?.length > 0 &&
                                                <Col className='variCss' onClick={() => setClickIndex(index)}><span>view</span></Col>}
                                        </Row>
                                    </Col>
                                    <Col xs={2} className='d-flex align-items-center'>
                                        {/* <Button className='cmpComtinue' size='sm' onClick={() => downloadVariationCSV(ele)}>Download</Button> */}
                                        <p className='downloadClass' onClick={() => downloadVariationCSV(ele)} ><span><HiDownload size={15}/></span> Download</p>
                                    </Col>
                                </Row>
                                {clickIndex == index &&
                                    <Row className='p-4'>
                                        {ele?.specId?.map((item, index) => (
                                           
                                            <Col xs={4} className={("is_approved" in item && item?.is_approved == 'pending') ? 'othervariDiv-notApproved' : 'othervariDiv'}>
                                                <Row>
                                                    {console.log({ item })}
                                                    {("is_approved" in item && item?.is_approved == 'pending') &&
                                                        <Col className='mb-2 mt-2 specborder2' xs={12}><h6>Not Approved</h6></Col>}
                                                    <Col xs={5} className='d-flex justify-content-end align-items-center'>
                                                        <img src={item?.image?.[0]?.image_path} width={80} className='bgofferProductImg3' alt='productImage' />
                                                    </Col>
                                                    <Col className='d-flex justify-content-end align-items-center mt-2 mb-2'>
                                                        <Row>
                                                            <Col xs={12} className='othervariDivName'>
                                                                {item?.productId?.brandId?.title} {item?.productId?.name} {item?.spec_det?.length > 0 && (
                                                                    <span>
                                                                        (
                                                                        {item?.spec_det.map((item, index, array) => (
                                                                            <span key={index}>
                                                                                {item?.value}
                                                                                {index < array.length - 1 ? ', ' : ''}
                                                                            </span>
                                                                        ))}
                                                                        )
                                                                    </span>
                                                                )}
                                                            </Col>
                                                            <Col className='mt-1 othervariDivNameV' xs={12}>
                                                                <span className='othervariDivName'>M.R.P Price</span> : {item?.price?.toLocaleString()}
                                                            </Col>
                                                            <Col className='mt-1 othervariDivNameV' xs={12}>
                                                                <span className='othervariDivName'>SKU ID</span> : {item?.skuId?.toUpperCase()}
                                                            </Col>
                                                            <Col className='mt-1 othervariDivNameV' xs={12}>
                                                                <span className='othervariDivName'>Product ID</span> : {item?.productId?.productId?.toUpperCase()}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        ))}
                                    </Row>}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" size='sm' onClick={handleClose}>
                        Close
                    </Button>
                    {/* <Button size='sm' variant="success">Understood</Button> */}
                </Modal.Footer>
            </Modal>
        </div>
    )
}


const ImageConveter  = ({showConverter}) =>{

    const [value, setValue] = useState('');
    const [copied, setCopied] = useState(false);
    const [storeData, setStoreData] = useState('')

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



    return (
        <div>
            {showConverter && 
              <div className='converterBack'>
                    <Container className='mt-2'>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <h3 className='cmpgin-title'>Convert Your Images {copied ? <span style={{ color: 'red' }}>Copied.</span> : null}</h3>
                            </Col>
                        </Row>
                    </Container>
                    <Container>
                        <Row className='mt-2'>
                            <Col xs={6}>
                                <Form.Group controlId="formFileMultiple" className="mb-3">
                                    <Form.Label className='cmpgin-title'>Multiple Images</Form.Label>
                                    <Form.Control type="file" onChange={handleImageInputChange} multiple accept="image/jpeg, image/png, image/gif" />
                                    <p className="cmpgin-sub-title" >
                                        Add images one by one or Select multiple images.
                                    </p>
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
                        <Row className='mt-4 mb-4'>
                            <Col>
                                <CopyToClipboard text={formData?.image?.toString()} onCopy={() => setCopied(true)}>
                                    <Button size={copied ? 'md' : 'sm'} variant={copied ? 'success' : 'secondary'}>{copied && <FaCheckCircle />}  Copy to clipboard</Button>
                                </CopyToClipboard>
                            </Col>
                        </Row>
                    </Container>
              </div>
            
            
            }
        </div>
    )
}


export default BulkUploadProduct