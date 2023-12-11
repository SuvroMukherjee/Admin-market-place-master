import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from 'react-bootstrap';
import { allRoleList, createRole, deleteApiRole, updateRole, updateStatusRole } from "../../API/api";
import { userRows } from '../../dummyData';
import "./roles.css";
import { ChangeFormatDate2 } from '../../common/DateFormat'
import { Modal, Button, Form, ButtonGroup } from 'react-bootstrap';

export function Roles() {
    const [roleList, setRoleList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showModal, setShowModal] = useState(false)
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [editData, setEditData] = useState();

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
        }).catch((err) => {
            console.log(err)
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
            }).catch((err) => {
                console.log(err)
            })
        }
    };


    const [data, setData] = useState(userRows);

    const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        // {
        //     field: "image",
        //     headerName: "Image",
        //     width: 200,
        //     renderCell: (params) => {
        //         return (
        //             <div className="productListItem">
        //                 <img className="productListImg" src={params.row.img} alt="" />
        //                 {params?.row?.image}
        //             </div>
        //         );
        //     },
        // },
        {
            field: "name",
            headerName: "Name",
            width: 160,
        },
        // {
        //     field: "description",
        //     headerName: "Description",
        //     width: 200,
        // },
        {
            field: "status",
            headerName: "Status",
            width: 120,
        },
        {
            field: 'creatat',
            headerName: 'Create At',
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
            width: 250,
            renderCell: (params) => {
                return (
                    <>

                        <button className="productListEdit" onClick={() => handleEdit(params?.row)}>Edit</button>
                        <button className="productListEdit" onClick={() => handleStatusUpdate(params?.row)}>Status</button>
                        <button className="productListEdit" onClick={() => deleteRole(params?.row?._id)}>Delete</button>
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
    }

    const handleEdit = (dataset) => {
        setEditData(dataset)
        setInputValue(dataset?.name)
        setShowModalEdit(true)
    }

    const handleClose2 = () => {
        getAllroll();
        setShowModalEdit(false)
    }

    const hanmdleUpdateRole = async () => {
        let payload = {
            'name': inputValue
        }

        await updateRole(editData?._id, payload).then((res) => {
            setShowModalEdit(false)
            getAllroll();
        }).catch((err) => {
            console.log(err)
        })
    }


    const handleStatusUpdate = async (dataset) => {

        let payload = {
            "status": !dataset?.status
        }

        await updateStatusRole(dataset?._id, payload).then((res) => {
            getAllroll();
        }).catch((err) => {
            console.log(err)
        })
    }

    const deleteRole = async (id) => {

        await deleteApiRole(id).then((res) => {
            getAllroll();
        }).catch((err) => {
            console.log(err)
        })

    }

    return (
        <div className="userList">
            {/* <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={6} md={6} style={{ textAlign: 'center' }}>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

                        {roleList?.length > 0 && roleList.map((role) => (
                            <>

                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`Role Name - ${role?.name}`}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    
                                                </Typography>
                                                {`Created At - ${ChangeFormatDate(role?.createdAt)}`}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </>

                        ))}
                    </List>
                </Grid>
                <Grid item xs={6} md={6} style={{ textAlign: 'center' }}>
                    <TextField
                        label="Add New Role"
                        variant="outlined"
                        fullWidth
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <br />
                    <br />
                    <Button variant="contained" color="primary" onClick={handleAddItem} fullWidth>
                        Save Role
                    </Button>
                </Grid>
            </Grid> */}
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <h3>Category List</h3>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex justify-content-end p-4">
                        <button className="addCategoryButton" onClick={handleNew}>Add New Role</button>
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
                        {/* Additional form fields here */}
                    </Modal.Body>
                    {/* <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer> */}
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
        </div>
    );
}

