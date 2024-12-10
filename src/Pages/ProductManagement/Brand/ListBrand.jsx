import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import toast, { Toaster } from 'react-hot-toast';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaRegTrashAlt } from "react-icons/fa";
import { FaCodePullRequest } from "react-icons/fa6";
import { RiEdit2Line } from 'react-icons/ri';
import { useNavigate } from "react-router-dom";
import { UpdateStatusBrand, allBrandList, deleteBrand } from "../../../API/api";
import { productRows } from "../../../dummyData";
import "../product.css";
import EditBrandPage from "./EditBrandPage";
import { FaInfoCircle } from "react-icons/fa";


export default function ListSubCategory() {
    const [data, setData] = useState(productRows);
    const [modalData, setModalData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            getAllBrandLists();
        }, 3000);
    }, []);


    async function getAllBrandLists() {
        await allBrandList().then((res) => {
            const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
                ...item,
                id: index + 1,
            }));
            setData(dataWithUniqueIds)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        }).finally(()=>{
            setLoading(false)
        })
    }


    const handleStatus = async (data) => {
        let payload = {
            "status": !data?.status
        }

        await UpdateStatusBrand(payload, data?._id).then((res) => {
            getAllBrandLists();
            toast.success('Brand updated successfully!');
        }).catch((err) => {
            console.log(err)
            toast.error('Something went wrong!');
        })
    }


    const handleDelete = async (id) => {
        await deleteBrand(id).then((res) => {
            getAllBrandLists();
            toast.success('Brand delete successfully!');
        }).catch((err) => {
            console.log(err)
            toast.error('Something went wrong!');
        })
    }



    const handleEdit = (dataset) => {
        setModalData(dataset)
        // console.log(dataset);
        setShowModal(true)
    }

    const handleClose = () => {
        getAllBrandLists();
        setShowModal(false)
    };

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        {
            field: "image",
            headerName: "Image",
            width: 130,
            renderCell: (params) => {
                return (
                    <div className="productListItem">
                        <img className="productListImg" src={params.row.image?.[0]?.image_path} alt="brand_logo" />
                    </div>
                );
            },
        },
        {
            field: "title",
            headerName: "Title",
            width: 170,
        },
        {
            field: "status",
            headerName: "Status",
            width: 110,
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
            width: 500,
            renderCell: (params) => {     
                return (
                    <div className="buttonWrapper">
                        <Button variant="warning" onClick={() => handleEdit(params?.row)} size="sm">
                            <RiEdit2Line /> Edit
                        </Button>
                        {params?.row?.status ?
                            <Button variant="danger" onClick={() => handleStatus(params?.row)} size="sm">
                                Deactive
                            </Button> :
                            <Button variant="success" onClick={() => handleStatus(params?.row)} size="sm">
                                Active
                            </Button>}
                        <Button variant="outline-danger" onClick={() => handleDelete(params?.row?._id)} size="sm">
                            <FaRegTrashAlt />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
      <>
        {loading && (
          <div className="productList p-4 contentLoader">
            <Row>
              <Col>
                <Spinner animation="border" size="lg" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Col>
            </Row>
          </div>
        )}
        <div className="productList mt-2 p-4">
          <Container>
            <EditBrandPage
              showModal={showModal}
              handleClose={handleClose}
              data={modalData}
            />
            <Row className="justify-content-md-center">
              <Col md="auto">
                <h3 className="text-center">Brand List</h3>
                <p style={{ color: "red", fontWeight: "500" }}>
                  <FaInfoCircle /> Please upload transparent brand Images{" "}
                  <span className="border border-dark mx-2 p-2 bg-gradient-secondary">
                    {" "}
                    <a href="https://www.remove.bg/" target="_blank">
                      Visit This Site
                    </a>{" "}
                  </span>
                </p>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col className="d-flex justify-content-end p-2 gap-2">
                <Button
                  className="addCategoryButton"
                  variant="dark"
                  onClick={() => navigate("/Admin/Addbrand")}
                >
                  <AiOutlinePlus /> Add New Brand
                </Button>
                <Button
                  className="addCategoryButton"
                  variant="dark"
                  onClick={() => navigate("/Admin/AdminApplications?tab=brands")}
                >
                  <FaCodePullRequest /> Requested Brand
                </Button>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col>
                <DataGrid rows={data} columns={columns} pageSize={8} />
              </Col>
            </Row>
          </Container>
          <Toaster position="top-right" />
        </div>
      </>
    );
}
