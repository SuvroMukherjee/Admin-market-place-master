import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Pagination, Row, Spinner } from "react-bootstrap";
import useAuth from "../../../hooks/useAuth";
import moment from "moment";
// import { AdminSellerLists, createPayment } from "../../API/api";

const apiUrl = import.meta.env.VITE_API_BASE;

const SellerPayments = () => {
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const { auth } = useAuth();

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl}/ledger/paginated-list?page=${currentPage}&limit=15&sellerId=${auth?.userId}`
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

  return (
    <div
      className="py-3 px-5"
      style={{ backgroundColor: "#e5faca", minHeight: "100vh" }}
    >
      <div className="">
        <Row>
          <Col>
            <h4 className="fw-bold">Seller Payments</h4>
          </Col>
          <Col className="d-flex justify-content-end">
            <span className="text-center mx-4 fw-bold">
              Total {totalRecords} Transactions
            </span>
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
        <Row className="mt-2">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Transaction Type</th>
                <th>Order Date</th>
                <th>Order No</th>
                <th>Payment Id</th>
                <th>Order Amount</th>
                <th>Category Commission</th>
                <th>Admin Price</th>
                <th>Leadger Amount</th>
                <th>Creditable Balance</th>
              </tr>
            </thead>
            <tbody>
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
                filterData?.length > 0 &&
                filterData?.map((ele, index) => (
                  <tr key={index}>
                    <td>
                      {ele?.type == "orderPayment" && (
                        <span
                          style={{
                            fontSize: "11px",
                            color: "green",
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
                            color: "red",
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
                            color: "red",
                            fontWeight: "500",
                          }}
                        >
                          Payment Done
                        </span>
                      )}
                    </td>

                    <td>{moment(ele?.updatedAt).format("DD-MM-YYYY")}</td>
                    <td>{ele?.orderId?.order_no?.toLocaleString("en-IN")}</td>

                    <td>
                      {ele?.type === "orderPayment" && ele?.orderId?.paymentId}
                      {ele?.type === "RefundPayment" &&
                        ele?.orderId?.refund_status?.razorpayRefundId}
                    </td>
                    <td>
                      {ele?.type === "orderPayment" && (
                        <span>{ele?.totalAmount?.toLocaleString("en-IN")}</span>
                      )}
                      {ele?.type === "RefundPayment" && (
                        <span>
                          {ele?.refundAmount?.toLocaleString("en-IN")}
                        </span>
                      )}

                      {ele?.type === "AdminPayout" && (
                        <span>{ele?.adminAmount?.toLocaleString("en-IN")}</span>
                      )}
                    </td>
                    <td>
                      {!isNaN((ele?.commissionAmount * 100) / ele?.totalAmount)
                        ? `${(
                            (ele?.commissionAmount * 100) /
                            ele?.totalAmount
                          ).toFixed(2)}%`
                        : ""}
                    </td>
                    <td>
                      <span
                        style={{
                          color: "#024CAA",
                          fontWeight: "bold",
                          letterSpacing: "1px",
                        }}
                      >
                        ₹ {ele?.commissionAmount?.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      {/* {ele?.sellerAmount?.toLocaleString("en-IN")} */}

                      {ele?.type === "orderPayment" && (
                        <span style={{ color: "green" }}>
                          + {ele?.sellerAmount?.toLocaleString("en-IN")}
                        </span>
                      )}
                      {ele?.type === "RefundPayment" && (
                        <span style={{ color: "red" }}>
                          - {ele?.refundAmount?.toLocaleString("en-IN")}
                        </span>
                      )}

                      {ele?.type === "AdminPayout" && (
                        <span style={{ color: "red" }}>
                          - {ele?.adminAmount?.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        style={{ fontWeight: "bold", letterSpacing: "1px" }}
                      >
                        {ele?.balance <= 0 ? (
                          <span style={{ color: "red" }}>
                            ₹ {ele?.balance?.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span style={{ color: "green" }}>
                            ₹ {ele?.balance?.toLocaleString("en-IN")}
                          </span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Row>
      </div>
    </div>
  );
};

export default SellerPayments;
