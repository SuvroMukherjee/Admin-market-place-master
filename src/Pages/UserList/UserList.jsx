import { DeleteOutline } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { AdminCreateUserList, StaffStatusUpdateByAdmin } from "../../API/api";
import "./userlist.css";

export default function UserList() {
    const [data, setData] = useState([]);

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
        { field: "id", headerName: "SL No", width: 90 },
        {
            field: "user",
            headerName: "User",
            width: 200,
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
        { field: "status", headerName: "Active", width: 160 },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <button className="productListEdit" onClick={() => handleShow(params?.row)}>Edit</button>
                        <button className="productListEdit" onClick={() => handleStatus(params?.row)}>Status</button>
                    </>
                );
            },
        },
    ];

    return (
        <div className="userList mt-4">
            <Container>
                {/* <EditCategory
                    showModal={showModal}
                    handleClose={handleClose}
                    data={modalData}
                /> */}
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h3>Users List</h3>
                    </Col>
                </Row>
                <Row >
                    <Col className="d-flex justify-content-end p-4">
                        <button className="addCategoryButton" onClick={() => navigate('/AddUser')}>Add New User</button>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            pageSize={8}
                        // checkboxSelection
                        // disableSelectionOnClick
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
