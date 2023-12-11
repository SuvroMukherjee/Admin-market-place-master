import "../product.css";
import { DataGrid } from "@mui/x-data-grid";
// import { DeleteOutline } from "@material-ui/icons";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productRows } from "../../../dummyData";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { UpdateStatusBrand, allBrandList, allCategoryList, allSubCategoryList, deleteBrand } from "../../../API/api";
import EditBrandPage from "./EditBrandPage";

export default function ListSubCategory() {
    const [data, setData] = useState(productRows);
    const [modalData, setModalData] = useState({});
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        getAllBrandLists();
    }, []);


    async function getAllBrandLists() {
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


    const handleStatus = async (data) => {
        let payload = {
            "status": !data?.status
        }

        await UpdateStatusBrand(payload, data?._id).then((res) => {
            getAllBrandLists();
        }).catch((err) => {
            console.log(err)
        })
    }


    const handleDelete = async(id) =>{
        await deleteBrand(id).then((res) => {
            getAllBrandLists();
        }).catch((err) => {
            console.log(err)
        })
    }



    const handleEdit = (dataset) => {
        setModalData(dataset)
        setShowModal(true)
    }

    const handleClose = () => {
        getAllBrandLists();
        setShowModal(false)
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "title",
            headerName: "Title",
            width: 160,
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
        },
        {
            field: "action",
            headerName: "Action",
            width: 250,
            renderCell: (params) => {
                return (
                    <>

                        <button className="productListEdit" onClick={() => handleEdit(params?.row)}>Edit</button>
                        <button className="productListEdit" onClick={() => handleStatus(params?.row)}>Status</button>
                        <button className="productListEdit" onClick={() => handleDelete(params?.row?._id)}>Delete</button>

                    </>
                );
            },
        },
    ];

    return (
        <div className="productList mt-2 p-4">
            <Container>
                <EditBrandPage
                    showModal={showModal}
                    handleClose={handleClose}
                    data={modalData}
                />
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h3>Brand List</h3>
                    </Col>
                </Row>
                <Row >
                    <Col className="d-flex justify-content-end p-2">
                        <button className="addCategoryButton" onClick={() => navigate('/Admin/Addbrand')}>Add New Brand</button>
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
