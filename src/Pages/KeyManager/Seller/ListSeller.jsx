import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { productRows } from "../../../dummyData";
import "./listStyle.css";
import { UpdateSellerStatus, allSellerList } from "../../../API/api";
import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Button, Col, Container, Row, ButtonGroup } from 'react-bootstrap';
import { DataGrid } from "@mui/x-data-grid";
import { RiEdit2Line } from "react-icons/ri";


export default function ListSeller() {
    const [data, setData] = useState(productRows);
    const [modalData, setModalData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true)
    const [activeButton, setActiveButton] = useState('all');
    const [totalData,setTotalData]  = useState([])

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
        await allSellerList().then((res) => {
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

    const calculateAverageCommission = (data) => {
        const commissionRates = data.map(item => item.commission_rate);
        const totalCommission = commissionRates.reduce((acc, rate) => acc + rate, 0);
        const averageCommission = totalCommission / commissionRates.length;
    
        return averageCommission?.toFixed(2);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "email",
            headerName: "Email",
            width: 150,
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
            width: 150,
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
            field: "picup_location",
            headerName: "Pickup Location",
            width: 150,
        },
        {
            field: "commission_rate",
            headerName: "Commission Rate(%)",
            width: 200,
            renderCell: (params) => {
                return (
                    <div>
                        {params?.row?.commission_data  && <span className="ActiveStatus">{calculateAverageCommission(params?.row?.commission_data)}%</span>}
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
            width: 100,
            renderCell: (params) => {
                return (
                    <div className="buttonWrapper">
                        <Button variant="warning" onClick={() => navigate(`/key/EditSeller/${params?.row?._id}`)} size="sm">
                            <RiEdit2Line /> Edit
                        </Button>
                        {/* {params?.row?.status ?
                            <Button variant="danger" onClick={() => handleStatus(params?.row)}>
                                Deactive
                            </Button> :
                            <Button variant="success" onClick={() => handleStatus(params?.row)}>
                                Active
                            </Button>} */}
                        {/* <Button variant="outline-danger" onClick={() => handleDelete(params?.row?._id)}>
                            <FaRegTrashAlt />
                        </Button> */}
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
                            <h3>Sellers List</h3>
                        </Col>
                    </Row>
                    <Row >
                        <Col className="d-flex justify-content-end p-2">
                            <Button className="addCategoryButton" variant="dark" onClick={() => navigate('/key/AddSeller')}>
                                <AiOutlinePlus /> Add New Seller
                            </Button>
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
                                    Approve
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
                                style={{ height: 400, width: '100%' }}
                                rows={data}
                                columns={columns}
                                pageSize={8}
                                noRowsOverlay={
                                    data?.length == 0 && <div style={{ textAlign: 'center', padding: '20px' }}>No Data Found</div>
                                }
                            />
                        </Col>
                    </Row>
                </Container>
                <Toaster position="top-right" />
            </div>
        </>


    );
}
