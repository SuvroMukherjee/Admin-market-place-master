import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { sellerStockoutlist } from "../../../API/api";

const ReturnOrderList = () => {
  const { userId } = JSON.parse(localStorage.getItem("auth"));

  const [list, setList] = useState([]);

  useEffect(() => {
    getOrdersist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrdersist = async () => {
    let res = await sellerStockoutlist(userId);
    console.log(res?.data?.data, "order");
    const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    setList(dataWithUniqueIds);
  };

  console.log({ list });

  return (
    <div>
      <Container className="mt-4">
        <Row>
          <Col className="dtext">Return Order List</Col>
        </Row>
        {/* <Row className="mt-4">
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Product Image</th>
                  <th>SKU</th>
                  <th>Available Quantiy</th>
                  <th>Order Quantity</th>
                  <th>Price</th>
                  <th>Shipping Cost</th>
                  <th>Net Disbursement</th>
                  <th>Order Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {list.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
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
                    <td className="avaible">{row.productId?.available_qty}</td>
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
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row> */}
      </Container>
    </div>
  );
};

export default ReturnOrderList;
