import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Carousel,
  Col,
  Container,
  ListGroup,
  Row,
  // Table,
  Modal,
} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { Toaster, toast } from "react-hot-toast";
import { FaBox, FaEye, FaRegUser } from "react-icons/fa";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import {
  AdminSellerProductLists,
  AdminSellerProductStatus,
} from "../../API/api";
// import { ChangeFormatDate2 } from "../../common/DateFormat";

export default function SellerProductManagment() {
  const [loading, setLoading] = useState(true);
  const [sellerOwnData, setSellerOwnData] = useState([]);

  // seller data
  const [sellerDetails, setSellerDetails] = useState();
  // product data
  const [productDetails, setProductDetails] = useState();

  // modal stats
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);

  // product and seller modal open close handlers
  const handleProductModalOpen = (data) => {
    setProductDetails(data);
    setShowProductModal(true);
  };
  const handleProductModalClose = () => {
    setShowProductModal(false);
  };

  const handleSellerModalOpen = (data) => {
    setSellerDetails(data);
    setShowSellerModal(true);
  };
  const handleSellerModalClose = () => {
    setShowSellerModal(false);
  };

  useEffect(() => {
    setTimeout(() => {
      getAllOwnProducts();
    }, 5000);
  }, []);

  async function getAllOwnProducts() {
    setLoading(true);
    await AdminSellerProductLists()
      .then((res) => {
        // console.log(res?.data?.data, 'own data');
        const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setSellerOwnData(dataWithUniqueIds);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // const ShowDetails = (data) => {
  //     console.log(data)
  //     setSellerDetails(data)
  // }

  // const ShowProductDetails = (data) => {
  //     console.log(data)
  //     setProductDetails(data)
  // }

  const productStatusUpdate = async (data) => {
    let payload = {};

    if (data?.is_approved == "approved") {
      payload = {
        is_approved: "pending",
      };
    } else {
      payload = {
        is_approved: "approved",
      };
    }

    await AdminSellerProductStatus(data?._id, payload)
      .then((res) => {
        // console.log(res?.data?.data)
        getAllOwnProducts();
        toast.success("Seller Product updated successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong!");
      });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    // { field: "productId", headerName: "Product Id", width: 150 },
    {
      field: "seller",
      headerName: "Seller",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">{params?.row?.sellerId?.email}</div>
        );
      },
    },
    { field: "name", headerName: "Product Name", width: 150 },
    {
      field: "seller deatils",
      headerName: "Seller Details",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <div className="buttonWrapper">
              <Button
                variant="dark"
                onClick={() => handleSellerModalOpen(params?.row?.sellerId)}
                size="sm"
              >
                <FaEye /> View
              </Button>
            </div>
          </>
        );
      },
    },
    {
      field: "image",
      headerName: "Product Image",
      width: 150,
      renderCell: (params) => {
        return (
          <div
            className="productListItem"
            // onClick={() => console.log(params?.row, 'roeDara')}
          >
            <img
              className="productListImg"
              src={params?.row?.image?.[0]?.image_path}
              alt=""
            />
            {params?.row?.image?.length > 1 && (
              <span>{params?.row?.image?.length - 1}+</span>
            )}
          </div>
        );
      },
    },
    {
      field: "seller product",
      headerName: "Product Details",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <div className="buttonWrapper">
              <Button
                variant="dark"
                onClick={() => handleProductModalOpen(params?.row)}
                size="sm"
              >
                <FaEye /> View
              </Button>
            </div>
          </>
        );
      },
    },
    // { field: "regular_price", headerName: "Price", width: 150},
    // { field: "desc", headerName: "Description", width: 150 },
    {
      field: "category",
      headerName: "Category",
      width: 200,
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
      field: "approved",
      headerName: "Is Approved",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            {params?.row?.is_approved == "pending" ? (
              <span className="DeactiveStatus">Pending</span>
            ) : (
              <span className="ActiveStatus">Approved</span>
            )}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        return (
          <>
            <div className="buttonWrapper">
              {params?.row?.is_approved == "pending" ? (
                <Button
                  variant="outline-success"
                  onClick={() => productStatusUpdate(params?.row)}
                  size="sm"
                >
                  <IoCheckmarkDoneSharp /> Approve
                </Button>
              ) : (
                <Button
                  variant="outline-danger"
                  onClick={() => productStatusUpdate(params?.row)}
                  size="sm"
                >
                  <IoCheckmarkDoneSharp /> Reject
                </Button>
              )}
            </div>
          </>
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
          <Row className="justify-content-md-center">
            <Col md="auto">
              <h3>Seller Product List</h3>
            </Col>
          </Row>
          <div className="mt-4">
            <Row className="justify-content-md-center mt-4">
              <Col>
                <DataGrid
                  rows={sellerOwnData}
                  columns={columns}
                  pageSize={8}
                  noRowsOverlay={
                    sellerOwnData?.length === 0 && (
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        No Data Found
                      </div>
                    )
                  }
                />
              </Col>
            </Row>
          </div>
          <Toaster position="top-right" />
        </Container>

        {/* modals */}
        <Container>
          {/* product modal */}
          <Modal
            show={showProductModal}
            size="md"
            onHide={handleProductModalClose}
          >
            <Modal.Body>
              <div>
                {productDetails && <ProductCard product={productDetails} />}
              </div>
            </Modal.Body>
          </Modal>
          {/* seller modal  */}
          <Modal
            show={showSellerModal}
            size="md"
            onHide={handleSellerModalClose}
          >
            <Modal.Body>
              <div>{sellerDetails && <UserCard user={sellerDetails} />}</div>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </>
  );
}

// user card here used to show seller details modal
const UserCard = ({ user }) => {
  // console.log("Inside User card");
  // console.log({ user })

  function isJSONString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  if (isJSONString(user?.address)) {
    var addressData = JSON.parse(user?.address);

    // Constructing the address string
    var addressString =
      addressData?.city +
      ", " +
      addressData?.province +
      ", " +
      addressData?.state +
      ", " +
      addressData?.postal_code +
      ", " +
      addressData?.country_code;
  } else {
    addressData = user?.address;
  }

  return (
    <>
      <Card style={{ width: "100%" }}>
        <Card.Header>
          <FaRegUser /> Seller Details
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Shop Name: </strong>
            {user?.shope_name}
            <br />
            <strong>Username: </strong>
            {user?.user_name}
            <br />
            <strong>Stuff ID: </strong>
            {user?.staffId}
            <br />
            <strong>Phone: </strong>
            {user?.phone_no}
            <br />
            <strong>Email: </strong>
            {user?.email}
            <br />
            <strong>Address: </strong>
            {addressString}
            <br />
            <strong>Pin Code: </strong>
            {user?.pin_code}
            <br />
            <strong>GST No: </strong>
            {user?.gst_no}
            <br />
            <strong>Pickup Location: </strong>
            {user?.picup_location}
            <br />
            <strong>Commission Rate: </strong>
            {user?.commission_data?.[0]?.commission_rate}%
            <br />
            <strong>Average Rating : </strong> {user?.review || 0}
            <br />
            <strong>Status: </strong>
            {user?.status}
            <br />
            <strong>Total No of Unit: </strong>
            {user?.total_no_of_unit}
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

//  product card here used to show product details modal
const ProductCard = ({ product }) => {
  const [showDes, setShowDesc] = useState(false);

  return (
    <>
      <Card style={{ width: "100%" }}>
        <Card.Header className="text-center fw-bold">
          <FaBox /> Product Details
        </Card.Header>
        <Card.Body>
          <Row>
            <Col xs={4} className="d-flex align-items-center">
              <Carousel>
                {product?.image?.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={image?.image_path}
                      alt={`Shop Image ${index + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
            <Col>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  <Row>
                    <Col xs={5} style={{ fontSize: "14px", color: "black" }}>
                      Product Name
                    </Col>
                    <Col
                      style={{
                        fontSize: "14px",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {product?.name}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col xs={4} style={{ fontSize: "14px", color: "black" }}>
                      description
                    </Col>
                    {product?.desc?.length < 25 ? (
                      <Col
                        style={{
                          fontSize: "14px",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {product?.desc}
                      </Col>
                    ) : (
                      <Col
                        style={{
                          fontSize: "14px",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {!showDes
                          ? product?.desc?.slice(0, 20) + "...."
                          : product?.desc}

                        <span
                          style={{
                            cursor: "pointer",
                            color: "blue",
                            fontSize: "10px",
                          }}
                          onClick={() => setShowDesc(!showDes)}
                        >
                          {!showDes ? "read more.." : "read less.."}
                        </span>
                      </Col>
                    )}
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col xs={4} style={{ fontSize: "14px", color: "black" }}>
                      Category
                    </Col>
                    <Col
                      style={{
                        fontSize: "14px",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {product?.categoryId?.title}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col xs={4} style={{ fontSize: "14px", color: "black" }}>
                      Sub Category
                    </Col>
                    <Col
                      style={{
                        fontSize: "14px",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {product?.subcategoryId?.title}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col xs={4} style={{ fontSize: "14px", color: "black" }}>
                      Brand
                    </Col>
                    <Col
                      style={{
                        fontSize: "14px",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {product?.brandId?.title}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col xs={4}>Approve</Col>
                    <Col>
                      {product?.is_approved == "pending" ? (
                        <span className="DeactiveStatus">Pending</span>
                      ) : (
                        <span className="ActiveStatus">Approved</span>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};
