import { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { createRefundRequest, sellerReturnRequestList } from "../../../API/api";
import { ChangeFormatDate } from "../../../common/DateFormat";
import { toast } from "react-toastify";

const ReturnOrderRequestList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReturnOrderRequestList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getReturnOrderRequestList() {
    setLoading(true);
    try {
      let res = await sellerReturnRequestList();
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
      getReturnOrderRequestList();
    }, 2000);
  };

  return (
    <div>
      <Container className="mt-4">
        <Row>
          <Col className="dtext fs-5">Return Order Request List</Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Return ID</th>
                  <th>Order ID</th>
                  <th>Order Type</th>
                  <th>Price</th>
                  <th>Product</th>
                  <th>Reason</th>
                  <th>Images</th>
                  <th>Order Date</th>
                  <th>Requested Status</th>
                  <th>Requested Date</th>
                  <th>Action</th>
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
                      <td>{row?._id}</td>
                      <td>{row?.orderId ? row?.orderId.order_no : ""}</td>
                      <td>{row?.orderId?.order_type}</td>
                      <td>{row?.price?.toLocaleString()}</td>
                      <td>{row?.productId ? row?.productId.name : ""}</td>
                      <td>{row?.reason}</td>
                      <td>
                          <Image
                          src={row?.images?.[0]?.image_path}
                          thumbnail
                          width={40}
                          height={40}
                        />
                        
                        </td>
                      <td>
                        {ChangeFormatDate(
                          row?.orderId?.order_details[0]?.order_delivery
                        )}
                      </td>
                      <td>{row?.status}</td>
                      <td>
                        {row?.createdAt ? ChangeFormatDate(row?.createdAt) : ""}
                      </td>
                      <td className="d-flex gap-2 justify-content-center items-center">
                        {row?.orderId?.refund_status == "Not-Initiated" && row?.orderId?.order_type !== "COD" ? (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApprove(row)}
                              disabled={
                                row?.orderId?.refund_status !== "Not-Initiated"
                              }
                            >
                              Approve
                            </Button>
                            <Button variant="danger" size="sm">
                              Reject
                            </Button>
                          </>
                        ) : (
                          <span className="fw-bold">
                            {row?.orderId?.refund_status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ReturnOrderRequestList;
