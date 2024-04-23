import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Form, ListGroup, Image } from 'react-bootstrap';
import { bannerTypesdata, creteBannerTypeNew, DeleteVideoType, FileUpload } from '../../API/api';
import toast, { Toaster } from 'react-hot-toast';
import { BannerImagesLists, DeleteBanner, bannerTypeList, createBannerImages, creteBannerType, updateBannerImages } from '../../API/api';
import { useRef } from 'react';
import { FaImages } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";

const NewBannermanager = () => {

    const [thumbnail, setThumbnail] = useState('');
    const [videoLink, setVideoLink] = useState('');
    const [types, setTypes] = useState([])
    const [bannerType, setBannerType] = useState('');
    const [selectedType, setSelectType] = useState('')
    const [topVideo, setTopVideo] = useState()


    useEffect(() => {
        getBannerTypes()
    }, [])


    const getBannerTypes = async () => {
        let res = await bannerTypesdata();
        console.log(res?.data?.data)
        setTypes(res?.data?.data)
    }

    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Selected File:', file);
            onFileUpload(file)
        }
    };

    const onFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await FileUpload(formData);
            console.log(res?.data?.data)

            setTimeout(() => {
                setThumbnail(res?.data?.data?.fileurl)
            }, 1000);
        } catch (err) {
            console.error(err, "err");
        }
    };

    const handleVideoLinkChange = (event) => {
        setVideoLink(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Process the uploaded thumbnail and video link here
        console.log('Thumbnail:', thumbnail);
        console.log('Video Link:', videoLink);

        let payload = {
            image: thumbnail,
            video_link: videoLink
        }


    };


    const bannerTypeFunc = async () => {
        let payload = {
            video_type: bannerType
        }

        let res = await creteBannerTypeNew(payload);

        if (res?.data?.error == false) {
            toast.success('Banner Type create successfully...');
            setBannerType('')
            getBannerTypes();
        }
    }




    const handleSelectChange = (event) => {
        const selectedId = event.target.value;
        const selectedVideo = types.find(video => video._id === selectedId);
        setSelectType(selectedVideo);
        console.log("Selected Video:", selectedVideo);
    };


    const handleUploadVideo = async (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Selected File:', file);
            const formData = new FormData();
            formData.append("file", file); // Corrected formData usage

            try {
                const res = await FileUpload(formData); // Assuming FileUpload expects FormData
                console.log(res?.data?.data);

                setTimeout(() => {
                    setTopVideo(res?.data?.data?.fileurl);
                }, 1000);
            } catch (err) {
                console.error(err, "err");
            }
        }
    };



    const deleteType = async (id) => {
        let res = await DeleteVideoType(id);
        getBannerTypes()
    }

    return (
        <div className="productList mt-2 p-4">
            <Container>
                <h4>Banner Managment</h4>
            </Container>
            <Container>
                <Row>
                    <Col size="6">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Banner Type</Form.Label>
                            <Form.Control type="text" placeholder="create your banner type" value={bannerType} onChange={(e) => setBannerType(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col size="6" className='d-flex align-items-center'>
                        <div>
                            <Button variant="dark" size="sm" onClick={() => bannerTypeFunc()}>
                                Create banner type
                            </Button>
                        </div>
                    </Col>
                    {types?.length > 0 && types?.map((ele) => (
                        <li value={ele} label={ele?.video_type}>{ele?.video_type} <button onClick={() => deleteType(ele?._id)}>Delete</button> </li>
                    ))}
                </Row>
            </Container>
            <Container>
                <Row>
                    <Row>
                        <Col xs={6}>
                            <Form.Group controlId="bannerType">
                                <Form.Label>Banner Type:</Form.Label>
                                <Form.Select
                                    value={selectedType}
                                    onChange={handleSelectChange}
                                >
                                    <option value="" disabled>Select Banner Type</option>
                                    {types?.length > 0 && types.map(video => (
                                        <option key={video._id} value={video._id}>
                                            {video.video_type}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Row>
            </Container>

            {selectedType?.video_type == 'Top_Bannner' &&
                <Container className='mt-4'>
                    <h6>Upload Your Video File</h6>
                    <Row className='mt-2'>
                        <Col>
                            <Form.Control type="file" size="sm" id="thumbnailUpload"
                                label="Choose Thumbnail Image"
                                accept="image/*"
                                onChange={handleUploadVideo} />
                        </Col>
                    </Row>
                </Container>}

            {selectedType?.video_type == 'Bottom_Bannner' &&
                <Container className='mt-4'>
                    <h6>Bottom Videos Section <span>Add New</span></h6>
                  
                    <Row>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="thumbnail">
                                <Form.Label>Thumbnail Image</Form.Label>
                                <Form.Control type="file" size="sm" id="thumbnailUpload"
                                    label="Choose Thumbnail Image"
                                    accept="image/*"
                                    onChange={handleThumbnailChange} />
                                {thumbnail && <img src={thumbnail} alt="Thumbnail" style={{ maxWidth: '100%', marginTop: '10px' }} />}
                            </Form.Group>

                            <Form.Group controlId="videoLink">
                                <Form.Label>Video Link</Form.Label>
                            </Form.Group>
                            <Form.Control as="textarea" rows={3} placeholder="Enter Video Link" value={videoLink} onChange={handleVideoLinkChange} />

                            <Button variant="success" size='sm' type="submit" className='w-100 mt-4' >
                                Upload
                            </Button>
                        </Form>
                    </Row>

                </Container>}
            <Toaster position="top-right" />
        </div>
    )
}

export default NewBannermanager