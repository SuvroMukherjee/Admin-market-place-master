import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
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
  addCategoryKeyword,
  allCategoryList,
  removeCategoryKeyword,
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
  const [showApplyCatModal, setShowApplyCatModal] = useState(false);
  const [modalData, setModalData] = useState();
  const [catId, setCatId] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [isAddCategoryVisible, setIsAddCategoryVisible] = useState(null);
  const [newCategory, setNewCategory] = useState("");

  const navigate = useNavigate();

  const handleShow = (catdata) => {
    setModalData(catdata);
    setShowModal(true);
  };
  const handleClose = () => {
    getCategoryList();
    setShowModal(false);
  };
  const handleShowApplyModal = (catId) => {
    setShowApplyCatModal(true);
    setCatId(catId);
  };
  const handleCloseApplyModal = () => {
    setShowApplyCatModal(false);
    setCatId(" ");
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
        getCategoryList();
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
        getCategoryList();
      });
  };

  const HandleUpcomingFunction = async (catData, value) => {
    let payload = {
      upcommingCat: value,
      status: !value,
    };

    console.log({ payload });

    await UpdateProductCategory(payload, catData?._id)
      .then((res) => {
        console.log({ res });
        toast.success("Category update successfully");
        getCategoryList();
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
        getCategoryList();
      });
  };

  const handlePosition = (value, row) => {
    console.log(value, row);
    let payload = {
      position: parseInt(value) + 1,
    };

    UpdateProductCategory(payload, row?._id)
      .then((res) => {
        console.log({ res });
        toast.success("Category position updated successfully");
        getCategoryList();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
        getCategoryList();
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
      field: "icon",
      headerName: "Icon",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img
              className="productListImg"
              src={params.row.icon}
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
      width: 250,
      renderCell: (params) => {
        return (
          <div>
            <span>{`${params?.row?.title} ${
              params?.row?.isOpenBox ? "(Open Box)" : ""
            }`}</span>
          </div>
        );
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 170,
    },
    {
      field: "cgst",
      headerName: "CGST",
      renderCell: (params) => {
        return (
          <div>
            <span>{`${params?.row?.cgst} %`}</span>
          </div>
        );
      },
    },
    {
      field: "sgst",
      headerName: "SGST",
      renderCell: (params) => {
        return (
          <div>
            <span>{`${params?.row?.sgst} %`}</span>
          </div>
        );
      },
    },
    {
      field: "igst",
      headerName: "IGST",
      renderCell: (params) => {
        return (
          <div>
            <span>{`${params?.row?.igst} %`}</span>
          </div>
        );
      },
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
                disabled={params?.row?.status == false}
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
          <>
            <div>
              {params?.row?.topCat ? (
                <Form.Select
                  name="position"
                  value={params?.row?.position - 1}
                  onChange={(e) => handlePosition(e.target.value, params?.row)}
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
            {/* <div>
              {"position" in params?.row && (
                <h4 className="m-2 ">{params?.row?.position}</h4>
              )}
            </div> */}
          </>
        );
      },
    },
    {
      field: "Upcoming Category",
      headerName: "Make As Upcoming Category",
      width: 180,
      renderCell: (params) => {
        return (
          <div>
            {params?.row?.upcommingCat ? (
              <Button
                variant="outline-primary"
                onClick={() => HandleUpcomingFunction(params?.row, false)}
                size="sm"
              >
                Already Upcomimg
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => HandleUpcomingFunction(params?.row, true)}
                size="sm"
              >
                Mark As Upcomimg
              </Button>
            )}
          </div>
        );
      },
    },
    {
      field: "Old position",
      headerName: "Old Position",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            {/* <div>
              {params?.row?.topCat ? (
                <Form.Select
                  name="position"
                  value={params?.row?.position - 1}
                  onChange={(e) => handlePosition(e.target.value, params?.row)}
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
            </div> */}
            <div>
              {"position" in params?.row && (
                <h4
                  className="m-2 "
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    fontSize: "16px",
                    background: "#f8d7da",
                    borderRadius: "5px",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {params?.row?.position}
                </h4>
              )}
            </div>
          </>
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
            <Button
              variant="outline-success"
              onClick={() => handleShowApplyModal(params?.row?._id)}
              size="sm"
            >
              Add Keyword
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

  const handleApplyCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    const payload = {
      keywords: newCategory,
    };
    try {
      const response = await addCategoryKeyword(catId, payload);
      toast.success("Category keyword applied successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply category keyword");
    }
  };

  const handleRemoveCategory = () => {
    try {
      const payload = { keywords: newCategory };
      const res = removeCategoryKeyword(catId, payload);
      toast.success("Category Keyword removed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove category keyword");
    } finally {
      handleCloseApplyModal();
      setNewCategory("");
    }
  };

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
          <Modal
            show={showApplyCatModal}
            onHide={handleCloseApplyModal}
            className="mt-5"
          >
            <Modal.Header className="d-flex justify-content-between">
              <Modal.Title>Add or Remove Category Keywords</Modal.Title>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleCloseApplyModal}
              >
                ✕
              </button>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* Radio Buttons */}
                <Row className="mt-2">
                  <Form.Group>
                    <Form.Check
                      type="radio"
                      label="Add"
                      name="action"
                      id="addAction"
                      onChange={() => setIsAddCategoryVisible("add")}
                      checked={isAddCategoryVisible === "add"}
                    />
                    <Form.Check
                      type="radio"
                      label="Remove"
                      name="action"
                      id="removeAction"
                      onChange={() => setIsAddCategoryVisible("remove")}
                      checked={isAddCategoryVisible === "remove"}
                    />
                  </Form.Group>
                </Row>

                {/* Conditional Textarea and Apply Button */}
                {isAddCategoryVisible && (
                  <Row className="mt-3">
                    <Form.Group controlId="newCategory">
                      <Form.Label>
                        {isAddCategoryVisible === "add"
                          ? "Add Keywords"
                          : "Remove Keywords"}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder={
                          isAddCategoryVisible === "add"
                            ? "Enter new keywords separated by commas"
                            : "Enter keywords to remove separated by commas"
                        }
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      className="btn btn-primary btn-block mt-2"
                      onClick={
                        isAddCategoryVisible === "add"
                          ? handleApplyCategory
                          : handleRemoveCategory
                      }
                    >
                      Apply
                    </Button>
                  </Row>
                )}
              </Form>
            </Modal.Body>
          </Modal>
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
                    onClick={() => navigate("/Admin/AdminApplications?tab=catgories")}
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
