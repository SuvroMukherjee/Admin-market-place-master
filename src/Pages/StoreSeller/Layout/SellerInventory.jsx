import { DataGrid } from "@mui/x-data-grid";
// import "./Seller.css";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Form, ButtonGroup, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { OwnProductSellerList, SellerProductAdd, SellerProductList, StatusUpdateProduct, UpdateSellerProduct, allBrandList, allCategoryList, allProductList, deleteProduct, getSubCategoryByCategory } from "../../../API/api";
import Spinner from 'react-bootstrap/Spinner';
import { categoryData, demoProductData, productRows } from "../../../dummyData";
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import './sellerlayout.css'
import { ChangeFormatDate } from "../../../common/DateFormat";

export default function SellerInventory() {
    const [data, setData] = useState(demoProductData);
    const [loading, setLoading] = useState(true);
    const [allcategoryList, setAllCategoryList] = useState(categoryData);
    const [maindata, setMaindata] = useState([])
    const [allSubcategorylist, setSubCatgoryList] = useState(categoryData);
    const [allbrandList, setAllBrandList] = useState(categoryData);
    const [selectedRows, setSelectedRows] = useState([]);
    const [activeButton, setActiveButton] = useState('sell');
    const [sellerOwnData, setSellerOwnData] = useState([]);
    const [searchtext, setSearchtext] = useState();
    const initialQuantities = [];
    const [clearInput, setClearInput] = useState(false);

    // State for quantities
    const [quantities, setQuantities] = useState([]);

    // Function to update quantity at a specific index
    const setQuantityAtIndex = (index, value) => {
        // Create a copy of the quantities array
        const updatedQuantities = [...quantities];
        // Update the quantity at the specified index
        updatedQuantities[index] = value;
        // Update the state
        setQuantities(updatedQuantities);
    };

    const { userId } = JSON.parse(localStorage.getItem('auth'));



    useEffect(() => {
        setTimeout(() => {
            getProductListFunc();
            getAllCats();
            getBrandList();
            //getAllOwnProducts();
        }, 5000)
    }, []);


    useEffect

    const navigate = useNavigate()


    async function getProductListFunc() {
        await SellerProductList(userId).then((res) => {
            console.log(res?.data?.data, 'data')
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
            setFormData(dataWithUniqueIds)
            setMaindata(dataWithUniqueIds)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally((data) => {
            setLoading(false)
        })
    };

    async function getAllCats() {
        await allCategoryList().then((res) => {
            setAllCategoryList(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    async function getBrandList() {
        await allBrandList().then((res) => {
            console.log(res?.data?.data, 'brands');
            setAllBrandList(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    async function getAllOwnProducts() {
        setLoading(true)
        await OwnProductSellerList(userId).then((res) => {
            console.log(res?.data?.data, 'own data');
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setSellerOwnData(dataWithUniqueIds)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleCategoryChange = async (e) => {
        console.log(e.target.value)
        setLoading(true)
        let filterData = maindata?.filter((ele) => {
            return ele?.categoryId?._id == e?.target?.value;
        })
        setData(filterData);

        await getSubCategoryByCategory(e?.target?.value).then((res) => {
            console.log(res?.data?.data, 'subcats');
            setSubCatgoryList(res?.data?.data)
        }).catch((err) => {
            console.log(err)
        })
        setLoading(false)

    }

    const handleSubChange = (e) => {
        setLoading(true);
        let filterData = maindata?.filter((ele) => {
            return ele?.subcategoryId?._id == e.target.value;
        })
        setData(filterData);
        setLoading(false)
    }

    const handleBrandChange = (e) => {
        console.log(e.target.value)
        setLoading(true);
        let filterData = maindata?.filter((ele) => {
            return ele?.brandId?._id == e.target.value;
        })
        setData(filterData);
        setLoading(false)
    }

    const AddSellerProduct = async (Pid) => {
        let payload = {
            "sellerId": userId,
            "productId": Pid
        }
        await SellerProductAdd(payload).then((res) => {
            console.log(res?.data?.data)
            if (res?.response?.data?.error !== false) {
                toast.success('product added successfully')
            } else {
                toast.error(res?.response?.data?.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    const handleStatus = async (dataset) => {
        let payload = {
            "status": !dataset?.status
        }

        await StatusUpdateProduct(dataset?._id, payload).then((res) => {
            console.log(res)
            getProductListFunc()
            toast.success('Product status updated successfully!');
        }).catch((err) => {
            console.log(err)
        })
    }


    const handledeleteProduct = async (id) => {
        await deleteProduct(id).then((res) => {
            console.log(res)
            getProductListFunc()
            toast.success('Product deleted successfully!');
        }).catch((err) => {
            console.log(err)
        })
    }




    const handleButtonClick = (buttonType) => {
        if (buttonType == 'sell') {
            setLoading(true)
            getProductListFunc();
        }
        else if (buttonType == 'own') {
            getAllOwnProducts();
        }
        setActiveButton(buttonType);
    };




    const navbarStyle = {
        paddingLeft: '0px', // Adjust the left padding
        paddingRight: '10px', // Adjust the right padding
        height: '5vh'
    };




    const [formData, setFormData] = useState([]);

    const handleUpdate = async (index) => {
        console.log(formData[index])
        console.log(quantities[index])

        formData[index].quantity = quantities[index] || 0;

        let res = await UpdateSellerProduct(formData[index]?._id, formData[index]);

        console.log({ res })

        if (res.data.error == false) {
            toast.success('Inventory update successfully...')
            setQuantities([])
            setClearInput(true);
            setTimeout(() => {
                setClearInput(false);
            }, 100);
            getProductListFunc();

        }

    }


    const handleQuansChange = (specIndex, quantity) => {
        console.log(specIndex, quantity);

        setFormData((prevData) => {
            const newData = [...prevData];
            newData[specIndex] = { ...newData[specIndex], quantity: parseInt(quantity) };
            return newData;
        });
    };

    const handlePriceChange = (specIndex, quantity) => {
        setFormData((prevData) => {
            const newData = [...prevData];
            newData[specIndex] = { ...newData[specIndex], price: quantity };
            return newData;
        });
    };

    const handleShippingChange = (specIndex, shipping) => {
        setFormData((prevData) => {
            const newData = [...prevData];
            newData[specIndex] = { ...newData[specIndex], shipping };
            return newData;
        });
    };

    console.log(formData[0])


    const handleSearch = () => {

        let filterData = data?.filter((ele) => {
            return ele?.name?.toLowerCase()?.includes(searchtext?.toLowerCase()) || ele?.specId?.skuId?.toLowerCase()?.includes(searchtext?.toLowerCase())
        })

        console.warn({ filterData });
        setData(filterData);
    }

    console.log({ quantities })

    return (
        <div>
            <div>
                <Navbar className="bg-body-tertiary" style={navbarStyle}>
                    <Container>
                        <Navbar.Brand href="#home" className="Caption">Manage Inventory</Navbar.Brand>
                    </Container>
                </Navbar>
            </div>
            <Container className="mt-4">
                <Row className="mt-4">
                    <Col className="dtext2">Manage Your Inventory : <span style={{ fontSize: '12px' }}>Total Products {data?.length}</span> </Col>
                </Row>
                <Row className="mt-4">
                    <Col xs={4}>
                        <Form.Control
                            type="text"
                            size="sm"
                            placeholder="Search by SKU or Product name"
                            name="searchtext"
                            required
                            value={searchtext}
                            onChange={(e) => setSearchtext(e.target.value)}
                        />
                    </Col>
                    <Col xs={2}>
                        <Button variant="warning" size="sm" onClick={() => handleSearch()}>Search</Button>
                    </Col>
                    <Col xs={2}>
                        <Button variant="dark" size="sm" onClick={() => { getProductListFunc(); setSearchtext('') }}>See All Products</Button>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Image</th>
                                    <th>SKU</th>
                                    <th>Product Name</th>
                                    <th>Date Created</th>
                                    <th>Available Quantity</th>
                                    <th>MRP price</th>
                                    <th>Selling Price</th>
                                    <th>Shipping Price</th>
                                    <th>Commission Price</th>
                                    <th>Add Quatity</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.length > 0 && data?.map((ele, index) => (
                                    <tr>
                                        <td>{ele?.status ? <span style={{ color: 'green' }}>Active</span> : <span style={{ color: 'red' }}>InActive</span>}<br />
                                        </td>
                                        <td>
                                            <Image src={ele?.specId?.image?.[0]?.image_path} thumbnail width={60} height={60} />
                                        </td>
                                        <td onClick={() => navigate(`/seller/product-deatils/${ele?._id}`)}>{ele?.specId?.skuId}</td>
                                        <td onClick={() => navigate(`/seller/product-deatils/${ele?._id}`)} className="pname">{ele?.name}</td>
                                        <td className="datecolor">{ChangeFormatDate(ele?.updatedAt)}</td>
                                        <td className="avaible">
                                            {ele?.available_qty || 0}
                                        </td>
                                        <td>
                                            {ele?.specId?.price}
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="tel"
                                                size="sm"
                                                placeholder="Product Price"
                                                name="price"
                                                required
                                                // value={formData[index]?.price}
                                                onChange={(e) => handlePriceChange(index, e.target.value)}
                                                defaultValue={ele?.price}

                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                type="tel"
                                                size="sm"
                                                placeholder="Shipping Price"
                                                name="shipping_cost"
                                                required
                                                // value={formData[index]?.price}
                                                onChange={(e) => handleShippingChange(index, e.target.value)}
                                                defaultValue={ele?.shipping_cost}

                                            />

                                        </td>
                                        <td>{ele?.comission_price}</td>
                                        <td>

                                            <Form.Control
                                                type="number"
                                                size="sm"
                                                placeholder="Add Quantity"
                                                name="quantity"
                                                required
                                                value={clearInput ? '' : quantities[index]}
                                                // value={formData[index]?.price}
                                                onChange={(e) => setQuantityAtIndex(index, parseInt(e.target.value))}
                                            />

                                        </td>
                                        <td>
                                            <Button size="sm" variant="warning" onClick={() => handleUpdate(index)}>Save</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Toaster position="top-right" />
            </Container>
        </div>
    )

}
