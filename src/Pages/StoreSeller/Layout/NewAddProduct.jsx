import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import toast, { Toaster } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  SellerProductAdd,
  StatusUpdateProduct,
  allBrandList,
  allCategoryList,
  allProductList,
  deleteProduct,
  getSubCategoryByCategory,
} from "../../../API/api";
import sellerback2 from "../../../assets/sellerback2.jpg";
import "./sellerlayout.css";
import { AiOutlineInfoCircle } from "react-icons/ai";
import PList from "../../ProductManagement/Product/PList";
import AddingProductTable from "./AddingProductTable";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_BASE;

export default function NewAddProduct() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allcategoryList, setAllCategoryList] = useState();
  const [maindata, setMaindata] = useState([]);
  const [allSubcategorylist, setSubCatgoryList] = useState();
  const [allbrandList, setAllBrandList] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [show, setShow] = useState(false);
  const [seletedProducrt, setSelectedProduct] = useState();
  const [formData, setFormData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [variantsArray, setVariantsArray] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleCheckboxChange = () => {
    // Toggle the value of 'isChecked' when the checkbox is clicked
    setIsChecked(!isChecked);

    if (isChecked == true) {
      setData([]);
    }
  };

  const handlePriceChange = (specIndex, price) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[specIndex] = { ...newData[specIndex], price };
      return newData;
    });
  };

  const handleQuansChange = (specIndex, quantity) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[specIndex] = { ...newData[specIndex], quantity };
      return newData;
    });
  };

  const handleShippingChange = (specIndex, shipping_cost) => {
    setFormData((prevData) => {
      const newData = [...prevData];
      newData[specIndex] = { ...newData[specIndex], shipping_cost };
      return newData;
    });
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { userId } = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    setTimeout(() => {
      getProductListFunc();
      getAllCats();
      getBrandList();
    }, 2000);
  }, []);

  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(selectedValues);
  };

  async function getProductListFunc() {
    // await allProductList()
    //   .then((res) => {
    //     const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
    //       ...item,
    //       id: index + 1,
    //     }));
    //     //  setData(dataWithUniqueIds)
    //     console.log(dataWithUniqueIds,'datawithuniqueids');
    //     setMaindata(dataWithUniqueIds);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   })
    //   .finally((data) => {
    //     setLoading(false);
    //   });
    
      try {
        const res = await axios.get(
          `${apiUrl}/product/all-list?page=${1}&limit=15`
        );
        setMaindata(res?.data?.data);
        setData(res?.data?.data);
        //     setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
   
  }

  async function getAllCats() {
    await allCategoryList()
      .then((res) => {
        setAllCategoryList(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function getBrandList() {
    await allBrandList()
      .then((res) => {
        console.log(res?.data?.data, "brands");
        setAllBrandList(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleCategoryChange = async (e) => {
    console.log(e.target.value);
    setLoading(true);
    let filterData = maindata?.filter((ele) => {
      return ele?.categoryId?._id == e?.target?.value;
    });
    setData(filterData);

    await getSubCategoryByCategory(e?.target?.value)
      .then((res) => {
        console.log(res?.data?.data, "subcats");
        setSubCatgoryList(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const handleSubChange = (e) => {
    setLoading(true);
    let filterData = maindata?.filter((ele) => {
      return ele?.subcategoryId?._id == e.target.value;
    });
    setData(filterData);
    setLoading(false);
  };

  const handleBrandChange = (e) => {
    console.log(e.target.value);
    setLoading(true);
    let filterData = maindata?.filter((ele) => {
      return ele?.brandId?._id == e.target.value;
    });
    setData(filterData);
    setLoading(false);
  };

  const cleatFilter = () => {
    setLoading(true);
    getProductListFunc();
  };

  const AddSellerProduct = async (
    Pid,
    SpecId,
    price,
    quantity,
    shipping_cost
  ) => {
    if (price) {
      let payload = {
        sellerId: userId,
        productId: Pid,
        specId: SpecId,
        price: price,
        quantity: quantity,
        shipping_cost: shipping_cost,
        // "discount_price": inputValue?.discount_price
      };

      console.log(payload);

      await SellerProductAdd(payload)
        .then((res) => {
          if (res?.response?.data?.error == true) {
            toast.error(res?.response?.data?.message);

            // handleClose();
          } else {
            toast.success("product added successfully");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleStatus = async (dataset) => {
    let payload = {
      status: !dataset?.status,
    };

    await StatusUpdateProduct(dataset?._id, payload)
      .then((res) => {
        console.log(res);
        getProductListFunc();
        toast.success("Product status updated successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handledeleteProduct = async (id) => {
    await deleteProduct(id)
      .then((res) => {
        console.log(res);
        getProductListFunc();
        toast.success("Product deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "productId", headerName: "Product Id", width: 150 },
    { field: "name", headerName: "Name", width: 250 },
    {
      field: "image",
      headerName: "Image",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img
              className="productListImg"
              src={params?.row?.image?.[0]}
              alt=""
            />
            {params?.row?.image?.length > 1 && (
              <span>{params?.row?.image?.length - 1}+</span>
            )}
          </div>
        );
      },
    },
    { field: "regular_price", headerName: "Price", width: 150 },
    { field: "desc", headerName: "Description", width: 150 },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">{params.row.categoryId?.title}</div>
        );
      },
    },
    {
      field: "Subcategory",
      headerName: "Sub Category",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            {params.row.subcategoryId?.title}
          </div>
        );
      },
    },
    {
      field: "Brand",
      headerName: "Brand",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">{params.row?.brandId?.title}</div>
        );
      },
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            {params.row?.tags?.map((ele, i) => (
              <p key={i}>{ele},</p>
            ))}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            {params?.row?.status ? (
              <span className="ActiveStatus">Active</span>
            ) : (
              <span className="DeactiveStatus">Not Active</span>
            )}
          </div>
        );
      },
    },
    // { field: "type", headerName: "Type", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <div className="buttonWrapper">
              <Button
                variant="success"
                onClick={() => handleAddProduct(params?.row)}
                size="sm"
              >
                <RiEdit2Line /> Add Item
              </Button>
            </div>
          </>
        );
      },
    },
  ];

  // new

  const handleAddProduct = (product) => {
    console.log(product, "product");
    setSelectedProduct(product);
    handleShow();
  };

  const handleSubmit = (index) => {
    console.log("Form Data:", formData[index]);
    // You can now send formData to your server or perform any other desired actions
  };

  const navbarStyle = {
    paddingLeft: "0px", // Adjust the left padding
    paddingRight: "10px", // Adjust the right padding
    height: "6vh",
  };

  const [searchtext, setsearchrtext] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchproducts = () => {
    let filterproducts = maindata?.filter((ele) => {
      console.log(searchtext?.toLowerCase());
      return ele?.name?.toLowerCase()?.includes(searchtext?.toLowerCase());
    });
    console.table({ filterproducts });
    // setSearchResults(filterproducts);
    setIsChecked(true);
    setData(filterproducts);
  };

  const showVariants = (data) => {
    console.log(data);
    setVariantsArray(data);
    handleShowModal();
  };

  function calculateApprovedVariantsLength(items, index) {
    const approvedItems = items.filter(
      (item) => "is_approved" in item && item?.is_approved
    );

    console.log(approvedItems, index, "index");

    return 0;
  }

  console.log({ maindata });

  return (
    <div style={{ background: "#ffffff", height: "100vh" }}>
      <div>
        <div className="mt-5">
          <Row className="mt-4">
            <Col
              xs={4}
              className="mt-4 d-flex align-items-center justify-content-center p-4"
            >
              <Image src={sellerback2} fluid width={400} height={400} />
            </Col>
            <Col>
              <Row>
                <Col className="mt-2 padd1">To Being Adding Products</Col>
              </Row>

              <Row className="mt-4">
                <Col className="padd2">
                  Search Your Product In Zoofi Catalogue <br /> & Start Selling
                </Col>
              </Row>
              {/* <Form>
                <Row className="mt-4">
                  <Col xs={7} style={{ marginLeft: "-2%" }}>
                    <InputGroup>
                      <InputGroup.Text id="basic-addon1">
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search product by entering product name.."
                        aria-label="Username"
                        className="p-2"
                        list="browsers" // This associates the datalist with the input
                        aria-describedby="basic-addon1"
                        onChange={(e) => setsearchrtext(e.target.value)}
                      />
                      {searchtext?.length > 2 && (
                        <datalist id="browsers" style={{ background: "red" }}>
                          {maindata?.map((ele, index) => (
                            <option key={index} value={ele?.name} />
                          ))}
                        </datalist>
                      )}
                    </InputGroup>
                  </Col>
                  <Col className="d-flex align-items-center">
                    <Button
                      onClick={() => searchproducts()}
                      size="sm"
                      variant="warning"
                    >
                      SEARCH
                    </Button>
                  </Col>
                </Row>
              </Form> */}

              {/* <Row className="mt-4">
                <Col>
                  <Form>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Check All Available Products"
                      className="custom-label-style" // Add a custom class for styling
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                  </Form>
                </Col>
              </Row> */}
              <Row className="mt-4 mb-2" xs={6}>
                <Col
                  xs={3}
                  className="optionCol"
                  onClick={() =>
                    navigate("/seller/seller-ownproduct-status/new-add")
                  }
                >
                  <p className="smalltextadd">
                    Could not find your product in the Zoofi Catalogue ?{" "}
                    <span>Create New Listing</span>{" "}
                  </p>
                </Col>
                <Col
                  xs={3}
                  className="optionCol"
                  onClick={() => navigate("/seller/category-request")}
                >
                  <p className="smalltextadd">
                    Manage your selling applications by{" "}
                    <span>requesting new Categories</span>{" "}
                  </p>
                </Col>
                <Col
                  xs={3}
                  className="optionCol"
                  onClick={() => navigate("/seller/brand-request")}
                >
                  <p className="smalltextadd">
                    Start listing new brand ? <span>Create Brand Request</span>{" "}
                  </p>
                </Col>
              </Row>

              {/* {!isChecked && (
                <Row className="mt-4 ml-2">
                  <Col xs={6}>
                    <ListGroup>
                      {searchResults?.length > 0 &&
                        searchResults?.map((ele, index) => (
                          <ListGroup.Item key={index} as="li">
                            <Row className="locationTagHeader mt-2">
                              <Col>{index + 1}. Product Name</Col>
                              <Col xs={3}>Brand</Col>
                              <Col xs={2}>Action</Col>
                            </Row>
                            <Row className="locationTagvalue mt-2">
                              <Col>{ele?.name}</Col>
                              <Col xs={3}>{ele?.brandId?.title}</Col>
                              <Col xs={2}>
                                <Button
                                  size="sm"
                                  variant="dark"
                                  onClick={() => handleAddProduct(ele)}
                                >
                                  select
                                </Button>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                  </Col>
                </Row>
              )} */}

              {/* {isChecked && (
               
                  <Row className="w-40 mb-2 mt-2">
                    <Col>
                      <Form.Group controlId="categoryId">
                        <Form.Label className="text-dark fw-bold dtext">
                          Category
                        </Form.Label>
                        <Form.Control
                          as="select"
                          size="sm"
                          name="categoryId"
                          onChange={handleCategoryChange}
                          required
                        >
                          <option value="" disabled selected>
                            Select Category
                          </option>
                          {allcategoryList?.length > 0 &&
                            allcategoryList?.map((ele) => (
                              <option key={ele?._id} value={ele?._id}>
                                {ele?.title}
                              </option>
                            ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="categoryId">
                        <Form.Label className="text-dark fw-bold dtext">
                          Sub Category
                        </Form.Label>
                        <Form.Control
                          as="select"
                          size="sm"
                          name="subcategoryId"
                          onChange={handleSubChange}
                          required
                        >
                          <option value="" disabled selected>
                            Select Sub Category
                          </option>
                          {allSubcategorylist?.length > 0 &&
                            allSubcategorylist?.map((ele) => (
                              <option key={ele?._id} value={ele?._id}>
                                {ele?.title}
                              </option>
                            ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="categoryId">
                        <Form.Label className="text-dark fw-bold dtext">
                          Brand
                        </Form.Label>
                        <Form.Control
                          as="select"
                          size="sm"
                          name="brandId"
                          onChange={handleBrandChange}
                        >
                          <option value="" disabled selected>
                            Select Brand
                          </option>
                          {allbrandList?.length > 0 &&
                            allbrandList?.map((ele) => (
                              <option key={ele?._id} value={ele?._id}>
                                {ele?.title}
                              </option>
                            ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="d-flex justify-content-center align-items-end">
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => cleatFilter()}
                      >
                        <IoIosCloseCircle size={17} />
                        CLEAR FILTER
                      </Button>
                    </Col>
                  </Row>
                </div>
              )} */}

              <Toaster position="top-right" />
            </Col>
          </Row>
          {console.log(data,'data')}
        </div>
        {/* {data?.length > 0  && (
          <Container>
            <Row>
              <Col>
                <Table striped responsive bordered hover className="mt-4">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Image</th>
                      <th>Variants</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Sub Category</th>
                      <th>Brand</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data
                      .filter((row) => row?.status) // Filter elements where status is true
                      .map((row) => (
                        <tr key={row?.id}>
                          <td>{row?._id}</td>
                          <td>{row?.name}</td>
                          <td>
                            <div className="productListItem">
                              <Image
                                className="productListImg"
                                src={row.image?.[0]?.image_path}
                                thumbnail
                                alt=""
                              />
                            </div>
                          </td>
                          <td
                            className="variants"
                            onClick={() => showVariants(row?.specId)}
                            style={{ cursor: "pointer" }}
                          >
                            ( {row?.specId?.length} ) variants
                          </td>
                          <td>{row?.desc?.substr(0, 50) + "..."}</td>
                          <td>
                            <div className="productListItem">
                              {row.categoryId?.title}
                            </div>
                          </td>
                          <td>
                            <div className="productListItem">
                              {row.subcategoryId?.title}
                            </div>
                          </td>
                          <td>
                            <div className="productListItem">
                              {row?.brandId?.title}
                            </div>
                          </td>
                          <td>
                            <div className="productListItem">
                              {row?.tags?.map((ele, i) => (
                                <p key={i}>{ele},</p>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="productListItem">
                              {row?.status ? (
                                <span className="ActiveStatus">Active</span>
                              ) : (
                                <span className="DeactiveStatus">
                                  Not Active
                                </span>
                              )}
                            </div>
                          </td>
                          <td>{row.type}</td>
                          <td style={{ width: "120px" }}>
                            <Button
                              onClick={() => handleAddProduct(row)}
                              variant="success"
                              size="sm"
                            >
                              Add to Sell
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        )} */}

        {/* <Container>
          <Row>
            <Modal size="xl" show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="p-catname">
                  {seletedProducrt?.name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Row>
                    <Col>
                      <ListGroup
                        style={{
                          maxHeight: "400px",
                          overflowY: "auto",
                          overflowX: "auto",
                          border: "1px solid #ccc",
                          borderRadius: "0px",
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "10px",
                          flexDirection: "column",
                          padding: "10px",
                        }}
                      >
                        {seletedProducrt?.specId?.map((ele, index) => (
                          <ListGroup.Item
                            key={ele?._id}
                            style={{
                              border: "1px solid #ccc",
                              width: "100%",
                            }}
                          >
                            <Row>
                              <Col>
                                <span style={{ fontSize: "16px" }}>
                                  <strong>Variant Title:</strong>
                                  {" ( "}
                                  {ele?.spec_det?.length > 0 &&
                                    ele?.spec_det
                                      ?.slice(0, 3)
                                      .map((ele, index) => (
                                        <span key={index} className="p-desc">
                                          {ele?.title} : {ele?.value}
                                          {index !== 2 && ", "}
                                        </span>
                                      ))}
                                  {" )"}
                                </span>
                              </Col>
                            </Row>

                            <Row>
                              <Col xs={10}>
                                <strong style={{ fontSize: "16px" }}>
                                  Variant Specification Details: {index + 1}
                                </strong>
                              </Col>
                              <Col xs={2}>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() =>
                                    AddSellerProduct(
                                      seletedProducrt?._id,
                                      ele?._id,
                                      formData[index]?.price,
                                      formData[index]?.quantity,
                                      formData[index]?.shipping_cost
                                    )
                                  }
                                  disabled={!ele?.is_approved}
                                >
                                  SAVE
                                </Button>
                              </Col>
                            </Row>

                            <Row className="locationTagHeader mt-2">
                              <Col xs={1}>MRP (₹)</Col>
                              <Col xs={1}>SKUID</Col>
                              {ele?.spec_det?.slice(1, 3).map((e, index) => (
                                <Col key={index} xs={2}>
                                  {e?.title}
                                </Col>
                              ))}
                              <Col>Enter product price (₹)</Col>
                              <Col>Add Stock</Col>
                              <Col>Add Shipping Cost(₹)</Col>
                            </Row>
                            <Row className="locationTagvalue mt-2">
                              <Col xs={1}>{ele?.price}</Col>
                              <Col xs={1}>{ele?.skuId}</Col>
                              {ele?.spec_det?.slice(1, 3).map((e, index) => (
                                <Col key={index} xs={2}>
                                  {e?.value}
                                </Col>
                              ))}
                              <Col>
                                <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Control
                                    type="tel"
                                    size="sm"
                                    placeholder="Product Price"
                                    name="price"
                                    required
                                    max={ele?.price}
                                    value={formData[index]?.price}
                                    onChange={(e) =>
                                      handlePriceChange(index, e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Control
                                    type="tel"
                                    size="sm"
                                    placeholder="Product Quatity"
                                    name="quantity"
                                    required
                                    value={formData[index]?.quantity}
                                    onChange={(e) =>
                                      handleQuansChange(index, e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                              <Col>
                                <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Control
                                    type="tel"
                                    size="sm"
                                    placeholder="Shipping cost"
                                    name="shipping_cost"
                                    required
                                    value={formData[index]?.shipping_cost}
                                    onChange={(e) =>
                                      handleShippingChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
            </Modal>
          </Row>
        </Container>
        <Container>
          <Modal show={showModal} size="xl" onHide={handleCloseModal}>
            <Modal.Body>
              <Row className="d-flex justify-content-md-center gap-4">
                {variantsArray?.length > 0 &&
                  variantsArray?.map((ele, index) => (
                    <Col
                      key={index}
                      className="d-flex justify-content-md-center"
                    >
                      <Card style={{ width: "18rem" }}>
                        {!ele?.is_approved && ele?.created_type != "admins" && (
                          <p className="newrq">
                            <span>
                              <AiOutlineInfoCircle size={20} />
                              {`New Request from - ${ele?.createdby?.shope_name}`}
                            </span>
                          </p>
                        )}

                        <Card.Img
                          className="p-2"
                          variant="top"
                          src={ele?.image?.[0]?.image_path}
                          style={{ height: "auto", objectFit: "cover" }}
                        />

                        <Card.Body>
                          <Row>
                            {ele?.spec_det?.length > 0 &&
                              ele?.spec_det?.slice(0, 5).map((ele, index) => (
                                <div key={index} className="p-desc">
                                  <strong>{ele?.title} :</strong> {ele?.value}
                                </div>
                              ))}
                          </Row>
                          <Row className="mt-2">
                            <Col
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                background: "lightgrey",
                                textAlign: "center",
                                padding: "2%",
                              }}
                            >
                              M.R.P -{" "}
                              <span style={{ color: "green" }}>
                                {ele?.price?.toLocaleString()}
                              </span>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </Modal.Body>
          </Modal>
        </Container> */}
      </div>

      {/** NEWW  */}
      <Container>
        <NewAddProductComponent />
      </Container>
      ,
    </div>
  );
}


const NewAddProductComponent = () => {
 return (
   <div>
     <AddingProductTable />
   </div>
 );
}