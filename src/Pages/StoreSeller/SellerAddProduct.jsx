import { DataGrid } from "@mui/x-data-grid";
import "./Seller.css";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Form, Card, ListGroup } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { SellerProductAdd, StatusUpdateProduct, allBrandList, allCategoryList, allProductList, deleteProduct, getSubCategoryByCategory } from "../../API/api";
import Spinner from 'react-bootstrap/Spinner';
import { categoryData, demoProductData, productRows } from "../../dummyData";
import Modal from 'react-bootstrap/Modal';
import { IoIosCloseCircle } from "react-icons/io";



export default function SellerAddProduct() {
    const [data, setData] = useState(demoProductData);
    const [loading, setLoading] = useState(true);
    const [allcategoryList, setAllCategoryList] = useState();
    const [maindata, setMaindata] = useState([])
    const [allSubcategorylist, setSubCatgoryList] = useState();
    const [allbrandList, setAllBrandList] = useState();
    const [selectedRows, setSelectedRows] = useState([]);
    const [show, setShow] = useState(false);
    const [seletedProducrt, setSelectedProduct] = useState()
    const [formData, setFormData] = useState([]);

    const handlePriceChange = (specIndex, price) => {
        setFormData((prevData) => {
            const newData = [...prevData];
            newData[specIndex] = { ...newData[specIndex], price };
            return newData;
        });
    };

    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    

    useEffect(() => {
        setTimeout(() => {
            getProductListFunc();
            getAllCats();
            getBrandList();
        }, 5000)
    }, []);


    const navigate = useNavigate()

    const handleSelectChange = (event) => {
        const selectedValues = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedOptions(selectedValues);
    };


    async function getProductListFunc() {
        await allProductList().then((res) => {
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

    const handleCategoryChange = async (e) => {
        console.log(e.target.value)
        setLoading(true)
        let filterData = demoProductData?.filter((ele) => {
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
        let filterData = demoProductData?.filter((ele) => {
            return ele?.subcategoryId?._id == e.target.value;
        })
        setData(filterData);
        setLoading(false)
    }

    const handleBrandChange = (e) => {
        console.log(e.target.value)
        setLoading(true);
        let filterData = demoProductData?.filter((ele) => {
            return ele?.brandId?._id == e.target.value;
        })
        setData(filterData);
        setLoading(false)
    }

    const AddSellerProduct = async (Pid,SpecId,price) => {

        if(price){
            let payload = {
                "sellerId": userId,
                "productId": Pid,
                "specId": SpecId,
                "price": price,
                // "discount_price": inputValue?.discount_price
            }

            console.log(payload);

            await SellerProductAdd(payload).then((res) => {
               
                if (res?.response?.data?.error == true) {
                    toast.error(res?.response?.data?.message)
                    
                   // handleClose();
                } else {
                    toast.success('product added successfully');
                }
            }).catch((err) => {
                console.log(err)
            })
        }
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
        {
            field: "action",
            headerName: "Action",
            width: 300,
            renderCell: (params) => {
                return (
                    <>

                        <div className="buttonWrapper">
                            <Button variant="success" onClick={() => AddSellerProduct(params?.row?._id)} size="sm">
                                <RiEdit2Line /> Add Item
                            </Button>
                        </div>
                    </>
                );
            },
        },
    ];

    // new

    const handleAddProduct = (product) => {
        setSelectedProduct(product)
        handleShow();
    }


  


    const handleSubmit = (index) => {
        console.log('Form Data:', formData[index]);
        // You can now send formData to your server or perform any other desired actions
    };

    console.log({data})

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
                            <h3>Add Your Product</h3>
                        </Col>
                    </Row>
                    <Row className="mb-3 mt-3">
                        <Col className="text-dark fw-bold">Apply Filter</Col>
                    </Row>
                    <Row className="w-40 mb-2 mt-2">
                        <Col>
                            <Form.Group controlId="categoryId">
                                <Form.Label className="text-dark fw-bold">Category</Form.Label>
                                <Form.Control as="select" name="categoryId" onChange={handleCategoryChange} required>
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
                                <Form.Label className="text-dark fw-bold">Sub Category</Form.Label>
                                <Form.Control as="select" name="subcategoryId" onChange={handleSubChange} required>
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
                                <Form.Label className="text-dark fw-bold">Brand</Form.Label>
                                <Form.Control as="select" name="brandId" onChange={handleBrandChange} >
                                    <option value="" disabled selected>
                                        Select Brand
                                    </option>
                                    {allbrandList?.length > 0 && allbrandList?.map((ele) => (
                                        <option key={ele?._id} value={ele?._id}>{ele?.title}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col className="d-flex justify-content-center align-items-end">
                            <Button variant="dark" size="sm" className="w-10 p-2" onClick={() => { setLoading(true); getProductListFunc() }}>
                                <IoIosCloseCircle size={25}/> clear Filter</Button>
                        </Col>
                    </Row>
                    {/* <Row className="justify-content-md-center">
                        <Col>
                            <DataGrid
                                rows={data}
                                columns={columns}
                                pageSize={8}
                                // checkboxSelection
                                // onSelectionModelChange={(ids) => {
                                //     const selectedIDs = new Set(ids);
                                //     const selectedRows = data.rows.filter((row) =>
                                //         selectedIDs.has(row.id),
                                //     );

                                //     setSelectedRows(selectedRows);
                                // }}
                                noRowsOverlay={
                                    data?.length === 0 && <div style={{ textAlign: 'center', padding: '20px' }}>No Data Found</div>
                                }
                            />
                        </Col>
                    </Row> */}
                    <Toaster position="top-right" />
                </Container>

                <Container className="mt-4">
                    <Row className="d-flex justify-content-md-center gap-4">
                        {data?.length > 0 && data?.map((ele, index) => (
                            <Col key={index} className="d-flex justify-content-md-center">
                                <Card style={{ width: '18rem' }}>
                                    {ele?.image?.[0]?.length < 15 ?
                                        <Card.Img variant="top" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf9vk9y50x6ZHHMLz9LHvwG-iUx0IUtLUmqg&usqp=CAU' style={{ height: '200px', objectFit: 'cover' }} /> :
                                        <Card.Img variant="top" src={ele?.image?.[0]?.image_path} style={{ height: '250px', objectFit: 'cover' }} />
                                    }
                                    <Card.Body>
                                        <Card.Title className="p-name">{ele?.name}</Card.Title>
                                        <Card.Subtitle className="p-catname">{ele?.brandId?.title} | {ele?.categoryId?.title}</Card.Subtitle>
                                        <Card.Text className="p-desc"> 
                                            {ele?.desc?.slice(0, 100) + '.....'}
                                        </Card.Text>
                                        <div className="p-desc">
                                            <ul>
                                                {ele?.features?.length > 0 && ele?.features?.map((ele)=>(
                                                    <li>{ele}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <Card.Subtitle className="p-catname">M.R.P - {ele?.regular_price?.toLocaleString()}</Card.Subtitle>
                                        {/* <Card.Subtitle className="p-catname">
                                            
                                                    {ele?.specId?.length > 0 && ele?.specId?.map((ele) => (
                                                        <span>{ele?.price} | </span>
                                                    ))}
                                            
                                        </Card.Subtitle> */}
                                    </Card.Body>
                                    <Card.Footer>
                                        <Button variant="outline-success w-100" onClick={() => handleAddProduct(ele)}>Select Product</Button>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <Row>
                        <Modal size="md" show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title className="p-catname">{seletedProducrt?.name}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Row>
                                        <Col>
                                            <ListGroup style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                                {seletedProducrt?.specId?.map((ele, index) => (
                                                    <ListGroup.Item key={ele?._id}>
                                                        <Row>
                                                            <Col xs={10}>
                                                                <strong style={{ fontSize: '12px' }}>Specification Details: {index + 1}</strong>
                                                            </Col>
                                                            <Col xs={2}>
                                                                <Button variant="outline-success" size="sm" onClick={() => AddSellerProduct(ele?.productId, ele?._id, formData[index]?.price)}>SAVE</Button>
                                                            </Col>
                                                        </Row>

                                                        <Row className='locationTagHeader mt-2'>
                                                            <Col xs={2}>MRP (₹)</Col>
                                                            {ele?.spec_det?.map((e) => (
                                                                <Col xs={2}>{e?.title}</Col>
                                                            ))}
                                                            <Col>Enter product price (₹)</Col>

                                                        </Row>
                                                        <Row className='locationTagvalue mt-2'>
                                                            <Col xs={2} >{ele?.price}</Col>
                                                            {ele?.spec_det?.map((e) => (
                                                                <Col xs={2}>{e?.value}</Col>
                                                            ))}
                                                            <Col>
                                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                                    <Form.Control
                                                                        type="tel"
                                                                        size="sm"
                                                                        placeholder="Product Price"
                                                                        name="price"
                                                                        required
                                                                        max={ele?.price}
                                                                        value={formData[index]?.price}
                                                                        onChange={(e) => handlePriceChange(index, e.target.value)}

                                                                    />
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    </Row>
                </Container>

            </div>
        </>
    );
}