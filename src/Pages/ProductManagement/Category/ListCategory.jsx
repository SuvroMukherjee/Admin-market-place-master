import "../product.css";
import { DataGrid } from "@mui/x-data-grid";
// import { DeleteOutline } from "@material-ui/icons";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productRows } from "../../../dummyData";
import { Button, Container, Row, Col } from 'react-bootstrap';
import { allCategoryList } from "../../../API/api";
import EditCategory from "./EditCategory";

export default function ListCategory() {
    const [data, setData] = useState(productRows);
    const [showModal, setShowModal] = useState(false);
    const [modalData,setModalData] = useState()

    const navigate = useNavigate()

    const handleShow = (catdata) => {
        console.log('data',catdata)
        setModalData(catdata)
        setShowModal(true)
    };
    const handleClose = () => setShowModal(false);

    const datas = {
        title: 'Mobile',
        description:
            'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGhvbmV8ZW58MHx8MHx8fDA%3D', // Replace with your image path
    }

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
        }).catch((err) => {
            console.log(err)
        })
    };


    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "image",
            headerName: "Image",
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                        <img className="productListImg" src={params.row.img} alt="" />
                        {params?.row?.image}
                    </div>
                );
            },
        },
        { field: "slug", headerName: "Slug", width: 200 },
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
            width: 150,
            renderCell: (params) => {
                return (
                    <>

                        <button className="productListEdit" onClick={() => handleShow(params?.row)}>Edit</button>

                        {/* <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row.id)}
            /> */}
                    </>
                );
            },
        },
    ];

    const handleNewCat = () => {
        navigate('/Admin/AddCategory');
    }

    return (
        <div className="productList mt-4">
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
                    <Col className="d-flex justify-content-end p-4">
                        <button className="addCategoryButton" onClick={() => handleNewCat()}>Add New Category</button>
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
