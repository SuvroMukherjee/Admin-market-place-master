import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { AddProductSubCategory, FileUpload, allCategoryList } from '../../../API/api';
import toast, { Toaster } from 'react-hot-toast';
import { FaList } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const SubCategoryRequest = () => {
   
    const navigate = useNavigate()
    const [formData, setFormData] = useState()
    const [allcategoryList, setAllCategoryList] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        getCategoryList();
    }, [])

    async function getCategoryList() {
        await allCategoryList().then((res) => {
            setAllCategoryList(res?.data?.data)
            // console.log(res?.data?.data);
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if(name == 'email'){
            setFormData({ ...formData, ['seller_contc_info']: { ...formData?.seller_contc_info,[name] : value} });
        }
        else if (name == 'phone_no'){
            setFormData({ ...formData, ['seller_contc_info']: { ...formData?.seller_contc_info , [name]: value } });
        }
        else{
            setFormData({ ...formData, [name]: value });
        }
        // console.log(formData);
        
    };

    const onFileUpload = async (data) => {
        const formDataVal = new FormData();
        formDataVal.append("file", data);
        await FileUpload(formDataVal)
            .then((res) => {
                console.log(res, "res");
                    setTimeout(() => {
                        setFormData({ ...formData, ['image']: { image_path: res?.data?.data?.fileurl } });
                    }, 800);
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };
   
    const handleFileChange = async (e) => {
        onFileUpload(e.target.files[0])
        // console.log(e.target.files[0]);
    };

    const onFileUpload2 = async (data, type) => {
        const formDataVal = new FormData();
        formDataVal.append("file", data);
        await FileUpload(formDataVal)
            .then((res) => {
                console.log(res, "res");
                if (type === "distributer") {
                    setTimeout(() => {
                        setFormData({ ...formData, ['seller_doc']: { ...formData?.seller_doc, doc: type, doc_file: res?.data?.data?.fileurl } });
                    }, 900);
                } else {
                    setTimeout(() => {
                        setFormData({ ...formData, ['seller_doc']: { ...formData?.seller_doc, doc: type, doc_file: res?.data?.data?.fileurl } });
                    }, 900);
                }
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };

    const handleFileChange2 = (e,type) => {
        onFileUpload2(e.target.files[0], type)
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        console.log('Selected option:', event.target.value);
        setFormData({ ...formData, ['seller_type']: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log( formData )

        let res = await AddProductSubCategory(formData);
            //  console.log(res?.response?.data);
             
        if (res?.response?.data?.error) {
            toast.error(res?.response?.data?.message)
        } else {
            toast.success('Sub-Category Request Sent Successfully')
            setTimeout(() => {
                navigate('/seller/approval-request-list?tabtype=Sub-category')
            }, 2000);
        }
    };

    const handleOptionInput = (value,type) =>{
        setFormData({ ...formData, ['seller_doc']: { ...formData?.seller_doc, comment : value } });
    }

  return (
    <div>
      <Container>
        <Row>
        <Col xs={5} className='mt-4'>
         <h4> Selling application for Sub Category</h4>
         </Col>
         <Col xs={4}></Col>
         <Col xs={3} className='mt-4'>
           <Button size='sm' variant='outline-dark' onClick={() => navigate('/seller/approval-request-list')}> <span className='mx-1'><FaList /></span> View All applications</Button>
          </Col>
        </Row>
        
        <Form onSubmit={handleSubmit}>
        <Row className='mt-2'>
        <Col className='p-4'>
        <Row className='stepContent'>
        <Row className='mt-2'>
                        <Col xs={12}>
                                <Form.Group controlId="title">
                     
                                                    <Form.Label ><span className="req">*</span> Category </Form.Label>
                                                
                                                    <Form.Control as="select" name="category" size='sm' className='tapG' value={formData?.category} onChange={handleInputChange} required>
                                                        <option value="" defaultValue>
                                                            Select Category
                                                        </option>
                                                        {allcategoryList?.length > 0 && allcategoryList?.map((ele) => (
                                                            <option key={ele?._id} value={ele?._id}>{ele?.title}</option>
                                                        ))}
                                                    </Form.Control>
                                               
                                            </Form.Group>
                                        </Col>
          </Row>

           <Row className='mt-2'>
            <Col xs={12}>
                    <Form.Group controlId="title">
                             <Form.Label><span className="req">*</span> Subcategory Title</Form.Label>
                                  <Form.Control
                                                    type="text"
                                                    className='tapG'
                                                    placeholder="Enter Subcategory Title"
                                                    name="title"
                                                    size='sm'
                                                    value={formData?.title}
                                                    required
                                                    onChange={handleInputChange}
                                                />
                                     </Form.Group>
                            </Col>
                    </Row>

                    <Row className='mt-2'>
                                        <Form.Group controlId="image">
                                            <Col xs={12}>
                                                <Form.Group controlId="title">
                                                    <Form.Label><span className="req">*</span> SubCategory Image
                                                        {formData?.image?.image_path &&
                                                            <a
                                                                href={formData?.image?.image_path}
                                                                target="_blank"
                                                            >
                                                                <span className='mx-4'>SHOW IMAGE</span>
                                                            </a>
                                                        }
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        className='tapG'
                                                        placeholder="Upload Sub Category Image"
                                                        name="img"
                                                        size='sm'
                                                        required
                                                        // value={modalData?.image}
                                                        onChange={(e) => handleFileChange(e)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Form.Group>
                    </Row>           
                      </Row>
                      </Col>
                      <Col className='mt-4 stepContent'>
                            <Row>
                                <Col> <h5>Tell us about your products and business</h5></Col>
                            </Row>
                            <Row>
                                <Col xs={12} className='mt-2 infotext'>
                                    Are you a reseller/distributor or a manufacturer for the products you want to list?
                                </Col>
                                <div className='mt-2'>
                                    <Col xs={6} className='infotext2'>
                                        <Form.Group>
                                            <Form.Check
                                                type='radio'
                                                id='reseller'
                                                label='Reseller/Distributor'
                                                value='distributer'
                                                checked={selectedOption === 'distributer'}
                                                onChange={handleOptionChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6} className='infotext2'>
                                        <Form.Group>
                                            <Form.Check
                                                type='radio'
                                                id='manufacturer'
                                                label='Manufacturer'
                                                value='manufracturer'
                                                checked={selectedOption === 'manufracturer'}
                                                onChange={handleOptionChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </div>


                            </Row>

                            {selectedOption == 'distributer' &&
                                <div className='mt-4'>
                                    <Row>
                                        <Col>
                                            <h5>Share Documents</h5>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className='mt-2 infotext'>
                                            At least 1 purchase invoice for products from a manufacturer or distributor
                                        </Col>
                                    </Row>
                                    <Row className='mt-2 text-center p-4'>
                                        <Col>
                                            {formData?.seller_doc?.doc == 'distributer' && 
                                              <span>
                                                    {formData?.seller_doc?.doc_file &&
                                                        <a
                                                            href={formData?.seller_doc?.doc_file}
                                                            target="_blank"
                                                        >
                                                            <span className='mx-4'>SHOW FILE</span>
                                                        </a>
                                                    }

                                              </span>
                                            }
                                        </Col>
                                        <Col xs={12}>
                                            <div className='upback'>
                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    style={{ display: 'none' }}
                                                    required
                                                    onChange={(e) => handleFileChange2(e,'distributer')}
                                                />
                                                <label htmlFor="fileInput">
                                                    <Button variant="secondary" className='w-100' size='sm' as="span">
                                                        Upload File
                                                    </Button>
                                                </label>
                                                {selectedFile && <p>Selected file: {selectedFile.name}</p>}
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12}>
                                            <Form.Group controlId="title">
                                                <Form.Label>Optional Comments</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='tapG'
                                                    placeholder="Add Comments..."
                                                    name="comment"
                                                    size='sm'
                                                    onChange={(e) => handleOptionInput(e?.target?.value,'distributer')}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>}

                            {selectedOption == 'manufracturer' &&
                                <div className='mt-4'>
                                    <Row>
                                        <Col>
                                            <h5>Share Documents</h5>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className='mt-2 infotext'>
                                            Upload file for {formData?.title} Manufacturing License
                                        </Col>
                                    </Row>
                                    <Row className='mt-2 text-center p-4'>
                                        <Col>
                                            {formData?.seller_doc?.doc == 'manufracturer' &&
                                                <span> 
                                                    {formData?.seller_doc?.doc_file &&
                                                        <a
                                                            href={formData?.seller_doc?.doc_file}
                                                            target="_blank"
                                                        >
                                                            <span className='mx-4'>SHOW FIle</span>
                                                        </a>
                                                    }
                                                </span>
                                            }
                                        </Col>
                                        <Col xs={12}>
                                            <div className='upback'>
                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    style={{ display: 'none' }}
                                                    required
                                                    onChange={(e) => handleFileChange2(e, 'manufracturer')}
                                                />
                                                <label htmlFor="fileInput">
                                                    <Button variant="secondary" className='w-100' size='sm' as="span">
                                                        Upload File
                                                    </Button>
                                                </label>
                                                {selectedFile && <p>Selected file: {selectedFile.name}</p>}
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12}>
                                            <Form.Group controlId="title">
                                                <Form.Label>Optional Comments</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='tapG'
                                                    placeholder="Add Comments..."
                                                    name="comment"
                                                    size='sm'
                                             onChange={(e) => handleOptionInput(e?.target?.value,'manufracturer')}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>}


                            <Row className='mt-4'>
                                <Col> <h5>Provide your contact information</h5></Col>
                            </Row>

                            <Row className='mt-2'>
                                <Col xs={12} className='mb-2'>
                                    <Form.Group controlId="title">
                                        <Form.Label><span className="req">*</span> Alternate Email to contact you</Form.Label>
                                        <Form.Control
                                            type="email"
                                            className='tapG'
                                            placeholder="Enter Email..."
                                            name="email"
                                            size='sm'
                                            required
                                        // value={modalData?.subtitle}
                                           onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="title">
                                        <Form.Label><span className="req">*</span> Alternate Phone to call you for query</Form.Label>
                                        <Form.Control
                                            type="phone"
                                            className='tapG'
                                            placeholder="Enter Phone..."
                                            name="phone_no"
                                            size='sm'
                                            required
                                        // value={modalData?.subtitle}
                                           onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>        
          
            </Row>  
                     <Row className='mt-5 mb-4 bgColor stepContent' >
                        <Col xs={6} className='d-flex align-items-center aggree'>
                            By clicking on Agree and Submit, I agree to the conditions.
                        </Col>
                        <Col className='d-flex justify-content-center'>
                            <Button
                                className="btn-block mr-1 mt-1 btn-lg"
                                variant="warning"
                                size='sm'
                                type='submit'
                                block
                            >Agree & Submit</Button>
                        </Col>
                    </Row>
        </Form>
        </Container> 
        <Toaster position="top-right" />
    </div>
  )
}

export default SubCategoryRequest