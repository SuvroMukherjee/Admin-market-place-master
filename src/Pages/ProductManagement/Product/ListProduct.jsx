import "../product.css";
import { DataGrid } from "@mui/x-data-grid";
// import { DeleteOutline } from "@material-ui/icons";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productRows } from "../../../dummyData";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { allBrandList, allCategoryList, allProductList, allSubCategoryList } from "../../../API/api";
import { AiOutlinePlus } from "react-icons/ai";

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
                        {/* <img className="productListImg" src={params?.row?.image[0]} alt="" /> */}
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
                        {params.row?.tags?.map((ele,i) => (
                            <p key={i}>{ele} |</p> 
                        ))}
                    </div>
                );
            }
        },
        { field: "type", headerName: "Type", width: 100 },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={"/product/" + params.row.id}>
                            <button className="productListEdit">Edit</button>
                        </Link>
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
                            disableSelectionOnClick
                            columns={columns}
                            pageSize={8}
                            checkboxSelection
                        />
                    </Col>
                </Row>
            </Container>
        </div>

    );
}
