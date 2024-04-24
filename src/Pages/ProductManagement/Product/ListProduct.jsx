import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  ListGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineInfoCircle, AiOutlinePlus } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { FaTrashAlt } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosAdd, IoMdCloseCircle } from "react-icons/io";
import { LiaListSolid } from "react-icons/lia";
import { LuClipboardSignature } from "react-icons/lu";
import { MdCancel } from "react-icons/md";
import { PiFileCsvLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import {
  BulkProductUpload,
  DeleteProductSpecification,
  FileUpload,
  ProductSpecificationCreate,
  SpecBulkProductUpload,
  StatusUpdateProduct,
  UpdateProductSpecification,
  allProductList,
  deleteProduct,
} from "../../../API/api";
import { productRows } from "../../../dummyData";
import useAuth from "../../../hooks/useAuth";
import "../product.css";

export default function ListProduct() {
  const [data, setData] = useState(productRows);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedproductid, setSeledtedProductId] = useState();

  const [variantsArray, setVariantsArray] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [showModal2, setShowModal2] = useState(false);

  const handleCloseModal2 = () => setShowModal2(false);
  const handleShowModal2 = () => setShowModal2(true);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    getProductListFunc();
  };

  const navigate = useNavigate();

  async function getProductListFunc() {
    await allProductList()
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

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the file, e.g., upload or process it
      onFileUpload(file, "product");
    }
  };

  const handleFileChangeSpec = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the file, e.g., upload or process it
      onFileUpload(file, "spec");
    }
  };

  // const handleButtonClick = () => {
  //     // Trigger the hidden file input
  //     console.log({ fileInputRef })
  //     fileInputRef.current.click();
  // };

  const onFileUpload = async (file, type) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await FileUpload(formData);
      const fileName = uploadResponse?.data?.data?.fileName;

      if (!fileName) {
        throw new Error("File upload failed");
      }

      const payload = { file: fileName };
      const Bulkres =
        type == "spec"
          ? await SpecBulkProductUpload(payload)
          : await BulkProductUpload(payload);

      if (Bulkres?.data?.error === false) {
        toast.success(`Upload successful: ${file.name}`);
        getProductListFunc();
      } else {
        throw new Error(`Could not upload file: ${file.name}`);
      }
    } catch (error) {
      console.error("Error in file upload:", error.message);
      toast.error(`Error in file upload: ${error.message}`);
    } finally {
      setUploading(false);
      getProductListFunc();
    }
  };

  const [copied, setCopied] = useState(false);
  const [copiedindex, setCopiedIndex] = useState("");

  const copyTextToClipboard = (text, index) => {
    setCopiedIndex(index);
    const textToCopy = text;
    // Create a temporary textarea element
    const textarea = document.createElement("textarea");
    // Set the text content to be copied
    textarea.value = textToCopy;
    // Append the textarea to the body
    document.body.appendChild(textarea);
    // Select the text within the textarea
    textarea.select();
    // Copy the selected text to the clipboard
    document.execCommand("copy");
    // Remove the temporary textarea
    document.body.removeChild(textarea);
    // Set copied state to true
    setCopied(true);
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
      setCopiedIndex("");
    }, 2000);
  };

  const showVariants = (data) => {
    console.log(data);
    setVariantsArray(data);
    handleShowModal2();
  };

  const variationRequestCount = (data) => {
    let filterData = data?.filter((ele) => {
      return ele?.is_approved == false;
    });

    return filterData?.length;
  };

  useEffect(() => {
    setTimeout(() => {
      getProductListFunc();
    }, 5000);
  }, []);

  // filter data based on search term
  const filterData = data.filter((ele) => {
    return (
      ele?.productId?.toString().includes(searchTerm) ||
      ele?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
          <Row className="justify-content-md-center">
            <Col md="auto">
              <h3>Product List</h3>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col
              style={{
                border: "1px solid lightgrey",
                padding: "2%",
                background: "#e5e5e5",
              }}
            >
              <Row className="text-center">
                <Col className="fontbold">Upload New Product</Col>
              </Row>
              <Row>
                <Col className="text-center mt-2">
                  <p style={{ fontSize: "12px" }}>
                    <i>Upload New Product by downloading templete</i>
                  </p>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col xs={12} className="text-center">
                  <a href="https://firebasestorage.googleapis.com/v0/b/hire2inspire-62f96.appspot.com/o/MARKETPLACE_1711535127298.csv?alt=media">
                    <Button size="sm" variant="success">
                      <PiFileCsvLight size="20" /> Download Templete For Product
                    </Button>
                  </a>
                </Col>
                <Col xs={12} className="text-center mt-3">
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <PiFileCsvLight size="20" />
                      Upload Products via CSV
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              style={{
                border: "1px solid lightgrey",
                padding: "2%",
                background: "#e5e5e5",
              }}
              className="mx-4"
            >
              <Row className="text-center">
                <Col className="fontbold">Upload Product's variation</Col>
              </Row>
              <Row>
                <Col className="text-center mt-2">
                  <p style={{ fontSize: "12px" }}>
                    <i>
                      Upload Product's variation by downloading templete and
                      copy <strong>product id</strong> from the product list
                    </i>
                  </p>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs={12} className="text-center">
                  <a href="https://firebasestorage.googleapis.com/v0/b/hire2inspire-62f96.appspot.com/o/MARKETPLACE_1711535413092.csv?alt=media">
                    <Button size="sm" variant="warning">
                      {" "}
                      <LiaListSolid size="20" /> Download Variations Templete
                    </Button>
                  </a>
                </Col>
                <Col xs={12} className="text-center mt-3">
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef2}
                      style={{ display: "none" }}
                      onChange={handleFileChangeSpec}
                    />
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => fileInputRef2.current.click()}
                    >
                      <LiaListSolid size="20" /> Specification via CSV
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={4}></Col>
          </Row>

          <Row className="mt-4">
            <Col xs={10}></Col>
            <Col>
              <Row>
                <Col>
                  <Button
                    size="sm"
                    variant="dark"
                    onClick={() => navigate("/Admin/Addproduct")}
                  >
                    <AiOutlinePlus /> Add New Product
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* <Row className="justify-content-md-center">
                        <Col style={{ height: 400, width: '100%' }}>
                            {data?.length > 0 ?
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    pageSize={2}
                                /> :

                                <DataGrid
                                    rows={[]}
                                    columns={columns}
                                    pageSize={8}
                                />
                            }
                        </Col>
                    </Row> */}
          <Row className="mt-4">
            <div>
              <div>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
                  <Form.Control
                    placeholder="search product by id or name"
                    aria-label="Search-Product"
                    aria-describedby="basic-addon1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div style={{ height: 1000, overflowY: "auto" }}>
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product Id</th>
                      <th>Name</th>
                      <th>Image</th>
                      <th>Variants</th>
                      {/* <th>Description</th> */}
                      <th>Category</th>
                      <th>Sub Category</th>
                      {/* <th>Tags</th> */}
                      {/* <th>Status</th> */}
                      {/* <th>Type</th> */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterData.map((row, index) => (
                      <tr key={index}>
                        <td>{row?.id}</td>
                        {/* <td>{row?.productId}</td> */}
                        {/** TEMP */}
                        <td>
                          {row?.productId?.substring(0, 15)}
                          <span className="mx-2">
                            {copied && copiedindex == index ? (
                              <>
                                <BsClipboard2CheckFill
                                  size={20}
                                  color="green"
                                />
                                <br />{" "}
                                <span
                                  style={{ fontSize: "10px", color: "green" }}
                                >
                                  Copied
                                </span>
                              </>
                            ) : (
                              <>
                                <LuClipboardSignature
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    copyTextToClipboard(row?.productId, index)
                                  }
                                  size={18}
                                />
                              </>
                            )}
                          </span>
                        </td>
                        <td>{row?.name?.substring(0, 20) + "..."}</td>
                        <td>
                          <div className="productListItem">
                            <img
                              className="productListImg"
                              src={row.image?.[0]?.image_path}
                              alt=""
                            />
                          </div>
                        </td>
                        <td style={{ width: "150px" }}>
                          {row?.specId?.length}
                          <p
                            className="variCss"
                            onClick={() => showVariants(row?.specId)}
                          >
                            VIEW
                          </p>
                          {variationRequestCount(row?.specId) > 0 && (
                            <p className="newrqNo">
                              <AiOutlineInfoCircle size={22} />{" "}
                              {variationRequestCount(row?.specId)} Requested{" "}
                            </p>
                          )}
                        </td>
                        {/* <td>{row?.desc}</td> */}
                        <td>{row?.categoryId?.title}</td>
                        <td>{row?.subcategoryId?.title}</td>
                        {/* <td>
                                                    <div className="productListItem">
                                                        {row?.tags?.map((ele, i) => (
                                                            <p key={i}>{ele},</p>
                                                        ))}
                                                    </div>
                                                </td> */}
                        {/* <td>
                                                    <div className="productListItem">
                                                        {row?.status ? <span className="ActiveStatus">Active</span> : <span className="DeactiveStatus">Not Active</span>}
                                                    </div>
                                                </td> */}
                        {/* <td>{row?.type}</td> */}
                        <td style={{ width: "275px" }}>
                          <div className="buttonWrapper">
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => {
                                handleShowModal();
                                setSeledtedProductId(row);
                              }}
                            >
                              <FaCirclePlus /> Variants
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() =>
                                navigate(`/Admin/Editproduct/${row?._id}`)
                              }
                            >
                              Edit
                            </Button>
                            {row?.status ? (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleStatus(row)}
                              >
                                Deactive
                              </Button>
                            ) : (
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleStatus(row)}
                              >
                                Active
                              </Button>
                            )}
                            <Button variant="outline-danger" size="sm">
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Row>
          <Row>
            <ProductSpecificationForm
              selectedproductid={selectedproductid}
              showModal={showModal}
              handleCloseModal={handleCloseModal}
              getProductListFunc={getProductListFunc}
            />
          </Row>
          <Toaster position="top-right" />
        </Container>
        <Container>
          <Modal show={showModal2} size="md" onHide={handleCloseModal2}>
            <Modal.Body>
              <Row className="d-flex justify-content-md-center gap-4">
                {variantsArray?.length > 0 &&
                  variantsArray?.map((ele, index) => (
                    <Col
                      key={index}
                      className="d-flex justify-content-md-center"
                    >
                      <Card style={{ width: "10rem" }}>
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
                              ele?.spec_det?.map((ele, index) => (
                                <Col key={index} className="p-desc">
                                  {ele?.title} : {ele?.value}
                                </Col>
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
        </Container>
      </div>
    </>
  );
}

const ProductSpecificationForm = ({
  selectedproductid,
  showModal,
  handleCloseModal,
  getProductListFunc,
}) => {
  // console.log({ selectedproductid })

  const [specifications, setSpecifications] = useState([
    {
      title: "",
      value: "",
      //user_choice: false,
    },
  ]);

  const [productPrice, setproductPrice] = useState(0);

  const [isEdit, setIsEdit] = useState(false);

  const [productImges, setProductImages] = useState([]);

  const [selectedSpecId, setSelectedSpecId] = useState();

  const handleChange = (index, title, value) => {
    setSpecifications((prevSpecifications) => {
      const newSpecifications = [...prevSpecifications];
      newSpecifications[index] = { title, value };
      return newSpecifications;
    });
  };

  const { auth } = useAuth();

  const addSpecification = () => {
    setSpecifications((prevSpecifications) => [
      ...prevSpecifications,
      { title: "", value: "" }, // Set user_choice to a default value
    ]);
  };

  const removeSpecification = (index) => {
    setSpecifications((prevSpecifications) => {
      const newSpecifications = [...prevSpecifications];
      newSpecifications.splice(index, 1);
      return newSpecifications;
    });
  };

  const handleSubmit = async () => {
    console.log("Submitted Data:", specifications);
    let payload = {
      productId: selectedproductid?._id,
      spec_det: specifications,
      price: productPrice,
      image: productImges,
      skuId: generateRandomKey(),
      // user_choice:false,
    };

    payload["product_type"] = "products";

    payload["createdby"] = auth?.userId;

    payload["created_type"] = "admins";

    payload["is_approved"] = true;

    console.log(payload);

    let res = await ProductSpecificationCreate(payload);

    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      console.log({ payload });
      getProductListFunc();
      setSpecifications([
        {
          title: "",
          value: "",
          //user_choice: false,
        },
      ]);
      setproductPrice("");
      setProductImages([]);
      handleCloseModal(); // Close the modal after submitting
    }
  };

  const EdithandleSubmit = async () => {
    console.log("Submitted Data:", specifications);
    let payload = {
      productId: selectedproductid?._id,
      spec_det: specifications,
      price: productPrice,
      image: productImges,
      skuId: generateRandomKey(),
      // user_choice:false,
    };

    console.log(payload);

    let res = await UpdateProductSpecification(selectedSpecId, payload);

    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      console.log(res);
      getProductListFunc();
      setSpecifications([
        {
          title: "",
          value: "",
          //user_choice: false,
        },
      ]);
      setproductPrice("");
      setProductImages([]);
      handleCloseModal(); // Close the modal after submitting
    }
  };

  function generateRandomKey() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "";

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
    }

    return key;
  }

  const handleFileImageChange = async (event) => {
    const files = event.target.files;

    if (files.length > 0) {
      const selectedFiles = Array.from(files);
      console.log("Selected Files:", selectedFiles);
      selectedFiles.forEach((file, index) => {
        console.log(`File ${index + 1}:`, file);
      });

      for (const file of selectedFiles) {
        await onFileUpload(file);
      }
    }
  };

  const onFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await FileUpload(formData);
      console.log(res?.data?.data);

      setTimeout(() => {
        setProductImages((prevData) => [
          ...prevData,
          { image_path: res?.data?.data?.fileurl },
        ]);
      }, 3000);
    } catch (err) {
      console.error(err, "err");
    }
  };

  const deleteImage = (id) => {
    console.log("clc");
    let filterData = productImges?.filter((ele, i) => {
      return i != id;
    });
    console.log({ filterData });
    setProductImages(filterData);
  };

  const EditHandler = (id) => {
    setSelectedSpecId(id);
    setIsEdit(true);
    let filterSpecData = selectedproductid?.specId?.find((ele) => {
      return ele?._id == id;
    });
    setSpecifications(filterSpecData?.spec_det);
    setProductImages(filterSpecData?.image);
    setproductPrice(filterSpecData?.price);
    console.log(filterSpecData);
  };

  const deleteSpec = async (id) => {
    let res = await DeleteProductSpecification(id);
    console.log(res);
    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      toast.success("Spec delete successfully");
      handleCloseModal();
    }
  };

  const ApprovalVariant = async (data) => {
    data["is_approved"] = true;

    console.log(data);

    let res = await UpdateProductSpecification(data?._id, data);

    if (res?.data?.error) {
      toast.error("Something went wrong..");
    } else {
      console.log(res);
      getProductListFunc();
      setSpecifications([
        {
          title: "",
          value: "",
          //user_choice: false,
        },
      ]);
      setproductPrice("");
      setProductImages([]);
      handleCloseModal(); // Close the modal after submitting
    }
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Product Specification Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <ListGroup
                style={{ maxHeight: "200px", overflowY: "auto" }}
                className="p-2"
              >
                {selectedproductid?.specId?.map((ele, index) => (
                  <ListGroup.Item key={ele?._id}>
                    <Row>
                      <Col xs={3}>
                        <strong style={{ fontSize: "12px" }}>
                          Specification Details: {index + 1}
                        </strong>
                      </Col>
                      <Col>
                        {!ele?.is_approved && ele?.created_type != "admins" && (
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => ApprovalVariant(ele)}
                          >
                            Approved {ele?.skuId} variation
                          </Button>
                        )}
                      </Col>
                      <Col xs={2}>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => EditHandler(ele?._id)}
                        >
                          <CiEdit size={22} />
                        </Button>
                      </Col>
                      <Col xs={1}>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteSpec(ele?._id)}
                        >
                          <FaTrashAlt />
                        </Button>
                      </Col>
                    </Row>

                    <Row className="locationTagHeader mt-2">
                      <Col>Price</Col>
                      <Col>SKU ID</Col>
                      {ele?.spec_det?.map((e, index) => (
                        <Col key={index}>{e?.title}</Col>
                      ))}
                      <Col>Images</Col>
                    </Row>
                    <Row className="locationTagvalue">
                      <Col>{ele?.price}</Col>
                      <Col>{ele?.skuId}</Col>
                      {ele?.spec_det?.map((e, index) => (
                        <Col key={index}>{e?.value}</Col>
                      ))}
                      <Col size={2}>{ele?.image?.length}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
          <Row className="mt-2">
            {specifications.map((specification, index) => (
              <Row key={index}>
                <Col>
                  <Form.Group controlId={`key-${index}`}>
                    <Form.Label>Title :</Form.Label>
                    <Form.Control
                      type="text"
                      value={specification.title}
                      onChange={(e) =>
                        handleChange(index, e.target.value, specification.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId={`value-${index}`}>
                    <Form.Label>Option :</Form.Label>
                    <Form.Control
                      type="text"
                      value={specification.value}
                      onChange={(e) =>
                        handleChange(index, specification.title, e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col className="d-flex align-items-start">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeSpecification(index)}
                  >
                    <IoMdCloseCircle size={26} />
                  </Button>
                </Col>
              </Row>
            ))}
          </Row>
          <Row className="mt-2">
            <Col xs={3}>
              <Button variant="dark" size="sm" onClick={addSpecification}>
                <IoIosAdd /> Add Title
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Form.Group>
                <Form.Label>Product Price :</Form.Label>
                <Form.Control
                  type="tel"
                  value={productPrice}
                  placeholder="Enter Product Price"
                  onChange={(e) => setproductPrice(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Label>Choose Multiple Files</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={handleFileImageChange}
                  />
                </Form.Group>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                {productImges?.length > 0 &&
                  productImges?.map((ele, index) => (
                    <Col key={index} xs={2}>
                      <span>{index + 1}</span>
                      <span>
                        <MdCancel
                          style={{
                            color: "red",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => deleteImage(index)}
                        />
                      </span>
                      <Image src={ele?.image_path} thumbnail />
                    </Col>
                  ))}
              </Row>
            </Col>
          </Row>
          <Row className="mt-2">
            {/* <Col xs={3}>
                            <Button variant="dark" size="sm" onClick={addSpecification}>
                                <IoIosAdd /> Add Title
                            </Button>
                        </Col> */}
            <Col xs={2}>
              {isEdit ? (
                <Button variant="dark" size="sm" onClick={EdithandleSubmit}>
                  Update Form
                </Button>
              ) : (
                <Button variant="dark" size="sm" onClick={handleSubmit}>
                  Submit Form
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

// const FileUploadButton = ({ onFileSelect }) => {
//     const handleFileChange = (e) => {
//         const selectedFiles = Array.from(e.target.files);
//         onFileSelect(selectedFiles);
//     };

//     return (
//         <Form.Group controlId="formFileMultiple" className="mb-3">
//             <Form.Label>Choose Multiple Files</Form.Label>
//             <Form.Control type="file" multiple onChange={handleFileChange} />
//         </Form.Group>
//     );
// };
