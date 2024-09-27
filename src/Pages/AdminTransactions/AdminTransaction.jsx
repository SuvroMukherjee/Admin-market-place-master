import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  ListGroup,
  Modal,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { CSVLink } from "react-csv";
import toast from "react-hot-toast";
import { AiOutlineInfoCircle, AiOutlinePlus } from "react-icons/ai";
import { BsClipboard2CheckFill } from "react-icons/bs";
import { CiCircleInfo } from "react-icons/ci";
import { FaArrowDown, FaArrowUp, FaFileExport, FaSearch } from "react-icons/fa";
import { FaCircleInfo, FaCirclePlus } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { LiaMailBulkSolid } from "react-icons/lia";
import { LuClipboardSignature } from "react-icons/lu";
import { MdCancel } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
  BulkProductUpload,
  DeleteProductSpecification,
  FileUpload,
  ProductSpecificationCreate,
  SpecBulkProductUpload,
  StatusUpdateProduct,
  UpdateProductSpecification,
  allBrandList,
  allCategoryList,
  allSubCategoryList,
  deleteProduct,
  razorpayPaymentDetailsData,
} from "../../API/api";
import useAuth from "../../hooks/useAuth";
import ReactPaginate from "react-paginate";
import { ChangeFormatDate } from "../../common/DateFormat";
import { ArrowRightAlt } from "@mui/icons-material";

const apiUrl = import.meta.env.VITE_API_BASE;

const AdminTransaction = () => {
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    categoryId: "",
    subcategoryId: "",
    brandId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedproductid, setSeledtedProductId] = useState();
  const [variantsArray, setVariantsArray] = useState([]);

  const [showModal2, setShowModal2] = useState(false);

  const handleCloseModal2 = () => setShowModal2(false);
  const handleShowModal2 = () => setShowModal2(true);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchData();
  };

  const navigate = useNavigate();

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

  const handleSearch = () => {
    fetchData(); // Trigger search when the search button is clicked
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

  const copyTextToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopied(false);
      setCopiedIndex(null);
    }, 2000);
  };

  const handleReset = () => {
    setSearchTerm("");
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

  const handleStatus = async (dataset) => {
    let payload = {
      status: !dataset?.status,
    };

    await StatusUpdateProduct(dataset?._id, payload)
      .then((res) => {
        console.log(res);
        fetchData();
        toast.success("Product status updated successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handledeleteProduct = async (id) => {
    await deleteProduct(id)
      .then((res) => {
        console.log(res);
        fetchData();
        toast.success("Product deleted successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showVariants = (data) => {
    console.log(data);
    setVariantsArray(data);
    handleShowModal2();
  };

  const variationRequestCount = (data) => {
    let filterData = data?.filter((ele) => {
      return ele?.is_approved == false;
    });

    return filterData?.length;
  };

  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    // Your page change logic here, for example:
    console.log(`Navigating to page ${newPage}`);
    setCurrentPage(newPage);
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

  const getPaymentDetails = async (paymentId) => {
    try {
      let res = await razorpayPaymentDetailsData(paymentId);
      console.log(res, "res");
      setShow(true);
      setPaymentDetailData(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => setShow(false);

  return (
    <div className="productList mt-2 p-4">
      <Container className="mt-2 mb-4">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h3>Transaction List</h3>
          </Col>
        </Row>
      </Container>
      <div style={{ height: 1000, overflowY: "auto" }}>
        <div className="d-flex justify-content-between mb-3 gap-4">
          <Form.Select
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
            size="sm"
          >
            <option value="">Select Category</option>
            {categories?.length > 0 &&
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
          </Form.Select>
          <Form.Select
            name="subcategoryId"
            value={filters.subcategoryId}
            onChange={handleFilterChange}
            size="sm"
          >
            <option value="">Select Subcategory</option>
            {subcategories?.length > 0 &&
              subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.title}
                </option>
              ))}
          </Form.Select>
          <Form.Select
            name="brandId"
            value={filters.brandId}
            onChange={handleFilterChange}
            size="sm"
          >
            <option value="">Select Brand</option>
            {brands?.length > 0 &&
              brands.map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.title}
                </option>
              ))}
          </Form.Select>
        </div>

        <div className="d-flex justify-content-center mt-2 mb-4">
          <Button variant="dark" size="sm" onClick={handleReset}>
            Reset & Refresh
          </Button>

          <Button variant="dark" size="sm" onClick={handleReset}>
            {filterData?.length} Products
          </Button>
        </div>

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

        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>SL NO</th>
              <th>Order ID</th>
              <th>Order Status</th>
              <th>Order Amount</th>
              <th>Order date & time</th>
              <th>Address</th>
              <th>Pincode</th>
              <th>Payment Status</th>
              <th>Payment Type</th>
              <th>Payment ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              filterData?.length > 0 &&
              filterData
                ?.filter((ele) => ele?.payment_status == "paid")
                .map((row, index) => (
                  <tr key={row.id}>
                    <td>{index + 1}</td>
                    <td className="orderId">{row?.order_no}</td>
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
                    <td>{moment(row?.updatedAt).format("LLL")}</td>
                    <td>{row?.address} - {row?.city}</td>
                    <td>{row?.pincode}</td>
                    <td>
                      {row?.payment_status == "unpaid" ? "Incomplete" : "Paid"}
                    </td>
                    <td>{row?.order_type}</td>
                    <td>
                      {row?.payment_status == "paid" ? row?.paymentId : "N/A"}
                    </td>
                    <td>
                     
                       
                       <Button
                        variant="dark"
                        size="sm"
                        onClick={() => getPaymentDetails(row?.paymentId)}
                      >
                        View Payment Details
                      </Button>
                      
                    </td>
                  </tr>
                ))}
            {!loading && filterData?.length === 0 && (
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
      </div>
      <div>
        {console.log(paymentDetailData, "paymentDetailData")}
        <Modal
          show={show}
          onHide={handleClose}
          size="lg"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <p className="cmpgin-title">
              Payment Details for Order #{paymentDetailData?.id}
            </p>
          </Modal.Header>
          <Modal.Body style={{ height: "50vh", overflow: "scroll" }}>
            <PaymentDetails paymentData={paymentDetailData} />
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

const PaymentDetails = ({ paymentData }) => {
    // Mapping keys to display-friendly labels
    const fieldLabels = {
      id: 'Payment ID',
      entity: 'Entity',
      amount: 'Amount',
      currency: 'Currency',
      status: 'Status',
      order_id: 'Order ID',
      invoice_id: 'Invoice ID',
      international: 'International',
      method: 'Payment Method',
      amount_refunded: 'Amount Refunded',
      refund_status: 'Refund Status', // Custom label for refund_status
      captured: 'Captured',
      description: 'Description',
      card_id: 'Card ID',
      bank: 'Bank',
      wallet: 'Wallet',
      vpa: 'VPA',
      email: 'Email',
      contact: 'Contact',
      notes: 'Notes',
      fee: 'Fee',
      tax: 'Tax',
      error_code: 'Error Code',
      error_description: 'Error Description',
      error_source: 'Error Source',
      error_step: 'Error Step',
      error_reason: 'Error Reason',
      acquirer_data: 'Acquirer Data',
      created_at: 'Created At',
      'acquirer_data.rrn': 'RRN',
      'acquirer_data.upi_transaction_id': 'UPI Transaction ID',
      'upi.vpa': 'UPI VPA',
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
          {Object.keys(paymentData).map((key, index) => {
            // Handle nested objects like 'acquirer_data' and 'upi'
            if (typeof paymentData[key] === 'object' && paymentData[key] !== null) {
              return Object.keys(paymentData[key]).map((nestedKey, nestedIndex) => (
                <tr key={`${index}-${nestedIndex}`}>
                  <td>{fieldLabels[`${key}.${nestedKey}`] || `${key}.${nestedKey}`}</td>
                  <td>{paymentData[key][nestedKey] !== null ? paymentData[key][nestedKey].toString() : 'N/A'}</td>
                </tr>
              ));
            } else {
              return (
                <tr key={index}>
                  <td>{fieldLabels[key] || key}</td>
                  <td>{paymentData[key] !== null ? paymentData[key].toString() : 'N/A'}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </Table>
    );
  };
  
export default AdminTransaction;
