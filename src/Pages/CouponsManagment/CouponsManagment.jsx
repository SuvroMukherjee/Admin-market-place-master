import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Modal,
  Pagination,
  Spinner,
  Table,
} from "react-bootstrap";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import moment from "moment";
import { GoDownload } from "react-icons/go";

const apiUrl = import.meta.env.VITE_API_BASE;

const CouponManagement = () => {
  const [formData, setFormData] = useState({
    couponType: "single-use",
    baseCouponNo: "",
    discountType: "flat",
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
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error creating coupon.",
        type: "danger",
      });
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
      setShowUpdateModal(false);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error updating coupon.",
        type: "danger",
      });
    }
  };

  return (
    <Container className="productList mt-4 p-4 bg-light rounded shadow">
      <h3 className="text-center mb-4">Coupon Management</h3>

      {/* Create Form */}
      <Form onSubmit={handleSubmit}>
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
                <option value="">Select</option>
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
                  (Enter maximum number of times the coupon can be used.)
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

  return (
    <div className="mt-4">
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by Coupon Code or ID"
            value={search}
            onChange={handleSearchChange}
          />
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={() => setCurrentPage(1)}>
            Search
          </Button>
        </Col>
        <Col md={3}>
          <Form.Select value={status} onChange={handleStatusChange}>
            <option value="default">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="secondary" onClick={resetFilter}>
            Reset
          </Button>
        </Col>
      </Row>

      <Row className="mt-3 mt-2">
        <Col xs={10}></Col>
        <Col className="text-end" xs={2}>
          <Button
            variant="dark"
            size="sm"
            onClick={downloadCSV}
            disabled={loading}
          >
            <span>
              {" "}
              <GoDownload size="20" />{" "}
            </span>{" "}
            Download CSV
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <>
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>Type</th>
                <th>Coupon Code</th>
                <th>Discount Type</th>
                <th>Discount</th>
                <th>Created At</th>
                <th>Minimum Amount</th>
                <th>Maximum Amount</th>
                <th>Maximum Usage(No. of Times)</th>
                <th>Used till now(No. of Times)</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
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
                  <td>{coupon.couponType}</td>
                  <td>{coupon.couponNo}</td>
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
                <Pagination.Item onClick={() => handlePageChange(totalPages)}>
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
        </>
      )}
    </div>
  );
};
