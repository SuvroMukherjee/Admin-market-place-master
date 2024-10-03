import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {
  createRefundRequest,
  sellerReturnRequestList,
  updateReturnStatus,
} from "../../../API/api";
import { ChangeFormatDate } from "../../../common/DateFormat";
import { toast } from "react-toastify";

const ReturnOrderRequestList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSeletedOrder] = useState({});
  const [showModalRefund, setShowModalRefund] = useState(false);

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

  // const handleApprove = async (data) => {

  //   console.log(data, "data");
  //   let payload = {
  //     orderId: data.orderId?._id,
  //     paymentId: data.orderId?.paymentId,
  //   };
  //   let res = await createRefundRequest(payload);
  //   if (res?.data?.error) {
  //     toast.error(res?.data?.message);
  //     return;
  //   }
  //   toast.success("Request Approved Successfully");
  //   setTimeout(() => {
  //     getReturnOrderRequestList();
  //   }, 2000);
  // };

  // const handleReturnStatus = async (data) => {
  //   console.log(data, "data");
  //   let payload = {
  //     orderId: data.orderId?._id,
  //     status: data.status,
  //   };
  //   let res = await updateReturnStatus(payload);
  //   if (res?.data?.error) {
  //     toast.error(res?.data?.message);
  //     return;
  //   }
  //   toast.success("Request Approved Successfully");
  //   setTimeout(() => {
  //     getReturnOrderRequestList();
  //   }, 2000);
  // };

  const [returnStatus, setReturnStatus] = useState("");
  const [refundStatus, setRefundStatus] = useState("");

  // Handler to update return status
  const handleReturnStatusChange = (e) => {
    setReturnStatus(e.target.value);
  };

  // Handler to update refund status
  const handleRefundStatusChange = (e) => {
    setRefundStatus(e.target.value);
  };

  // Function to handle save action
  const handleSaveChanges = async () => {
    await handleReturnStatus(selectedOrder, returnStatus);
    setShowModal(false);
  };

  const handleSaveRefundChanges = async () => {
    await handleRefundStatus(selectedOrder, refundStatus);
    setShowModalRefund(false);
  };

  const handleReturnStatus = async (data, returnStatus) => {
    console.log(data, "data");
    let payload = {
      status: returnStatus,
    };
    let res = await updateReturnStatus(
      payload,
      selectedOrder?.orderId?.order_details?.[0]?.returnReqId?._id
    );
    if (res?.data?.error) {
      toast.error(res?.data?.message);
      return;
    }
    toast.success("Request Approved Successfully");
    setTimeout(() => {
      getReturnOrderRequestList();
    }, 2000);
  };

  const handleRefundStatus = async (data, refundStatus) => {
    console.log(data, "data");
    if (refundStatus == "Refund-Approved") {
      let payload = {
        orderId: data.orderId?._id,
        paymentId: data.orderId?.paymentId,
      };
      let res = await createRefundRequest(
        payload,
        selectedOrder?.orderId?.order_details?.[0]?.returnReqId?._id
      );
      if (res?.data?.error) {
        toast.error(res?.data?.message);
        return;
      }
      toast.success("Request Approved Successfully");
      setTimeout(() => {
        getReturnOrderRequestList();
      }, 2000);
    } else {
      toast.error("Nothing to update");
    }
  };

  const handleOpenReturn = (data) => {
    setShowModal(true);
    setSeletedOrder(data);
  };

  const handleOpenRefund = (data) => {
    setShowModalRefund(true);
    setSeletedOrder(data);
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
                  <td>Product</td>
                  <th>Return ID</th>
                  <th>Order ID</th>
                  <th>Order Type</th>
                  <th>Price</th>
                  <th>Reason</th>
                  <th>Images</th>
                  <th>Order Date</th>
                  <th>Requested Status</th>
                  <th>Requested Date</th>
                  <th>Return Staus</th>
                  <th>Refund Staus</th>
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
                      <td className="d-flex justify-content-center align-items-center gap-2">
                         <div>
                          {console.log(row,'row')}
                          <img src={row?.productId?.specId?.image?.[0]?.image_path} alt="img" width="50" height="50" style={{objectFit:'contain'}}/>
                         </div>
                        {row?.productId ? row?.productId.name : ""}</td>
                      <td>{row?._id}</td>
                      <td>{row?.orderId ? row?.orderId.order_no : ""}</td>
                      <td>{row?.orderId?.order_type}</td>
                      <td>{row?.price?.toLocaleString()}</td>
                      <td>{row?.productId ? row?.productId.name : ""}</td>
                      <td>{row?.reason}</td>
                      <td>
                      <img src={row?.images?.[0]?.image_path} alt="img" width="100" height="100" style={{objectFit:'contain'}}/>
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
                      <td style={{ width: "200px" }}>
                        <p style={{ color: "red", fontWeight: "bold" }}>
                          {
                            row?.orderId?.order_details?.[0]?.returnReqId
                              ?.status
                          }
                        </p>
                        <Button
                          size="sm"
                          variant="dark"
                          onClick={() => handleOpenReturn(row)}
                        >
                          Return Status
                        </Button>
                      </td>

                      <td style={{ width: "200px" }}>
                        <p style={{ color: "green", fontWeight: "bold" }}>
                          {row?.orderId?.refund_status?.status}
                        </p>
                        <Button
                          variant="dark"
                          size="sm"
                          onClick={() => {
                            handleOpenRefund(row);
                          }}
                          disabled={
                            row?.orderId?.order_details?.[0]?.returnReqId
                              ?.status !== "Returned"
                          }
                        >
                          Update Refund Status
                         
                        </Button>
                        {row?.orderId?.order_type === "COD" && <p style={{ color: "green", fontWeight: "bold" }}>COD Refund Not Available</p>}
                         
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <h6>Return - Order ({selectedOrder?.orderId?.order_no}) </h6>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="returnStatus">
                <Form.Label>Return Status </Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleReturnStatusChange}
                  value={returnStatus}
                >
                  <option disabled value="">
                    Open Return Status
                  </option>
                  <option value="Return-Approved">Return-Approved</option>
                  <option value="Returned">Returned</option>
                  <option value="Return-Cancelled">Return-Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showModalRefund}
          onHide={() => setShowModalRefund(false)}
          centered
        >
          <Modal.Header closeButton>
            <h6>Refund - Order ({selectedOrder?.orderId?.order_no})</h6>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="refundStatus">
                <Form.Label>Refund Request For Admin</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  onChange={handleRefundStatusChange}
                  value={refundStatus}
                  disabled={
                    selectedOrder?.orderId?.order_details?.[0]?.returnReqId
                      ?.status !== "Returned"
                  }
                >
                  <option disabled value="">
                    Open Refund Status
                  </option>
                  <option value="Refund-Approved">Refund-Approved </option>
                  <option value="Refund-Rejected">Refund-Rejected</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveRefundChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ReturnOrderRequestList;
