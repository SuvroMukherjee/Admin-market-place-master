import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Form, ListGroup } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { FileUpload, bannerTypeList, createBannerImages, creteBannerType } from '../../API/api';
import { useRef } from 'react';

const BannerManagment = () => {
   
    const [bannerType,setBannerType] = useState('');
    const [bannerTypelist,setBannerTypelist]  = useState([]);
    const [selectBannerType,SetSelectedBannerType] = useState({
        id : "",
        type : ""
    })
    const [BannerImages,SetbannerImages] = useState([])

    useEffect(()=>{
        getBannerType();
    },[])

    async function getBannerType(){
        await bannerTypeList().then((res)=>{
            console.log(res?.data?.data)
            setBannerTypelist(res?.data?.data)
        }).catch((err)=>[
            console.log(err)
        ])
    }

    const bannerTypeFunc  = async() =>{
        let payload  = {
            banner_type: bannerType
        }

        let res = await creteBannerType(payload);

        console.log(res?.data?.data)
    }


    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {

        const file = event.target.files[0];
        if (file) {
            // Handle the file, e.g., upload or process it
            console.log('Selected File:', file);
            onFileUpload(file)
        }
    };

    const handleButtonClick = () => {
        // Trigger the hidden file input
        fileInputRef.current.click();
    };


    const onFileUpload = async (file) => {
        //setUploading(true)
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await FileUpload(formData);
            console.log(res?.data?.data)

            setTimeout(() => {
                SetbannerImages((prevData) => [
                    ...prevData,
                    res?.data?.data?.fileurl
                ]);
            }, 3000);

            // let payload = {
            //     file: res?.data?.data?.fileName
            // }

            // let response = await BulkProductUpload(payload);

            // if (response?.data?.error) {
            //     toast.error('Could not upload csv');
            //     setUploading(false)
            // } else {
            //     console.log(response?.data)
            //     toast.success('Upload successfully')
            //     getProductListFunc();
            //     setUploading(false)
            // }

            // console.log(response)
            // // setTimeout(() => {
            // //     setFormData((prevData) => ({
            // //         ...prevData,
            // //         image: [...prevData.image, res?.data?.data?.fileurl],
            // //     }));
            // // }, 3000);
        } catch (err) {
            console.error(err, "err");
        }
    };


    const BabnnerTypeChange = (e) =>{
        console.log(e.target.selectedOptions[0])
        const selectedOption = e.target.selectedOptions[0];
        SetSelectedBannerType({
            id: selectedOption.value,
            type: selectedOption.label,
        });
    }

    const BannerUpload = async() =>{
        let payload  = {
            banner_typeId : selectBannerType?.id,
            image: BannerImages
        }

      let res =  await createBannerImages(payload);
      console.log({res})
      SetSelectedBannerType({ id: '', type: '' });
      SetbannerImages([])
           
    }


    const deleteImage = (id) =>{
        console.log('clc')
        let filterData  = BannerImages?.filter((ele,i)=>{
            return i != id;
        })
        console.log({filterData})
        SetbannerImages(filterData)
    }

    console.log({ BannerImages })


  return (
      <div className="productList mt-2 p-4">
          <Container>
              <Row className="justify-content-md-center">
                  <Col md="auto">
                      <h3>Banner Managment</h3>
                  </Col>
              </Row>
              <Row>
                <Col size="6">
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                          <Form.Label>Banner Type</Form.Label>
                          <Form.Control type="text" placeholder="create your banner type" onChange={(e) => setBannerType(e.target.value)} required/>
                      </Form.Group>
                </Col>
                  <Col size="6" className='d-flex align-items-center'>
                      <div className="mb-2">
                          <Button variant="primary" size="lg" onClick={() => bannerTypeFunc()}>
                              Create banner type
                          </Button>
                      </div>
              </Col>
              </Row>
              <Row>
                <h6>Banner Lists</h6>
                <Col>
                      {bannerTypelist?.length > 0 && bannerTypelist?.map((ele)=>(
                          <ListGroup>
                              <ListGroup.Item>{ele?.banner_type}</ListGroup.Item>
                          </ListGroup>
                      ))}
                </Col>
              </Row>
              <Row className="justify-content-md-center mt-3">
                  <Col md="auto">
                      <h5>Upload Banner Images</h5>
                  </Col>
              </Row>
              <Row>
                  <Col xs={8} >
                      <Col>
                          <Form.Group controlId="bannerType">
                              <Form.Label>Banner Type:</Form.Label>
                              <Form.Select
                                  value={SetSelectedBannerType}
                                  onChange={BabnnerTypeChange}
                              >
                                  <option value="" disabled selected>Select Banner Type</option>
                                  {bannerTypelist?.length > 0 && bannerTypelist?.map((ele) => (
                                      <option value={ele?._id} label={ele?.banner_type}>{ele?.banner_type}</option>
                                  ))}
                              </Form.Select>
                          </Form.Group>
                      </Col>
                      <Col className='mt-2'>
                          <h4>{selectBannerType?.type}</h4> <button onClick={() => BannerUpload()}>save</button>
                    
                          <div>
                              <input
                                  type="file"
                                  ref={fileInputRef}
                                  style={{ display: 'none' }}
                                  onChange={handleFileChange}
                              />
                              <Button variant="primary" onClick={handleButtonClick}>
                                  Select File
                              </Button>
                          </div>
                      </Col>
                      <Col>
                          {BannerImages?.length > 0 && BannerImages?.map((ele,index)=>(
                            <Col xs={2}>
                                  <img src={ele} /> <button onClick={() => deleteImage(index)}>delete</button>
                            </Col>
                          ))}
                      </Col>
                  </Col>
                  <Col xs={4} >
                      <BannerCMS/>
                  </Col>
              </Row>
              <Toaster position="top-right" />
          </Container>
      </div>
  )
}


const BannerCMS = () =>{
    return (
        <div class="border border-dark p-4">
            <Row className='text-center bg-primary text-white'>
                <Col>Header</Col>
            </Row>
            <Row className="bg-secondary p-4 text-center mt-1">
                <Col>
                  Top Banner
                </Col>
            </Row>
            <Row className='mt-2'>
                <Col>Indian grown product videos</Col>
            </Row>
            <Row className="d-flex justify-content-between gap-2 mt-1">
                <Col className="bg-dark p-2 text-white">
                   Video1
                </Col>
                <Col className="bg-dark p-2 text-white">
                    Video2
                </Col>
                <Col className="bg-dark p-2 text-white">
                    Video3
                </Col>
            </Row>
            <Row className='mt-2 d-flex justify-content-center bg-success text-center p-1 m-2'>
                <Col>
                  Explore All
                </Col>
            </Row>

            <Row className='d-flex justify-content-between gap-2 mb-4'>
                <Col className='bg-info'>
                    Middle ban 1
                </Col>
                <Col className='bg-info'>
                    Middle ban 2
                </Col>
            </Row>


            <Row className='d-flex justify-content-between gap-2 mt-4'>
                <Col className='bg-warning p-2 text-center'>
                    footer ban 1
                </Col>
                <Col className='bg-warning p-2 text-center'>
                    footer ban 2
                </Col>
            </Row>

        </div>
    )
}

export default BannerManagment