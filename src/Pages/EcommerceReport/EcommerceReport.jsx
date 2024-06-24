import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table
} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { Toaster } from "react-hot-toast";
import { FaBoxOpen } from "react-icons/fa";
import { LiaClipboardListSolid } from "react-icons/lia";
import { AllOrderListsByAdmin, allProductList } from "../../API/api";
import moment from "moment";

export default function EcommerceReport() {
    
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [pendingOrders, setPendingOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let pendingList = [];
      let deliveredList = [];
        try {
            const [productsResponse, ordersResponse] = await Promise.all([
                allProductList(),
                AllOrderListsByAdmin()
            ]);
            setProducts(productsResponse?.data?.data);
            setOrders(ordersResponse?.data?.data);
            setData(ordersResponse?.data?.data);
            if (orders.length > 0) {
              pendingList = [...orders].filter(
                (item) =>
                  item?.order_details?.order_status === "order_placed" 
              );
            }
            setPendingOrders(pendingList);
            if (orders.length > 0) {
              deliveredList = [...orders].filter(
                (item) =>
                  item?.order_details?.order_status === "delivered" 
              );
            }
            setDeliveredOrders(deliveredList);
            if (productsResponse?.data?.data && ordersResponse?.data?.data ){
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
           setLoading(false);
        }
    };

    // Call the fetchData function
    fetchData();
}, []);


let filteredList = [...data];
  // if (searchTerm.length > 0) {
  //   filteredList =[...data].filter(
  //     (item) =>
  //       item?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       item?.Shop_Details_Info?.shope_name
  //         ?.toLowerCase()
  //         .includes(searchTerm.toLowerCase())
  //   );
  // }


  //filter by seller
  if (selectedSeller) {
    filteredList = [...data].filter(order =>
        order.order_details.some(detail => detail.sellerId.user_name === selectedSeller)
    );
}


const parseOrderData = (data) => {
  return data.map(order => ({
      orderId: order._id,
      orderDate: new Date(order.order_details[0].proId.createdAt).toLocaleString(),
      orderDetails: order.order_details.map(detail => ({
          productId: detail.proId._id,
          productName: detail.proId.name,
          sellerName: detail.sellerId.user_name, // Assuming sellerId is the seller name
          shopName: detail.sellerId.Shop_Details_Info.shope_name, // Assuming we need to provide a placeholder for shop name
          productImage: detail.proId.specId.image[0]?.image_path || '', // Assuming the first image is the primary image
          orderStatus: detail.order_status,
      })),
      orderAddress: order.addressId ? `${order.addressId.locality}, ${order.addressId.city}, ${order.addressId.state}, ${order.addressId.pincode}` : 'N/A',
  }));
};


const OrderTable = ({ data }) => {
  const parsedData = parseOrderData(data);

  return (
      <Table bordered hover responsive>
          <thead>
              <tr>
                  <th>Shop Name</th>
                  <th>Seller Name</th>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Order Location</th>
                  <th>Order Date & Time</th>
              </tr>
          </thead>
          <tbody>
              {parsedData.length > 0 ? (
                  parsedData.map((order, idx) => (
                      order.orderDetails.map((detail, index) => (
                          <tr key={`${idx}-${index}`}>
                              <td>{detail.shopName}</td>
                              <td>{detail.sellerName}</td>
                              <td>
                                  <div className="productListItem">
                                      <img
                                          className="productListImg"
                                          src={detail.productImage}
                                          alt="Product"
                                          style={{ width: '100px', height: '100px' }}
                                      />
                                  </div>
                              </td>
                              <td>{detail.productName}</td>
                              <td>{order.orderAddress}</td>
                              <td>{order.orderDate}</td>
                              
                          </tr>
                      ))
                  ))
              ) : (
                  <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                          No Data Found
                      </td>
                  </tr>
              )}
          </tbody>
      </Table>
  );
};


  return (
    <>
      {loading && (
        <div className="productList p-4 contentLoader">
          <Row>
            <Col>
              <Spinner animation="border" size="lg" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Col>
          </Row>
        </div>
      )}
      <div className="productList mt-2 p-4 mt-4">
        <Container>
          <Row className="d-flex justify-content-center gap-5">
            <Col>
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>Total Products</Card.Title>
                  <Card.Text className="featuredMoney">
                  <FaBoxOpen /> <span>{products?.length}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title> Total Sold Products</Card.Title>
                  <Card.Text className="featuredMoney">
                  <LiaClipboardListSolid /> <span>{deliveredOrders?.length}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>Total Orders</Card.Title>
                  <Card.Text className="featuredMoney">
                  <LiaClipboardListSolid /> <span>{orders?.length}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card style={{ width: "18rem" }}>
                <Card.Body>
                  <Card.Title>Pending Orders</Card.Title>
                  <Card.Text className="featuredMoney">
                  <LiaClipboardListSolid /> <span>{pendingOrders?.length}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="justify-content-md-center">
            <Col md="auto">
              <h4>Report</h4>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="justify-content-md-center mt-4">
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-sm">
                Search
              </InputGroup.Text>
              <Form.Control
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                placeholder="Search by Seller Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
    <InputGroup.Text id="inputGroup-sizing-sm">
        Select by Seller
    </InputGroup.Text>
    <Form.Select
        aria-label="Small"
        aria-describedby="inputGroup-sizing-sm"
        onChange={(e) => setSelectedSeller(e.target.value)}
        value={selectedSeller}
    >
        <option value="">All Sellers</option>
        {/* {filteredList.map((seller, index) => (
            <option key={index} value={seller}>{seller}</option>
        ))} */}
    </Form.Select>
   </InputGroup>
          </Row>
          <Row className="justify-content-md-center mt-4">
            <Col
              style={{
                overflowY: "scroll",
                maxHeight: "600px",
                border: "1px solid #ccc",
              }}
            >
              <OrderTable data={filteredList} />
            </Col>
          </Row>
        </Container>
        <Toaster position="top-right" />
      </div>
    </>
  );
}
