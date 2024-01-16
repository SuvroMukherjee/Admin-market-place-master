import { DataGrid } from "@mui/x-data-grid";
// import "./Seller.css";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Form, ButtonGroup, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { OwnProductSellerList, SellerProductAdd, SellerProductList, StatusUpdateProduct, allBrandList, allCategoryList, allProductList, deleteProduct, getSubCategoryByCategory } from "../../../API/api";
import Spinner from 'react-bootstrap/Spinner';
import { categoryData, demoProductData, productRows } from "../../../dummyData";
import Navbar from 'react-bootstrap/Navbar';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';

export default function SellerInventory() {
    const [data, setData] = useState(demoProductData);
    const [loading, setLoading] = useState(true);
    const [allcategoryList, setAllCategoryList] = useState(categoryData);
    const [maindata, setMaindata] = useState([])
    const [allSubcategorylist, setSubCatgoryList] = useState(categoryData);
    const [allbrandList, setAllBrandList] = useState(categoryData);
    const [selectedRows, setSelectedRows] = useState([]);
    const [activeButton, setActiveButton] = useState('sell');
    const [sellerOwnData, setSellerOwnData] = useState([])

    const { userId } = JSON.parse(localStorage.getItem('auth'));



    useEffect(() => {
        setTimeout(() => {
            getProductListFunc();
            getAllCats();
            getBrandList();
            //getAllOwnProducts();
        }, 5000)
    }, []);


    const navigate = useNavigate()


    async function getProductListFunc() {
        await SellerProductList(userId).then((res) => {
            console.log(res?.data?.data, 'data')
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
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


    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "productId", headerName: "Product Id", width: 150 },
        { field: "name", headerName: "Name", width: 250 },
        {
            field: "image", headerName: "Image", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        <img className="productListImg" src={params?.row?.image?.[0]} alt="" />
                        {params?.row?.image?.length > 1 && <span>{params?.row?.image?.length - 1}+</span>}
                    </div>
                );
            }
        },
        { field: "regular_price", headerName: "Price", width: 150, },
        { field: "desc", headerName: "Description", width: 150 },
        {
            field: "category", headerName: "Category", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row.categoryId?.title}
                    </div>
                );
            }
        },
        {
            field: "Subcategory", headerName: "Sub Category", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row.subcategoryId?.title}
                    </div>
                );
            }
        },
        {
            field: "Brand", headerName: "Brand", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row?.brandId?.title}
                    </div>
                );
            }
        },
        {
            field: "tags", headerName: "Tags", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row?.tags?.map((ele, i) => (
                            <p key={i}>{ele},</p>
                        ))}
                    </div>
                );
            }
        },
        {
            field: "status", headerName: "Status", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params?.row?.status ? <span className="ActiveStatus">Active</span> : <span className="DeactiveStatus">Not Active</span>}
                    </div>
                );
            }
        },
        { field: "type", headerName: "Type", width: 150 },
        // {
        //     field: "action",
        //     headerName: "Action",
        //     width: 300,
        //     renderCell: (params) => {
        //         return (
        //             <>

        //                 <div className="buttonWrapper">
        //                     <Button variant="success" onClick={() => AddSellerProduct(params?.row?._id)} size="sm">
        //                         <RiEdit2Line /> Add Item
        //                     </Button>
        //                 </div>
        //             </>
        //         );
        //     },
        // },
    ];




    const columnsOwn = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Name", width: 250 },
        {
            field: "image", headerName: "Image", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        <img className="productListImg" src={params?.row?.image?.[0]} alt="" />
                        {params?.row?.image?.length > 1 && <span>{params?.row?.image?.length - 1}+</span>}
                    </div>
                );
            }
        },
        { field: "regular_price", headerName: "Price", width: 150, },
        { field: "desc", headerName: "Description", width: 150 },
        {
            field: "category", headerName: "Category", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row.categoryId?.title}
                    </div>
                );
            }
        },
        {
            field: "Subcategory", headerName: "Sub Category", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row.subcategoryId?.title}
                    </div>
                );
            }
        },
        {
            field: "Brand", headerName: "Brand", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row?.brandId?.title}
                    </div>
                );
            }
        },
        {
            field: "tags", headerName: "Tags", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row?.tags?.map((ele, i) => (
                            <p key={i}>{ele},</p>
                        ))}
                    </div>
                );
            }
        },
        {
            field: "status", headerName: "Is Approve", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params?.row?.is_approved == 'pending' ? <span className="DeactiveStatus">Pending</span> : <span className="ActiveStatus">Approved</span>}
                    </div>
                );
            }
        },
        {
            field: "action",
            headerName: "Action",
            width: 300,
            renderCell: (params) => {
                return (
                    <>

                        <div className="buttonWrapper">
                            <Button variant="warning" onClick={() => navigate(`/seller/seller-editownproduct/${params?.row?._id}`)} size="sm">
                                <RiEdit2Line /> Edit
                            </Button>
                        </div>
                    </>
                );
            },
        },
    ];


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

    console.log({ data })

    // return (
    //     <>
    //         {loading &&
    //             <div className="productList mt-2 p-4 contentLoader">
    //                 <Row>
    //                     <Col>
    //                         <Spinner animation="border" size="lg" role="status">
    //                             <span className="visually-hidden">Loading...</span>
    //                         </Spinner>
    //                     </Col>
    //                 </Row>
    //             </div>}
    //         <div className="productList mt-2 p-4">

    //             <Container>
    //                 <Row className="justify-content-md-center">
    //                     <Col md="auto">
    //                         {/* <h3>Product List</h3> */}
    //                         <ButtonGroup>
    //                             <Button
    //                                 variant={activeButton === 'sell' ? 'dark' : 'outline-dark'}
    //                                 onClick={() => handleButtonClick('sell')}
    //                                 class="fw-bold"
    //                             >
    //                                 <span className="fw-bold">  Selling Products</span>
    //                             </Button>
    //                             <Button
    //                                 variant={activeButton === 'own' ? 'dark' : 'outline-dark'}
    //                                 onClick={() => handleButtonClick('own')}
    //                                 class="fw-bold"
    //                             >
    //                                 <span className="fw-bold">  Own Products</span>
    //                             </Button>
    //                         </ButtonGroup>
    //                     </Col>
    //                 </Row>
    //                 {activeButton == 'sell' &&
    //                     <div>

    //                         <Row className="mb-3 mt-3">
    //                             <Col className="text-dark fw-bold">Apply Filter</Col>
    //                         </Row>
    //                         <Row className="w-40 mb-2 mt-2">
    //                             <Col>
    //                                 <Form.Group controlId="categoryId">
    //                                     <Form.Label className="text-dark fw-bold">Category</Form.Label>
    //                                     <Form.Control as="select" name="categoryId" onChange={handleCategoryChange} required>
    //                                         <option value="" disabled selected>
    //                                             Select Category
    //                                         </option>
    //                                         {allcategoryList?.length > 0 && allcategoryList?.map((ele) => (
    //                                             <option key={ele?._id} value={ele?._id}>{ele?.title}</option>
    //                                         ))}
    //                                     </Form.Control>
    //                                 </Form.Group>
    //                             </Col>
    //                             <Col>
    //                                 <Form.Group controlId="categoryId">
    //                                     <Form.Label className="text-dark fw-bold">Sub Category</Form.Label>
    //                                     <Form.Control as="select" name="subcategoryId" onChange={handleSubChange} required>
    //                                         <option value="" disabled selected>
    //                                             Select Sub Category
    //                                         </option>
    //                                         {allSubcategorylist?.length > 0 && allSubcategorylist?.map((ele) => (
    //                                             <option key={ele?._id} value={ele?._id}>{ele?.title}</option>
    //                                         ))}
    //                                     </Form.Control>
    //                                 </Form.Group>
    //                             </Col>
    //                             <Col>
    //                                 <Form.Group controlId="categoryId">
    //                                     <Form.Label className="text-dark fw-bold">Brand</Form.Label>
    //                                     <Form.Control as="select" name="brandId" onChange={handleBrandChange} >
    //                                         <option value="" disabled selected>
    //                                             Select Brand
    //                                         </option>
    //                                         {allbrandList?.length > 0 && allbrandList?.map((ele) => (
    //                                             <option key={ele?._id} value={ele?._id}>{ele?.title}</option>
    //                                         ))}
    //                                     </Form.Control>
    //                                 </Form.Group>
    //                             </Col>
    //                             <Col className="d-flex justify-content-center align-items-center">
    //                                 <Button variant="dark" className="w-10 p-2" onClick={() => { setLoading(true); getProductListFunc() }}>All Reset</Button>
    //                             </Col>
    //                         </Row>
    //                         {/* <Row className="justify-content-md-center">
    //                             <Col>
    //                                 <DataGrid
    //                                     rows={data}
    //                                     columns={columns}
    //                                     pageSize={8}
    //                                     noRowsOverlay={
    //                                         data?.length === 0 && <div style={{ textAlign: 'center', padding: '20px' }}>No Data Found</div>
    //                                     }
    //                                 />
    //                             </Col>
    //                         </Row> */}
    //                     </div>}


    //                 <Toaster position="top-right" />
    //             </Container>

    //             <Container className="mt-4">
    //                 {activeButton == 'sell' &&
    //                     <Row className="d-flex justify-content-md-center gap-4">
    //                         {data?.length > 0 && data?.map((ele, index) => (
    //                             <Col key={index} className="d-flex justify-content-md-center">
    //                                 <Card style={{ width: '18rem' }}>
    //                                     {ele?.image?.[0]?.length < 15 ?
    //                                         <Card.Img variant="top" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf9vk9y50x6ZHHMLz9LHvwG-iUx0IUtLUmqg&usqp=CAU' style={{ height: '200px', objectFit: 'cover' }} /> :
    //                                         <Card.Img variant="top" src={ele?.productId?.image?.[0]?.image_path} style={{ height: '200px', objectFit: 'cover' }} />
    //                                     }
    //                                     <Card.Body>
    //                                         <Card.Title className="p-name">{ele?.name}</Card.Title>
    //                                         <Card.Subtitle className="p-catname">{ele?.productId?.brandId?.title} | {ele?.productId?.categoryId?.title}</Card.Subtitle>
    //                                         <Card.Text className="p-desc">
    //                                             {ele?.productId?.desc?.slice(0, 100) + '.....'}
    //                                         </Card.Text>
    //                                     </Card.Body>
    //                                     <Card.Footer>
    //                                         {console.log({ ele })}
    //                                         <Button variant="outline-success w-100">Price - {ele?.price}</Button>
    //                                     </Card.Footer>
    //                                 </Card>
    //                             </Col>
    //                         ))}
    //                     </Row>}
    //                 {activeButton == 'own' &&
    //                     <Row className="d-flex justify-content-md-center gap-4">
    //                         {sellerOwnData?.length > 0 && sellerOwnData?.map((ele, index) => (
    //                             <Col key={index} className="d-flex justify-content-md-center">
    //                                 <Card style={{ width: '18rem' }}>
    //                                     {ele?.image?.[0]?.length < 15 ?
    //                                         <Card.Img variant="top" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf9vk9y50x6ZHHMLz9LHvwG-iUx0IUtLUmqg&usqp=CAU' style={{ height: '200px', objectFit: 'cover' }} /> :
    //                                         <Card.Img variant="top" src={ele?.image?.[0]} style={{ height: '200px', objectFit: 'cover' }} />
    //                                     }
    //                                     <Card.Body>
    //                                         <Card.Title className="p-name">{ele?.name}</Card.Title>
    //                                         <Card.Subtitle className="p-catname">{ele?.brandId?.title} | {ele?.categoryId?.title}</Card.Subtitle>
    //                                         <Card.Text className="p-desc">
    //                                             {ele?.desc?.slice(0, 100) + '.....'}
    //                                         </Card.Text>
    //                                     </Card.Body>
    //                                     <Card.Footer>
    //                                         <Button variant="outline-success w-100" onClick={() => handleAddProduct(ele)}>Select Product</Button>
    //                                     </Card.Footer>
    //                                 </Card>
    //                             </Col>
    //                         ))}
    //                     </Row>}
    //             </Container>

    //         </div>
    //     </>
    // );

    const navbarStyle = {
        paddingLeft: '0px', // Adjust the left padding
        paddingRight: '10px', // Adjust the right padding
        height: '10vh'
    };


    const handleUpdate = (id) => {

    }

    return (
        <div>
            <div>
                <Navbar className="bg-body-tertiary" style={navbarStyle}>
                    <Container>
                        <Navbar.Brand href="#home">Manage Inventory</Navbar.Brand>
                    </Container>
                </Navbar>
            </div>
            <Container>
                <Row>
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Image</th>
                                    <th>SKU</th>
                                    <th>Product Name</th>
                                    <th>Date Created</th>
                                    <th>Available</th>
                                    <th>MRP price</th>
                                    <th>Selling Price</th>
                                    <th>Shipping Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.length > 0 && data?.map((ele) => (
                                    <tr>
                                        <td>{ele?.status ? 'Active' : 'InActive'}</td>
                                        <td>
                                            <Image src={ele?.specId?.image?.[0]?.image_path} thumbnail width={60} height={60} />
                                        </td>
                                        <td>{ele?.specId?.skuId}</td>
                                        <td>{ele?.name}</td>
                                        <td>{ele?.specId?.createdAt}</td>
                                        <td>
                                            <button>-</button>{ele?.quantity}<button>+</button>
                                            {/* <input type="number"  defaultValue={ele?.quantity}/>
                                            {ele?.quantity} */}
                                        </td>
                                        <td>{ele?.price}</td>
                                        <td>{ele?.shipping_cost}</td>
                                        <td>
                                            <Button size="sm" onClick={() => handleUpdate(ele?._id)}>Save</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </div>
    )

}
