import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { Toaster } from "react-hot-toast";
import { IoIosArrowForward, IoIosEye } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AdminSellerLists } from "../../API/api";
import { productRows } from "../../dummyData";


export default function SellerChoose() {
  const [data, setData] = useState(productRows);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
   const timer = setTimeout(() => {
      getAllSellersList();
    }, 2000);

    return ()=> clearTimeout(timer)
  }, []);

  async function getAllSellersList() {
    await AdminSellerLists()
      .then((res) => {
        const dataWithUniqueIds = res?.data?.data?.map((item, index) => ({
          ...item,
          id: index + 1,
        }));

        const filteredDataAsApproved = dataWithUniqueIds.filter(
          (item) => item?.status === "approved"
        );

        setData(filteredDataAsApproved);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [searchTerm, setSearchTerm] = useState("");

  let filteredList = [...data];
  if (searchTerm.length > 0) {
    filteredList = data.filter(
      (item) =>
        item?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.Shop_Details_Info?.shope_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }

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
              <h4>Choose a Seller Products to Apply Offers</h4>
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
          </Row>
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
                    <th>ID</th>
                    <td>Registered By</td>
                    <th>Shop Name</th>
                    <th>Shop Image</th>
                    <th>Seller Name</th>
                    <th>Selling Products</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length > 0 &&
                    filteredList.map((row) => {
                      return (
                        <tr key={row?.id}>
                          <td>{row?.id}</td>
                          <td>{row?.staffId ? row?.staffId?.name : "Own"}</td>
                          <td>{row?.Shop_Details_Info?.shope_name}</td>
                          <td>
                            <div className="productListItem">
                              <img
                                className="productListImg"
                                src={
                                  row?.Shop_Details_Info?.pic_of_shope?.[0] ||
                                  row?.Shop_Details_Info?.pic_of_shope?.[0]
                                    ?.imag_path
                                }
                                alt=""
                              />
                              {row?.Shop_Details_Info?.pic_of_shope?.length >
                                2 && (
                                <span>
                                  {row?.Shop_Details_Info?.pic_of_shope
                                    ?.length - 1}
                                  +
                                </span>
                              )}
                            </div>
                          </td>
                          <td>{row?.user_name}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="dark"
                              onClick={() =>
                                navigate(`/Admin/product-offer-productchoose/${row?._id}`)
                              }
                            >
                              Go to Selling Products <span className="mx-1"><IoIosArrowForward /></span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  {filteredList.length === 0 && (
                    <tr>
                      <td colSpan="12" style={{ textAlign: "center" }}>
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
        <Toaster position="top-right" />
      </div>
    </>
  );
}
