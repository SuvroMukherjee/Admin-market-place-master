import { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { sellerReturnRequestList } from "../../../API/api";
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

  console.log({ list });

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
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Product Image</th>
                  <th>SKU</th>
                  <th>Order Quantity</th>
                  <th>Price</th>
                  <th>Shipping Cost</th>
                  <th>Net Disbursement</th>
                  <th>Request Date & Time</th>
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
                    <td
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <button className="btn btn-link">Accept</button>
                      <button
                        style={{
                          color: "red",
                        }}
                        className="btn btn-link"
                      >
                        Reject
                      </button>
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
