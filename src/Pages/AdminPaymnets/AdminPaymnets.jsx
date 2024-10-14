import axios, { all } from "axios";
import React, { useEffect, useState } from "react";
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
import { AdminSellerLists } from "../../API/api";

const apiUrl = import.meta.env.VITE_API_BASE;

const AdminPaymnets = () => {
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    categoryId: "",
    subcategoryId: "",
    brandId: "",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [show, setShow] = useState(false);
  const [paymentDetailData, setPaymentDetailData] = useState({});
  const [allSellers, setAllSellers] = useState([]);

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
  }, [currentPage, filters]);

  useEffect(() => {
    // fetchCategories();
    // fetchSubcategories();
    // fetchBrands();
    getAllSellersList();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/ledger/paginated-list?page=${currentPage}&limit=10`
      );
      console.log(res?.data?.data, "kkkk");
      setFilterData(res?.data?.data);
      setTotalPages(res?.data?.pagination?.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await allCategoryList();
      setCategories(res.data?.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await allSubCategoryList();
      setSubcategories(res.data?.data);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await allBrandList();
      setBrands(res.data?.data);
    } catch (error) {
      console.error("Error fetching brands", error);
    }
  };

  //   const handlePageChange = (page) => {
  //     setCurrentPage(page);
  //   };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setCurrentPage(1);
    setTotalPages(1);
    setFilterData([]);
    handlePageChange(1);
    setFilters({
      categoryId: "",
      subcategoryId: "",
      brandId: "",
    });
  };

  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    // Your page change logic here, for example:
    console.log(`Navigating to page ${newPage}`);
    setCurrentPage(newPage);
  };

  return (
    <div className="newProduct mt-4">
      <Container>
        <h4 className="text-center">Payment Settlement</h4>
        <div className="mt-4 p-2">
          <Row className="bg-light p-4 mt-4 d-flex justify-content-between align-items-center">
            <Col>
              <Form.Label>Choose Seller</Form.Label>
              <Form.Select aria-label="Default select example" size="sm">
                <option>Open this select menu</option>
                {allSellers?.map((seller) => (
                  <option key={seller._id} value={seller._id}>
                    {seller?.shope_name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col
              className="d-flex justify-content-center align-items-center gap-4"
              xs={8}
            >
              <div>
                <Form.Label>Choose From Date</Form.Label>
                <Form.Select aria-label="Default select example" size="sm">
                  <option>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </div>
              <div>
                <Form.Label>Choose From Date</Form.Label>
                <Form.Select aria-label="Default select example" size="sm">
                  <option>Open this select menu</option>
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </div>
            </Col>
          </Row>
          <Row>
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
          </Row>
          <Row className="w-100 mt-4" style={{ fontSize: "12px" }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Order NO</th>
                  <th>Payment Id</th>
                  <th>Total Amount</th>
                  <th>Category Commission</th>
                  <th>Commission Price (Receivable Amount)</th>
                  <th>Seller Amount (Payable Amount)</th>
                  <th>Due Balance</th>
                </tr>
              </thead>
              <tbody>
                {filterData?.length > 0 &&
                  filterData?.map((ele, index) => (
                    <tr key={index}>
                      <td>{ele?.sellerId?.Shop_Details_Info?.shope_name}</td>
                      <td>{ele?.orderId?.order_no?.toLocaleString("en-IN")}</td>
                      <td>
                        {ele?.type === "orderPayment" &&
                          ele?.orderId?.paymentId}
                      </td>
                      <td>
                        {ele?.type === "orderPayment" &&
                          ele?.totalAmount?.toLocaleString("en-IN")}
                        {ele?.type === "RefundPayment" && (
                          <span>
                            Refunded -{" "}
                            {ele?.refundAmount?.toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>
                      <td>
                        {!isNaN(
                          (ele?.commissionAmount * 100) / ele?.totalAmount
                        )
                          ? `${(
                              (ele?.commissionAmount * 100) /
                              ele?.totalAmount
                            ).toFixed(2)}%`
                          : ""}
                      </td>
                      <td>{ele?.commissionAmount?.toLocaleString("en-IN")}</td>
                      <td>{ele?.sellerAmount?.toLocaleString("en-IN")}</td>
                      <td>
                        {ele?.type === "orderPayment" ? (
                          <span style={{ color: "red" }}>
                            + {ele?.balance?.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span style={{ color: "green" }}>
                            - {ele?.balance?.toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default AdminPaymnets;
