import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { Toaster, toast } from "react-hot-toast";
import { GoDownload } from "react-icons/go";

const apiUrl = import.meta.env.VITE_API_BASE;

const CouponManagement = () => {
  const [formData, setFormData] = useState({
    couponType: "single-use",
    baseCouponNo: "",
    discountType: "percentage",
    discountValue: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
    status: true,
    quantity: 1, // Only relevant for multi-use
  });

  const [updateFormData, setUpdateFormData] = useState({ ...formData });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "baseCouponNo") {
      setFormData({
        ...formData,
        [name]: value
          ?.trim()
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, ""),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const downloadCSV = (csvContent) => {
    const timestamp = moment().format("YYYY-MM-DD_HH-mm-ss"); // Replace invalid filename characters
    const fileName = `coupons-${timestamp}.csv`; // Use timestamp in the filename
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertArrayToCSV = (data) => {
    if (!data.length) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] || "")).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/coupon/coupon-create`,
        formData
      );
      setMessage({
        text: response.data.message,
        type: "success",
      });
      toast.success(response.data.message || "Coupon created successfully.");

      console.log(response, "PAI RESponse");

      // Assuming response.data.coupons is the array to download
      if (
        response?.data?.data &&
        response?.data.data?.length > 0 &&
        formData.couponType === "multi-use"
      ) {
        const csvContent = convertArrayToCSV(response?.data?.data);
        console.warn(csvContent, "csvContent");
        downloadCSV(csvContent, ` coupons.csv`);
      }
      setFormData({
        couponType: "single-use",
        baseCouponNo: "",
        discountType: "percentage",
        discountValue: "",
        minAmount: "",
        maxAmount: "",
        startDate: "",
        endDate: "",
        status: true,
        quantity: 1, // Only relevant for multi-use
      });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error creating coupon.",
        type: "danger",
      });
      toast.error(error.response?.data?.message || "Error creating coupon.");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `/coupon-update/${updateFormData.id}`,
        updateFormData
      );
      setMessage({
        text: response.data.message,
        type: "success",
      });
      toast.success(response.data.message || "Coupon updated successfully.");
      setShowUpdateModal(false);
      setFormData({
        couponType: "single-use",
        baseCouponNo: "",
        discountType: "percentage",
        discountValue: "",
        minAmount: "",
        maxAmount: "",
        startDate: "",
        endDate: "",
        status: true,
        quantity: 1, // Only relevant for multi-use
      });
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error updating coupon.",
        type: "danger",
      });
      toast.error(error.response?.data?.message || "Error updating coupon.");
    }
  };

  return (
    <Container className="productList mt-4 p-4 bg-light rounded shadow">
      <h3 className="text-center mb-4">Coupon Management</h3>

      {/* Create Form */}
      <Form onSubmit={handleSubmit}>
        <div>
          <Row className="gy-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Coupon Type</Form.Label>
                <Form.Select
                  name="couponType"
                  value={formData.couponType}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="single-use">Single-Coupon</option>
                  <option value="multi-use">Multi-Coupons</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Base Coupon No</Form.Label>
                {formData?.couponType == "multi-use" && (
                  <span
                    className="mx-2"
                    style={{
                      fontSize: "12px",
                      color: "darkgrey",
                      textTransform: "lowercase",
                      fontStyle: "italic",
                      fontWeight: "bold",
                    }}
                  >
                    (use a prefix that will be used for generating the coupon
                    codes.)
                  </span>
                )}
                {formData?.couponType == "single-use" && (
                  <span
                    className="mx-2"
                    style={{
                      fontSize: "12px",
                      color: "darkgrey",
                      textTransform: "lowercase",
                      fontStyle: "italic",
                      fontWeight: "bold",
                    }}
                  >
                    (only uppercase, no special character.)
                  </span>
                )}
                <Form.Control
                  type="text"
                  name="baseCouponNo"
                  value={formData.baseCouponNo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {formData.couponType === "multi-use" && (
            <Row className="gy-3 mt-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <span
                    className="mx-2"
                    style={{
                      fontSize: "12px",
                      color: "darkgrey",
                      textTransform: "lowercase",
                      fontStyle: "italic",
                      fontWeight: "bold",
                    }}
                  >
                    (Enter number of coupons you want to be generated.)
                  </span>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min={1}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row className="gy-3 mt-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Discount Type</Form.Label>
                <Form.Select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  required
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  {formData?.discountType !== "percentage"
                    ? "Discount Value in Rupees"
                    : "Discount Value in Percentage"}
                </Form.Label>
                <Form.Control
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            {formData.couponType !== "multi-use" && (
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Max Use Count</Form.Label>
                  <span
                    className="mx-2"
                    style={{
                      fontSize: "12px",
                      color: "darkgrey",
                      textTransform: "lowercase",
                      fontStyle: "italic",
                      fontWeight: "bold",
                    }}
                  >
                    (maximum times coupon can be used.)
                  </span>
                  <Form.Control
                    type="number"
                    name="maxUseCount"
                    value={formData.maxUseCount}
                    onChange={handleChange}
                    min={1}
                    required
                  />
                </Form.Group>
              </Col>
            )}
          </Row>

          <Row className="gy-3 mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Start Date (optional) </Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>End Date (optional) </Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="gy-3 mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Min Amount (optional) </Form.Label>
                <Form.Control
                  type="number"
                  name="minAmount"
                  value={formData.minAmount}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Max Amount (optional) </Form.Label>
                <Form.Control
                  type="number"
                  name="maxAmount"
                  value={formData.maxAmount}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Button variant="primary" type="submit" className="px-5">
            Create Coupon
          </Button>
        </div>
      </Form>

      <div className="mt-5">
        <CouponList />
      </div>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Row className="gy-3">
              {/* Same structure as the create form for update */}
            </Row>
            <div className="d-flex justify-content-center mt-4">
              <Button variant="primary" type="submit" className="px-5">
                Update Coupon
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Toaster position="top-right" />
    </Container>
  );
};

export default CouponManagement;

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("default");

  const fetchCoupons = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: limit,
    };
    if (search.trim()) params.search = search.trim();
    if (status !== "default") params.status = status;
    try {
      const response = await axios.get(`${apiUrl}/coupon/coupon-list`, {
        params,
      });
      setCoupons(response.data?.data || []);
      setTotalCoupons(response.data?.pagination?.totalCoupons || 0);
      setTotalPages(response?.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, limit, search, status]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleUpdateSubmit = async (e) => {
    try {
      const response = await axios.patch(
        `${apiUrl}/coupon/coupon-update/${e._id}`,
        {
          ...e,
          status: !e.status,
        }
      );
      toast.success(response.data.message || "Coupon updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating coupon.");
    } finally {
      setLoading(false);
      fetchCoupons();
      setCurrentPage(1);
    }
  };

  const resetFilter = () => {
    setSearch("");
    setStatus("default");
    setCurrentPage(1);
  };

  const downloadCSV = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (status !== "default") params.status = status;

      const response = await axios.get(`${apiUrl}/coupon/coupon-list`, {
        params: { ...params, limit: totalCoupons },
      });

      const csvContent = convertToCSV(response.data?.data || []);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "coupons.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
    setLoading(false);
  };

  const convertToCSV = (data) => {
    const headers = [
      "Coupon Code",
      "Discount Type",
      "Discount",
      "Created At",
      "Minimum Amount",
      "Maximum Amount",
      "Maximum Usage(No. of Times)",
      "Used till now(No. of Times)",
      "Start Date",
      "End Date",
    ];

    const rows = data.map((coupon) => [
      coupon.couponNo,
      coupon.discountType,
      coupon.discountValue,
      moment(coupon.createdAt).tz("Asia/Kolkata").format("LLL"),
      coupon.minAmount || "N/A",
      coupon.maxAmount || "N/A",
      coupon.maxUseCount,
      coupon.useCount,
      coupon.startDate
        ? moment(coupon.startDate).tz("Asia/Kolkata").format("LLL")
        : "N/A",
      coupon.endDate
        ? moment(coupon.endDate).tz("Asia/Kolkata").format("LLL")
        : "N/A",
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="mt-4">
      <div className="mb-3 d-flex align-items-center justify-content-center">
        <div className="d-flex">
          <Form.Control
            type="text"
            style={{
              width: "200px",
            }}
            placeholder="Search by Coupon Code or ID"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="d-flex justify-content-start mx-3">
          <Form.Select
            style={{
              width: "200px",
            }}
            value={status}
            onChange={handleStatusChange}
          >
            <option value="default">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Form.Select>
        </div>

        <div className="d-flex justify-content-start">
          <Button variant="danger" onClick={resetFilter}>
            Reset
          </Button>
          <Button
            variant="dark"
            size="sm"
            onClick={downloadCSV}
            disabled={loading}
            className="ms-2"
          >
            <span>
              <GoDownload size="20" />
            </span>
            Download CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Pagination>
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Pagination.Prev>

                {currentPage > 3 && (
                  <>
                    <Pagination.Item onClick={() => handlePageChange(1)}>
                      1
                    </Pagination.Item>
                    {currentPage > 4 && <Pagination.Ellipsis />}
                  </>
                )}

                {Array.from(
                  { length: 5 },
                  (_, index) => currentPage - 2 + index
                ).map((page) =>
                  page > 0 && page <= totalPages ? (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Pagination.Item>
                  ) : null
                )}

                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && <Pagination.Ellipsis />}
                    <Pagination.Item
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Pagination.Item>
                  </>
                )}

                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Pagination.Next>
              </Pagination>
            </div>
          )}

          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Coupon ID
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Coupon Code
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Discount Type
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Discount
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Created At
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Min Amount
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Max Amount
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Max Limit
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Used Count
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Start Date
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  End Date
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Status
                </th>
                <th
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>
                    No Data Found
                  </td>
                </tr>
              )}
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <span>{coupon._id}</span>
                      <span
                        onClick={() => copyToClipboard(coupon._id)}
                        style={{ marginLeft: "10px", cursor: "pointer" }}
                        title="Copy"
                      >
                        <i className="fas fa-copy"></i>{" "}
                        {/* You can use any icon or text */}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <span> {coupon.couponNo}</span>
                      <span
                        onClick={() => copyToClipboard(coupon.couponNo)}
                        style={{ marginLeft: "10px", cursor: "pointer" }}
                        title="Copy"
                      >
                        <i className="fas fa-copy"></i>{" "}
                        {/* You can use any icon or text */}
                      </span>
                    </span>
                  </td>

                  <td>{coupon.discountType}</td>
                  <td>{coupon.discountValue}</td>
                  <td>
                    {moment(coupon.createdAt).tz("Asia/Kolkata").format("LLL")}
                  </td>
                  <td>{coupon.minAmount || "N/A"}</td>
                  <td>{coupon.maxAmount || "N/A"}</td>
                  <td>{coupon.maxUseCount}</td>
                  <td>{coupon.useCount}</td>
                  <td>
                    {coupon.startDate
                      ? moment(coupon.startDate)
                          .tz("Asia/Kolkata")
                          .format("LLL")
                      : "N/A"}
                  </td>
                  <td>
                    {coupon.endDate
                      ? moment(coupon.endDate).tz("Asia/Kolkata").format("LLL")
                      : "N/A"}
                  </td>
                  <td>
                    {coupon.status ? (
                      <span className="text-success">Active</span>
                    ) : (
                      <span className="text-danger">Inactive</span>
                    )}
                  </td>
                  <td>
                    {coupon.status ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleUpdateSubmit(coupon)}
                      >
                        Activate
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUpdateSubmit(coupon)}
                      >
                        Deactivate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};
