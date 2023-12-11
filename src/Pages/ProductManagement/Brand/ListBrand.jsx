import "../product.css";
import { DataGrid } from "@mui/x-data-grid";
// import { DeleteOutline } from "@material-ui/icons";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productRows } from "../../../dummyData";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { allBrandList, allCategoryList, allSubCategoryList } from "../../../API/api";

export default function ListSubCategory() {
    const [data, setData] = useState(productRows);

    
    const navigate = useNavigate()

    useEffect(() => {
        getCategoryList();
    }, []);


    async function getCategoryList() {
        await allBrandList().then((res) => {
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
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "title",
            headerName: "Title",
            width: 160,
        },
        // {
        //     field: "description",
        //     headerName: "Description",
        //     width: 200,
        // },
        {
            field: "status",
            headerName: "Status",
            width: 120,
        },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        
                            <button className="productListEdit">Edit</button>
                        
                        {/* <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row.id)}
            /> */}
                    </>
                );
            },
        },
    ];

    return (
        <div className="productList mt-4">
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h3>Brand List</h3>
                    </Col>
                </Row>
                <Row >
                    <Col className="d-flex justify-content-end p-4">
                        <button className="addCategoryButton" onClick={()=>navigate('/Admin/Addbrand')}>Add New Brand</button>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col>
                        <DataGrid
                            rows={data}
                            disableSelectionOnClick
                            columns={columns}
                            pageSize={8}
                            //checkboxSelection
                        />
                    </Col>
                </Row>
            </Container>
        </div>

    );
}
