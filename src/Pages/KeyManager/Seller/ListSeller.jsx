import { useState } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { productRows } from "../../../dummyData";
import "./listStyle.css";
import { UpdateSellerStatus, allSellerList, createCommission, getCommission } from "../../../API/api";
import { useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Button, Col, Container, Row, ButtonGroup, Table } from 'react-bootstrap';
import { DataGrid } from "@mui/x-data-grid";
import { RiEdit2Line } from "react-icons/ri";
import { width } from "@mui/system";
import SellerAttendence from "./SellerAttendence";
import Modal from 'react-bootstrap/Modal';
import { CommissionComponent } from "./Addseller";
import useAuth from "../../../hooks/useAuth";
import { CommissionComponentshow } from "./EditSeller";
import { IoIosEye } from "react-icons/io";


export default function ListSeller() {
    const { auth, logout } = useAuth();
    const [data, setData] = useState(productRows);
    const [modalData, setModalData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true)
    const [activeButton, setActiveButton] = useState('all');
    const [totalData, setTotalData] = useState([])
    const [sleSllerId, setSeSllerId] = useState()
    const [commissiondata, setCommissiondata] = useState()

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (sellerId) => {
        setShow(true);
        setSeSllerId(sellerId)
        getCommissionDetails(sellerId)
    }


    // const [show2, setShow2] = useState(false);

    // const handleClose2 = () => setShow2(false);
    // const handleShow2 = (sellerId) => {
    //     setShow2(true);
    //     setSeSllerId(sellerId);
    //     getCommissionDetails(sellerId)
    // }


    const getCommissionDetails = async (ID) => {

        let res = await getCommission(ID);

        setCommissiondata(res?.data?.data)
    }

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
    }

    const calculateAverageCommission = (data) => {
        const commissionRates = data.map(item => item.commission_rate);
        const totalCommission = commissionRates.reduce((acc, rate) => acc + rate, 0);
        const averageCommission = totalCommission / commissionRates.length;

        return averageCommission?.toFixed(2);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        {
            field: "shope_name",
            headerName: 'Shop Name',
            width: 150
        },
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
                        {params?.row?.commission_data && <span className="ActiveStatus">{calculateAverageCommission(params?.row?.commission_data)}%</span>}
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
        // {
        //     field: "View Commisson",
        //     headerName: "View commisson",
        //     width: 150,
        //     renderCell: (params) => {
        //         return (
        //             <div>
        //                 <Button size="sm" onClick={() => handleShow2(params?.row?._id)}>View Commision</Button>
        //             </div>
        //         )
        //     }
        // },
        {
            field: "Add Commisson",
            headerName: "commisson",
            width: 150,
            renderCell: (params) => {
                return (
                    <div>
                        <Button size="sm" onClick={() => handleShow(params?.row?._id)}>Add Commision</Button>
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


    const handlecreateCommissionFunc = async (dataValue) => {

        console.log({ dataValue })

        let payload = {

            "staff": auth?.userId,
            "sellerId": sleSllerId,
            "categoryId": dataValue?.categoryId,
            "commission_rate": parseInt(dataValue?.commission_rate)
        }

        console.log({ payload })

        let res = await createCommission(payload);

        console.log(res, 'conm res')

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
                            <h3>Sellers List</h3>
                        </Col>
                    </Row>
                    {/* <SellerAttendence/> */}
                    {/* <Row >
                        <Col className="d-flex justify-content-end p-2">
                            <Button className="addCategoryButton" size="sm" variant="dark" onClick={() => navigate('/key/AddSeller')}>
                                <AiOutlinePlus /> Add New Seller
                            </Button>
                        </Col>
                    </Row> */}
                    <Row className="mt-4">
                        <Col >
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
                                    Rejected
                                </Button>
                            </ButtonGroup>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Button className="addCategoryButton" size="sm" variant="dark" onClick={() => navigate('/key/AddSeller')}>
                                <AiOutlinePlus /> Add New Seller
                            </Button>
                        </Col>
                    </Row>
                    {/* <Row className="justify-content-md-center">
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
                    </Row> */}
                </Container>
                <Container>
                    <Row className="justify-content-md-center mt-4">
                        <Col>
                            <Table  bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Shop Name</th>
                                        <th>Shop Image</th>
                                        <th>Seller Name</th>
                                        <th>Seller Email</th>
                                        <th>Seller Phone No.</th>
                                        <th>Registration</th>
                                        <th>Status</th>
                                        <th>Commission</th>
                                        <th>Action</th>
                                        <th>View</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row) => (
                                        <tr key={row?.id}>
                                            <td>{row?.id}</td>
                                            <td>{row?.Shop_Details_Info?.shope_name}</td>
                                            <td>
                                                <div className="productListItem">
                                                    <img className="productListImg" src={row?.Shop_Details_Info?.pic_of_shope?.[0]} alt="" />
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
                                            <td>
                                                <Button size="sm" onClick={() => handleShow(row?._id)}>Add</Button>
                                            </td>
                                            <td>
                                                <div className="buttonWrapper">
                                                    <Button variant="success" onClick={() => navigate(`/key/EditSeller/${row?._id}`)} size="sm">
                                                        <RiEdit2Line />
                                                    </Button>
                                                </div>
                                            </td>
                                            <td>
                                                <Button size="sm" variant="dark" onClick={() => navigate(`/key/keysellerdetails/${row?._id}`)}><IoIosEye/></Button>
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
                <Toaster position="top-right" />
                <Container>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Commission</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CommissionComponent catsdata={commissiondata} handlecreateCommissionFunc={handlecreateCommissionFunc} />
                        </Modal.Body>
                    </Modal>
                </Container>
                {/* <Container>
                    <Modal show={show2} onHide={handleClose2}>
                        <Modal.Header closeButton>
                            <Modal.Title>Modal heading</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CommissionComponentshow catsdata={commissiondata} />
                        </Modal.Body>
                    </Modal>
                </Container> */}
            </div>
        </>


    );





}


// export const CommissionComponent = ({ addCategorytoForm }) => {
//     const [formData, setFormData] = useState({
//         categories: [{ categoryId: '', commission_rate: '' }]
//     });
//     const [categorylist, setcategorylist] = useState([]);


//     useEffect(() => {
//         getAllCats()
//     }, [])

//     async function getAllCats() {
//         await allCategoryList().then((res) => {
//             setcategorylist(res?.data?.data)
//         }).catch((err) => {
//             console.log(err)
//         })
//     }

//     const handleChange = (e, index) => {
//         const { name, value } = e.target;
//         const updatedCategories = [...formData.categories];
//         updatedCategories[index][name] = value;
//         setFormData({ ...formData, categories: updatedCategories });
//     };

//     const addCategory = () => {
//         setFormData({
//             ...formData,
//             categories: [...formData.categories, { categoryId: '', commission_rate: '' }]
//         });
//     };

//     const handleSave = () => {
//         console.log(formData.categories);
//         addCategorytoForm(formData.categories)
//     };

//     const handleDelete = (index) => {
//         const updatedCategories = [...formData.categories];
//         updatedCategories.splice(index, 1);
//         setFormData({ ...formData, categories: updatedCategories });
//     };

//     return (

//         <Col xs={12} >
//             <Form.Group controlId="commissionRate">
//                 <Form.Label>Commission rate against category(%)</Form.Label>
//                 <span>
//                     <Button variant="dark" onClick={handleSave} size="sm">Save</Button>
//                 </span>
//                 {formData.categories.map((item, index) => (
//                     <Row key={index} className="mb-2">
//                         <Col>
//                             <Form.Label>category</Form.Label>
//                             <Form.Select
//                                 name="categoryId"
//                                 value={item.categoryId}
//                                 onChange={(e) => handleChange(e, index)}
//                                 required
//                             >
//                                 <option value="" disabled>Select category</option>
//                                 {categorylist?.length > 0 && categorylist.map((ele) => (
//                                     <option value={ele?._id}>{ele?.title}</option>
//                                 ))}
//                             </Form.Select>
//                         </Col>
//                         <Col>
//                             <Form.Label>commission(%)</Form.Label>
//                             <Form.Control
//                                 type="number"
//                                 name="commission_rate"
//                                 value={item.commission}
//                                 onChange={(e) => handleChange(e, index)}
//                                 placeholder="Commisson rate"
//                                 required
//                             />
//                         </Col>
//                         <Col>
//                             <Button size="sm" variant="dark" >SAVE</Button>
//                         </Col>
//                         <Col>
//                             <MdCancel size={22} color='red' onClick={() => handleDelete(index)} />
//                         </Col>
//                     </Row>
//                 ))}
//                 <IoIosAddCircle size={26} onClick={addCategory} />
//                 <span style={{ marginLeft: '5px', color: 'grey', fontSize: '16px' }}  >Add more...</span>
//             </Form.Group>
//         </Col>


//     );
// };