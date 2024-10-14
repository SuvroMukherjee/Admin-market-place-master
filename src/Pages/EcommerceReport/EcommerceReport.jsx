import moment from "moment/moment";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { CSVLink } from "react-csv";
import { Toaster } from "react-hot-toast";
import { FaBoxOpen } from "react-icons/fa";
import { LiaClipboardListSolid } from "react-icons/lia";
import { AllOrderListsByAdmin, allProductList, productWithPagination } from "../../API/api";

export default function EcommerceReport() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState("");
  const [sellerList, setSellerList] = useState([]);
  const [range, setRange] = useState("default");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredOrderCount, setFilteredOrderCount] = useState(0);

  let totalOrders = 0;
  let pendingList;
  let deliveredList;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          productWithPagination(1, 10),
          AllOrderListsByAdmin(),
        ]);
        console.log(productsResponse?.data?.pagination?.total)
        setProducts(productsResponse?.data?.pagination?.total);
        setOrders(ordersResponse?.data?.data);
        setData(ordersResponse?.data?.data);
        if (productsResponse?.data?.data && ordersResponse?.data?.data) {
          setLoading(false);
        }

        // Get all unique sellers
        const uniqueSellers = new Set();
        ordersResponse?.data?.data.forEach((order) => {
          order.order_details.forEach((detail) => {
            uniqueSellers.add(detail.sellerId.user_name);
          });
        });

        setSellerList(Array.from(uniqueSellers));
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  const OrderStatusSequence = (status) => {
    switch (status) {
      case "order_placed":
        return "Order Placed";
      case "order_packed":
        return "Packed";
      case "confirmed":
        return "Confirmed";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Order Delivered";
      case "cancel":
        return "Order Cancelled";
      case "returned":
        return "Order Returned";
      default:
        return "Unknown Status";
    }
  };

  if (orders?.length) {
    [...orders].forEach((item) => {
      totalOrders += item?.order_details?.length;
    });

    pendingList = [...orders]
      .map((item) => item?.order_details)
      .flat()
      .filter((item) => item?.order_status !== "delivered");

    deliveredList = [...orders]
      .map((item) => item?.order_details)
      .flat()
      .filter((item) => item?.order_status === "delivered");
  }

  let filteredList = useMemo(() => {
    return [...data];
  }, [data]);

  // filter by search
  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  //   if (searchTerm.length > 0) {
  //     const lowerCaseSearchTerm = searchTerm.toLowerCase();
  //     filteredList = [...filteredList].filter((order) =>
  //       order.order_details.some((detail) =>
  //         detail.proId.name.toLowerCase().includes(lowerCaseSearchTerm)
  //       )
  //     );
  //     return filteredList;
  //   }
  //   else{
  //     filteredList = [...data];
  //   }
  // };

  //filter by seller
  if (selectedSeller) {
    filteredList = [...filteredList]
      .map((order) => {
        const filteredOrderDetails = order.order_details.filter(
          (detail) => detail.sellerId.user_name === selectedSeller
        );
        return {
          ...order,
          order_details: filteredOrderDetails,
        };
      })
      .filter((order) => order.order_details.length > 0);
  }

  // filter by date range
  if (fromDate && toDate) {
    filteredList = [...filteredList]?.filter((order) => {
      const itemDate = moment(order.createdAt).format("YYYY-MM-DD");
      const from = moment(fromDate).format("YYYY-MM-DD");
      const to = moment(toDate).format("YYYY-MM-DD");

      return (
        moment(itemDate).isSameOrAfter(from) &&
        moment(itemDate).isSameOrBefore(to)
      );
    });
  }

  //csv data export
  const csvData = [...filteredList].flatMap((order) => {
    return order.order_details.map((detail) => {
      return {
        "Seller Name": detail.sellerId?.user_name || "N/A",
        "Order Date and Time": order.createdAt
          ? moment(order.createdAt).format("DD-MM-YYYY, hh:mm:ss A")
          : "N/A",
        "Shop Name": detail.sellerId?.Shop_Details_Info?.shope_name || "N/A",
        "Product Name": detail.proId?.name || "N/A",
        "SKU-Id": detail?.proId?.specId?.skuId || "N/A",
        "Order Status": detail?.order_status || "N/A",
        "Payment Status": detail?.is_payment ? "Paid" : "Incomplete",
        "Order Address": order.addressId
          ? `${order.addressId.locality || "N/A"}, ${
              order.addressId.city || "N/A"
            }, ${order.addressId.state || "N/A"}, ${
              order.addressId.pincode || "N/A"
            }`
          : "N/A",
        "Payment type": order?.order_type || "N/A",
        "Payment Id": order?.paymentId || "N/A",
      };
    });
  });

  const parseOrderData = (data) => {
    console.log(data,'data');
    return data.map((order) => ({
      // orderId: order._id,
      orderDate: moment(order.createdAt).format("DD-MM-YYYY, hh:mm:ss A") || "N/A",
      orderNo: order.order_no || "N/A",
      orderDetails: order.order_details.map((detail) => ({
        // productId: detail.proId?._id || "N/A",
        productName: detail.proId?.name || "N/A",
        skuId: detail.proId?.specId?.skuId || "N/A",
        sellerName: detail.sellerId?.user_name || "N/A",
        shopName: detail.sellerId?.Shop_Details_Info?.shope_name || "N/A",
        shopAddress: detail.sellerId?.Shop_Details_Info?.state || "N/A",
        productImage: detail.proId?.specId?.image?.[0]?.image_path || "",
        orderStatus: OrderStatusSequence(detail?.order_status || "N/A"),
        isPayment: detail?.is_payment || "N/A",
      })),
      orderAddress: order.addressId
        ? `${order.addressId.locality}, ${order.addressId.city}, ${order.addressId.state}, ${order.addressId.pincode}`
        : "N/A",
      paymentType: order.order_type,
      paymentId: order.paymentId || "N/A",
    }));
  };

  // const csvData = parseOrderData([...filteredList]);

  const OrderTable = ({ data }) => {
    const parsedData = parseOrderData(data);


    console.log(parsedData,'parsedData')

    return (
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Shop Name</th>
            <th>Seller Name</th>
            <th>Product Image</th>
            <th>Product Name</th>
            <th>SKU Id</th>
            <th>Order Id</th>
            <th>Order Status</th>
            <th>Order Location</th>
            <th>Order Date & Time</th>
            <th>Payment Status</th>
            <th>Payment Type</th>
            <th>Payment Id</th>
          </tr>
        </thead>
        <tbody>
          {parsedData.length > 0 ? (
            parsedData.map((order, idx) =>
              order.orderDetails.map((detail, index) => (
                <tr key={`${idx}-${index}`}>
                  <td>
                    {detail.shopName} {`(${detail.shopAddress})`} {console.log()}
                  </td>
                  <td>{detail.sellerName}</td>
                  <td>
                    <div className="productListItem">
                      <img
                        className="productListImg"
                        src={detail.productImage}
                        alt="Product"
                        style={{ width: "100px", height: "100px" }}
                      />
                    </div>
                  </td>
                  <td>{detail.productName}</td>
                  <td>{detail.skuId}</td>
                  <td>{order?.orderNo}</td>
                  <td
                    className={`text-${
                      detail.orderStatus == "Order Delivered" ? "success" : ""
                    }`}
                  >
                    {detail.orderStatus}
                  </td>
                  <td>{order.orderAddress}</td>
                  <td>{order.orderDate}</td>
                  <td
                    className={`text-${
                      detail.isPayment ? "success" : "danger"
                    }`}
                  >
                    {detail.isPayment ? "Paid" : "Incomplete"}
                  </td>
                  <td>{order.paymentType}</td>
                  <td>{order.paymentId}</td>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: "center",
                  fontSize: "1.4vw",
                  fontWeight: "bold",
                }}
              >
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  const resetHandler = () => {
    setSearchTerm("");
    setSelectedSeller("");
    setFromDate("");
    setToDate("");
    setRange("default");
  };

  useEffect(() => {
    let fromDate = "";
    let toDate = "";

    if (range === "default") {
      (fromDate = ""), (toDate = "");
    } else if (range === "today") {
      fromDate = moment().format("YYYY-MM-DD");
      toDate = moment().format("YYYY-MM-DD");
    } else if (range === "yesterday") {
      fromDate = moment().subtract(1, "days").format("YYYY-MM-DD");
      toDate = moment().subtract(1, "days").format("YYYY-MM-DD");
    } else if (range === "this_month") {
      fromDate = moment().startOf("month").format("YYYY-MM-DD");
      toDate = moment().format("YYYY-MM-DD");
    } else if (range === "last_month") {
      fromDate = moment()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD");
      toDate = moment()
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD");
    } else if (range === "this_year") {
      fromDate = moment().startOf("year").format("YYYY-MM-DD");
      toDate = moment().format("YYYY-MM-DD");
    } else if (range === "last_year") {
      fromDate = moment()
        .subtract(1, "years")
        .startOf("year")
        .format("YYYY-MM-DD");
      toDate = moment().subtract(1, "years").endOf("year").format("YYYY-MM-DD");
    }

    setFromDate(fromDate);
    setToDate(toDate);
  }, [range]);

  useEffect(() => {
    let count = 0;
    filteredList.forEach((order) => {
      count += order.order_details.length;
    });
    setFilteredOrderCount(count);
  }, [filteredList]);

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
          <Row
            style={{
              margin: "10px 0px 10px 0px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Col>
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>Total Products</Card.Title>
                  <Card.Text className="featuredMoney">
                    <FaBoxOpen /> <span>{products}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>Total Orders</Card.Title>
                  <Card.Text className="featuredMoney">
                    <LiaClipboardListSolid /> <span>{totalOrders}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {!loading && (
              <>
                <Col>
                  <Card style={{ width: "18rem" }}>
                    <Card.Body>
                      <Card.Title>Total Sold Products</Card.Title>
                      <Card.Text className="featuredMoney">
                        <LiaClipboardListSolid />{" "}
                        <span>{deliveredList?.length}</span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card style={{ width: "18rem" }}>
                    <Card.Body>
                      <Card.Title>Pending Orders</Card.Title>
                      <Card.Text className="featuredMoney">
                        <LiaClipboardListSolid />{" "}
                        <span>{pendingList?.length}</span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            )}
          </Row>
        </Container>
        <Container>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <h4>Ecommerce Report</h4>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="p-4 mt-4 mx-2 cont">
            <Row className="justify-content-md-center mt-4">
              {/* <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-sm">
                  Search
                </InputGroup.Text>
                <Form.Control
                  value={searchTerm}
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Search By Product Name"
                  onChange={handleSearch}
                />
              </InputGroup> */}
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-sm">
                  Select by Seller
                </InputGroup.Text>
                <Form.Select
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={(e) => setSelectedSeller(e.target.value)}
                  value={selectedSeller}
                >
                  <option value="">All Sellers</option>
                  {sellerList.map((seller, index) => (
                    <option key={index} value={seller}>
                      {seller}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Row>
            <Row className="justify-content-md-center mt-2">
              <Col xs={4}>
                <Form.Group controlId="date-to">
                  <Form.Label className="customDatelable">
                    Start Date:
                  </Form.Label>
                  <Form.Control
                    type="date"
                    className="tapG"
                    name="start"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group controlId="date-form">
                  <Form.Label className="customDatelable">End Date:</Form.Label>
                  <Form.Control
                    type="date"
                    className="tapG"
                    name="end"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col xs={4}>
                <Form.Group controlId="date-range">
                  <Form.Label className="customDatelable">
                    Select Date Range:
                  </Form.Label>
                  <Form.Select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                  >
                    <option value={"default"}>Select Date Range</option>
                    <option value={"today"}>Today</option>
                    <option value={"yesterday"}>Yesterday</option>
                    <option value={"this_month"}>This Month</option>
                    <option value={"last_month"}>Last Month</option>
                    <option value={"this_year"}>This Year</option>
                    <option value={"last_year"}>Last Year</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-md-center mt-4 gap-4">
              <Button
                style={{
                  width: "100px",
                }}
                onClick={() => {
                  resetHandler();
                }}
              >
                Reset
              </Button>
              <CSVLink
                style={{
                  width: "100px",
                  backgroundColor: "#28a745",
                  outline: "none",
                  border: "none",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
                data={csvData}
                filename={`order-report.csv`}
              >
                Download
              </CSVLink>
            </Row>
            <Row className="justify-content-md-center mt-4 gap-4">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <h5>
                  Count :{" "}
                  <span style={{ color: "blue" }}>{filteredOrderCount}</span>
                </h5>
              </div>
            </Row>
          </Row>
          <Row>
            <Col>
              <input type="text" placeholder="Search"  />
            </Col>
          </Row>
          <Row className="justify-content-md-center mt-4">
            <Col
              style={{
                overflowY: "scroll",
                maxHeight: "600px",
                border: "1px solid #ccc",
              }}
            >
              <OrderTable data={filteredList} />
            </Col>
          </Row>
        </Container>
        <Toaster position="top-right" />
      </div>
    </>
  );
}
