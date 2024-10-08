import axios from "axios";
import moment from "moment";
import  { useEffect, useState } from "react";
import {
    Button,
    Col,
    Container,
    Form,
    Modal,
    Row,
    Table
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import {
    allBrandList,
    allCategoryList,
    allSubCategoryList,
    razorpayPaymentDetailsData
} from "../../API/api";

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
        

        <div className="d-flex justify-content-center mt-2 mb-4 gap-4">
          <Button variant="dark" size="sm" onClick={handleReset}>
            Reset & Refresh
          </Button>

          <Button variant="dark" size="sm" onClick={handleReset}>
            {filterData?.length} Transactions
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
              <th>Seller</th>
              <th>Delivery Address</th>
              <th>Delivery Pincode</th>
              <th>Payment Status</th>
              <th>Payment Type</th>
              <th>Payment ID</th>
              <th>Deatils</th>
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
                    <td>{row?.order_details[0]?.proId?.sellerId?.Shop_Details_Info?.shope_name}</td>
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
                        disabled={row?.order_type == "COD"}
                      >
                        View
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
                  <td>{paymentData[key][nestedKey]}</td>
                </tr>
              ));
            } else {
              return (
                <tr key={index}>
                  <td>{fieldLabels[key] || key}</td>
                  {/* If the key is 'amount', display 100 instead of the actual value */}
                  <td>{key === 'amount' ? (paymentData[key]/100)?.toLocaleString() : (paymentData[key] !== null ? paymentData[key].toString() : 'N/A')}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </Table>
    );
  };
  
export default AdminTransaction;
