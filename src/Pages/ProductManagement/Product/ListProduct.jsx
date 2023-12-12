import "../product.css";
import { DataGrid } from "@mui/x-data-grid";
// import { DeleteOutline } from "@material-ui/icons";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productRows } from "../../../dummyData";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { allBrandList, allCategoryList, allProductList, allSubCategoryList } from "../../../API/api";
import { AiOutlinePlus } from "react-icons/ai";
import { RiEdit2Line } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";

export default function ListProduct() {
    const [data, setData] = useState(productRows);


    useEffect(() => {
        getProductListFunc();
    }, []);


    const navigate = useNavigate()


    async function getProductListFunc() {
        await allProductList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
        }).catch((err) => {
            console.log(err)
        })
    };


    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "productId", headerName: "Product Id", width: 100 },
        { field: "name", headerName: "Name", width: 200 },
        {
            field: "image", headerName: "Image", width: 200, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        <img className="productListImg" src={params?.row?.image?.[0]} alt="" />
                        <span>{params?.row?.image?.length - 1}+</span>
                    </div>
                );
            }
        },
        { field: "regular_price", headerName: "Price", width: 200, },
        { field: "desc", headerName: "Description", width: 200 },
        {
            field: "category", headerName: "Category", width: 200, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row.categoryId?.title}
                    </div>
                );
            }
        },
        {
            field: "Subcategory", headerName: "Sub Category", width: 200, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params.row.subcategoryId?.title}
                    </div>
                );
            }
        },
        {
            field: "tags", headerName: "Tags", width: 200, renderCell: (params) => {
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
            field: "status", headerName: "Status", width: 200, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params?.row?.status ? <span className="ActiveStatus">Active</span> : <span className="DeactiveStatus">Not Active</span>}
                    </div>
                );
            }
        },
        { field: "type", headerName: "Type", width: 100 },
        {
            field: "action",
            headerName: "Action",
            width: 300,
            renderCell: (params) => {
                return (
                    <>
                        {/* <button className="productListEdit" onClick={() => navigate(`/Admin/Editproduct/${params?.row?._id}`)}>Edit</button> */}
                        <div className="buttonWrapper">
                            <Button variant="warning" onClick={() => navigate(`/Admin/Editproduct/${params?.row?._id}`)}>
                                <RiEdit2Line /> Edit
                            </Button>
                            {params?.row?.status ?
                                <Button variant="danger" >
                                    Deactive
                                </Button> :
                                <Button variant="success" >
                                    Active
                                </Button>}
                            {/* <Button variant="outline-danger" onClick={() => handleDelete(params?.row?._id)}>
                                <FaRegTrashAlt />
                            </Button> */}
                        </div>
                    </>
                );
            },
        },
    ];

    return (
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
                        <DataGrid
                            rows={data}
                            columns={columns}
                            pageSize={8}
                        />
                    </Col>
                </Row>
            </Container>
        </div>

    );
}
