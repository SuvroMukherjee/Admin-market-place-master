
import { DataGrid } from "@mui/x-data-grid";
// import { DeleteOutline } from "@material-ui/icons";
import "../product.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productRows } from "../../../dummyData";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { DeleteProductSubCategory, UpdateStatusProductSubCategory, allCategoryList, allSubCategoryList } from "../../../API/api";
import EditSubCategory from "./EditSubCategory";

export default function ListSubCategory() {
    const [data, setData] = useState(productRows);
    const [modalData, setModalData] = useState();
    const [showModal, setShowModal] = useState(false);


    const navigate = useNavigate()

    useEffect(() => {
        getSubCategoryList();
    }, []);


    async function getSubCategoryList() {
        await allSubCategoryList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
        }).catch((err) => {
            console.log(err)
        })
    };


    const handleEdit = (dataSet) => {
        setModalData(dataSet);
        setShowModal(true)
    }

    const handleClose = () => {
        getSubCategoryList();
        setShowModal(false)
    }

    const handleStatus = async (dataset) => {

        let payload = {
            "status": !dataset?.status
        }

        await UpdateStatusProductSubCategory(payload, dataset?._id).then((res) => {
            console.log(res)
            getSubCategoryList()
        }).catch((err) => {
            console.log(err)
        })

    }

    const handleDelete = async (id) => {
        await DeleteProductSubCategory(id).then((res) => {
            console.log(res)
            getSubCategoryList()
        }).catch((err) => {
            consoile.log(err)
        })
    }



    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "image",
            headerName: "Image",
            width: 100,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                        <img className="productListImg" src={params.row.image} alt="" />
                    </div>
                );
            },
        },
        {
            field: "category", headerName: "Category", width: 200, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        {params?.row?.category?.title}
                    </div>
                );
            }
        },
        {
            field: "title",
            headerName: "Title",
            width: 160,
        },
        {
            field: "description",
            headerName: "Description",
            width: 200,
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
        <div className="productList mt-2 p-4">
            <Container>
                <EditSubCategory
                    showModal={showModal}
                    handleClose={handleClose}
                    data={modalData}
                />
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h3>Sub Category List</h3>
                    </Col>
                </Row>
                <Row >
                    <Col className="d-flex justify-content-end p-2">
                        <button className="addCategoryButton" onClick={() => navigate('/Admin/Addsubcategory')}>Add New Sub Category</button>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col>
                        <DataGrid
                            rows={data}
                            disableSelectionOnClick
                            columns={columns}
                            pageSize={8}
                        // checkboxSelection
                        />
                    </Col>
                </Row>
            </Container>
        </div>

    );
}
