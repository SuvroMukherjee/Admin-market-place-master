import axios from "axios";
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

  useEffect(() => {
    fetchData();
  }, [currentPage, filters]);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchBrands();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/order/list-paginated?page=${currentPage}&limit=10`
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

  // const OrderSequenceStatus = (status) => {
  //   switch (status) {
  //     case "order_placed":
  //       return "order packed";
  //     case "order_packed":
  //       return "shipped";
  //     case "shipped":
  //       return "delivered";
  //     case "delivered":
  //       return "Order Delivered";
  //     case "cancel":
  //       return "Order Cancel";
  //     default:
  //       return "Unknown Status";
  //   }
  // };

  // const getPaymentDetails = async (paymentId) => {
  //   try {
  //     let res = await razorpayPaymentDetailsData(paymentId);
  //     console.log(res, "res");
  //     setShow(true);
  //     setPaymentDetailData(res?.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const handleClose = () => setShow(false);

  return (
    <div className="newProduct mt-4">
      <h4>Payment Settlement</h4>
      <Container>
        <Row>
          <Col>Select Seller</Col>
          <Col>choose Date Range</Col>
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
        <Row className="w-100 mt-4">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col>SL No</Col>
                <Col>Order NO</Col>
                <Col>Seller</Col>
                <Col>Category Commission</Col>
                <Col>Received Amount</Col>
                <Col>Payment Id</Col>
                <Col>Payable Amount</Col>
                <Col>Payment Status</Col>
                <Col>Action</Col>
              </Row>
            </ListGroup.Item>

            {filterData?.length > 0 &&
              filterData?.map((ele, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col>{index + 1}</Col>
                    <Col>{ele?.order_no}</Col>
                    <Col>
                      {ele?.order_details[0]?.proId?.sellerId?.user_name}
                    </Col>
                    <Col>{ele?.order_details[0]?.productId?.categoryId}</Col>
                    <Col>{ele?.order_details[0]?.price?.toLocaleString()}</Col>
                    <Col>{ele?.paymentId}</Col>
                    <Col>{ele?.order_details[0]?.price}</Col>
                    <Col>{ele?.payment_status}</Col>
                    <Col>Action Button</Col>
                  </Row>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPaymnets;
