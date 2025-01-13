import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Image,
  Row,
  Spinner,
  Button,
} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  ReportLists,
  SellerProductList,
  listBySellerPaginated,
  sellerDetails,
} from "../../../API/api";
import { ratingCalculation } from "../../../common/RatingAvg";
import { StarRating } from "../../../Layouts/StarRating";

const NewSellerDashboard = () => {
  const [data, setdata] = useState();
  const [reviewData, setReviewData] = useState();
  const [avgCustomerRating, setAvgCustomerRating] = useState(0);
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { userId } = JSON.parse(localStorage.getItem("auth"));

  const SellingProducts = async () => {
    await listBySellerPaginated(userId, {
      page: 1,
      limit: 10,
      sales_start: true,
    })
      .then((res) => {
        setdata(res?.data?.data?.SellerProductData?.filter((ele) => ele?.status === true));
        setReviewData(res?.data?.data?.reviewData);
        getProfileDetails();
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {});
  };

  const getProfileDetails = async () => {
    let res = await sellerDetails(userId);

    let totalRating = (res?.data?.sellerReviewData || []).reduce(
      (acc, curr) => {
        return acc + parseInt(curr?.rating || 0);
      },
      0
    );

    setAvgCustomerRating(
      totalRating / res?.data?.sellerReviewData?.length || 0
    );
  };

  const getSellerReport = async () => {
    try {
      setLoading(true);
      const res = await ReportLists();
      if (res.status === 200) {
        setReportData(res?.data);
      } else {
        console.error(res);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const NumberBox = ({ number, label }) => {
    return (
      <Card style={{ width: "12rem" }} className="shadowbox">
        <Card.Body>
          <p className="dtext">{label?.toUpperCase()}</p>
          {/* {label != "Customer Feedback" && (
            <h6 className="dtextNumber">{number}</h6>
          )} */}
          {label == "Customer Feedback" &&
            (number != 0 ? (
              <StarRating value={number} />
            ) : (
              <>
                <FaRegStar color="#FF9843" />
                <FaRegStar color="#FF9843" />
                <FaRegStar color="#FF9843" />
                <FaRegStar color="#FF9843" />
                <FaRegStar color="#FF9843" />
              </>
            ))}
          {label == "Total Sales" && <p className="dtextNumber">₹ {number}</p>}
          {label == "Total Profit" && <p className="dtextNumber">₹ {number}</p>}
          {label == "Total Orders" && <p className="dtextNumber">{number}</p>}
          {label == "Selling Products" && (
            <p className="dtextNumber">{number}</p>
          )}
        </Card.Body>
      </Card>
    );
  };

  useEffect(() => {
    SellingProducts();
    getSellerReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="px-5 py-4"
      style={{ backgroundColor: "#e5faca", minHeight: "100vh" }}
    >
      <Row>
        <Col>
          <div>
            {data?.length > 0 && (
              <Row>
                <Col className="dtext2">
                  Top Selling Products{" "}
                  <span>
                    <FaArrowUpRightDots color="red" size={24} />
                  </span>
                </Col>
              </Row>
            )}
            <hr />
            {loading && (
              <div className="d-flex justify-content-center flex-wrap gap-4 mt-5">
                <Spinner animation="border" />
              </div>
            )}
            {!loading && data?.length == 0 ? (
              <Row className="stratAdd">
                <Col xs={2}>
                  <img
                    src="https://5.imimg.com/data5/SELLER/Default/2023/1/MH/CQ/PR/3553409/corrugated-paper-electronics-packaging-box-500x500.jpg"
                    width={200}
                  />
                </Col>
                <Col xs={4}>
                  Start Adding Products <br />
                  <span onClick={() => navigate("/seller/seller-addproduct")}>
                    GO
                  </span>
                </Col>
              </Row>
            ) : (
              <Row className="mt-2">
                <Col>
                  <SellingProductList data={data} reviewData={reviewData} />
                </Col>
              </Row>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

const SellingProductList = ({ data, reviewData }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Table striped bordered hover className="shadowbox">
        {data?.length > 0 && (
          <thead>
            <tr>
              <th>Image</th>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Selling Price</th>
              <th>In Stock</th>
              <th>Total Sales</th>
              <th>Rating</th>
              <th>Visit On Zoofi</th>
            </tr>
          </thead>
        )}
        <tbody>
          {data?.length > 0 &&
            data?.slice(0, 20)?.map((ele, index) => (
              <tr key={index}>
                <td>
                  {/* <Image
                    src={ele?.specId?.image?.[0]?.image_path}
                    thumbnail
                    width={60}
                    height={60}
                  /> */}
                  <img src={ele?.specId?.image?.[0]?.image_path} width={60} />
                </td>
                <td
                  className="pname"
                  onClick={() =>
                    navigate(`/seller/seller-productList?name=${ele?.name}`)
                  }
                >
                  {ele?.specId?.skuId?.toUpperCase()}
                </td>
                <td
                  className="pname"
                  onClick={() =>
                    navigate(`/seller/seller-productList?name=${ele?.name}`)
                  }
                >
                  <div className="d-flex align-items-center justify-content-start gap-4">
                    {ele?.name?.slice(0, 30)}
                  </div>
                </td>
                <td>
                  {ele?.productId?.categoryId?.image[0] && (
                    <img
                      src={ele?.productId?.categoryId?.image[0]?.image_path}
                      width={40}
                    />
                  )}
                </td>
                <td>
                  {ele?.productId?.brandId?.image[0] && (
                    <img
                      src={ele?.productId?.subcategoryId?.image[0]?.image_path}
                      width={40}
                    />
                  )}
                </td>
                <td>{ele?.price?.toLocaleString()}</td>
                <td className="avaible">{ele?.available_qty || 0}</td>
                <td>{ele?.salesCount}</td>
                <td>
                  <div className="ratingDiv">
                    <FaStar color="gold" size={15} />
                    {ratingCalculation(ele?._id, reviewData)?.toFixed(2)}
                  </div>
                </td>
                <td>
                  <a
                    href={`https://zoofi.in/product-details/${ele?._id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline-primary" size="sm">
                      Visit
                    </Button>
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default NewSellerDashboard;
