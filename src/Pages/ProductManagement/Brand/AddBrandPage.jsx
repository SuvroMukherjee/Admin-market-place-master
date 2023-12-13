import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { AddBrand, FileUpload } from '../../../API/api';
import '../product.css';
import NoImage from '../../../assets/noimage.png'

const AddBrandPage = () => {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(NoImage);
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 3000);
    }, [])

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title && file) {
            console.log('rsrs')
            let payload =
            {
                "title": title,
                "image": file
            }

            await AddBrand(payload).then((res) => {
                toast.success('Brand Added successfully!');
                setTitle('');
                setFile(null);
                navigate('/Admin/Brand')
            }).catch((err) => {
                console.log(err)
            })
        }
    };

    const handleFileChange = async (e) => {
        onFileUpload(e.target.files[0])
    };


    const onFileUpload = async (data) => {
        const formData = new FormData();
        formData.append("file", data);
        await FileUpload(formData)
            .then((res) => {
                console.log(res, "res");
                setTimeout(() => {
                    setFile(res?.data?.data?.fileurl)
                }, 3000);
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };

    return (
        <>
            {loading &&
                <div className="productList mt-2 p-4 contentLoader">
                    <Row>
                        <Col>
                            <Spinner animation="border" size="lg" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                </div>}
            <div className="newProduct">
                <h1 className="addProductTitle">New Brand</h1>
                <form className="addProductForm" onSubmit={handleSubmit}>
                    <div className="addProductItem">
                        <label>Image</label>
                        {file &&
                            <img src={file} />}
                        <input type="file" id="file" onChange={handleFileChange} accept="image/jpeg, image/png, image/gif" />
                    </div>
                    <div className="addProductItem">
                        <label>Title</label>
                        <input
                            type="text"
                            name="Title"
                            placeholder="Brand Name"
                            value={title}
                            onChange={handleTitleChange}
                        />
                    </div>
                    <button type="submit" className="addProductButton">Create</button>
                </form>
            </div>
            <Toaster position="top-right" />
        </>

    )
}

export default AddBrandPage