import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import "./Seller.css";
import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Button, Col, Container, Row, ButtonGroup, Form, Table } from 'react-bootstrap';
import { DataGrid } from "@mui/x-data-grid";
import { RiEdit2Line } from "react-icons/ri";
import { productRows } from "../../dummyData";
import { AdminSellerLists, UpdateSellerStatus, allSellerList } from "../../API/api";
import { FaEye } from "react-icons/fa";
import { Card, Carousel } from 'react-bootstrap';
import { FaRegUser } from "react-icons/fa";
import {  Overlay, Popover } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { MdAutorenew } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { IoIosEye } from "react-icons/io";

export default function SellerListManage() {
    const [data, setData] = useState(productRows);
    const [modalData, setModalData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true)
    const [sellerDetails, setSellerDeatils] = useState()
    const [activeButton, setActiveButton] = useState('all');
    const [totalData, setTotalData] = useState([])
    const [selectedSeller,setSellerSeller] = useState()
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (data) => {
        setShow(true)
        setSellerSeller(data)
    };

    const handleButtonClick = (buttonType) => {
        if (buttonType == 'pending') {
            let filtersData = totalData?.filter((ele) => {
                return ele?.status == 'pending';
            })
            setData(filtersData)
        }
        else if (buttonType == 'approve') {
            let filtersData = totalData?.filter((ele) => {
                return ele?.status == 'approved';
            })
            setData(filtersData)
        }
        else if (buttonType == 'reject') {
            let filtersData = totalData?.filter((ele) => {
                return ele?.status == 'rejected';
            })
            console.log({ filtersData })
            setData(filtersData)
        }
        else if (buttonType == 'all') {
            getAllSellersList()
        }
        setActiveButton(buttonType);
    };

    

    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            getAllSellersList()
        }, 3000);
    }, []);


    async function getAllSellersList() {
        await AdminSellerLists().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
            setTotalData(dataWithUniqueIds)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    };


    const handleStatus = async (data,password='') => {

        let payload = {};

        if (data?.status == 'approved') {
            payload = {
                "status": 'rejected',
            }
        } else {
            payload = {
                "status": 'approved',
                "password": password
            }
        }

        await UpdateSellerStatus(data?._id, payload).then((res) => {
            getAllSellersList();
            toast.success('Seller updated successfully!');
        }).catch((err) => {
            console.log(err)
            toast.error('Something went wrong!');
        })
    }

    const ShowDetails = (data) => {
        console.log(data)
        setSellerDeatils(data)
    }

    // const handleDelete = async (id) => {
    //     await deleteBrand(id).then((res) => {
    //         getAllBrandLists();
    //         toast.success('Brand delete successfully!');
    //     }).catch((err) => {
    //         console.log(err)
    //         toast.error('Something went wrong!');
    //     })
    // }



    // const handleEdit = (dataset) => {
    //     setModalData(dataset)
    //     setShowModal(true)
    // }

    // const handleClose = () => {
    //     getAllBrandLists();
    //     setShowModal(false)
    // };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "shope_name",
            headerName: "Shop Name",
            width: 200,
        },
        {
            field: "email",
            headerName: "Email",
            width: 200,
        },
        {
            field: "phone_no",
            headerName: "Phone No.",
            width: 150,
        },
        {
            field: "address",
            headerName: "Address",
            width: 150,
        },
        {
            field: "gst_no",
            headerName: "Gst No.",
            width: 200,
        },
        {
            field: "pic_of_shope", headerName: "Image", width: 150, renderCell: (params) => {
                return (
                    <div className="productListItem">
                        <img className="productListImg" src={params?.row?.pic_of_shope?.[0]} alt="" />
                        <span>{params?.row?.pic_of_shope?.length - 1}+</span>
                    </div>
                );
            }
        },
        {
            field: "rating", headerName: "Rating by Buyer(avg)", width: 200, renderCell: (params) => {
                return (
                   
                     <div className='ratingDiv'>
                                    <FaStar color='gold' size={15} /> {params?.row?.review}
                                </div>
                );
            }
        },
        {
            field: "picup_location",
            headerName: "Pickup Location",
            width: 150,
        },
        {
            field: "commission_rate",
            headerName: "Commission Rate(%)",
            width: 200,
        },
        {
            field: "manager",
            headerName: "Manager",
            width: 150,
            renderCell: (params) => {
                return (
                    <div>
                        {params?.row?.staffId?.name}
                    </div>
                )
            }
        },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params) => {
                return (
                    <div>
                        {params?.row?.status == 'approved' && <span className="ActiveStatus">Approved</span>}
                        {params?.row?.status == 'rejected' && <span className="DeactiveStatus">Reject</span>}
                        {params?.row?.status == 'pending' && <span className="PendingStatus">Pending</span>}
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
                    <div className="buttonWrapper">
                        <Button variant="dark" onClick={() => ShowDetails(params?.row)} size="sm">
                            <FaEye /> View
                        </Button>
                        {params?.row?.status == 'approved' ?
                            <Button variant="danger" onClick={() => handleStatus(params?.row)} size="sm">
                                Reject
                            </Button> :
                            // <Button variant="success"   onClick={() => handleStatus(params?.row)} size="sm">
                            //     Approve
                            // </Button>
                            <Button variant="success" onClick={() => handleShow(params?.row)} size="sm">
                                Approve
                            </Button>
                            }
                    </div>
                );
            },
        },
    ];

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const generatePassword = () => {
        // Generate a random password of length 6
        const newPassword = Math.random().toString(36).slice(-6);
        setPassword(newPassword);
    };

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
            <div className="productList mt-2 p-4 mt-4">
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <h4>Seller - List</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <ButtonGroup>
                                <Button
                                    variant={activeButton === 'all' ? 'dark' : 'outline-dark'}
                                    onClick={() => handleButtonClick('all')}
                                    size="sm"
                                >
                                    All
                                </Button>
                                <Button
                                    variant={activeButton === 'pending' ? 'dark' : 'outline-dark'}
                                    onClick={() => handleButtonClick('pending')}
                                    size="sm"
                                >
                                    Pending
                                </Button>
                                <Button
                                    variant={activeButton === 'approve' ? 'dark' : 'outline-dark'}
                                    onClick={() => handleButtonClick('approve')}
                                    size="sm"
                                >
                                    Approved
                                </Button>
                                <Button
                                    variant={activeButton === 'reject' ? 'dark' : 'outline-dark'}
                                    onClick={() => handleButtonClick('reject')}
                                    size="sm"
                                >
                                    Reject
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col>
                            <ButtonGroup>
                                <Button
                                    variant={activeButton === 'all' ? 'dark' : 'outline-dark'}
                                    onClick={() => handleButtonClick('all')}
                                    size="sm"
                                >
                                    All
                                </Button>
                                <Button
                                    variant={activeButton === 'pending' ? 'dark' : 'outline-dark'}
                                    onClick={() => handleButtonClick('pending')}
                                    size="sm"
                                >
                                   Imcomplete
                                </Button>
                                <Button
                                    variant={activeButton === 'approve' ? 'dark' : 'outline-dark'}
                                    onClick={() => handleButtonClick('approve')}
                                    size="sm"
                                >
                                    Complete
                                </Button>
                                <Button
                                    variant={activeButton === 'reject' ? 'dark' : 'outline-dark'}
                                    onClick={() => handleButtonClick('reject')}
                                    size="sm"
                                >
                                    Reject
                                </Button>
                            </ButtonGroup>
                        </Col>
                    </Row> */}
                    {/* <Row className="justify-content-md-center">
                        <Col>
                            <DataGrid
                                rows={data}
                                columns={columns}
                                pageSize={8}
                            />
                        </Col>
                    </Row> */}
                </Container>
                <Container>
                    <Row className="justify-content-md-center mt-4">
                        <Col>
                            <Table bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <td>Registered By</td>
                                        <th>Shop Name</th>
                                        <th>Shop Image</th>
                                        <th>Seller Name</th>
                                        <th>Seller Email</th>
                                        <th>Seller Phone No.</th>
                                        <th>Registration</th>
                                        <th>Status</th>
                                        {/* <th>Commission</th>
                                        <th>Edit</th> */}
                                        <th>View</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row) => (
                                        <tr key={row?.id}>
                                            <td>{row?.id}</td>
                                            <td>{row?.staffId ? row?.staffId?.name : 'Own'}</td>
                                            <td>{row?.Shop_Details_Info?.shope_name}</td>
                                            <td>
                                                <div className="productListItem">
                                                    <img className="productListImg" src={row?.Shop_Details_Info?.pic_of_shope?.[0] || row?.Shop_Details_Info?.pic_of_shope?.[0]?.imag_path} alt="" />
                                                    {row?.Shop_Details_Info?.pic_of_shope?.length > 2 &&
                                                        <span>{row?.Shop_Details_Info?.pic_of_shope?.length - 1}+</span>}
                                                </div>
                                            </td>
                                            <td>{row?.user_name}</td>
                                            <td>{row?.email}</td>
                                            <td>{row?.phone_no}</td>
                                            <td>{row?.interest_details ? <p style={{ color: 'white', background: 'green' }}>Complete</p> : <p style={{ color: 'black', background: '#FAA300' }}>Incomplete</p>}</td>
                                            <td>
                                                {row?.status === 'approved' && <span className="ActiveStatus">Approved</span>}
                                                {row?.status === 'rejected' && <span className="DeactiveStatus">Reject</span>}
                                                {row?.status === 'pending' && <span className="PendingStatus">Pending</span>}
                                            </td>
                                            {/* <td>
                                                <Button size="sm" onClick={() => handleShow(row?._id)}>Add</Button>
                                            </td>
                                            <td>
                                                <div className="buttonWrapper">
                                                    <Button variant="success" onClick={() => navigate(`/key/EditSeller/${row?._id}`)} size="sm">
                                                        <RiEdit2Line />
                                                    </Button>
                                                </div>
                                            </td> */}
                                            <td>
                                                <Button size="sm" variant="dark" onClick={() => navigate(`/SellerDetails/${row?._id}`)}><IoIosEye /></Button>
                                            </td>
                                            <td>
                                                {row?.status == 'approved' ? (
                                                    <Button variant="danger" onClick={() => handleStatus(row)} size="sm">
                                                        Reject
                                                    </Button>
                                                ) : (
                                                    row?.staffId ? (
                                                        <Button variant="success" onClick={() => handleShow(row)} size="sm">
                                                            Approve
                                                        </Button>
                                                    ) : (
                                                        <Button variant="success" onClick={() => handleStatus(row)} size="sm">
                                                            Approve
                                                        </Button>
                                                    )
                                                )}
                                            </td>

                                        </tr>
                                    ))}
                                    {data.length === 0 && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: 'center' }}>No Data Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
                <Container>
                    <Modal centered size="md" show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedSeller?.email} {console.log(selectedSeller)}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Row>
                                <Col xs={8}>
                                    <Form.Group controlId="formPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Form.Text className="text-muted">
                                            Password should be at least 6 characters long.
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col  className="d-flex align-items-center">
                                    <Button variant="dark" size="sm" onClick={generatePassword}>
                                        <MdAutorenew/> Auto Generate
                                    </Button>
                                </Col>
                            </Row>

                            <Form.Check
                                type="checkbox"
                                size="sm"
                                label="Show Password"
                                onChange={() => setShowPassword(!showPassword)}
                            />
      
                            <Row className="mt-2">
                                <Col>
                                    <Button variant="dark" size="sm" onClick={() => handleStatus(selectedSeller,password)}>
                                        SAVE
                                    </Button>
                                </Col>
                            </Row>


                        </Modal.Body>
                    </Modal>
                </Container>
                <Container className="mt-4">
                    <Row>
                        <Col>
                            {sellerDetails &&
                                <UserCard user={sellerDetails} />}
                        </Col>
                    </Row>
                </Container>
                <Toaster position="top-right" />
            </div>

        </>


    );
}




const UserCard = ({ user }) => {
    console.log({user})
    return (
        <>

            <Card style={{ width: '18rem' }}>
                <Card.Header><FaRegUser/> Seller Details</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <strong>Shop Name:</strong> {user?.shope_name}
                        <br />
                        <strong>Phone:</strong> {user?.phone_no}
                        <br />
                        <strong>Email:</strong> {user?.email}
                        <br />
                        <strong>Address:</strong> {user?.address}
                        <br />
                        <strong>GST No:</strong> {user?.gst_no}
                        <br />
                        <strong>Pickup Location:</strong> {user?.picup_location}
                        <br/>
                        <strong>Commission Rate:</strong> {user?.commission_rate}%
                        <br/>
                        <strong>Average Rating
                            :</strong> {user?.rating  ||  0 }
                        <br/>
                        <strong>Status:</strong> {user?.status}
                    </Card.Text>
                    <Row>
                        <Col className="d-flex align-items-center"><strong>Shop Images</strong></Col>
                        <Col xs={6}>
                            <Carousel>
                                {user?.pic_of_shope?.map((image, index) => (
                                    <Carousel.Item key={index}>
                                        <img className="d-block w-100" src={image} alt={`Shop Image ${index + 1}`} />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

        </>
    );
};


