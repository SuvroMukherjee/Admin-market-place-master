import React from 'react'
import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import { categoryData, productRows } from "../../../dummyData";
import "./listStyle.css";
import { FileUpload, UpdateSellerData, addNewsSeller, allCategoryList, allSellerList, sellerDetails } from "../../../API/api";
import { useEffect } from "react";
import { AiOutlinePlus, AiTwotoneEdit } from "react-icons/ai";
import { Button, Col, Container, Row, Form, Image, Table, ListGroup } from 'react-bootstrap';
import { DataGrid } from "@mui/x-data-grid";
import { MdCancel, MdOutlineFileUpload } from 'react-icons/md';
import { IoIosAddCircle } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

const EditSeller = () => {
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        phone_no: '',
        email: '',
        password: '',
        address: '',
        pic_of_shope: [],
        gst_no: '',
        picup_location: '',
       // commission_data: [],
        shope_name: '',
        pin_code: '',
        address: '',
        total_no_of_unit: '',
        old_shope_desc: '',
        status: 'pending',
        review: ''
    });
    const [btnEnale, setBtnEnable] = useState(true)
    const [commissionSave, setCommission] = useState(true)
    const [catsdata, setCatsData] = useState([])
    const [searchItems, setSearchItems] = useState([])

    const { id: SellerId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            getSellerDetails();
        }, 3000);
    }, [])

    async function getSellerDetails() {
        await sellerDetails(SellerId).then((res) => {
            console.log(res);

            // Extracting data from the response and excluding the password
            const { password, ...filteredData } = res?.data?.data;

            // Setting the filtered data in the state
            setFormData(filteredData);
          //  setCatsData(filteredData?.commission_data);
            setLoading(false);
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setLoading(false);
        });
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isFormValid = Object.values(formData).every((value) => value !== '');

        console.log(formData)

        // if (isFormValid) {
        //     console.log(formData);
        //     await UpdateSellerData(SellerId,formData).then((res) => {
        //         console.log(res)
        //         toast.success('Seller updated successfully!');
        //         navigate('/key/seller')
        //     }).catch((err) => {
        //         console.log(err)
        //         toast.error('Something went wrong!');
        //     })
        // } else {
        //     console.error('Please fill in all the required fields.');
        // }
        console.table(formData)
        if (isFormValid) {
            try {
                const res = await UpdateSellerData(SellerId, formData);
                console.log(res);
                if (res?.response?.data?.error) {
                    toast.error(res.response.data.data);
                } else {
                    console.log(res)
                    toast.success('Seller updated successfully!');
                    navigate('/key/seller');
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

    const getSellerShopLocation = async () => {

        if (formData?.pin_code != '') {

               let res = await getLocationByZipCoder(formData?.pin_code);

          
            console.table(res?.data?.results[formData?.pin_code])
            setSearchItems(res?.data?.results[formData?.pin_code])

        }
    }


    const saveAddress = async (locData) => {
        setFormData((prevData) => ({
            ...prevData,
            address: JSON.stringify(locData),
        }));
        setSearchItems([])
        //console.log({ locData })

        //    setFormData({ ...formData, [address]: JSON.stringify(locData) });
    }

    const formattedAddress = Object.entries(formData?.address)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n'); 


    return (
        <>
            {loading &&
                <div className="productList p-4 contentLoader">
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
                            <h3>Edit Seller</h3>
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
                                    {/* <Col>
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
                                    </Col> */}
                                    {/* <Col>
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
                                    </Col> */}

                                    <Col>
                                        <Form.Group controlId="gstNo">
                                            <Form.Label>GST Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="gst_no"
                                                value={formData.gst_no}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col></Col>
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
                                        <Form.Group controlId="pickupLocation">
                                            <Form.Label>Pickup Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="picup_location"
                                                value={formData.picup_location}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                </Row>

                                <Row className='mt-2'>

                                    <Col>
                                        <Row>
                                            <Col xs={10}>
                                                <Form.Group controlId="commissionRate">
                                                    <Form.Label>Shop Location </Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="pin_code"
                                                        value={formData.pin_code}
                                                        placeholder='Search location by pincode..'
                                                        minLength={3}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col sx={2} className='d-flex align-items-end'>
                                                <Button size="md" variant='dark' onClick={() => getSellerShopLocation()}>
                                                    <FaSearch />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Group controlId="commissionRate">
                                            <Form.Label>Shop Address</Form.Label>
                                            <Form.Control
                                                as="textarea" // Set the type to "textarea"
                                                rows={3}      // You can adjust the number of rows as needed
                                                name="address"
                                                value={formattedAddress}
                                                //defaultValue={formData?.address}
                                                 //value={formData?.address}
                                                // placeholder='Enter Shopname'
                                                // minLength={3}
                                                // onChange={handleChange}
                                                readOnly
                                                required
                                                disabled
                                            />
                                        </Form.Group>
                                    </Col>
                                      
                                </Row>

                                {searchItems?.length > 0 &&
                                    <Row className='mt-0'>
                                        <Col></Col>
                                        <Col offset={6} xs={6}>
                                            <h6>Results:</h6>
                                            <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }} className='p-2'>
                                                {searchItems.map((data, index) => (
                                                    <ListGroup.Item action key={index}>
                                                        <Row>
                                                            <Col xs={10}>
                                                                <strong style={{ fontSize: '12px' }}>Address Details: {index + 1}</strong>
                                                            </Col>
                                                            <Col xs={2}>
                                                                <Button variant='outline-success' size="sm" onClick={() => saveAddress(data)}>SAVE</Button>
                                                            </Col>
                                                        </Row>

                                                        <Row className='locationTagHeader mt-2'>
                                                            <Col>City</Col>
                                                            <Col >State</Col>
                                                            <Col>Province</Col>
                                                        </Row>
                                                        <Row className='locationTagvalue'>
                                                            <Col >{data?.city}</Col>
                                                            <Col>{data?.state}</Col>
                                                            <Col>{data?.province}</Col>
                                                        </Row>
                                                    </ListGroup.Item>

                                                ))}
                                            </ListGroup>
                                        </Col>
                                    </Row>}

                                {/* <Row className='mt-2'>
                                    <Col>
                                        <CommissionComponentshow addCategorytoForm={addCategorytoForm} catsdata={catsdata} />
                                    </Col>
                                </Row> */}

                                <Row className='mt-3'>
                                    <Col>
                                        <Form.Group controlId="pickupLocation">
                                            <Form.Label>Total Year of Busniess Experience</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="old_shope_desc"
                                                value={formData.old_shope_desc}
                                                placeholder='Enter Busniess Experince'
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group controlId="pickupLocation">
                                            <Form.Label>Total of Units Sold Each Year</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="total_no_of_unit"
                                                value={formData.total_no_of_unit}
                                                placeholder='Enter Total Units'
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                        <Form.Group controlId="pickupLocation">
                                            <Form.Label>Review / Rating</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="review"
                                                value={formData.review}
                                                placeholder='Enter Review'
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

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
                                            <Button variant="success" size="lg" type="submit">
                                                <AiTwotoneEdit /> Edit Seller
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

export const CommissionComponentshow = ({ addCategorytoForm, catsdata }) => {

    console.log({ catsdata })

    const [formData, setFormData] = useState({
        categories: [{ categoryId: '', commission_rate: '' }]
    });
    const [categorylist, setcategorylist] = useState([]);


    useEffect(() => {
        getAllCats()
    }, [])

    async function getAllCats() {
        await allCategoryList().then((res) => {
            setcategorylist(res?.data?.data)
        }).catch((err) => {
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
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="text-center">Category Title</th>
                        <th className="text-center">Commission Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {catsdata?.map((item, index) => (
                        <tr key={index}>
                            <td className="text-center">{item?.categoryId?.title}</td>
                            <td className="text-center">{item?.commission_rate}%</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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
        </>




    );
};




export default EditSeller