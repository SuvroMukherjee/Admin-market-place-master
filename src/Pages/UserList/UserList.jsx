import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { FaClipboardList, FaInfoCircle } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { AdminCreateUserList, StaffStatusUpdateByAdmin } from "../../API/api";
import { productRows } from "../../dummyData";
import UserAttendence from "./UserAttendence";
import "./userlist.css";
import AdminAttendence from "../KeyManager/AdminAttendence";

export default function UserList() {
    const [data, setData] = useState(productRows || []);
    const [loading, setLoading] = useState(true)
    const [show,setshow] = useState(false)
    const [selectedUserId,setSelectedUserId] = useState()

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
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally(()=>{
            setLoading(false)
        })
    }



    const handleStatus = async (dataset) => {

        let payload = {
            'status': !dataset?.status
        }

        await StaffStatusUpdateByAdmin(dataset?._id, payload).then((res) => {
            getUserList();
            toast.success('User updated successfully')
        }).catch((err) => {
            console.log(err)
            toast.error('Something went wrong!')
        })

    }


    const handleClose = () => {
        setshow(false)
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
        { field: "phone_no", headerName: "Phone No.", width: 200 },
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
            width: 200,
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
                                <Button variant="danger" onClick={() => handleStatus(params?.row)} size="sm">
                                    Deactive
                                </Button> :
                                <Button variant="success" onClick={() => handleStatus(params?.row)} size="sm">
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
        {
            field: "Attendance", headerName: "Attendance", width: 160,
            renderCell: (params) => {
                return (
                    <div>
                        <Button variant="info" onClick={() => { setshow(true); setSelectedUserId(params?.row)}} size="sm">
                            <FaClipboardList /> Attendance
                        </Button>
                    </div>
                )

            }
        },
    ];

    return (
        <>
            {loading &&
                <div className="productList p-4 contentLoader">
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
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <h3>Users List</h3>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                    <Col xs={5} className="">
                  <FaInfoCircle /> Keep the cursor pointer inside the table and use <span className="fw-bold">shift + scrollbar</span> to scroll from left to right 
                  </Col>
                        <Col className="d-flex justify-content-end p-2">
                            <Button className="addCategoryButton" variant="dark" onClick={() => navigate('/AddUser')}>
                                <AiOutlinePlus /> Add New User
                            </Button>
                            {/* <button className="addCategoryButton" onClick={() => navigate('/Admin/Addbrand')}>Add New User</button> */}
                        </Col>
                    </Row>
                    <Row >
                        <Col style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={data}
                                columns={columns}
                                pageSize={8}
                            />
                        </Col>
                    </Row>
                </Container>
                <Container>
                    {console.log(selectedUserId)}
                    <Modal size="xl" show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <h5>{selectedUserId?.name} Attendence logs</h5>
                        </Modal.Header>
                        <Modal.Body>
                            {/* <UserAttendence userId={selectedUserId?._id}/> */}
                             <AdminAttendence userId={selectedUserId?._id}/>
                        </Modal.Body>
                    </Modal>
                </Container>
                <Toaster position="top-right" />
            </div>
        </>

    );
}
