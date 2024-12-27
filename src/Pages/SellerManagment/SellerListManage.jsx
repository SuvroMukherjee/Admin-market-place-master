import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Carousel,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { toast, Toaster } from "react-hot-toast";
import { FaInfoCircle, FaRegUser } from "react-icons/fa";
import { GrCatalog } from "react-icons/gr";
import { IoIosEye } from "react-icons/io";
import { MdAutorenew } from "react-icons/md";
import { RiFolderSettingsFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  AdminSellerLists,
  allBrandList,
  allcatList,
  deleteSellerById,
  getPermittedCatalogue,
  UpdateSellerPermission,
  UpdateSellerStatus,
} from "../../API/api";
import { distanceCategories } from "../../common/DistanceDelivery";
import { productRows } from "../../dummyData";
import "./Seller.css";

export default function SellerListManage() {
  const [data, setData] = useState(productRows);
  // const [modalData, setModalData] = useState({});
  // const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sellerDetails, setSellerDeatils] = useState();
  const [activeButton, setActiveButton] = useState("all");
  const [totalData, setTotalData] = useState([]);
  const [selectedSeller, setSellerSeller] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (data) => {
    setShow(true);
    setSellerSeller(data);
  };

  const handleButtonClick = (buttonType) => {
    if (buttonType == "pending") {
      let filtersData = totalData?.filter((ele) => {
        return ele?.status == "pending";
      });
      setData(filtersData);
    } else if (buttonType == "approve") {
      let filtersData = totalData?.filter((ele) => {
        return ele?.status == "approved";
      });
      setData(filtersData);
    } else if (buttonType == "reject") {
      let filtersData = totalData?.filter((ele) => {
        return ele?.status == "rejected";
      });
      console.log({ filtersData });
      setData(filtersData);
    } else if (buttonType == "all") {
      getAllSellersList();
    }
    setActiveButton(buttonType);
  };

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      getAllSellersList();
    }, 3000);
  }, []);

  async function getAllSellersList() {
    await AdminSellerLists()
      .then((res) => {
        const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setData(dataWithUniqueIds);
        setTotalData(dataWithUniqueIds);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleStatus = async (data, password = "") => {
    let payload = {};
    console.log({ data });
    if (data?.status == "approved") {
      payload = {
        status: "rejected",
      };
    } else {
      payload = {
        status: "approved",
        password: "Enter the Password that you have set",
      };
    }

    await UpdateSellerStatus(data?._id, payload)
      .then(() => {
        getAllSellersList();
        toast.success("Seller updated successfully!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  const handleDelete = async (data) => {
    await deleteSellerById(data?._id)
      .then((res) => {
        console.log(res);
        getAllSellersList();
        toast.success("Seller deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  const ShowDetails = (data) => {
    console.log(data);
    setSellerDeatils(data);
  };

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

  // const columns = [
  //   { field: "id", headerName: "ID", width: 90 },
  //   {
  //     field: "shope_name",
  //     headerName: "Shop Name",
  //     width: 200,
  //   },
  //   {
  //     field: "email",
  //     headerName: "Email",
  //     width: 200,
  //   },
  //   {
  //     field: "phone_no",
  //     headerName: "Phone No.",
  //     width: 150,
  //   },
  //   {
  //     field: "address",
  //     headerName: "Address",
  //     width: 150,
  //   },
  //   {
  //     field: "gst_no",
  //     headerName: "Gst No.",
  //     width: 200,
  //   },
  //   {
  //     field: "pic_of_shope",
  //     headerName: "Image",
  //     width: 150,
  //     renderCell: (params) => {
  //       return (
  //         <div className="productListItem">
  //           <img
  //             className="productListImg"
  //             src={params?.row?.pic_of_shope?.[0]}
  //             alt=""
  //           />
  //           <span>{params?.row?.pic_of_shope?.length - 1}+</span>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     field: "rating",
  //     headerName: "Rating by Buyer(avg)",
  //     width: 200,
  //     renderCell: (params) => {
  //       return (
  //         <div className="ratingDiv">
  //           <FaStar color="gold" size={15} /> {params?.row?.review}
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     field: "picup_location",
  //     headerName: "Pickup Location",
  //     width: 150,
  //   },
  //   {
  //     field: "commission_rate",
  //     headerName: "Commission Rate(%)",
  //     width: 200,
  //   },
  //   {
  //     field: "manager",
  //     headerName: "Manager",
  //     width: 150,
  //     renderCell: (params) => {
  //       return <div>{params?.row?.staffId?.name}</div>;
  //     },
  //   },
  //   {
  //     field: "status",
  //     headerName: "Status",
  //     width: 150,
  //     renderCell: (params) => {
  //       return (
  //         <div>
  //           {params?.row?.status == "approved" && (
  //             <span className="ActiveStatus">Approved</span>
  //           )}
  //           {params?.row?.status == "rejected" && (
  //             <span className="DeactiveStatus">Reject</span>
  //           )}
  //           {params?.row?.status == "pending" && (
  //             <span className="PendingStatus">Pending</span>
  //           )}
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     field: "action",
  //     headerName: "Action",
  //     width: 200,
  //     renderCell: (params) => {
  //       return (
  //         <div className="buttonWrapper">
  //           <Button
  //             variant="dark"
  //             onClick={() => ShowDetails(params?.row)}
  //             size="sm"
  //           >
  //             <FaEye /> View
  //           </Button>
  //           {params?.row?.status == "approved" ? (
  //             <Button
  //               variant="danger"
  //               onClick={() => handleStatus(params?.row)}
  //               size="sm"
  //             >
  //               Reject
  //             </Button>
  //           ) : (
  //             // <Button variant="success"   onClick={() => handleStatus(params?.row)} size="sm">
  //             //     Approve
  //             // </Button>
  //             <Button
  //               variant="success"
  //               onClick={() => handleShow(params?.row)}
  //               size="sm"
  //             >
  //               Approve
  //             </Button>
  //           )}
  //         </div>
  //       );
  //     },
  //   },
  // ];

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registeredByType, setRegisteredByType] = useState("all");

  console.log(registeredByType);

  const generatePassword = () => {
    // Generate a random password of length 6
    const newPassword = Math.random().toString(36).slice(-6);
    setPassword(newPassword);
  };

  const filteredList = data.filter((item) => {
    if (registeredByType === "own") {
      if (!item?.staffId) {
        return item;
      }
    } else if (registeredByType === "kam") {
      if (item?.staffId) {
        return item;
      }
    } else {
      return item;
    }
  });

  const [permissionManageModalShow, setPermissionManageModalShow] =
    useState(false);
  const [
    permissionManageModalDataLoading,
    setPermissionManageModalDataLoading,
  ] = useState(false);
  const [permissionManageModalDataError, setPermissionManageModalDataError] =
    useState(null);

  const [permissionManageSellerId, setPermissionManageSellerId] =
    useState(null);

  const onPermissionManageModalClose = () => {
    setPermissionManageModalShow(false);
    setPermissionManageSellerId(null);
    setPermissionManageModalDataError(null);
  };

  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  useEffect(() => {
    fetchAllCategories();
    fetchAllBrands();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await allcatList();
      const filteredData = res?.data?.data
        .filter((category) => category?.status)
        .sort((a, b) => a?.title.localeCompare(b?.title));
      setCategoryList(filteredData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAllBrands = async () => {
    try {
      const res = await allBrandList();
      const filteredData = res?.data?.data
        .filter((brand) => brand?.status)
        .sort((a, b) => a?.title.localeCompare(b?.title));
      setBrandList(filteredData);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleCheckboxChange = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const getSellerCategoryBrandMapping = async (sellerId) => {
    setPermissionManageModalDataLoading(true);
    try {
      const res = await getPermittedCatalogue(sellerId);
      const data = res?.data?.data;
      const { categories, brand } = data;
      const categoryIds = categories.map((category) => category?._id);
      const brandIds = brand.map((brand) => brand?._id);

      setSelectedCategories(categoryIds);
      setSelectedBrands(brandIds);
    } catch (error) {
      console.error("Error fetching categories and brand map:", error);
      setPermissionManageModalDataError(
        "Error fetching categories and brand map"
      );
      toast.error("Error fetching categories and brand map");
    } finally {
      setPermissionManageModalDataLoading(false);
    }
  };

  const handleBrandCheckboxChange = (brandId) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(brandId)
        ? prevSelected.filter((id) => id !== brandId)
        : [...prevSelected, brandId]
    );
  };

  const handleSubmit = async () => {
    const payload = {
      sellerId: permissionManageSellerId?._id,
      categories: selectedCategories,
      brand: selectedBrands,
    };

    toast
      .promise(UpdateSellerPermission(payload), {
        loading: "Updating seller category and brand mapping...",
        success: "Seller category and brand mapping updated successfully!",
        error: "Error updating seller category and brand mapping",
      })
      .then(() => {
        onPermissionManageModalClose();
      })
      .catch((error) => {
        console.error(
          "Error updating seller category and brand mapping:",
          error
        );
      });
  };

  useEffect(() => {
    if (permissionManageSellerId) {
      getSellerCategoryBrandMapping(permissionManageSellerId?._id);
    }
  }, [permissionManageSellerId]);

  console.log({ selectedCategories, selectedBrands });

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
      <div className="productList mt-2 p-4 mt-4">
        <Container>
          <Row className="justify-content-md-center mb-2">
            <Col md="auto">
              <h4>Seller - List</h4>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <ButtonGroup>
                <Button
                  variant={activeButton === "all" ? "dark" : "outline-dark"}
                  onClick={() => handleButtonClick("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={activeButton === "pending" ? "dark" : "outline-dark"}
                  onClick={() => handleButtonClick("pending")}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={activeButton === "approve" ? "dark" : "outline-dark"}
                  onClick={() => handleButtonClick("approve")}
                  size="sm"
                >
                  Approved
                </Button>
                <Button
                  variant={activeButton === "reject" ? "dark" : "outline-dark"}
                  onClick={() => handleButtonClick("reject")}
                  size="sm"
                >
                  Rejected
                </Button>
              </ButtonGroup>
            </Col>
            <Col xs={2}> Total : {data?.length}</Col>
            <Col xs={5}>
              <FaInfoCircle /> Keep the cursor pointer inside the table and use{" "}
              <span className="fw-bold">shift + scrollbar</span> to scroll from
              left to right if needed.
            </Col>
          </Row>
          <Row className="mt-2">
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span>Filter by register by :</span>
              <Form.Check
                type="radio"
                label="All"
                name="registeredBy"
                checked={registeredByType === "all"}
                onChange={() => setRegisteredByType("all")}
              />
              <Form.Check
                type="radio"
                label="Own"
                checked={registeredByType === "own"}
                name="registeredBy"
                onChange={() => setRegisteredByType("own")}
              />
              <Form.Check
                type="radio"
                label="KAM"
                checked={registeredByType === "kam"}
                name="registeredBy"
                onChange={() => setRegisteredByType("kam")}
              />
            </div>
          </Row>
        </Container>
        <Container>
          <Row className="justify-content-md-center mt-4">
            <Col>
              <div
                style={{
                  overflowY: "auto",
                  maxHeight: "600px",
                  border: "1px solid #ccc",
                }}
              >
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        ID
                      </th>
                      <td
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Registered By
                      </td>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Shop Name
                      </th>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Shop Image
                      </th>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Seller Name
                      </th>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Seller Email
                      </th>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Seller Phone No.
                      </th>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Registration
                      </th>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Delivery Distance
                      </th>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Permission Catalog
                      </th>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        View
                      </th>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Action
                      </th>
                      <th
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length > 0 &&
                      filteredList.map((row) => (
                        <tr key={row?.id}>
                          <td>{row?.id}</td>
                          <td>{row?.staffId ? row?.staffId?.name : "Own"}</td>
                          <td>{row?.Shop_Details_Info?.shope_name}</td>
                          <td>
                            <div className="productListItem">
                              <img
                                className="productListImg"
                                src={
                                  row?.Shop_Details_Info?.pic_of_shope?.[0] ||
                                  row?.Shop_Details_Info?.pic_of_shope?.[0]
                                    ?.imag_path
                                }
                                alt=""
                              />
                              {row?.Shop_Details_Info?.pic_of_shope?.length >
                                2 && (
                                <span>
                                  {row?.Shop_Details_Info?.pic_of_shope
                                    ?.length - 1}
                                  +
                                </span>
                              )}
                            </div>
                          </td>
                          <td>{row?.user_name}</td>
                          <td>{row?.email}</td>
                          <td>{row?.phone_no}</td>
                          <td>
                            {row?.doc_details?.gst_no ? (
                              <p
                                style={{ color: "white", background: "green" }}
                              >
                                Complete
                              </p>
                            ) : (
                              <p
                                style={{
                                  color: "black",
                                  background: "#FAA300",
                                }}
                              >
                                Incomplete
                              </p>
                            )}
                          </td>
                          <td>
                            {/* {row?.Shop_Details_Info?.distance_category} 
                            <br /> */}
                            <p style={{ fontSize: "12px", fontWeight: "bold" }}>
                              {/* {distanceCategories?.find(
                              (ele) =>
                                ele?.distance ===
                                row?.Shop_Details_Info?.distance_category
                            )?.range
                              ? `(${
                                  distanceCategories.find(
                                    (ele) =>
                                      ele?.distance ===
                                      row?.Shop_Details_Info?.distance_category
                                  )?.range
                                })`
                              : ""} */}
                              <p>
                                {
                                  distanceCategories?.find(
                                    (ele) =>
                                      ele?.distance ===
                                      row?.Shop_Details_Info?.distance_category
                                  )?.range
                                }{" "}
                                -{" "}
                                {
                                  distanceCategories?.find(
                                    (ele) =>
                                      ele?.distance ===
                                      row?.Shop_Details_Info?.distance_category
                                  )?.text
                                }
                              </p>
                            </p>
                          </td>
                          <td>
                            <span className="d-flex justify-content-center gap-2 flex-column">
                              <Button
                                size="sm"
                                variant="dark"
                                onClick={() =>
                                  navigate(
                                    `/Admin/catalogue-permissions?sellerId=${row?._id}`
                                  )
                                }
                              >
                                <GrCatalog /> Requests
                              </Button>

                              <Button
                                size="sm"
                                variant="dark"
                                onClick={() => {
                                  setPermissionManageModalShow(true);
                                  setPermissionManageSellerId(row);
                                }}
                              >
                                <RiFolderSettingsFill /> Manage
                              </Button>
                            </span>
                          </td>

                          <td>
                            {row?.status === "approved" && (
                              <span className="ActiveStatus">Approved</span>
                            )}
                            {row?.status === "rejected" && (
                              <span className="DeactiveStatus">Reject</span>
                            )}
                            {row?.status === "pending" && (
                              <span className="PendingStatus">Pending</span>
                            )}
                          </td>

                          <td>
                            <Button
                              size="sm"
                              variant="dark"
                              onClick={() =>
                                navigate(`/SellerDetails/${row?._id}`)
                              }
                            >
                              <IoIosEye />
                            </Button>
                          </td>
                          <td>
                            {row?.status == "approved" ? (
                              <Button
                                variant="danger"
                                onClick={() => handleStatus(row)}
                                size="sm"
                              >
                                Reject
                              </Button>
                            ) : row?.staffId ? (
                              <Button
                                variant="success"
                                onClick={() => handleShow(row)}
                                size="sm"
                              >
                                Approve
                              </Button>
                            ) : (
                              <Button
                                variant="success"
                                onClick={() => handleStatus(row)}
                                size="sm"
                              >
                                Approve
                              </Button>
                            )}
                          </td>
                          <td>
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(row)}
                              size="sm"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    {filteredList.length === 0 && (
                      <tr>
                        <td colSpan="12" style={{ textAlign: "center" }}>
                          No Data Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </Container>
        <Container>
          <Modal centered size="md" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedSeller?.email}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col xs={8}>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                      Password should be at least 6 characters long.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col className="d-flex align-items-center">
                  <Button variant="dark" size="sm" onClick={generatePassword}>
                    <MdAutorenew /> Auto Generate
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
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => handleStatus(selectedSeller, password)}
                  >
                    SAVE
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        </Container>
        <Container className="mt-4">
          <Row>
            <Col>{sellerDetails && <UserCard user={sellerDetails} />}</Col>
          </Row>
        </Container>
        <Toaster position="top-right" />
      </div>

      <Modal
        show={permissionManageModalShow}
        onHide={onPermissionManageModalClose}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <p
              style={{
                fontSize: "20px",
              }}
            >
              {`Manage Category & Brand Permission For ${permissionManageSellerId?.user_name}`}
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {permissionManageModalDataLoading && (
            <Container>
              <Row>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px",
                  }}
                >
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </Row>
            </Container>
          )}

          {permissionManageModalDataError && (
            <Container>
              <Row>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100px",
                  }}
                >
                  <p>{permissionManageModalDataError}</p>
                </div>
              </Row>
            </Container>
          )}

          {!permissionManageModalDataLoading &&
            !permissionManageModalDataError && (
              <Container>
                <Row>
                  <Col>
                    {/* Categories Section */}
                    <Row className="mt-4">
                      <p style={{ fontWeight: "bold" }}>
                        Select Categories - {selectedCategories?.length}
                      </p>
                      <Row>
                        {categoryList?.map((option) => (
                          <Col key={option?._id} xs={3} className="mt-2">
                            <input
                              type="checkbox"
                              id={option?._id}
                              checked={selectedCategories.includes(option?._id)}
                              onChange={() => handleCheckboxChange(option?._id)}
                            />
                            <label
                              className="mx-2 frmLable"
                              htmlFor={option?._id}
                            >
                              {option?.title}
                            </label>
                          </Col>
                        ))}
                      </Row>
                    </Row>

                    {/* Brands Section */}
                    <Row className="mt-4">
                      <p style={{ fontWeight: "bold" }}>
                        Select Brands - {selectedBrands?.length}
                      </p>
                      <Row>
                        {brandList?.map((option) => (
                          <Col key={option?._id} xs={2} className="mt-2">
                            <input
                              type="checkbox"
                              id={option?._id}
                              checked={selectedBrands.includes(option?._id)}
                              onChange={() =>
                                handleBrandCheckboxChange(option?._id)
                              }
                            />
                            <label
                              className="mx-2 frmLable"
                              htmlFor={option?._id}
                            >
                              {option?.title}
                            </label>
                          </Col>
                        ))}
                      </Row>
                    </Row>
                  </Col>
                </Row>

                <Toaster position="top-right" />
              </Container>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button variant="secondary" onClick={onPermissionManageModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const UserCard = ({ user }) => {
  console.log({ user });
  return (
    <>
      <Card style={{ width: "18rem" }}>
        <Card.Header>
          <FaRegUser /> Seller Details
        </Card.Header>
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
            <br />
            <strong>Commission Rate:</strong> {user?.commission_rate}%
            <br />
            <strong>Average Rating :</strong> {user?.rating || 0}
            <br />
            <strong>Status:</strong> {user?.status}
          </Card.Text>
          <Row>
            <Col className="d-flex align-items-center">
              <strong>Shop Images</strong>
            </Col>
            <Col xs={6}>
              <Carousel>
                {user?.pic_of_shope?.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={image}
                      alt={`Shop Image ${index + 1}`}
                    />
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
