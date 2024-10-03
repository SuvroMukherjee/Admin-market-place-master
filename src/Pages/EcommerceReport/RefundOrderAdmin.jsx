import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {
  AdminRefundRequestList,
  RazorpayRefundRequest,
  updateRefundRequest,
} from "../../API/api";
import { toast } from "react-toastify";

const RefundOrderAdmin = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRefundOrderRequestList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getRefundOrderRequestList() {
    setLoading(true);
    let query = {
      limit: 500,
    };
    try {
      let res = await AdminRefundRequestList(query);
      console.log(res?.data?.data, "order");
      setList(res?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const createRefundRequestHandler = async (data, id, status) => {
    try {
      let payload = {
        amount: data.orderId?.order_price,
        paymentId: data.orderId?.paymentId,
        orderId: data.orderId?._id,
      };
      let res = await RazorpayRefundRequest(payload);
      if (res?.data?.error) {
        toast.error(res?.data?.message);
        return;
      } else {
        toast.success("Refund Request Created Successfully");
        await updateRefundRequestHandler(id, status);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const updateRefundRequestHandler = async (id, status) => {
    try {
      let payload = {
        status: status,
      };
      let res = await updateRefundRequest(id, payload);
      if (res?.data?.error) {
        toast.error(res?.data?.message);
        return;
      }
      toast.success("Refund Updated Successfully");
      setTimeout(() => {
        getRefundOrderRequestList();
      }, 2000);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="newProduct mt-4">
      <h4 className="text-center">Refund Orders List</h4>
      <Container>
        <Row className="mt-4">
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Product</th>
                <th>Seller</th>
                <th>Order Type</th>
                <th>Price</th>
                <th>Payment ID</th>
                <th>Refund Status</th>
                <th>Refund Id</th>
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
                  <tr key={row?.id}>
                    <td>{row?.orderId ? row?.orderId.order_no : ""}</td>
                    <td className="d-flex gap-2 justify-content-center align-items-center">
                      <div>
                        <img
                          src={
                            row?.orderId?.order_details?.[0]?.proId?.specId
                              ?.image?.[0]?.image_path
                          }
                          alt=""
                          width="75"
                          height="75"  
                          className="img-fluid"
                        />
                      </div>
                      {row?.orderId?.order_details?.[0]?.proId?.productId?.name}
                    </td>
                    <td>
                      {row?.sellerId
                        ? row?.sellerId?.Shop_Details_Info?.shope_name
                        : "Order is not Delivered"}
                    </td>
                    <td>{row?.orderId ? row?.orderId.order_type : ""}</td>
                    <td>
                      {" "}
                      {row?.orderId
                        ? row?.orderId.order_price?.toLocaleString()
                        : ""}
                    </td>
                    <td>{row?.paymentId}</td>
                    <td> {row?.status}</td>
                    <td>{row?.razorpayRefundId}</td>

                    <td className="d-flex gap-2 justify-content-center align-items-center">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() =>
                          createRefundRequestHandler(
                            row,
                            row?._id,
                            "Refund-Done"
                          )
                        }
                        disabled={
                          row?.status === "Refund-Done" || row?.razorpayRefundId
                        }
                      >
                        Refund Complete
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          updateRefundRequestHandler(
                            row?._id,
                            "Refund-Rejected"
                          )
                        }
                        disabled={
                          row?.status === "Refund-Rejected" ||


                          row?.razorpayRefundId
                        }
                      >
                        Refund Cancel
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Row>
      </Container>
    </div>
  );
};

export default RefundOrderAdmin;
