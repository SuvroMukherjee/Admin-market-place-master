import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { AddNewProduct, FileUpload, GetProductDetails, allBrandList, allCategoryList, allSubCategoryList } from '../../../API/api';
import Spinner from 'react-bootstrap/Spinner';
import { MdCancel } from 'react-icons/md';
import { AiTwotoneEdit } from "react-icons/ai";

const EditProduct = () => {

    const [formData, setFormData] = useState({
        type: '',
        name: '',
        visibility_in_Catalog: '',
        desc: '',
        tax_status: '',
        regular_price: '',
        categoryId: '',
        subcategoryId: '',
        image: [],
        tags: [],
        position: '',
        brandId: '',
    });
    const [allcategoryList, setAllCategoryList] = useState([]);
    const [allSubcategorylist, setSubCatgoryList] = useState([]);
    const [allbrandList, setAllBrandList] = useState([]);
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    const { id: productId } = useParams()

    async function getProductDetails() {
        try {
            const res = await GetProductDetails(productId);
            setFormData(res?.data?.data);
            setLoading(false)
        } catch (err) {
            console.log(err);
            setLoading(false)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            getCategoryList();
            getSubCategoryList();
            getAllBrandLists();
            getProductDetails();
        }, 5000);
    }, [productId])

    async function getCategoryList() {
        await allCategoryList().then((res) => {
            setAllCategoryList(res?.data?.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    };

    async function getSubCategoryList() {
        await allSubCategoryList().then((res) => {
            setSubCatgoryList(res?.data?.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally(() => [
            setLoading(false)
        ])
    };

    async function getAllBrandLists() {
        await allBrandList().then((res) => {
            setAllBrandList(res?.data?.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleTagInputChange = (e) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            tags: value.split(',').map((tag) => tag.trim()),
        }));
    };

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
            console.log(res, "res");
            setFormData((prevData) => ({
                ...prevData,
                image: [...prevData.image, res?.data?.data?.fileurl],
            }));
        } catch (err) {
            console.error(err, "err");
        }
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            formData.type &&
            formData.name &&
            formData.visibility_in_Catalog &&
            formData.desc &&
            formData.tax_status &&
            formData.regular_price &&
            formData.categoryId &&
            formData.subcategoryId &&
            formData.image.length > 0 &&
            formData.brandId
        ) {
            console.log(formData);

            try {
                const res = await AddNewProduct(formData);
                console.log(res);
                toast.success('Product update successfully!');
                navigate('/Admin/product');
            } catch (err) {
                console.log(err);
                toast.error('An error occurred. Please try again.');
            }
        } else {
            toast.error('Please fill in all required fields.');
        }
    }

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
                </div>
            }
            <div className="productList mt-2 p-4">
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <h3>Edit Product</h3>
                        </Col>
                    </Row>

                    <Row className="justify-content-md-center">
                        <Col>
                            <Form onSubmit={handleSubmit}>

                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId="type">
                                            <Form.Label>Type</Form.Label>
                                            <Form.Control type="text" name="type" placeholder='Enter product type' value={formData.type} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group controlId="name">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" name="name" placeholder='Enter product name' value={formData.name} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group controlId="visibility_in_Catalog">
                                            <Form.Label>Visibility in Catalog</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="visibility_in_Catalog"
                                                value={formData.visibility_in_Catalog}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="" disabled selected>
                                                    Select visibility
                                                </option>
                                                <option value="visible">Visible</option>
                                                <option value="hidden">Hidden</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>

                                    <Col>
                                        <Form.Group controlId="regular_price">
                                            <Form.Label>Regular Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="regular_price"
                                                value={formData.regular_price}
                                                placeholder='Enter product price'
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>


                                    <Col>
                                        <Form.Group controlId="tax_status">
                                            <Form.Label>Tax Status</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="tax_status"
                                                value={formData.tax_status}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="" disabled selected>
                                                    Select tax status
                                                </option>
                                                <option value="taxable">Taxable</option>
                                                <option value="non_taxable">Non-taxable</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>

                                </Row>


                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId="categoryId">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Control as="select" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                                                <option value="" disabled selected>
                                                    Select Category
                                                </option>
                                                {allcategoryList?.length > 0 && allcategoryList?.map((ele) => (
                                                    <option key={ele?._id} value={ele?._id}>{ele?.title}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group controlId="categoryId">
                                            <Form.Label>Sub Category</Form.Label>
                                            <Form.Control as="select" name="subcategoryId" value={formData.subcategoryId} onChange={handleChange} required>
                                                <option value="" disabled selected>
                                                    Select Sub Category
                                                </option>
                                                {allSubcategorylist?.length > 0 && allSubcategorylist?.map((ele) => (
                                                    <option key={ele?._id} value={ele?._id}>{ele?.title}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group controlId="categoryId">
                                            <Form.Label>Brand</Form.Label>
                                            <Form.Control as="select" name="brandId" value={formData.brandId} onChange={handleChange} required>
                                                <option value="" disabled selected>
                                                    Select Brand
                                                </option>
                                                {allbrandList?.length > 0 && allbrandList?.map((ele) => (
                                                    <option key={ele?._id} value={ele?._id}>{ele?.title}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId="position">
                                            <Form.Label>Position</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="position"
                                                placeholder='Enter product position'
                                                value={formData.position}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="tags">
                                            <Form.Label>Tags</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="tags"
                                                value={formData.tags.join(', ')}
                                                onChange={handleTagInputChange}
                                                placeholder="Add tags, separated by commas"
                                                required
                                            />
                                            <Form.Text className="text-muted">
                                                Separate tags with commas (e.g., tag1, tag2).
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId="desc">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control as="textarea" placeholder='Enter Product description' name="desc" value={formData.desc} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>
                                    <Col xs={6}>
                                        <Form.Group controlId="formFileMultiple" className="mb-3">
                                            <Form.Label>Multiple Images</Form.Label>
                                            <Form.Control type="file" onChange={handleImageInputChange} multiple accept="image/jpeg, image/png, image/gif" required />
                                            <Form.Text className="text-muted" >
                                                Select and add multiple images one by one.
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Row>
                                        <Col>
                                            {formData.image.length > 0 && (
                                                <Container>
                                                    <Row>
                                                        {formData.image.map((fileUrl, index) => (
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
                                        <div className="d-grid gap-2">
                                            <Button variant="success" size="lg" type="submit">
                                                <AiTwotoneEdit/> Edit Product
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                    <Toaster position="top-right" />
                </Container>
            </div>
        </>

    )
}

export default EditProduct;