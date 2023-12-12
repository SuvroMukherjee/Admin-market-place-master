import "../product.css";
import { DataGrid } from "@mui/x-data-grid";
// import { DeleteOutline } from "@material-ui/icons";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productRows } from "../../../dummyData";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { UpdateStatusBrand, allBrandList, allCategoryList, allSubCategoryList, deleteBrand } from "../../../API/api";
import EditBrandPage from "./EditBrandPage";
import { RiEdit2Line } from 'react-icons/ri';
import { FaRegTrashAlt } from "react-icons/fa";
import { AiOutlinePlus } from 'react-icons/ai';


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


    const handleDelete = async (id) => {
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
            field: "title",
            headerName: "Title",
            width: 160,
        },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell:(params)=>{
                return (
                    <div>
                        {params?.row?.status ? <span className="ActiveStatus">Active</span> : <span className="DeactiveStatus">Not Active</span>}
                    </div>
                )
            }
        },
        {
            field: "action",
            headerName: "Action",
            width: 500,
            renderCell: (params) => {
                return (
                    <div className="buttonWrapper">
                        <Button variant="warning" onClick={() => handleEdit(params?.row)}>
                            <RiEdit2Line /> Edit
                        </Button>
                        {params?.row?.status ?
                            <Button variant="danger" onClick={() => handleStatus(params?.row)}>
                                Deactive
                            </Button> :
                            <Button variant="success" onClick={() => handleStatus(params?.row)}>
                                Active
                            </Button>}
                        <Button variant="outline-danger" onClick={() => handleDelete(params?.row?._id)}>
                            <FaRegTrashAlt />
                        </Button>
                        

                    </div>
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
                        <Button className="addCategoryButton" variant="dark" onClick={() => navigate('/Admin/Addbrand')}>
                            <AiOutlinePlus /> Add New Brand
                        </Button>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col>
                        <DataGrid
                            rows={data}
                            // disableSelectionOnClick
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
