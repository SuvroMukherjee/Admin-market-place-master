import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {
  createRefundRequest,
  sellerRefurnRequestList,
  sellerReturnRequestList,
} from "../../API/api";
import { toast } from "react-toastify";
import { ChangeFormatDate } from "../../common/DateFormat";

const RefundOrderSeller = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRefundOrderRequestList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getRefundOrderRequestList() {
    setLoading(true);
    try {
      let res = await sellerRefurnRequestList();
      console.log(res?.data?.data, "order");
      setList(res?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (data) => {
    console.log(data, "data");
    let payload = {
      orderId: data.orderId?._id,
      paymentId: data.orderId?.paymentId,
    };
    let res = await createRefundRequest(payload);
    if (res?.data?.error) {
      toast.error(res?.data?.message);
      return;
    }
    toast.success("Request Approved Successfully");
    setTimeout(() => {
      getRefundOrderRequestList();
    }, 2000);
  };

  return (
    <div>
      <div className="mt-4 mx-4 px-4">
        <Row>
          <Col className="dtext fs-5">Refund Order List</Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Order Type</th>
                  <th>Price</th>
                  <th>Payment ID</th>
                  <th>Refund Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <div className="productList p-4 contentLoader">
                    <Row>
                      <Col>
                        <Spinner animation="border" size="lg" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  list?.map((row) => (
                    <tr key={row._id}>
                      <td>{row?.orderId ? row?.orderId.order_no : ""}</td>
                      <td>{row?.orderId ? row?.orderId.order_type : ""}</td>
                      <td>
                        {row?.orderId
                          ? row?.orderId.order_price?.toLocaleString()
                          : ""}
                      </td>
                      <td>{row?.paymentId}</td>
                      <td>
                        <Button variant="dark" size="sm">
                          {row?.status}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RefundOrderSeller;
