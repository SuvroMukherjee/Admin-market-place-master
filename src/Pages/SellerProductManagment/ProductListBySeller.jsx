import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Carousel,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { FaBox, FaEye, FaRegUser, FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { MakePopularProduct, SellerProductList } from "../../API/api";
import { ratingCalculation } from "../../common/RatingAvg";
import toast, { Toaster } from "react-hot-toast";
// import { ChangeFormatDate2 } from "../../common/DateFormat";

export default function ProductListBySeller() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { id: sellerID } = useParams();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [data, setdata] = useState([]);
  const [reviewData, setReviewData] = useState([]);

  async function getAllOwnProducts() {
    setLoading(true);
    await SellerProductList(sellerID)
      .then((res) => {
        setdata(res?.data?.data?.SellerProductData);
        setReviewData(res?.data?.data?.reviewData);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  let filteredData = [];
  if (data && data.length > 0) {
    filteredData = data.filter((item) => {
      if (searchTerm === "") {
        return item;
      } else if (
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.sellerId?.user_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return item;
      }
    });
  }

  const HandleTopFunction = async (catData, value) => {
    let payload = {
      is_popular: value,
    };

    console.log(catData, "catData");

    await MakePopularProduct(payload, catData?._id)
      .then((res) => {
        console.log({ res });
        toast.success("product update successfully");
        getAllOwnProducts();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
        getAllOwnProducts();
      });
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
          <Row>
            <Col>
              <Link to={"/SellerReport"}>Back</Link>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3 className="text-center">Product List By Seller</h3>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="justify-content-md-center mt-4">
            <Col>
              <div className="">
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Search Using Product Name"
                    aria-label="search"
                    aria-describedby="basic-addon1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div className="table-max-height">
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <td style={{ width: "300px" }}>Product Name</td>
                      <td>Seller Details</td>
                      <td>Product Image</td>
                      <td>View Product In Zoofi</td>
                      <td>Review Data</td>
                      <td>Add as Popular Product</td>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row) => (
                      <tr key={row._id}>
                        <td style={{ width: "300px" }}>{row?.name}</td>
                        <td>
                          <Button
                            variant="primary"
                            onClick={() => handleSellerModalOpen(row?.sellerId)}
                            size="sm"
                          >
                            <FaRegUser />
                          </Button>
                        </td>
                        <td>
                          <img
                           className="productListImg"
                            src={row?.specId?.image?.[0].image_path}
                            alt=""
                            
                          />
                        </td>
                        <td>
                          <a
                            href={`https://zoofi.in/product-details/${row?._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="primary" size="sm">
                              <FaEye />
                            </Button>
                          </a>
                        </td>
                        <td>
                          <div>
                            <FaStar color="gold" size={15} />
                            {ratingCalculation(row?._id, reviewData)}
                          </div>
                        </td>
                        <td>
                          {row?.is_popular ? (
                            <Button
                              variant="outline-dark"
                              onClick={() => HandleTopFunction(row, false)}
                              size="sm"
                            >
                              Already Mark
                            </Button>
                          ) : (
                            <Button
                              variant="dark"
                              onClick={() => HandleTopFunction(row, true)}
                              size="sm"
                            >
                              Mark As Popular
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredData.length === 0 && (
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
        <Toaster position="top-right" />
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
                {product?.productId?.image?.map((image, index) => (
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
                      {product?.productId?.name}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col xs={4} style={{ fontSize: "14px", color: "black" }}>
                      description
                    </Col>
                    {product?.productId?.desc?.length < 25 ? (
                      <Col
                        style={{
                          fontSize: "14px",
                          color: "black",
                          fontWeight: "bold",
                        }}
                      >
                        {product?.productId?.desc}
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
                          ? product?.productId?.desc?.slice(0, 20) + "...."
                          : product?.productId?.desc}

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
                      {product?.productId?.categoryId?.title}
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
                      {product?.productId?.subcategoryId?.title}
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
                      {product?.productId?.brandId?.title}
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
