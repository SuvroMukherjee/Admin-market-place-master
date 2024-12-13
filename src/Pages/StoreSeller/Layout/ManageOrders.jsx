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
import ReactPaginate from "react-paginate";
import { useDebounce } from "../../../hooks/useDebounce";
import axios from "axios";
const baseURL = import.meta.env.VITE_API_BASE; // Replace with your actual base URL

const ManageOrders = () => {
  const { userId } = JSON.parse(localStorage.getItem("auth"));
  const [filteredData, setFilteredData] = useState([]);
  const [selectIndex, setSelectIndex] = useState();
  const [loading, setLoading] = useState(true);
  const [processLoader, setProcessLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reportDate, setReportDate] = useState({
    start: "",
    end: "",
  });
  const [reportDateRange, setReportDateRange] = useState("Select Date Range");
  const [filters, setFilters] = useState({
    search: "",
    order_status: "",
    payment_status: "",
    fromDate: "",
    toDate: "",
    sellerId: userId,
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const {
        search,
        order_status,
        payment_status,
        fromDate,
        toDate,
        sellerId,
      } = filters;
      const res = await axios.get(`${baseURL}/order/order-list-paginated`, {
        params: {
          page: currentPage,
          limit: 20,
          search,
          order_status,
          payment_status,
          fromDate,
          toDate,
          sellerId,
        },
      });
      const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      // setFormData(dataWithUniqueIds);
      // setList(dataWithUniqueIds);
      setFilteredData(dataWithUniqueIds);
      setCurrentPage(res.data?.pagination?.currentPage);
      setTotalPages(res.data?.pagination?.totalPages);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchData = useDebounce(fetchData, 500);

  useEffect(() => {
    debouncedFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleStatusUpdate = async (OId, product, status) => {
    setProcessLoader(true);
    let payload = {
      proId: product,
      order_status: status,
    };

    let res = await orderStatusUpdate(payload, OId);

    console.log(res);
    fetchData();
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
        return "Order Placed";
      case "confirmed":
        return "Order Confirmed";
      case "order_packed":
        return "Order Packed";
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

  const OrderSequenceStatus = (status) => {
    switch (status) {
      case "order_placed":
        return "order_packed";
      case "confirmed":
        return "order_packed";
      case "order_packed":
        return "shipped";
      case "shipped":
        return "delivered";
      case "cancel":
        return "cancel";
      default:
        return "Unknown Status";
    }
  };
  const buttonActionStatus = (status) => {
    switch (status) {
      case "order_placed":
        return "Order Packed";
      case "confirmed":
        return "Order Packed";
      case "order_packed":
        return "Shipped";
      case "shipped":
        return "Order Delivered";
      case "delivered":
        return "Order Delivered";
      case "cancel":
        return "Order Cancelled";
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

  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setReportDateRange(value);
    let start = "";
    let end = "";

    if (value === "Today") {
      start = formatDateRemoveTime(new Date());
      end = formatDateRemoveTime(new Date());
    } else if (value === "This Week") {
      const date = new Date();
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      start = formatDateRemoveTime(new Date(date.setDate(diff - 1)));
      end = formatDateRemoveTime(new Date());
    } else if (value === "Last Week") {
      const date = new Date();
      const day = date.getDay();
      const diff = date.getDate() - day - 6;
      start = formatDateRemoveTime(new Date(date.setDate(diff - 1)));
      end = formatDateRemoveTime(new Date(date.setDate(diff + 6 - 1)));
    } else if (value === "This Month") {
      const date = new Date();
      start = formatDateRemoveTime(
        new Date(date.getFullYear(), date.getMonth(), 2)
      );
      end = formatDateRemoveTime(new Date());
    } else if (value === "Last Month") {
      const date = new Date();
      start = formatDateRemoveTime(
        new Date(date.getFullYear(), date.getMonth() - 1, 2)
      );
      end = formatDateRemoveTime(
        new Date(date.getFullYear(), date.getMonth(), 1)
      );
    } else if (value === "This Year") {
      const date = new Date();
      start = formatDateRemoveTime(new Date(date.getFullYear(), 0, 2));
      end = formatDateRemoveTime(new Date());
    } else if (value === "Last Year") {
      const date = new Date();
      start = formatDateRemoveTime(new Date(date.getFullYear() - 1, 0, 2));
      end = formatDateRemoveTime(new Date(date.getFullYear() - 1, 11, 32));
    }

    // Update reportDate state
    setReportDate({ start, end });

    // Update filters directly using calculated start and end
    setFilters((prev) => ({
      ...prev,
      fromDate: start,
      toDate: end,
    }));
  };

  const resetAllFilters = () => {
    setCurrentPage(1);
    setFilters({
      search: "",
      payment_status: "",
      order_status: "",
      fromDate: "",
      toDate: "",
      sellerId: userId,
    });
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
    fetchData();
    setProcessLoader(false);
  };

  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    // Your page change logic here, for example:
    console.log(`Navigating to page ${newPage}`);
    setCurrentPage(newPage);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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
          {/* Search By Order Id or  Payment Id*/}
          <Col xs={3}>
            <Form.Group controlId="search" className="flex-grow-1">
              <Form.Label className="fw-bold">
                Search by Order Id or Payment Id
              </Form.Label>
              <Form.Control
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                size="sm"
                placeholder="Search by OrderId or PaymentId"
              />
            </Form.Group>
          </Col>
          {/* Order Status */}
          <Col xs={3}>
            <Form.Group controlId="order_status" className="flex-grow-1">
              <Form.Label className="fw-bold">
                Filter by Order Status
              </Form.Label>
              <Form.Select
                name="order_status"
                value={filters.order_status}
                onChange={handleFilterChange}
                size="sm"
              >
                <option value="">Select Order Status</option>
                <option value="order_placed">Order Placed</option>
                <option value="confirmed">Confirmed</option>
                <option value="order_packed">Order Packed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancel">Cancelled</option>
                <option value="returned">Returned</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {/* Payment Status */}
          <Col xs={3}>
            <Form.Group controlId="payment_status" className="flex-grow-1">
              <Form.Label className="fw-bold">
                Filter by Payment Status
              </Form.Label>
              <Form.Select
                name="payment_status"
                value={filters.payment_status}
                onChange={handleFilterChange}
                size="sm"
              >
                <option value="">Select Payment Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partially Paid</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {/* select date range */}
          <Col xs={3}>
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
          {/* buttons */}
          <Row>
            <Col className="mt-2">
              <div className="flex-justify-center-align-end custom-gap-10">
                <Button
                  variant="dark"
                  size="sm"
                  style={{
                    fontWeight: "bold",
                  }}
                  onClick={() => resetAllFilters()}
                >
                  Reset & Refresh
                </Button>
                <Button variant="secondary" size="sm">
                  {filteredData?.length} Filtered Products
                </Button>
              </div>
            </Col>
          </Row>
        </Row>

        <Row className="mt-2">
          <Col>
            {/* Pagination */}
            <div className="d-flex justify-content-end mt-2 mb-4">
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                onPageChange={handlePageChange}
                containerClassName="pagination"
                activeClassName="active"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                previousClassName="page-item"
                nextClassName="page-item"
                previousLinkClassName="page-link"
                nextLinkClassName="page-link"
              />
            </div>
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
                  filteredData?.length > 0 &&
                  filteredData?.map((row, index) => (
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
                              row?.order_details?.[0]?.order_status === "cancel"
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
                {!loading && filteredData?.length === 0 && (
                  <tr>
                    <td colSpan={15} className="text-center fw-bold">
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
            {filteredData[selectIndex]?.order_details?.length > 0 && (
              <Row className="mt-4">
                <Col className="mb-2">
                  <h5 className="dtextOredr">
                    Order Id:{" "}
                    <span style={{ color: "#FF9843", fontWeight: "bold" }}>
                      {filteredData[selectIndex]?.order_no}
                    </span>
                  </h5>
                  {filteredData[selectIndex]?.order_details?.every(
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
                            Order No: {filteredData[selectIndex]?.order_no} (
                            {
                              filteredData[selectIndex]?.order_details?.[0]
                                ?.order_status
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
                              {filteredData[selectIndex]?.addressId?.name}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Phone:
                            </Col>
                            <Col xs={12}>
                              {filteredData[selectIndex]?.addressId?.ph_no}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Alternate Phone:
                            </Col>
                            <Col xs={12}>
                              {filteredData[selectIndex]?.addressId
                                ?.alterphone || "N/A"}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Pincode:
                            </Col>
                            <Col xs={12}>
                              {filteredData[selectIndex]?.addressId?.pincode}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              City:
                            </Col>
                            <Col xs={12}>
                              {filteredData[selectIndex]?.addressId?.city}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              State:
                            </Col>
                            <Col xs={12}>
                              {filteredData[selectIndex]?.addressId?.state}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Locality:
                            </Col>
                            <Col xs={12}>
                              {filteredData[selectIndex]?.addressId?.locality ||
                                "N/A"}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Landmark:
                            </Col>
                            <Col xs={12}>
                              {filteredData[selectIndex]?.addressId?.landmark}
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Address Type:
                            </Col>
                            <Col xs={12}>
                              {
                                filteredData[selectIndex]?.addressId
                                  ?.address_type
                              }
                            </Col>
                          </Col>
                          <Col className="mt-1" xs={3}>
                            <Col xs={12} className="fw-bold">
                              Order For:
                            </Col>
                            <Col xs={12}>
                              {filteredData[selectIndex]?.addressId?.order_for}
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
                      {filteredData[selectIndex]?.order_details?.map(
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
                                    filteredData[selectIndex]?._id,
                                    row?.proId?._id,
                                    OrderSequenceStatus(row?.order_status)
                                  )
                                }
                                disabled={
                                  row?.order_status === "delivered" ||
                                  row?.order_status === "cancel" ||
                                  row?.order_status === "returned"
                                }
                              >
                                <FaTruck />{" "}
                                {buttonActionStatus(row?.order_status)}
                              </Button>
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() =>
                                  handleMakePayment(
                                    filteredData[selectIndex]?._id,
                                    filteredData[selectIndex]?.order_type
                                  )
                                }
                                disabled={
                                  filteredData[selectIndex]?.payment_status ===
                                  "paid"
                                }
                              >
                                <FaRegMoneyBillAlt /> Payment Received
                              </Button>
                              {row?.order_status !== "cancel" &&
                                row?.order_status !== "delivered" &&
                                row?.order_status !== "returned" && (
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                      handleStatusUpdate(
                                        filteredData[selectIndex]?._id,
                                        row?.proId?._id,
                                        "cancel"
                                      )
                                    }
                                  >
                                    <FaTimes /> Cancel Order
                                  </Button>
                                )}
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
