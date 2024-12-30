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

const apiUrl = import.meta.env.VITE_API_BASE;

const CouponManagement = () => {
  const [formData, setFormData] = useState({
    couponType: "single-use",
    baseCouponNo: "",
    discountType: "",
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
    const timestamp =  moment().format("YYYY-MM-DD_HH-mm-ss"); // Replace invalid filename characters
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

  const reFetchListCall = async () => {};

  return (
    <Container className="productList mt-2 p-4">
      <h3>Coupon Management</h3>
      {/* {message.text && <Alert variant={message.type}>{message.text}</Alert>} */}

      {/* Create Form */}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Coupon Type</Form.Label>
              <Form.Select
                name="couponType"
                value={formData.couponType}
                onChange={handleChange}
              >
                <option value="single-use">Single-Coupon</option>
                <option value="multi-use">Multi-Coupons</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Base Coupon No</Form.Label>
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
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={1}
              required
            />
          </Form.Group>
        )}

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
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
            <Form.Group className="mb-3">
              <Form.Label>Discount Value</Form.Label>
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
              <Form.Group className="mb-3">
                <Form.Label>Max Use Count</Form.Label>
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

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Min Amount</Form.Label>
          <Form.Control
            type="number"
            name="minAmount"
            value={formData.minAmount}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Max Amount</Form.Label>
          <Form.Control
            type="number"
            name="maxAmount"
            value={formData.maxAmount}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Active Status"
            name="status"
            checked={formData.status}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Coupon
        </Button>
      </Form>

      <div>
        <CouponList />
      </div>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Coupon Type</Form.Label>
                  <Form.Select
                    name="couponType"
                    value={updateFormData.couponType}
                    onChange={handleUpdateChange}
                  >
                    <option value="single-use">Single-Coupon</option>
                    <option value="multi-use">Multi-Coupons</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Base Coupon No</Form.Label>
                  <Form.Control
                    type="text"
                    name="baseCouponNo"
                    value={updateFormData.baseCouponNo}
                    onChange={handleUpdateChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {updateFormData.couponType === "multi-use" && (
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={updateFormData.quantity}
                  onChange={handleUpdateChange}
                  min={1}
                  required
                />
              </Form.Group>
            )}

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Type</Form.Label>
                  <Form.Select
                    name="discountType"
                    value={updateFormData.discountType}
                    onChange={handleUpdateChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Value</Form.Label>
                  <Form.Control
                    type="number"
                    name="discountValue"
                    value={updateFormData.discountValue}
                    onChange={handleUpdateChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Use Count</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxUseCount"
                    value={updateFormData.maxUseCount}
                    onChange={handleUpdateChange}
                    min={1}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={updateFormData.startDate}
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={updateFormData.endDate}
                    onChange={handleUpdateChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Min Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="minAmount"
                    value={updateFormData.minAmount}
                    onChange={handleUpdateChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxAmount"
                    value={updateFormData.maxAmount}
                    onChange={handleUpdateChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active Status"
                name="status"
                checked={updateFormData.status}
                onChange={handleUpdateChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Update Coupon
            </Button>
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

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl}/coupon/coupon-list?page=${currentPage}&limit=${limit}`
        );
        console.log({ response });
        setCoupons(response.data?.data);
        setTotalCoupons(response.data?.pagination?.totalCoupons);
        setTotalPages(response?.data?.pagination?.totalPages);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
      setLoading(false);
    };

    fetchCoupons();
  }, [currentPage, limit]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  console.log(totalPages, "totalPages");

  return (
    <div className="mt-4">
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Coupon Type</th>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {coupons?.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    No Data Found
                  </td>
                </tr>
              )}
              {coupons?.length > 0 &&
                coupons?.map((coupon) => (
                  <tr key={coupon._id}>
                    <td>{coupon._id}</td>
                    <td>{coupon.couponNo}</td>
                    <td>{coupon.discount}</td>
                    <td>{new Date(coupon.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <Pagination>
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
};
