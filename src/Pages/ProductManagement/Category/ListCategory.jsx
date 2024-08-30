import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlinePlus } from "react-icons/ai";
import { FaInfoCircle, FaRegTrashAlt } from "react-icons/fa";
import { FaCodePullRequest } from "react-icons/fa6";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  DeleteProductCategory,
  UpdateProductCategory,
  UpdateStatusProductCategory,
  allCategoryList,
  topCatList,
} from "../../../API/api";
import { productRows } from "../../../dummyData";
import "../product.css";
import EditCategory from "./EditCategory";
import moment from "moment";
import { Select } from "@mui/material";

export default function ListCategory() {
  const [data, setData] = useState(productRows || []);
  const [topCats, setTopCats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState("");

  const navigate = useNavigate();

  const handleShow = (catdata) => {
    setModalData(catdata);
    setShowModal(true);
  };
  const handleClose = () => {
    getCategoryList();
    setShowModal(false);
  };

  // const handleDelete = (id) => {
  //     setData(data.filter((item) => item.id !== id));
  // };

  useEffect(() => {
    getCategoryList();
    topCategoryList();
  }, []);

  async function getCategoryList() {
    await allCategoryList()
      .then((res) => {
        const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setData(dataWithUniqueIds);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  async function topCategoryList() {
    try {
      setLoading(true);
      const res = await topCatList();
      setTopCats(res?.data?.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatus = async (data) => {
    let payload = {
      status: !data?.status,
    };

    await UpdateStatusProductCategory(payload, data?._id)
      .then((res) => {
        console.log(res, "res");
        getCategoryList();
        toast.success("Category updated successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Soemthing went wrong!");
      });
  };

  const handleDelete = async (id) => {
    await DeleteProductCategory(id)
      .then((res) => {
        console.log({ res });
        getCategoryList();
        toast.success("Category deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Soemthing went wrong!");
      });
  };

  const HandleTopFunction = async (catData, value) => {
    let payload = {
      topCat: value,
    };

    console.log({ payload });

    await UpdateProductCategory(payload, catData?._id)
      .then((res) => {
        console.log({ res });
        toast.success("Category update successfully");
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img
              className="productListImg"
              src={params.row.image?.[0]?.image_path}
              alt=""
            />
            {/* {params?.row?.image} */}
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
      field: "description",
      headerName: "Description",
      width: 170,
    },
    {
      field: "updatedAt",
      headerName: "uploaded",
      width: 180,
      renderCell: (params) => {
        return (
          <div>
            <span>{moment(params?.row?.updatedAt).format("LLL")}</span>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <div>
            {params?.row?.status ? (
              <span className="ActiveStatus">Active</span>
            ) : (
              <span className="DeactiveStatus">Not Active</span>
            )}
          </div>
        );
      },
    },

    {
      field: "Top category",
      headerName: "Make As Top Category",
      width: 140,
      renderCell: (params) => {
        return (
          <div>
            {params?.row?.topCat ? (
              <Button
                variant="outline-dark"
                onClick={() => HandleTopFunction(params?.row, false)}
                size="sm"
              >
                Already Mark
              </Button>
            ) : (
              <Button
                variant="dark"
                onClick={() => HandleTopFunction(params?.row, true)}
                size="sm"
              >
                Mark As Top
              </Button>
            )}
          </div>
        );
      },
    },

    {
      field: "position",
      headerName: "Select Position",
      width: 140,
      renderCell: (params) => {
        return (
          <div>
            {params?.row?.topCat ? (
              <Form.Select
                name="position"
                value={params?.row?.position}
                // onChange={(e) => setSelectedPosition(e.target.value)}
                size="sm"
              >
                <option value="">Select Position</option>
                {topCats?.length > 0 &&
                  topCats.map((topcat, index) => (
                    <option key={topcat._id} value={index}>
                      {index + 1}
                    </option>
                  ))}
              </Form.Select>
            ) : null}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 350,
      renderCell: (params) => {
        return (
          <div className="buttonWrapper">
            <Button
              variant="warning"
              onClick={() => handleShow(params?.row)}
              size="sm"
            >
              <RiEdit2Line /> Edit
            </Button>
            {params?.row?.status ? (
              <Button
                variant="danger"
                onClick={() => handleStatus(params?.row)}
                size="sm"
              >
                Deactive
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={() => handleStatus(params?.row)}
                size="sm"
              >
                Active
              </Button>
            )}
            <Button
              variant="outline-danger"
              onClick={() => handleDelete(params?.row?._id)}
              size="sm"
            >
              <FaRegTrashAlt />
            </Button>
          </div>
          // <>

          //     <button className="productListEdit" onClick={() => handleShow(params?.row)}>Edit</button>
          //     <button className="productListEdit" onClick={() => handleStatus(params?.row)}>Status</button>
          //     <button className="productListEdit" onClick={() => handleDelete(params?.row?._id)}>Delete</button>
          // </>
        );
      },
    },
  ];

  const handleNewCat = () => {
    navigate("/Admin/AddCategory");
  };

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
          <EditCategory
            showModal={showModal}
            handleClose={handleClose}
            data={modalData}
          />
          <Row className="justify-content-md-center mb-2">
            <Col md="auto">
              <h3>Category List</h3>
            </Col>
          </Row>
          <Row className="justify-content-md-center mb-3">
            <Col md="auto">
              <p style={{ color: "red", fontWeight: "500" }}>
                <FaInfoCircle /> Please upload transparent category Images{" "}
                <span className="border border-dark mx-2 p-2 bg-gradient-secondary">
                  {" "}
                  <a
                    rel="noreferrer"
                    href="https://www.remove.bg/"
                    target="_blank"
                  >
                    Visit This Site
                  </a>{" "}
                </span>
              </p>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col></Col>
            <Col xs={8}>
              <Row>
                <Col className="d-flex justify-content-end p-2">
                  {/* <button className="addCategoryButton" onClick={() => handleNewCat()}>Add New Category</button> */}
                  <Button
                    className="addCategoryButton"
                    variant="dark"
                    size="sm"
                    onClick={() => navigate("/Admin/category-commission")}
                  >
                    <AiOutlinePlus /> Category Commission
                  </Button>
                </Col>
                <Col className="d-flex justify-content-end p-2">
                  {/* <button className="addCategoryButton" onClick={() => handleNewCat()}>Add New Category</button> */}
                  <Button
                    className="addCategoryButton"
                    variant="dark"
                    size="sm"
                    onClick={() => handleNewCat()}
                  >
                    <AiOutlinePlus /> Add New Category
                  </Button>
                </Col>
                <Col className="d-flex justify-content-end p-2">
                  {/* <button className="addCategoryButton" onClick={() => handleNewCat()}>Add New Category</button> */}
                  <Button
                    className="addCategoryButton"
                    variant="dark"
                    size="sm"
                    onClick={() => navigate("/Admin/category-request")}
                  >
                    <FaCodePullRequest /> Requested Category
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <DataGrid
                rows={data}
                disableSelectionOnClick
                columns={columns}
                pageSize={8}
                // checkboxSelection
              />
            </Col>
          </Row>
        </Container>
        <Toaster position="top-right" />
      </div>
    </>
  );
}
