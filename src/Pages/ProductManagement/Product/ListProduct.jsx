import { DataGrid } from "@mui/x-data-grid";
import "../product.css";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { allProductList, deleteProduct } from "../../../API/api";
import Spinner from 'react-bootstrap/Spinner';
import { productRows } from "../../../dummyData";

export default function ListProduct() {
    const [data, setData] = useState(productRows);
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        setTimeout(()=>{
            getProductListFunc();
        },5000)
    }, []);


    const navigate = useNavigate()


    async function getProductListFunc() {
        await allProductList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally((data)=>{
            setLoading(false)
        })
    };

    const handleStatus = async (dataset) => {
        let payload = {
            "status": !dataset?.status
        }

        await StatusUpdateProduct(payload, dataset?._id).then((res) => {
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
        { field: "name", headerName: "Name", width: 150 },
        {
            field: "image", headerName: "Image", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        <img className="productListImg" src={params?.row?.image?.[0]} alt="" />
                        <span>{params?.row?.image?.length - 1}+</span>
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
                            <Button variant="warning" onClick={() => navigate(`/Admin/Editproduct/${params?.row?._id}`)}>
                                <RiEdit2Line /> Edit
                            </Button>
                            {params?.row?.status ?
                                <Button variant="danger" onClick={() => handleStatus(params?.row)}>
                                    Deactive
                                </Button> :
                                <Button variant="success" onClick={() => handleStatus(params?.row)}>
                                    Active
                                </Button>}
                            <Button variant="outline-danger" onClick={() => handledeleteProduct(params?.row?._id)}>
                                <FaRegTrashAlt />
                            </Button>
                        </div>
                    </>
                );
            },
        },
    ];

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
                            <h3>Product List</h3>
                        </Col>
                    </Row>
                    <Row >
                        <Col className="d-flex justify-content-end p-2">
                            <Button className="addCategoryButton" variant="dark" onClick={() => navigate('/Admin/Addproduct')}>
                                <AiOutlinePlus /> Add New Product
                            </Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col>
                            {data?.length > 0 ?
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    pageSize={8}
                                /> :

                                <DataGrid
                                    rows={[]}
                                    columns={columns}
                                    pageSize={8}
                                />
                            }
                        </Col>
                    </Row>
                    <Toaster position="top-right" />
                </Container>
            </div>
        </>
    );
}
