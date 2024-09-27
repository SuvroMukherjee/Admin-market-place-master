import { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { createRefundRequest, sellerReturnRequestList } from "../../../API/api";
import { ChangeFormatDate } from "../../../common/DateFormat";

const ReturnOrderRequestList = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    getReturnOrderRequestList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getReturnOrderRequestList() {
    let res = await sellerReturnRequestList();
    console.log(res?.data?.data, "order");
    setList(res?.data?.data);
  }

  const handleRefund = async (data) => {
    console.log(data,'data');
    let payload = {
      orderId: data.orderId?._id,
      paymentId: data.orderId?.paymentId,
    };

    console.log(payload);
    // let res = await createRefundRequest();
    // console.log(res?.data?.data, "order");
    // getReturnOrderRequestList()
  };

  return (
    <div>
      <Container className="mt-4">
        <Row>
          <Col className="dtext">Return Order Request List</Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Return ID</th>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Reason</th>
                  <th>Order Date</th>
                  <th>Requested Status</th>
                  <th>Requetsed Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row) => (
                  <tr key={row.id}>
                    <td>{row._id}</td>
                    <td>{row.productId ? row.productId.name : ""}</td>
                    <td>
                      <Image
                        src={row.productId?.specId?.image?.[0]?.image_path}
                        thumbnail
                        width={40}
                        height={40}
                      />
                    </td>
                    <td>{row.productId?.specId?.skuId}</td>
                    <td className="amount">{row.quantity}</td>
                    <td className="amount">
                      {" "}
                      {row.productId?.price?.toLocaleString()}
                    </td>
                    <td className="amount">{row.productId?.shipping_cost}</td>
                    <td className="amount">
                      {row.productId?.comission_price?.toLocaleString()}
                    </td>
                    <td className="datecolor">
                      {ChangeFormatDate(row.createdAt)}
                    </td>
                    <td className="d-flex gap-2 justify-content-center items-center">
                      <Button variant="success" size="sm" onClick={() => handleRefund(row)}>
                        Approve
                      </Button>
                      <Button variant="danger" size="sm">
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ReturnOrderRequestList;
