import { DataGrid } from "@mui/x-data-grid";
import "./Seller.css";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Form } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { SellerProductAdd, StatusUpdateProduct, allBrandList, allCategoryList, allProductList, deleteProduct, getSubCategoryByCategory } from "../../API/api";
import Spinner from 'react-bootstrap/Spinner';
import { categoryData, demoProductData, productRows } from "../../dummyData";


export default function SellerAddProduct() {
    const [data, setData] = useState(demoProductData);
    const [loading, setLoading] = useState(true);
    const [allcategoryList, setAllCategoryList] = useState(categoryData);
    const [maindata, setMaindata] = useState([])
    const [allSubcategorylist, setSubCatgoryList] = useState(categoryData);
    const [allbrandList, setAllBrandList] = useState(categoryData);
    const [selectedRows, setSelectedRows] = useState([]);

    const { userId } = JSON.parse(localStorage.getItem('auth'));

    console.log({ userId })

    useEffect(() => {
        setTimeout(() => {
            getProductListFunc();
            getAllCats();
            getBrandList();
        }, 5000)
    }, []);


    const navigate = useNavigate()


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

    const AddSellerProduct = async (Pid) => {
        let payload = {
            "sellerId": userId,
            "productId": Pid
        }
        await SellerProductAdd(payload).then((res) => {
            console.log(res?.data?.data)
            if (res?.response?.data?.error !== false) {
                toast.success('product added successfully')
            }else{
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

    // const handleSelectionChange = (selection) => {
    //     const selectedRowIds = selection.selectionModel;
    //     setSelectedIds(selectedRowIds);

    //     // Log the selected IDs to the console
    //     console.log('Selected IDs:', selectedRowIds);
    // };


    const handleChange = (e) => {
        console.log(e.target.value)
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
                        <Col className="d-flex justify-content-center align-items-center">
                            <Button variant="dark" className="w-10 p-2" onClick={() => { setLoading(true); getProductListFunc() }}>All Reset</Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
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
                    </Row>
                    <Toaster position="top-right" />
                </Container>
            </div>
        </>
    );
}