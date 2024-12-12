import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { FaPrint, FaRegMoneyBillAlt, FaTimes, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  PaymentUpdate,
  commandOnOrder,
  orderStatusUpdate,
  sellerOrderLists,
} from "../../../API/api";
import {
  ChangeFormatDate,
  formatDateRemoveTime,
} from "../../../common/DateFormat";
import { LoaderIcon } from "react-hot-toast";

const ManageOrders = () => {
  const { userId } = JSON.parse(localStorage.getItem("auth"));

  const [list, setList] = useState([]);
  const [selectIndex, setSelectIndex] = useState();
  const [showCommentIndex, setCommentIndx] = useState();
  const [showCommentBoxText, SetshowCommentBoxText] = useState("");
  const [loading, setLoading] = useState(true);
  const [processLoader, setProcessLoader] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getOrdersist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrdersist = async () => {
    try {
      setLoading(true);
      let res = await sellerOrderLists(userId);
      // console.log(res?.data?.data, "seller orders");
      const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
        ...item,
        id: index + 1,
      }));

      // console.log({ dataWithUniqueIds });

      setList(dataWithUniqueIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // console.log({ list });

  const handleStatusUpdate = async (OId, product, status) => {
    setProcessLoader(true);
    let payload = {
      proId: product,
      order_status: status,
    };

    let res = await orderStatusUpdate(payload, OId);

    console.log(res);
    getOrdersist();
    setProcessLoader(false);
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
        return "order_packed";
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
    setProcessLoader(true);
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
    setProcessLoader(false);
  };

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

  console.log(filteredListByDate, "filteredListByDate");

  const itemsPerPage = 10; // You can adjust this based on your preference
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListByDate?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredListByDate?.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setSelectIndex(null);
  };

  return (
    <div>
      <div
        className="py-4 px-5"
        style={{ backgroundColor: "#e5faca", minHeight: "100vh" }}
      >
        <Row
          className="cont"
          style={{
            padding: "10px",
            marginTop: "10px",
            backgroundColor: "#9de367",
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

        <Row className="mt-2">
          <Col>
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination size="md" className="justify-content-end mb-2">
                <Pagination.Prev
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
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
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            )}
            {/* table start */}
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Amount</th>
                  <th>Product</th>
                  <th>Order date & time</th>
                  <th>Order Status</th>
                  <th>Pincode</th>
                  <th>Address</th>
                  <th>Payment Status</th>
                  <th>Payment Type</th>
                  <th>Payment ID</th>
                  <th>Action</th>
                  <th>Return Requested</th>
                  <th>Refund Requested</th>
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  currentItems?.length > 0 &&
                  currentItems?.map((row, index) => (
                    <tr key={row.id}>
                      <td
                        className="orderId"
                        onClick={() => {
                          setSelectIndex(index);
                          handleShow();
                        }}
                      >
                        {row?.order_no}
                        {/* <MdArrowDropDownCircle size={20} />{" "} */}
                      </td>
                      <td className="orderPrice">
                        ₹ {row?.order_price?.toLocaleString()}
                      </td>
                      <td>
                        <div>
                          <img
                            src={
                              row?.order_details?.[0]?.proId?.specId?.image?.[0]
                                ?.image_path
                            }
                            alt=""
                            width="100"
                            height="100"
                          />
                        </div>
                        {row?.order_details?.[0]?.proId?.name}
                      </td>
                      <td>{ChangeFormatDate(row?.createdAt)}</td>
                      <td>
                        <span
                          style={{
                            color: "#7E60BF",
                            fontWeight: "bold",
                            fontSize: "10px",
                          }}
                        >
                          {OrderSequence(row?.order_details?.[0]?.order_status)}
                        </span>
                      </td>
                      <td>{row?.addressId?.pincode}</td>
                      <td>
                        {row?.addressId?.landmark},{row?.addressId?.city},
                        {row?.addressId?.state}
                      </td>
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
                        {selectIndex != index && (
                          <Button
                            variant="dark"
                            size="sm"
                            onClick={() => {
                              setSelectIndex(index);
                              handleShow();
                            }}
                            disabled={
                              row?.order_details?.[0]?.order_status == "cancel"
                            }
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
                        )}
                      </td>
                      <td>
                        {row?.order_details?.[0]?.returnReqId ? (
                          <Button
                            variant="dark"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/seller/seller-return-order-request-list`
                              )
                            }
                          >
                            View
                          </Button>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        {"refund_status" in row ? (
                          <Button
                            variant="dark"
                            size="sm"
                            onClick={() =>
                              navigate(`/seller/refund-orders-list`)
                            }
                          >
                            View
                          </Button>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                {!loading && currentItems?.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No Order Found
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={15} className="text-center fw-bold">
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Modal show={show} onHide={handleClose} centered size="xl">
          {/* <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header> */}
          <Modal.Body>
            {filteredListByDate[selectIndex]?.order_details?.length > 0 && (
              <Row className="mt-4">
                <Col className="mb-2">
                  <h5 className="dtextOredr">
                    Order Id:{" "}
                    <span style={{ color: "#FF9843", fontWeight: "bold" }}>
                      {filteredListByDate[selectIndex]?.order_no}
                    </span>
                  </h5>
                  {filteredListByDate[selectIndex]?.order_details?.every(
                    IsallOrderPackedFunc
                  ) && (
                    <Row
                      className="p-3 mt-3 rounded cdetailsbg"
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <Col xs={12}>
                        <h6>Customer Details</h6>
                      </Col>
                      <Col xs={12}>
                        <Row className="mt-3">
                          <Col className="orderId" xs={12} md={6}>
                            Order No:{" "}
                            {filteredListByDate[selectIndex]?.order_no} (
                            {
                              filteredListByDate[selectIndex]
                                ?.order_details?.[0]?.order_status
                            }
                            )
                          </Col>
                        </Row>
                        <div
                          style={{ background: "#343a40", color: "#fff" }}
                          className="d-flex justify-content-between align-items-center flex-wrap p-2"
                        >
                          <Col className="mt-3" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Name:
                            </Col>
                            <Col xs={12}>
                              {filteredListByDate[selectIndex]?.addressId?.name}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Phone:
                            </Col>
                            <Col xs={12}>
                              {
                                filteredListByDate[selectIndex]?.addressId
                                  ?.ph_no
                              }
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Alternate Phone:
                            </Col>
                            <Col xs={12}>
                              {filteredListByDate[selectIndex]?.addressId
                                ?.alterphone || "N/A"}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Pincode:
                            </Col>
                            <Col xs={12}>
                              {
                                filteredListByDate[selectIndex]?.addressId
                                  ?.pincode
                              }
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              City:
                            </Col>
                            <Col xs={12}>
                              {filteredListByDate[selectIndex]?.addressId?.city}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              State:
                            </Col>
                            <Col xs={12}>
                              {
                                filteredListByDate[selectIndex]?.addressId
                                  ?.state
                              }
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Locality:
                            </Col>
                            <Col xs={12}>
                              {filteredListByDate[selectIndex]?.addressId
                                ?.locality || "N/A"}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Landmark:
                            </Col>
                            <Col xs={12}>
                              {
                                filteredListByDate[selectIndex]?.addressId
                                  ?.landmark
                              }
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Address Type:
                            </Col>
                            <Col xs={12}>
                              {
                                filteredListByDate[selectIndex]?.addressId
                                  ?.address_type
                              }
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Order For:
                            </Col>
                            <Col xs={12}>
                              {
                                filteredListByDate[selectIndex]?.addressId
                                  ?.order_for
                              }
                            </Col>
                          </Col>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Col>
                <Col xs={12}>
                  <Table striped bordered hover responsive>
                    <thead
                      style={{ backgroundColor: "#343a40", color: "#fff" }}
                    >
                      <tr>
                        <th>Product Name</th>
                        <th>Image</th>
                        <th>Order Quantity</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Shipping Cost</th>
                        {/* <th>Estimated Date & Time</th> */}
                        <th>Manage Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredListByDate[selectIndex]?.order_details?.map(
                        (row, index) => (
                          <tr key={index}>
                            <td>{row?.proId?.name}</td>
                            <td>
                              <Image
                                src={row?.proId?.specId?.image?.[0]?.image_path}
                                thumbnail
                                width={100}
                                style={{ objectFit: "contain", height: "80px" }}
                              />
                            </td>
                            <td>{row?.qty}</td>
                            <td>{row?.proId?.specId?.skuId?.toUpperCase()}</td>
                            <td>₹{row?.price?.toLocaleString()}</td>
                            <td>
                              ₹{row?.total_shipping_price?.toLocaleString()}
                            </td>
                            {/* <td className="text-success">
                              {row?.order_status !== "delivered" && (
                                <>
                                  {OrderSequence(row?.order_status)} Estimation:{" "}
                                  {ChangeFormatDate(row?.estimited_delivery)}
                                </>
                              )}
                              {row?.order_status === "delivered" && (
                                <>
                                  Delivered:{" "}
                                  {ChangeFormatDate(row?.order_delivery)}
                                  <span className="text-secondary">
                                    {" "}
                                    (
                                    {calculateDateDifference(
                                      row?.order_delivery,
                                      filteredListByDate[selectIndex]?.createdAt
                                    )}{" "}
                                    days)
                                  </span>
                                </>
                              )}
                            </td> */}
                            <td
                              className="d-flex flex-column gap-2"
                              style={{ width: "200px" }}
                            >
                              <p
                                className="text-center"
                                style={{ color: "black" }}
                              >
                                {processLoader && <Spinner size={30} />}
                                {processLoader && <br />}
                                {processLoader && "Processing...."}
                              </p>

                              <Button
                                variant="success"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(
                                    filteredListByDate[selectIndex]?._id,
                                    row?.proId?._id,
                                    OrderSequenceStatus(row?.order_status)
                                  )
                                }
                                disabled={row?.order_status === "delivered"}
                              >
                                <FaTruck /> {OrderSequence(row?.order_status)}
                              </Button>
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() =>
                                  handleMakePayment(
                                    filteredListByDate[selectIndex]?._id,
                                    filteredListByDate[selectIndex]?.order_type
                                  )
                                }
                                disabled={
                                  filteredListByDate[selectIndex]
                                    ?.payment_status === "paid"
                                }
                              >
                                <FaRegMoneyBillAlt /> Payment Received
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(
                                    filteredListByDate[selectIndex]?._id,
                                    row?.proId?._id,
                                    "cancel"
                                  )
                                }
                              >
                                <FaTimes /> Cancel Order
                              </Button>
                              {/* <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => console.log("Refund clicked")}
                              >
                                Refund
                              </Button> */}
                              {/* <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => console.log("Print clicked")}
                              >
                                <FaPrint /> Print Tax Invoice
                              </Button> */}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ManageOrders;
