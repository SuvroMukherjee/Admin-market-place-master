import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  ListGroup,
  Modal,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { IoIosInformationCircle } from "react-icons/io";
import { MdArrowDropDownCircle } from "react-icons/md";
import {
  PaymentUpdate,
  commandOnOrder,
  orderStatusUpdate,
  razorpayPaymentDetailsData,
  sellerOrderLists,
} from "../../API/api";
import {
  ChangeFormatDate,
  formatDateRemoveTime,
} from "../../common/DateFormat";
import { toast } from "react-toastify";
import { ArrowRightAlt } from "@mui/icons-material";

const AllTransaction = () => {
  const { userId } = JSON.parse(localStorage.getItem("auth"));
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [selectIndex, setSelectIndex] = useState();
  const [showCommentIndex, setCommentIndx] = useState();
  const [showCommentBoxText, SetshowCommentBoxText] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentDetailLoading, setPaymentDetailLoading] = useState(false);
  const [paymentDetailData, setPaymentDetailData] = useState({});

  useEffect(() => {
    getOrdersist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrdersist = async () => {
    try {
      setLoading(true);
      let res = await sellerOrderLists(userId);

      const dataWithUniqueIds = res?.data?.data
        ?.filter((item) => item?.payment_status == "paid")
        .map((item, index) => ({
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

  // console.log({ list });

  const handleStatusUpdate = async (OId, product, status) => {
    let payload = {
      proId: product,
      order_status: status,
    };

    let res = await orderStatusUpdate(payload, OId);

    console.log(res);
    getOrdersist();
  };

  const IsallOrderPackedFunc = (data) => {
    // console.log(data?.order_status, "o");
    // console.log(
    //   data.order_status != "order_placed" && data?.order_status != "cancel",
    //   "ll"
    // );
    return (
      data.order_status != "order_placed" && data?.order_status != "cancel"
    );
  };

  //   const itemsPerPage = 5; // You can adjust this based on your preference
  //   const [currentPage, setCurrentPage] = useState(1);

  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //   const currentItems = list?.slice(indexOfFirstItem, indexOfLastItem);

  //   const totalPages = Math.ceil(list?.length / itemsPerPage);

  //   const handlePageChange = (pageNumber) => {
  //     setCurrentPage(pageNumber);
  //   };

  const OrderSequence = (status) => {
    //"order_placed"
    switch (status) {
      case "order_placed":
        return "Pack Your Order";
      case "order_packed":
        return "Shipping Order";
      case "shipped":
        return "Deliver Order";
      case "delivered":
        return "Order Delivered";
      case "cancel":
        return "Order Cancel";
      default:
        return "Unknown Status";
    }
  };

  const OrderSequenceStatus = (status) => {
    switch (status) {
      case "order_placed":
        return "order packed";
      case "order_packed":
        return "shipped";
      case "shipped":
        return "delivered";
      case "delivered":
        return "Order Delivered";
      case "cancel":
        return "Order Cancel";
      default:
        return "Unknown Status";
    }
  };

  function calculateDateDifference(startDateString, endDateString) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    const timeDifference = Math.abs(endDate - startDate);
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference >= 1) {
      return `${daysDifference} day${daysDifference > 1 ? "s" : ""}`;
    } else {
      const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
      return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""}`;
    }
  }

  const showCommentBox = (index) => {
    setCommentIndx(index);
  };

  const handleCommand = async (orderId, proId) => {
    // console.log({ orderId });
    let payload = {
      proId: proId,
      comment: showCommentBoxText,
    };

    let res = await commandOnOrder(orderId, payload);

    console.log(res, "res");

    getOrdersist();
  };

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

  function generateCODId() {
    const prefix = "COD_";
    const maxLength = 15;
    const randomPartLength = maxLength - prefix.length;

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomPart = "";

    for (let i = 0; i < randomPartLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomPart += characters[randomIndex];
    }

    return prefix + randomPart;
  }

  const handleMakePayment = async (orderId, orderType) => {
    let payload = {
      is_payment: true,
      payment_status: "paid",
    };

    if (orderType === "COD") {
      let codPaymentId = generateCODId();
      payload.paymentId = codPaymentId;
    }

    try {
      let res = await PaymentUpdate(orderId, payload);
      if (!res?.data?.error) {
        toast.success("Payment Done Successfully");
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      // console.error("Error making payment:", error);
      toast.error("An error occurred while processing the payment.");
    }
    getOrdersist();
  };

  let filteredListByDate = [...list];
  if (filteredListByDate.length > 0) {
    if (
      reportDateRange === "Select Date Range" &&
      reportDate.start === "" &&
      reportDate.end === ""
    ) {
      filteredListByDate = [...filteredListByDate];
    } else {
      filteredListByDate = [...filteredListByDate].filter((item) => {
        const orderDate = new Date(item.createdAt);
        const startDate = new Date(reportDate.start);
        const endDate = new Date(reportDate.end);

        return orderDate >= startDate && orderDate <= endDate;
      });
    }
  }

  console.log(filteredListByDate, "filteredListByDate");

  const getPaymentDetails = async (paymentId) => {
    setPaymentDetailLoading(true);
    setShow(true);
    try {
      let res = await razorpayPaymentDetailsData(paymentId);
      setPaymentDetailData(res?.data);
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    } finally {
      setPaymentDetailLoading(false);
    }
  };

  const handleClose = () => setShow(false);

  return (
    <div
      className="py-3 px-5"
      style={{ backgroundColor: "#e5faca", minHeight: "100vh" }}
    >
      <div>
        <Row
          className="cont"
          style={{
            padding: "10px",
            marginTop: "10px",
            backgroundColor: "#9af064",
          }}
        >
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
                  variant="dark"
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

        <Row className="mt-4">
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Amount</th>
                  <th>Order Status</th>
                  <th>Order date & time</th>
                  <th>Pincode</th>
                  <th>Address</th>
                  <th>Payment Status</th>
                  <th>Payment Type</th>
                  <th>Payment ID</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  filteredListByDate?.length > 0 &&
                  filteredListByDate.map((row, index) => (
                    <tr key={row.id}>
                      <td
                        className="orderId"
                        onClick={() => setSelectIndex(index)}
                      >
                        {row?.order_no}
                        {/* <MdArrowDropDownCircle size={20} />{" "} */}
                      </td>
                      <td>
                        <span style={{ color: "#7EACB5", fontWeight: "bold" }}>
                          {" "}
                          {OrderSequenceStatus(
                            row?.order_details?.[0]?.order_status
                          )?.toLocaleUpperCase()}
                        </span>
                      </td>
                      <td className="orderPrice">
                        ₹ {row?.order_price?.toLocaleString()}
                      </td>
                      <td>{ChangeFormatDate(row?.createdAt)}</td>
                      {/* <td>
                        <span style={{ color: "#021526" }}>
                          {" "}
                          {row?.order_details?.[0]?.order_status}
                        </span>
                      </td> */}
                      <td>{row?.addressId?.pincode}</td>
                      <td>{row?.addressId?.address}</td>
                      <td>
                        {row?.payment_status == "unpaid"
                          ? "Incomplete"
                          : "Paid"}
                      </td>
                      <td>{row?.order_type}</td>
                      <td>
                        {row?.payment_status == "paid" ? row?.paymentId : "N/A"}
                      </td>
                      <td>
                        {/* {selectIndex != index && (
                          <Button
                            variant="dark"
                            size="sm"
                            onClick={() => setSelectIndex(index)}
                          >
                            {} Manage
                          </Button>
                        )}
                        {selectIndex == index && (
                          <Button
                            variant="dark"
                            size="sm"
                            onClick={() => setSelectIndex(null)}
                          >
                            {} Close
                          </Button>
                        )} */}
                        {row?.order_type == "Online" ? (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => getPaymentDetails(row?.paymentId)}
                          >
                            View
                          </Button>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                {!loading && filteredListByDate?.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No Order Found
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={8} className="text-center font-weight-bold">
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            {/* <Pagination size="sm">
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination> */}
          </Col>
        </Row>

        {filteredListByDate[selectIndex]?.order_details?.length > 0 && (
          <Row className="mt-4">
            <Col className="mb-2 dtextOredr">
              Order Id :{" "}
              <span style={{ color: "#FF9843" }}>
                {filteredListByDate[selectIndex]?.order_no}
              </span>{" "}
              {filteredListByDate[selectIndex]?.order_details?.every(
                IsallOrderPackedFunc
              ) && (
                <Row className="p-2 mt-2 cdetailsbg ">
                  <Col className="dtext" xs={3}>
                    <Row>
                      <Col>Customer Details</Col>
                    </Row>
                    <Row className="mt-3">
                      <Col className="orderId">
                        {" "}
                        {filteredListByDate[selectIndex]?.order_no} (
                        {
                          filteredListByDate[selectIndex]?.order_details?.[0]
                            ?.order_status
                        }
                        )
                      </Col>
                    </Row>
                  </Col>
                  <Col>
                    <Row>
                      <Col className="dtext" xs={3}>
                        Name
                      </Col>
                      <Col className="dtext">Phone</Col>
                      <Col className="dtext">City</Col>
                      <Col className="dtext" xs={3}>
                        Locality
                      </Col>
                      <Col className="dtext">Shipping Place</Col>
                    </Row>
                    <Row>
                      <Col className="cdetails" xs={3}>
                        {filteredListByDate[selectIndex]?.addressId?.name}
                      </Col>
                      <Col className="cdetails">
                        {filteredListByDate[selectIndex]?.addressId?.ph_no}
                      </Col>
                      <Col className="cdetails">
                        {filteredListByDate[selectIndex]?.addressId?.city}
                      </Col>
                      <Col xs={3} className="cdetails">
                        {filteredListByDate[selectIndex]?.addressId?.locality}
                      </Col>
                      <Col className="cdetails">
                        {
                          filteredListByDate[selectIndex]?.addressId
                            ?.address_type
                        }
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
            </Col>
            <Col xs={12}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Image</th>
                    <th>Order Quantity</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Shipping Cost</th>
                    <th>Estimated Date & Time</th>
                    <th>Manage Order</th>
                  </tr>
                </thead>
                {/* {console.log(filteredListByDate[selectIndex], "index")} */}
                <tbody>
                  {filteredListByDate[selectIndex]?.order_details?.length > 0 &&
                    filteredListByDate[selectIndex]?.order_details?.map(
                      (row, index) => (
                        <Fragment key={index}>
                          <tr>
                            <td>
                              {row?.proId?.name} {console.log(row)}
                            </td>
                            <td>
                              <Image
                                src={row?.proId?.specId?.image?.[0]?.image_path}
                                thumbnail
                                width={100}
                                style={{
                                  objectFit: "contain",
                                  height: "120px",
                                }}
                              />
                            </td>
                            <td>{row?.qty}</td>
                            <td>{row?.proId?.specId?.skuId?.toUpperCase()}</td>

                            <td>₹{row?.price?.toLocaleString()}</td>
                            <td>{row?.total_shipping_price}</td>

                            <td className="estTime">
                              <p style={{ color: "green" }}>
                                {row?.order_status != "delivered" &&
                                  ` ${OrderSequence(
                                    row?.order_status
                                  )} Estimation`}{" "}
                                <br />
                                {row?.order_status != "delivered" &&
                                  ChangeFormatDate(row?.estimited_delivery)}
                              </p>
                              {row?.order_delivery &&
                                row?.order_status == "delivered" && (
                                  <span>
                                    Delivered :{" "}
                                    {ChangeFormatDate(row?.order_delivery)}
                                  </span>
                                )}
                              {row?.order_delivery &&
                              row?.order_status == "delivered" ? (
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    color: "black",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {" "}
                                  (Delivered In{" "}
                                  <span style={{ color: "#2874f0" }}>
                                    {calculateDateDifference(
                                      row?.order_delivery,
                                      filteredListByDate[selectIndex]?.createdAt
                                    )}
                                  </span>{" "}
                                  )
                                </span>
                              ) : (
                                ""
                              )}

                              <div
                                onClick={() => showCommentBox(row?._id)}
                                style={{ cursor: "pointer" }}
                              >
                                <IoIosInformationCircle
                                  size={20}
                                  color="black"
                                />{" "}
                                <span
                                  className="mx-2"
                                  style={{ color: "black" }}
                                >
                                  Add your Reason
                                </span>
                              </div>
                              {showCommentIndex == row?._id && (
                                <>
                                  <div className="mt-2">
                                    <Form.Group
                                      className="mb-3"
                                      controlId="exampleForm.ControlTextarea1"
                                    >
                                      <Form.Control
                                        size="sm"
                                        placeholder="Enter your comment.."
                                        onChange={(e) =>
                                          SetshowCommentBoxText(e.target.value)
                                        }
                                        as="textarea"
                                        rows={3}
                                      />
                                    </Form.Group>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleCommand(
                                        filteredListByDate[selectIndex]?._id,
                                        row?.proId?._id
                                      )
                                    }
                                    className="savebtn"
                                  >
                                    save
                                  </button>
                                </>
                              )}
                              {row?.comment}
                            </td>

                            <td className="d-flex flex-column gap-2">
                              <Button
                                variant="success"
                                size="sm"
                                className="orderpadding"
                                onClick={() =>
                                  handleStatusUpdate(
                                    filteredListByDate[selectIndex]?._id,
                                    row?.proId?._id,
                                    OrderSequenceStatus(row?.order_status)
                                  )
                                }
                                disabled={
                                  row?.order_status == "delivered"
                                    ? true
                                    : false
                                }
                              >
                                {OrderSequence(row?.order_status)}
                              </Button>

                              <Button
                                variant="warning"
                                size="sm"
                                className={`orderpadding ${
                                  row?.order_status !== "delivered"
                                    ? "d-none"
                                    : ""
                                }`}
                                disabled={
                                  filteredListByDate[selectIndex]
                                    ?.payment_status == "paid"
                                    ? true
                                    : false
                                }
                                onClick={() =>
                                  handleMakePayment(
                                    filteredListByDate[selectIndex]?._id,
                                    filteredListByDate[selectIndex]?.order_type
                                    // row?.is_payment,
                                    // "cancel"
                                  )
                                }
                              >
                                Payment Received
                              </Button>

                              <Button
                                variant="danger"
                                size="sm"
                                className="orderpadding"
                                onClick={() =>
                                  handleStatusUpdate(
                                    filteredListByDate[selectIndex]?._id,
                                    row?.proId?._id,
                                    "cancel"
                                  )
                                }
                              >
                                Order Cancel
                              </Button>

                              <Button
                                variant="outline-secondary"
                                size="sm"
                                className="orderpadding"
                              >
                                Order Refund
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                className="orderpadding"
                              >
                                Print Tax Invoice
                              </Button>
                            </td>
                          </tr>
                        </Fragment>
                      )
                    )}
                </tbody>
              </Table>
            </Col>
          </Row>
        )}
      </div>

      <div>
        <Modal
          show={show}
          onHide={handleClose}
          size="lg"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <p className="cmpgin-title">
              Payment Details for{" "}
              <span className="text-danger">#{paymentDetailData?.id}</span>
            </p>
          </Modal.Header>
          <Modal.Body style={{ height: "50vh", overflow: "scroll" }}>
            <PaymentDetails
              paymentData={paymentDetailData}
              loading={paymentDetailLoading}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

const PaymentDetails = ({ paymentData, loading }) => {
  // Mapping keys to display-friendly labels
  const fieldLabels = {
    id: "Payment ID",
    entity: "Entity",
    amount: "Amount",
    currency: "Currency",
    status: "Status",
    order_id: "Order ID",
    invoice_id: "Invoice ID",
    international: "International",
    method: "Payment Method",
    amount_refunded: "Amount Refunded",
    refund_status: "Refund Status", // Custom label for refund_status
    captured: "Captured",
    description: "Description",
    card_id: "Card ID",
    bank: "Bank",
    wallet: "Wallet",
    vpa: "VPA",
    email: "Email",
    contact: "Contact",
    notes: "Notes",
    fee: "Fee",
    tax: "Tax",
    error_code: "Error Code",
    error_description: "Error Description",
    error_source: "Error Source",
    error_step: "Error Step",
    error_reason: "Error Reason",
    acquirer_data: "Acquirer Data",
    created_at: "Created At",
    "acquirer_data.rrn": "RRN",
    "acquirer_data.upi_transaction_id": "UPI Transaction ID",
    "upi.vpa": "UPI VPA",
    "acquirer_data.bank_transaction_id": "Bank Transaction ID",
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <div className="d-flex justify-content-center mt-5">
            <Row>
              <Col>
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Col>
            </Row>
          </div>
        )}
        {!loading &&
          Object.keys(paymentData).map((key, index) => {
            // Handle nested objects like 'acquirer_data' and 'upi'
            if (
              typeof paymentData[key] === "object" &&
              paymentData[key] !== null
            ) {
              return Object.keys(paymentData[key]).map(
                (nestedKey, nestedIndex) => (
                  <tr key={`${index}-${nestedIndex}`}>
                    <td>
                      {fieldLabels[`${key}.${nestedKey}`] ||
                        `${key}.${nestedKey}`}
                    </td>
                    <td>
                      {paymentData[key][nestedKey] !== null
                        ? paymentData[key][nestedKey].toString()
                        : "N/A"}
                    </td>
                  </tr>
                )
              );
            } else {
              return (
                <tr key={index}>
                  <td>{fieldLabels[key] || key}</td>
                  <td>
                    {paymentData[key] !== null
                      ? paymentData[key].toString()
                      : "N/A"}
                  </td>
                </tr>
              );
            }
          })}
      </tbody>
    </Table>
  );
};

export default AllTransaction;
