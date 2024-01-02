import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { Toaster, toast } from 'react-hot-toast';
import { IoIosAddCircle } from "react-icons/io";
import { MdCancel, MdOutlineFileUpload } from 'react-icons/md';
import { FileUpload, addNewsSeller, allCategoryList } from "../../../API/api";
import { categoryData } from "../../../dummyData";
import "./listStyle.css";
import { useNavigate } from 'react-router-dom';


const Addseller = () => {
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        phone_no: '',
        email: '',
        password: '',
        address: '',
        pic_of_shope: [],
        gst_no: '',
        picup_location: '',
        commission_data: [],
        shope_name: '',
        status: 'pending',
    });
    const [btnEnale, setBtnEnable] = useState(true)
    const [commissionSave, setCommission] = useState(true)

    const naviagete  = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 3000);
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = Object.values(formData).every((value) => value !== '');

        if (commissionSave) {
            toast.error('Please save your commission');
            return;
        }

        console.log({formData})

        if (isFormValid) {
            try {
                const res = await addNewsSeller(formData);
                console.log(res);
                if (res?.response?.data?.error) {
                    toast.error(res.response.data.data);
                } else {
                    toast.success('Seller created successfully!');
                    setTimeout(() => {
                        naviagete('/key/seller');
                    }, 2500);
                }
            } catch (err) {
                console.error(err);
                toast.error('Something went wrong!');
            }
        } else {
            console.error('Please fill in all the required fields.');
        }
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
            setTimeout(() => {
                setFormData((prevData) => ({
                    ...prevData,
                    pic_of_shope: [...prevData?.pic_of_shope, res?.data?.data?.fileurl],
                }));
            }, 3000);
            setBtnEnable(false)
        } catch (err) {
            console.error(err, "err");
        }
    };

    const handleCancelImage = (url) => {

        let filterData = formData?.pic_of_shope?.filter((e, index) => {
            return e !== url;
        })

        console.log(filterData)

        setFormData((prevData) => ({
            ...prevData,
            pic_of_shope: filterData,
        }));

    }

    const addCategorytoForm = (data) => {
        console.log({ data })
        if (data) {
            setCommission(false)
            setFormData((prevData) => ({
                ...prevData,
                commission_data: [...prevData?.commission_data, ...data],
            }));
        }
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
            <div className="productList mt-2 p-4">
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <h3>Add Seller</h3>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col>
                            <Form onSubmit={handleSubmit}>
                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId="phoneNo">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phone_no"
                                                placeholder='Enter your phone number'
                                                value={formData.phone_no}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder='Enter your email '
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="password"
                                                placeholder='Enter your Password'
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="address">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                placeholder='Enter your Address'
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId="gstNo">
                                            <Form.Label>GST Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="gst_no"
                                                value={formData.gst_no}
                                                placeholder='Enter GST Number'
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="pickupLocation">
                                            <Form.Label>Pickup Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="picup_location"
                                                value={formData.picup_location}
                                                placeholder='Enter Pickup Location'
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className='mt-2'>
                                    <Col xs={6}>
                                        <Form.Group controlId="commissionRate">
                                            <Form.Label>Enter Shop Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="shope_name"
                                                value={formData.shope_name}
                                                placeholder='Enter Shopname'
                                                minLength={3}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>

                                    </Col>
                                </Row>

                                <Row className='mt-3'>
                                    <CommissionComponent addCategorytoForm={addCategorytoForm} />
                                </Row>

                                <Row className="mt-2">
                                    <Col xs={6}>
                                        <Form.Group controlId="formFileMultiple" className="mb-3">
                                            <Form.Label>Shop Images</Form.Label>
                                            <Form.Control
                                                type="file"
                                                onChange={handleImageInputChange}
                                                multiple
                                                accept="image/jpeg, image/png, image/gif"
                                                required
                                            />
                                            <Form.Text className="text-muted">
                                                Add images one by one or select multiple images.
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Row>
                                        <Col>
                                            {formData?.pic_of_shope?.length > 0 && (
                                                <Container>
                                                    <Row>
                                                        {formData?.pic_of_shope.map((fileUrl, index) => (
                                                            <Col key={index} xs={4} md={2}>
                                                                <span>{index + 1}</span>
                                                                <span>
                                                                    <MdCancel
                                                                        style={{
                                                                            color: 'red',
                                                                            fontSize: '20px',
                                                                            cursor: 'pointer',
                                                                        }}
                                                                        onClick={() => handleCancelImage(fileUrl)}
                                                                    />
                                                                </span>
                                                                <Image src={fileUrl} thumbnail fluid />
                                                                {/* Use fluid prop for responsive images */}
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
                                            <Button variant="warning" size="lg" type="submit" disabled={btnEnale && commissionSave}>
                                                <MdOutlineFileUpload /> Add Seller
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>

                            </Form>
                        </Col>
                    </Row>
                </Container>
                <Toaster position="top-right" />
            </div>
        </>
    )
}




const CommissionComponent = ({ addCategorytoForm }) => {
    const [formData, setFormData] = useState({
        categories: [{ categoryId: '', commission_rate: '' }]
    });
    const [categorylist, setcategorylist] = useState([]);


    useEffect(() => {
        getAllCats()
    },[])

    async function getAllCats(){
        await allCategoryList().then((res)=>{
            setcategorylist(res?.data?.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedCategories = [...formData.categories];
        updatedCategories[index][name] = value;
        setFormData({ ...formData, categories: updatedCategories });
    };

    const addCategory = () => {
        setFormData({
            ...formData,
            categories: [...formData.categories, { categoryId: '', commission_rate: '' }]
        });
    };

    const handleSave = () => {
        console.log(formData.categories);
        addCategorytoForm(formData.categories)
    };

    const handleDelete = (index) => {
        const updatedCategories = [...formData.categories];
        updatedCategories.splice(index, 1);
        setFormData({ ...formData, categories: updatedCategories });
    };

    return (

        <Col xs={6} >
            <Form.Group controlId="commissionRate">
                <Form.Label>Commission rate against category(%)</Form.Label>
                <span>
                    <Button variant="dark" onClick={handleSave} size="sm">Save</Button>
                </span>
                {formData.categories.map((item, index) => (
                    <Row key={index} className="mb-2">
                        <Col>
                            <Form.Label>category</Form.Label>
                            <Form.Select
                                name="categoryId"
                                value={item.categoryId}
                                onChange={(e) => handleChange(e, index)}
                                required
                            >
                                <option value="" disabled>Select category</option>
                                {categorylist?.length > 0 && categorylist.map((ele) => (
                                    <option value={ele?._id}>{ele?.title}</option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col>
                            <Form.Label>commission(%)</Form.Label>
                            <Form.Control
                                type="number"
                                name="commission_rate"
                                value={item.commission}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Commisson rate"
                                required
                            />
                        </Col>
                        <Col>
                            <MdCancel size={22} color='red' onClick={() => handleDelete(index)} />
                        </Col>
                    </Row>
                ))}
                <IoIosAddCircle size={26} onClick={addCategory} />
                <span style={{ marginLeft: '5px', color: 'grey', fontSize: '16px' }}  >Add more...</span>
            </Form.Group>
        </Col>


    );
};



export default Addseller