import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  BestSellerProductUpdate,
  SellerAllProductList,
} from "../../../API/api";

const BestSeller = () => {
  const [ProductList, setBestSellerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setshowModal] = useState(false);

  useEffect(() => {
    getSellerProductList();
  }, []);

  async function getSellerProductList() {
    try {
      setLoading(true);
      const res = await SellerAllProductList();
      if (!res?.data?.error) {
        setBestSellerList(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      // console.log(ProductList, "seller product list");
    }
  }

  const updateBestSellerProduct = async (index, isBestSell) => {
    console.log(index);
    try {
      let payload = {
        is_bestSell: !isBestSell,
      };
      const res = await BestSellerProductUpdate(index, payload);
      if (!res?.data?.error) {
        getSellerProductList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  let filteredList = [...ProductList];

  filteredList = [...filteredList].filter((ele) => {
    return (
      ele?.productId?.productId
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()) ||
      ele?.productId?.name
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()) ||
      ele?.specId?.skuId?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  });

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
          <Row className="justify-content-md-center">
            <Col md="auto">
              <h4>Product List</h4>
              <h5 className="text-muted text-center">
                Total Products : {ProductList.length}
              </h5>
            </Col>
          </Row>
          <div>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
              <Form.Control
                placeholder="search product by id or name"
                aria-label="Search-Product"
                aria-describedby="basic-addon1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
        </Container>
        <Container>
          <Row className="justify-content-md-center mt-4">
            <Col
              style={{
                overflowY: "scroll",
                maxHeight: "600px",
                border: "1px solid #ccc",
              }}
            >
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>Product Id</th>
                    <th>Product Name</th>
                    <th>Product Image</th>
                    <th>Variants</th>
                    <th>SKU Id</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length > 0 &&
                    filteredList.map((row, index) => {
                      return (
                        <tr key={index}>
                          <td>{row?.productId?.productId}</td>
                          <td>{row?.productId?.name}</td>
                          <td>
                            <div className="productListItem">
                              <img
                                className="productListImg"
                                src={row?.specId?.image?.[0]?.image_path}
                                alt="productpic"
                              />
                              {/* {row?.productId?.image?.length > 2 && (
                                <span>
                                  {row?.productId?.image?.length - 1}+
                                </span>
                              )} */}
                            </div>
                          </td>
                          <td>{row?.specId?.spec_det?.length}</td>
                          <td>{row?.specId?.skuId}</td>
                          <td>{row?.productId?.categoryId?.title}</td>
                          <td>{row?.productId?.brandId?.title}</td>
                          <td>
                            <Button
                              size="sm"
                              onClick={() =>
                                updateBestSellerProduct(
                                  row?._id,
                                  row?.is_bestSell
                                )
                              }
                              className={`${
                                row?.is_bestSell ? "btn-danger" : "btn-success"
                              }`}
                            >
                              {row?.is_bestSell
                                ? "Remove from Best Seller"
                                : "Add to Best Seller"}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  {filteredList.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default BestSeller;
