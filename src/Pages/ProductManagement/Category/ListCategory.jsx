import "../product.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productRows } from "../../../dummyData";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { DeleteProductCategory, FileUpload, UpdateStatusProductCategory, allCategoryList } from "../../../API/api";
import EditCategory from "./EditCategory";
import Spinner from 'react-bootstrap/Spinner';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { RiEdit2Line } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";


export default function ListCategory() {
    const [data, setData] = useState(productRows || []);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState()
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const handleShow = (catdata) => {
        setModalData(catdata)
        setShowModal(true)
    };
    const handleClose = () => {
        getCategoryList();
        setShowModal(false)
    };


    // const handleDelete = (id) => {
    //     setData(data.filter((item) => item.id !== id));
    // };

    useEffect(() => {
        getCategoryList();
    }, []);


    async function getCategoryList() {
        await allCategoryList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    };

    const handleStatus = async (data) => {
        let payload = {
            "status": !data?.status
        }

        await UpdateStatusProductCategory(payload, data?._id).then((res) => {
            console.log(res, 'res')
            getCategoryList();
            toast.success('Category updated successfully')
        }).catch((err) => {
            console.log(err)
            toast.error('Soemthing went wrong!')
        })
    }


    const handleDelete = async (id) => {
        await DeleteProductCategory(id).then((res) => {
            console.log({ res })
            getCategoryList();
            toast.success('Category deleted successfully')
        }).catch((err) => {
            console.log(err)
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
                        {/* {params?.row?.image} */}
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
                        <Button variant="warning" onClick={() => handleShow(params?.row)} size="sm">
                            <RiEdit2Line /> Edit
                        </Button>
                        {params?.row?.status ?
                            <Button variant="danger" onClick={() => handleStatus(params?.row)} size="sm">
                                Deactive
                            </Button> :
                            <Button variant="success" onClick={() => handleStatus(params?.row)} size="sm">
                                Active
                            </Button>}
                        <Button variant="outline-danger" onClick={() => handleDelete(params?.row?._id)} size="sm">
                            <FaRegTrashAlt />
                        </Button>
                    </div>
                    // <>

                    //     <button className="productListEdit" onClick={() => handleShow(params?.row)}>Edit</button>
                    //     <button className="productListEdit" onClick={() => handleStatus(params?.row)}>Status</button>
                    //     <button className="productListEdit" onClick={() => handleDelete(params?.row?._id)}>Delete</button>
                    // </>
                );
            },
        },
    ];

    const handleNewCat = () => {
        navigate('/Admin/AddCategory');
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
                    <EditCategory
                        showModal={showModal}
                        handleClose={handleClose}
                        data={modalData}
                    />
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <h3>Category List</h3>
                        </Col>
                    </Row>
                    <Row >
                        <Col className="d-flex justify-content-end p-2">
                            {/* <button className="addCategoryButton" onClick={() => handleNewCat()}>Add New Category</button> */}
                            <Button className="addCategoryButton" variant="dark" onClick={() => handleNewCat()}>
                                <AiOutlinePlus /> Add New Category
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
