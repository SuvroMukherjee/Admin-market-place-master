
import { DataGrid } from "@mui/x-data-grid";
import "../product.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productRows } from "../../../dummyData";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { DeleteProductSubCategory, UpdateStatusProductSubCategory, allCategoryList, allSubCategoryList } from "../../../API/api";
import EditSubCategory from "./EditSubCategory";
import Spinner from 'react-bootstrap/Spinner';
import toast, { Toaster } from 'react-hot-toast';
import { RiEdit2Line } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";

export default function ListSubCategory() {
    const [data, setData] = useState(productRows);
    const [modalData, setModalData] = useState();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true)

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
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setLoading(false)
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
            toast.success('Sub Category updated successfully')
        }).catch((err) => {
            console.log(err)
            toast.error('Soemthing went wrong!')
        })

    }

    const handleDelete = async (id) => {
        await DeleteProductSubCategory(id).then((res) => {
            console.log(res)
            getSubCategoryList()
            toast.success('Sub Category deleted successfully')
        }).catch((err) => {
            consoile.log(err)
            toast.error('Soemthing went wrong!')
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
            field: "category", headerName: "Category", width: 100, renderCell: (params) => {
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
            width: 150,
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
            renderCell: (params) => {
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
            width: 350,
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
                    //         <>

                    //             <button className="productListEdit" onClick={() => handleEdit(params?.row)}>Edit</button>
                    //             <button className="productListEdit" onClick={() => handleStatus(params?.row)}>Status</button>
                    //             <button className="productListEdit" onClick={() => handleDelete(params?.row?._id)}>Delete</button>

                    //          <DeleteOutline
                    //   className="productListDelete"
                    //   onClick={() => handleDelete(params.row.id)}
                    // /> 
                    //          </>
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
                            {/* <button className="addCategoryButton" onClick={() => navigate('/Admin/Addsubcategory')}>Add New Sub Category</button> */}
                            <Button className="addCategoryButton" variant="dark" onClick={() => navigate('/Admin/Addsubcategory')}>
                                <AiOutlinePlus /> Add New Sub Category
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
                            // checkboxSelection
                            />
                        </Col>
                    </Row>
                </Container>
                <Toaster position="top-right" />
            </div>
        </>


    );
}
