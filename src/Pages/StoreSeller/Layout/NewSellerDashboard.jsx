import { useEffect, useState } from "react";
import { Card, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FaArrowUpRightDots } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  ReportLists,
  SellerProductList,
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
    await SellerProductList(userId)
      .then((res) => {
        setdata(res?.data?.data?.SellerProductData);
        setReviewData(res?.data?.data?.reviewData);
        getProfileDetails();
        setLoading(false)
        // CalculateAvgRating(res?.data?.data?.SellerProductData, res?.data?.data?.reviewData)
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

    setAvgCustomerRating(totalRating / res?.data?.sellerReviewData?.length || 0);
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
      className="pt-4"
      style={{
        background: "#f5f1f1",
      }}
    >
      <Container>
        <Row>
          {!loading && Object.keys(reportData) !== 0 && (
            <div className="d-flex justify-content-center flex-wrap gap-4">
              <NumberBox
                label={"Total Orders"}
                number={reportData?.totalOrder}
              />
              <NumberBox
                label={"Selling Products"}
                number={reportData?.totalDeliver}
              />
              <NumberBox
                label={"Total Sales"}
                number={reportData?.totalsell?.toFixed(2)}
              />
              {/* return order to be implemented */}
              {/* <NumberBox label={"Returned Orders"} number={0} /> */}
              <NumberBox
                label={"Customer Feedback"}
                number={avgCustomerRating}
              />
              <NumberBox
                label={"Total Profit"}
                number={reportData?.totalProfit?.toFixed(2)}
              />
            </div>
          )}
          {loading && (
            <div className="d-flex justify-content-center flex-wrap gap-4">
              <Spinner animation="border" />
            </div>
          )}
          {!loading && Object.keys(reportData) === 0 && (
            <div className="d-flex justify-content-center flex-wrap gap-4">
              <p>Error Fetching Data</p>
            </div>
          )}
        </Row>
      </Container>
      <Container className="mt-4">
        <Row>
          <Col className="p-2">
            <Container>
              {data?.length > 0 && 
              <Row className="mt-4">
                <Col className="dtext2">
                  Top Selling Products{" "}
                  <span>
                    <FaArrowUpRightDots color="red" size={24} />
                  </span>
                </Col>
              </Row>}
              <hr />
              { loading && (
                <div className="d-flex justify-content-center flex-wrap gap-4 mt-5">
                <Spinner animation="border" />
              </div>
              )}
              {(!loading && data?.length == 0) ? 
               <Row className="stratAdd">
               <Col xs={2}>
                 <img src="https://5.imimg.com/data5/SELLER/Default/2023/1/MH/CQ/PR/3553409/corrugated-paper-electronics-packaging-box-500x500.jpg" width={200} />
               </Col>
             <Col xs={4}>
               Start Adding Products <br/>
                 <span onClick={() => navigate('/seller/seller-addproduct')}>GO</span>
             </Col>
           </Row>
              : 
          <Row className="mt-2">
          <Col>
       <SellingProductList data={data} reviewData={reviewData} />
        </Col>
       </Row>
            }
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// const OrderConatiner = ({ list }) => {
//   const navigate = useNavigate();
//   return (
//     <>
//       <Table striped bordered hover responsive className="shadowbox2">
//         <thead>
//           <tr>
//             <th>Product Name</th>
//             <th className="pname">Product Image</th>
//             <th className="pname">SKU</th>
//             <th>Order Quantity</th>
//             <th>Price</th>
//             <th>Order Date & Time</th>
//           </tr>
//         </thead>
//         <tbody>
//           {list.map((row) => (
//             <tr key={row.id}>
//               <td
//                 className="pname"
//                 onClick={() => navigate(`/seller/product-deatils/${row?._id}`)}
//               >
//                 {row.productId ? row.productId.name : ""}
//               </td>
//               <td>
//                 <Image
//                   src={row.productId?.specId?.image?.[0]?.image_path}
//                   thumbnail
//                   width={40}
//                   height={40}
//                 />
//               </td>
//               <td
//                 className="pname"
//                 onClick={() => navigate(`/seller/product-deatils/${row?._id}`)}
//               >
//                 {row.productId?.specId?.skuId?.toUpperCase()}
//               </td>
//               <td className="avaible">{row.quantity}</td>
//               <td className="avaible">
//                 {" "}
//                 {row.productId?.price?.toLocaleString()}
//               </td>
//               <td className="datecolor">{ChangeFormatDate(row.createdAt)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </>
//   );
// };

const SellingProductList = ({ data, reviewData }) => {
  const navigate = useNavigate();
  return (
    <div>
      <Table striped bordered hover className="shadowbox">
       { data?.length > 0 && <thead>
          <tr>
            <th>Image</th>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Selling Price</th>
            <th>In Stock</th>
            <th>Rating</th>
            {/* <th>Visit On Site</th> */}
          </tr>
        </thead>}
        <tbody>
          {data?.length > 0 &&
            data?.slice(0, 20)?.map(
              (ele, index) =>
                // Add a condition to check if the rating is greater than 2
                ratingCalculation(ele?._id, reviewData) > 2 && (
                  <tr key={index}>
                    <td>
                      <Image
                        src={ele?.specId?.image?.[0]?.image_path}
                        thumbnail
                        width={60}
                        height={60}
                      />
                    </td>
                    <td
                      className="pname"
                      onClick={() =>
                        navigate(`/seller/product-deatils/${ele?._id}`)
                      }
                    >
                      {ele?.specId?.skuId?.toUpperCase()}
                    </td>
                    <td
                      className="pname"
                      onClick={() =>
                        navigate(`/seller/product-deatils/${ele?._id}`)
                      }
                    >
                      {ele?.name}
                    </td>
                    <td>{ele?.price?.toLocaleString()}</td>
                    <td className="avaible">{ele?.available_qty || 0}</td>
                    <td>
                      <div className="ratingDiv">
                        <FaStar color="gold" size={15} />
                        {ratingCalculation(ele?._id, reviewData)}
                      </div>
                    </td>
                  </tr>
                )
            )}
        </tbody>
      </Table>
    </div>
  );
};

export default NewSellerDashboard;
