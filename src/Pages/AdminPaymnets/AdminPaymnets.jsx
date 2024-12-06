import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { AdminSellerLists, createPayment } from "../../API/api";
import { AmountWithGst } from "./AmountWithGst";

const apiUrl = import.meta.env.VITE_API_BASE;

const AdminPaymnets = () => {
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedSeller, setSelectedSeller] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [show, setShow] = useState(false);

  const [allSellers, setAllSellers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  async function getAllSellersList() {
    await AdminSellerLists()
      .then((res) => {
        const filteredDataAsApproved = res?.data?.data?.filter(
          (item) => item?.status === "approved"
        );

        setAllSellers(filteredDataAsApproved);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedSeller, startDate, endDate]);

  useEffect(() => {
    getAllSellersList();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/ledger/paginated-list?page=${currentPage}&limit=10&sellerId=${selectedSeller}&fromDate=${startDate}&toDate=${endDate}`
      );
      console.log(res?.data?.data, "kkkk");
      setFilterData(res?.data?.data);
      setTotalPages(res?.data?.pagination?.totalPages);
      setTotalRecords(res?.data?.pagination?.totalRecords);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [formData, setFormData] = useState({
    amount: "",
    remarks: "",
    paymentReceipt: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Log the payload to the console
    console.log("Payload:", formData);

    let payload = {
      sellerId: selectedSeller,
      adminAmount: formData?.amount,
      remark: formData?.remarks,
    };

    let res = await createPayment(payload);

    if (res?.data?.error) {
      toast.error(res?.data?.message);
      return;
    }

    handleClose();
    fetchData();
  };

  return (
    <div className="newProduct mt-4">
      <Container>
        <h4 className="text-center">Payment Settlement</h4>
        <div className="mt-4 p-2">
          <Row className="bg-light p-4 mt-4 d-flex justify-content-between align-items-center">
            <Col>
              <Form.Label>Choose Seller</Form.Label>
              <Form.Select
                aria-label="Default select example"
                size="sm"
                onChange={(e) => setSelectedSeller(e.target.value)}
              >
                <option>Open to select Seller</option>
                {allSellers?.map((seller) => (
                  <option key={seller._id} value={seller._id}>
                    {seller?.Shop_Details_Info?.shope_name} [
                    {seller?.Shop_Details_Info?.disict} -{" "}
                    {seller?.Shop_Details_Info?.state}]
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col
              className="d-flex justify-content-center align-items-center gap-4"
              xs={8}
            >
              <div className="d-flex flex-column">
                <Form.Label>Choose From Date</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) =>
                    setStartDate(moment(date).format("YYYY-MM-DD"))
                  }
                  dateFormat="yyyy-MM-dd"
                  className="form-control form-control-sm"
                  placeholderText="Select a date"
                />
              </div>
              <div className="d-flex flex-column">
                <Form.Label>Choose To Date</Form.Label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) =>
                    setEndDate(moment(date).format("YYYY-MM-DD"))
                  }
                  dateFormat="yyyy-MM-dd"
                  className="form-control form-control-sm"
                  placeholderText="Select a date"
                />
              </div>
            </Col>
          </Row>
          {/* <Row>
            <Col>
              <Row>Total Income</Row>
              <Row>10,000</Row>
            </Col>
            <Col>
              <Row>Payable Amount</Row>
              <Row>10,000</Row>
            </Col>
            <Col>
              <Row>Paid Amount</Row>
              <Row>10,000</Row>
            </Col>
            <Col>
              <Row>No of Transaction</Row>
              <Row>1000</Row>
            </Col>
          </Row> */}
          {selectedSeller != "" && (
            <Row>
              <Col className="mt-4 d-flex justify-content-end align-items-center">
                <span className="text-center mx-4 font-weight-bold">
                  {totalRecords} Records
                </span>
                <Button size="sm" variant="dark" onClick={() => handleShow()}>
                  Clear Settlement
                </Button>
              </Col>
            </Row>
          )}
          {selectedSeller != "" && (
            <Row>
              <Col className="mt-4 d-flex justify-content-end">
                <Pagination>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </Col>
            </Row>
          )}
          <Row className="w-100 mt-2">
            <span
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "green",
                textTransform: "capitalize",
              }}
            >
              * Commission Amount will be calculated on without tax amount
            </span>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Transaction Type</th>
                  <th>Seller</th>
                  <th>Order NO</th>
                  <th>Payment Id / Refund Id</th>
                  <th>Invoice Amount Calculation</th>
                  <th>Category Commission</th>
                  <th>Receivable Amount</th>
                  <th>Ledger Amount</th>
                  <th>Due Balance</th>
                </tr>
              </thead>
              <tbody>
                {selectedSeller == "" && (
                  <tr>
                    <td colSpan="10" className="text-center">
                      <h6>Please select a seller</h6>
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan="10" className="text-center">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </td>
                  </tr>
                )}
                {!loading &&
                  selectedSeller != "" &&
                  filterData?.length > 0 &&
                  filterData?.map((ele, index) => (
                    <tr key={index}>
                      <td>
                        {ele?.type == "orderPayment" && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "red",
                              fontWeight: "500",
                            }}
                          >
                            Order Payment
                          </span>
                        )}
                        {ele?.type == "RefundPayment" && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "green",
                              fontWeight: "500",
                            }}
                          >
                            Refund Payment
                          </span>
                        )}
                        {ele?.type === "AdminPayout" && (
                          <span
                            style={{
                              fontSize: "11px",
                              color: "green",
                              fontWeight: "500",
                            }}
                          >
                            Payment Done
                          </span>
                        )}
                      </td>
                      <td>{ele?.sellerId?.Shop_Details_Info?.shope_name}</td>
                      <td>{ele?.orderId?.order_no?.toLocaleString("en-IN")}</td>
                      <td>
                        {ele?.type === "orderPayment" && (
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "5px",
                              flexDirection: "column",
                            }}
                          >
                            <span>{ele?.orderId?.paymentId}</span>
                            <span>({ele?.orderId?.order_type})</span>
                          </span>
                        )}
                        {ele?.type === "RefundPayment" && (
                          <span
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "5px",
                              flexDirection: "column",
                            }}
                          >
                            <span>
                              {ele?.orderId?.refund_status?.razorpayRefundId}
                            </span>
                            <span>({ele?.orderId?.order_type})</span>
                          </span>
                        )}
                      </td>
                      <td>
                        {ele?.type === "orderPayment" && (
                          <AmountWithGst ele={ele} />
                        )}
                        {ele?.type === "RefundPayment" && (
                          <span>
                            {ele?.refundAmount?.toLocaleString("en-IN")}
                          </span>
                        )}

                        {ele?.type === "AdminPayout" && (
                          <span style={{ color: "#37AFE1" }}>
                            {ele?.adminAmount?.toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>
                      <td>
                        {/* {!isNaN(
                          (ele?.commissionAmount * 100) / ele?.totalAmount
                        )
                          ? `${(
                              (ele?.commissionAmount * 100) /
                              ele?.totalAmount
                            ).toFixed(2)}%`
                          : ""} */}
                        {ele?.orderId?.order_details?.[0]?.commissionPercentage}{" "}
                        %
                      </td>
                      <td>
                        <span style={{ color: "#024CAA", fontWeight: "bold" }}>
                          ₹{" "}
                          {ele?.commissionAmount?.toLocaleString("en-IN") || 0}
                        </span>
                      </td>
                      <td>
                        {ele?.type === "orderPayment" && (
                          <span style={{ color: "red" }}>
                            + {ele?.sellerAmount?.toLocaleString("en-IN")}
                          </span>
                        )}
                        {ele?.type === "RefundPayment" && (
                          <span style={{ color: "green" }}>
                            - {ele?.refundAmount?.toLocaleString("en-IN")}
                          </span>
                        )}

                        {ele?.type === "AdminPayout" && (
                          <span style={{ color: "green" }}>
                            - {ele?.adminAmount?.toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>
                      <td style={{ width: "250px" }}>
                        <span
                          style={{
                            fontWeight: "bold",
                            letterSpacing: "1px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          {ele?.balance <= 0 ? (
                            <span style={{ color: "green" }}>
                              ₹ {ele?.balance?.toLocaleString("en-IN")}
                            </span>
                          ) : (
                            <span style={{ color: "red" }}>
                              ₹ {ele?.balance?.toLocaleString("en-IN")}
                            </span>
                          )}
                        </span>
                        <div>
                          {ele?.remark && <TaxRemarks remarks={ele?.remark} />}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Row>
        </div>
      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px", textAlign: "center" }}>
            For Seller -{" "}
            {
              allSellers?.find((seller) => seller._id == selectedSeller)
                ?.Shop_Details_Info?.shope_name
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Row className="d-flex justify-content-center">
              <Col xs={8} className="d-flex flex-column">
                <Form.Label>Add Price Amount</Form.Label>
                <Form.Control
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Enter Amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  size="sm"
                  required
                />
              </Col>
              <Col xs={8} className="d-flex flex-column">
                <Form.Label>Payment Remarks</Form.Label>
                <Form.Control
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Enter Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  as="textarea"
                  rows={3}
                  size="sm"
                  required
                />
              </Col>

              {/* <Col xs={8} className="d-flex flex-column mt-2">
                <Form.Label>Payment Receipts</Form.Label>
                <Form.Control
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder="Enter Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  as="textarea"
                  rows={3}
                  size="sm"
                />
              </Col> */}
              <Col xs={8} className="d-flex flex-column mt-2">
                <Button size="sm" variant="dark" type="submit">
                  Save Payment
                </Button>
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const TaxRemarks = ({ remarks }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="mt-2">
      <p onClick={() => setShow(!show)} className="shwTx2">
        {show ? "Hide" : "Show"} Remarks
      </p>
      {show && <p className="text-start mt-2 fw-500 text-break">{remarks}</p>}
    </div>
  );
};

export default AdminPaymnets;
