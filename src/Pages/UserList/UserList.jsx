import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from 'react-bootstrap';
import { AiOutlinePlus } from "react-icons/ai";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { AdminCreateUserList, StaffStatusUpdateByAdmin } from "../../API/api";
import { productRows } from "../../dummyData";
import "./userlist.css";

export default function UserList() {
    const [data, setData] = useState(productRows);

    const navigate = useNavigate()

    useEffect(() => {
        getUserList();
    }, [])

    async function getUserList() {
        await AdminCreateUserList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1, // Generate a unique ID
            }));
            setData(dataWithUniqueIds)
        }).catch((err) => {
            console.log(err)
        })
    }



    const handleStatus = async (dataset) => {

        let payload = {
            'status': !dataset?.status
        }

        await StaffStatusUpdateByAdmin(dataset?._id, payload).then((res) => {
            getUserList()
        }).catch((err) => {
            console.log(err)
        })

    }



    const columns = [
        { field: "id", headerName: "SL No", width: 50 },
        {
            field: "user",
            headerName: "User",
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="userListUser">
                        {params?.row?.name}
                    </div>
                );
            },
        },
        { field: "email", headerName: "Email", width: 200 },
        {
            field: "role", headerName: "Role", width: 200, renderCell: (params) => {
                return (
                    <div className="userListUser">
                        {params?.row?.role?.name}
                    </div>
                );
            }
        },
        {
            field: "status", headerName: "Active", width: 100,
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
            width: 250,
            renderCell: (params) => {
                return (
                    <>
                        {/* <button className="productListEdit" onClick={() => navigate(`/EditUser/${params?.row?._id}`)}>Edit</button>
                        <button className="productListEdit" onClick={() => handleStatus(params?.row)}>Status</button> */}

                        <div className="buttonWrapper">

                            {/* <button className="productListEdit" onClick={() => handleEdit(params?.row)}>Edit</button> */}
                            <Button variant="warning" onClick={() => navigate(`/EditUser/${params?.row?._id}`)} size="sm">
                                <RiEdit2Line /> Edit
                            </Button>
                            {params?.row?.status ?
                                <Button variant="danger" onClick={() => handleStatus(params?.row)}>
                                    Deactive
                                </Button> :
                                <Button variant="success" onClick={() => handleStatus(params?.row)}>
                                    Active
                                </Button>}
                            {/* <Button variant="outline-danger" onClick={() => handleDelete(params?.row?._id)}>
                                <FaRegTrashAlt />
                            </Button> */}
                            {/* <button className="productListEdit" onClick={() => handleStatus(params?.row)}>Status</button>
                        <button className="productListEdit" onClick={() => handleDelete(params?.row?._id)}>Delete</button> */}

                        </div>
                    </>
                );
            },
        },
    ];

    return (
        <div className="userList mt-4 p-4">
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h3>Users List</h3>
                    </Col>
                </Row>
                <Row >
                    <Col className="d-flex justify-content-end p-2">
                        <Button className="addCategoryButton" variant="dark" onClick={() => navigate('/Admin/Addbrand')}>
                            <AiOutlinePlus /> Add New User
                        </Button>
                        {/* <button className="addCategoryButton" onClick={() => navigate('/Admin/Addbrand')}>Add New User</button> */}
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
