import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from "react-icons/ai";
import { RiEdit2Line } from "react-icons/ri";
import { allRoleList, createRole, deleteApiRole, updateRole, updateStatusRole } from "../../API/api";
import { ChangeFormatDate2 } from '../../common/DateFormat';
import { productRows } from '../../dummyData';
import "./roles.css";

export function Roles() {
    const [roleList, setRoleList] = useState(productRows || []);
    const [inputValue, setInputValue] = useState('');
    const [showModal, setShowModal] = useState(false)
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [editData, setEditData] = useState();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAllroll()
    }, [])


    async function getAllroll() {
        await allRoleList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setRoleList(dataWithUniqueIds)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleAddItem = async () => {
        if (inputValue.trim() !== '') {
            let payload = {
                name: inputValue
            }
            await createRole(payload).then((res) => {
                setInputValue('');
                getAllroll();
                handleClose()
                toast.success("Role added successfully!")
            }).catch((err) => {
                console.log(err)
                toast.error('Something went wrong!')
            })
        }
    };


    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "name",
            headerName: "Name",
            width: 160,
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
            field: 'creatat',
            headerName: 'Joined At',
            width: 200,
            renderCell: (params) => {
                return (
                    <>

                        <div>{ChangeFormatDate2(params?.row?.createdAt)}</div>
                    </>
                );
            },
        },
        {
            field: "action",
            headerName: "Action",
            width: 500,
            renderCell: (params) => {
                return (
                    <>
                        <div className="buttonWrapper">
                            <Button variant="warning" onClick={() => handleEdit(params?.row)} size="sm" disabled={params?.row?.name  == "Admin"}>
                                <RiEdit2Line /> Edit
                            </Button>
                            {params?.row?.status ?
                                <Button variant="danger" onClick={() => handleStatusUpdate(params?.row)} size="sm" disabled={params?.row?.name  == "Admin"}>
                                    Deactive
                                </Button> :
                                <Button variant="success" onClick={() => handleStatusUpdate(params?.row)} size="sm" disabled={params?.row?.name  == "Admin"}>
                                    Active
                                </Button>}
                            {/* <Button variant="outline-danger" onClick={() => deleteRole(params?.row?._id)}>
                                <FaRegTrashAlt />
                            </Button> */}
                        </div>
                    </>
                );
            },
        },
    ];


    const handleNew = () => {
        setShowModal(true)
    }

    const handleClose = () => {
        getAllroll();
        setShowModal(false)
        setInputValue('')
    }

    const handleEdit = (dataset) => {
        setEditData(dataset)
        setInputValue(dataset?.name)
        setShowModalEdit(true)
    }

    const handleClose2 = () => {
        getAllroll();
        setShowModalEdit(false)
        setInputValue('')
    }

    const hanmdleUpdateRole = async () => {
        let payload = {
            'name': inputValue
        }

        await updateRole(editData?._id, payload).then((res) => {
            setShowModalEdit(false)
            getAllroll();
            toast.success("Role update successfully!")
        }).catch((err) => {
            console.log(err)
            toast.error("Something went wrong!")
        })
    }


    const handleStatusUpdate = async (dataset) => {

        let payload = {
            "status": !dataset?.status
        }

        await updateStatusRole(dataset?._id, payload).then((res) => {
            getAllroll();
            toast.success('Role Update Successfulluy!')
        }).catch((err) => {
            console.log(err)
            toast.error('Something went wrong');
        })
    }

    const deleteRole = async (id) => {

        await deleteApiRole(id).then((res) => {
            getAllroll();
            toast.success('Role deleted Successfulluy!')
        }).catch((err) => {
            console.log(err)
            toast.error('Something went wrong');
        })

    }

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
                            <h3>Role List</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex justify-content-end p-2">
                            <Button className="addCategoryButton" variant="dark" onClick={handleNew} >
                                <AiOutlinePlus /> Add New Role
                            </Button>
                        </Col>
                    </Row>
                    <Row className="justify-content-md-center">
                        <Col>
                            <DataGrid
                                rows={roleList}
                                disableSelectionOnClick
                                columns={columns}
                                pageSize={8}
                            // checkboxSelection
                            />
                        </Col>
                    </Row>
                    <Modal show={showModal} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Role</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row className='mt-2'>
                                <Form.Group controlId="title">
                                    <Form.Label>Role Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your role name"
                                        name="title"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <ButtonGroup className="d-flex">
                                        <Button
                                            className="btn-block mr-1 mt-1 btn-lg"
                                            variant="success"
                                            type='submit'
                                            block
                                            onClick={handleAddItem}
                                        >Add Role</Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>
                    <Modal show={showModalEdit} onHide={handleClose2} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Role </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row className='mt-2'>
                                <Form.Group controlId="title">
                                    <Form.Label>Role Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your role name"
                                        name="title"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                    <ButtonGroup className="d-flex">
                                        <Button
                                            className="btn-block mr-1 mt-1 btn-lg"
                                            variant="warning"
                                            type='submit'
                                            block
                                            onClick={hanmdleUpdateRole}
                                        >Update Role</Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </Modal>
                </Container>
                <Toaster position="top-right" />
            </div>
        </>

    );
}

