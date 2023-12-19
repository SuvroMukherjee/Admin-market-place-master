import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import "./Seller.css";
import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Button, Col, Container, Row, ButtonGroup } from 'react-bootstrap';
import { DataGrid } from "@mui/x-data-grid";
import { RiEdit2Line } from "react-icons/ri";
import { productRows } from "../../dummyData";
import { AdminSellerLists, UpdateSellerStatus, allSellerList } from "../../API/api";
import { FaEye } from "react-icons/fa";
import { Card, Carousel } from 'react-bootstrap';
import { FaRegUser } from "react-icons/fa";
import {  Overlay, Popover } from 'react-bootstrap';

export default function SellerListManage() {
    const [data, setData] = useState(productRows);
    const [modalData, setModalData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true)
    const [sellerDetails, setSellerDeatils] = useState()
    const [activeButton, setActiveButton] = useState('all');
    const [totalData, setTotalData] = useState([])

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


    const handleStatus = async (data) => {

        let payload = {};

        if (data?.status == 'approved') {
            payload = {
                "status": 'rejected'
            }
        } else {
            payload = {
                "status": 'approved'
            }
        }

        await UpdateSellerStatus(data?._id, payload).then((res) => {
            getAllSellersList();
            toast.success('Brand updated successfully!');
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
                    <div>
                       {'Not Avaible'}
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
                            <Button variant="success" onClick={() => handleStatus(params?.row)} size="sm">
                                Approve
                            </Button>}
                    </div>
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
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <h3>Seller List</h3>
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


