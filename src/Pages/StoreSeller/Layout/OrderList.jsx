import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { sellerStockoutlist } from "../../../API/api";
import {
  ChangeFormatDate,
  formatDateRemoveTime,
} from "../../../common/DateFormat";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const { userId } = JSON.parse(localStorage.getItem("auth"));

  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reportDate, setReportDate] = useState({
    start: "",
    end: "",
  });
  const [reportDateRange, setReportDateRange] = useState("Select Date Range");

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setReportDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateRangeChange = (e) => {
    setReportDateRange(e.target.value);
    if (e.target.value == "Today") {
      setReportDate({
        start: formatDateRemoveTime(new Date()),
        end: formatDateRemoveTime(new Date()),
      });
    } else if (e.target.value == "This Week") {
      // from last sunday to today
      let date = new Date();
      let day = date.getDay();
      let diff = date.getDate() - day + (day == 0 ? -6 : 1);
      let start = new Date(date.setDate(diff - 1));
      let end = new Date();
      setReportDate({
        start: formatDateRemoveTime(start),
        end: formatDateRemoveTime(end),
      });
    } else if (e.target.value == "Last Week") {
      // from last sunday to last saturday
      let date = new Date();
      let day = date.getDay();
      let diff = date.getDate() - day - 6;
      let start = new Date(date.setDate(diff - 1));
      let end = new Date(date.setDate(diff + 6 - 1));
      setReportDate({
        start: formatDateRemoveTime(start),
        end: formatDateRemoveTime(end),
      });
    } else if (e.target.value == "This Month") {
      // from 1st to today
      let date = new Date();
      let start = new Date(date.getFullYear(), date.getMonth(), 2);
      let end = new Date();
      setReportDate({
        start: formatDateRemoveTime(start),
        end: formatDateRemoveTime(end),
      });
    } else if (e.target.value == "Last Month") {
      // from 1st to last day of last month
      let date = new Date();
      let start = new Date(date.getFullYear(), date.getMonth() - 1, 2);
      let end = new Date(date.getFullYear(), date.getMonth(), 1);
      setReportDate({
        start: formatDateRemoveTime(start),
        end: formatDateRemoveTime(end),
      });
    } else if (e.target.value == "This Year") {
      // from 1st jan to today
      let date = new Date();
      let start = new Date(date.getFullYear(), 0, 2);
      let end = new Date();
      setReportDate({
        start: formatDateRemoveTime(start),
        end: formatDateRemoveTime(end),
      });
    } else if (e.target.value == "Last Year") {
      // from 1st jan to 31st dec
      let date = new Date();
      let start = new Date(date.getFullYear() - 1, 0, 2);
      let end = new Date(date.getFullYear() - 1, 11, 32);
      setReportDate({
        start: formatDateRemoveTime(start),
        end: formatDateRemoveTime(end),
      });
    } else {
      setReportDate({
        start: "",
        end: "",
      });
    }
  };

  const resetDate = () => {
    setReportDate({
      start: "",
      end: "",
    });
    setReportDateRange("Select Date Range");
  };

  useEffect(() => {
    getOrdersist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrdersist = async () => {
    try {
      setLoading(true);
      let res = await sellerStockoutlist(userId);
      console.log(res?.data?.data, "order");
      const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
        ...item,
        id: index + 1,
      }));

      setList(dataWithUniqueIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  console.log({ list });

  let filteredListByDate = [];
  if (list.length > 0) {
    if (
      reportDateRange === "Select Date Range" &&
      reportDate.start === "" &&
      reportDate.end === ""
    ) {
      filteredListByDate = list;
    } else {
      filteredListByDate = list.filter((item) => {
        const orderDate = new Date(item.createdAt);
        const startDate = new Date(reportDate.start);
        const endDate = new Date(reportDate.end);

        return orderDate >= startDate && orderDate <= endDate;
      });
    }
  }

  return (
    <div>
      <Container className="mt-4">
        <Row>
          <Col className="dtext">Closing Stock</Col>
        </Row>
        <Row className="cont" style={{ padding: "10px", marginTop: "10px" }}>
          {/* start date */}
          <Col xs={4}>
            <Form.Group controlId="date-to">
              <Form.Label className="customDatelable">Start Date:</Form.Label>
              <Form.Control
                type="date"
                className="tapG"
                name="start"
                value={reportDate?.start}
                onChange={(e) => handleDateChange(e)}
              />
            </Form.Group>
          </Col>
          {/* end date */}
          <Col xs={4}>
            <Form.Group controlId="date-form">
              <Form.Label className="customDatelable">End Date:</Form.Label>
              <Form.Control
                type="date"
                className="tapG"
                name="end"
                value={reportDate?.end}
                onChange={(e) => handleDateChange(e)}
              />
            </Form.Group>
          </Col>
          {/* select date range */}
          <Col xs={4}>
            <Form.Group controlId="date-range">
              <Form.Label className="customDatelable">
                Select Date Range:
              </Form.Label>
              <Form.Select
                value={reportDateRange}
                onChange={handleDateRangeChange}
              >
                <option disabled selected value={"Select Date Range"}>
                  Select Date Range
                </option>
                <option value={"Today"}>Today</option>
                <option value={"This Week"}>This Week</option>
                <option value={"Last Week"}>Last Week</option>
                <option value={"This Month"}>This Month</option>
                <option value={"Last Month"}>Last Month</option>
                <option value={"This Year"}>This Year</option>
                <option value={"Last Year"}>Last Year</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {/* btnS */}
          <Row>
            <Col className="mt-2">
              <div className="flex-justify-center-align-end custom-gap-10">
                <Button
                  variant="warning"
                  style={{
                    fontWeight: "bold",
                  }}
                  onClick={() => resetDate()}
                >
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </Row>

        {/* <Row
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            style={{
              width: "200px",
            }}
            onClick={() => navigate("/seller/manage-orders")}
          >
            Go to Manage Orders
          </Button>
        </Row> */}

        <Row className="mt-4">
          <Col
            style={{
              overflowY: "auto",
              maxHeight: "500px",
              border: "1px solid #ccc",
            }}
          >
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Product Image</th>
                  <th>SKU</th>
                  <th>Available Quantiy</th>
                  <th>Order Quantity</th>
                  <th>Price</th>
                  <th>Shipping Cost</th>
                  <th>Net Disbursement</th>
                  <th>Order Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  filteredListByDate.length > 0 &&
                  filteredListByDate.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.productId ? row.productId.name : ""}</td>
                      <td>
                        <Image
                          src={row.productId?.specId?.image?.[0]?.image_path}
                          thumbnail
                          width={40}
                          height={40}
                        />
                      </td>
                      <td>{row.productId?.specId?.skuId}</td>
                      <td className="avaible">
                        {row.productId?.available_qty}
                      </td>
                      <td className="amount">{row.quantity}</td>
                      <td className="amount">
                        {" "}
                        {row.productId?.price?.toLocaleString()}
                      </td>
                      <td className="amount">{row.productId?.shipping_cost}</td>
                      <td className="amount">
                        {row.productId?.comission_price?.toLocaleString()}
                      </td>
                      <td className="datecolor">
                        {ChangeFormatDate(row.createdAt)}
                      </td>
                    </tr>
                  ))}
                {!loading && filteredListByDate.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center">
                      No Data Found
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={10} className="text-center">
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderList;
