import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { Toaster } from "react-hot-toast";
import { IoIosEye } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AdminSellerLists } from "../../API/api";
import { productRows } from "../../dummyData";
import "./Seller.css";

export default function SellerReport() {
  const [data, setData] = useState(productRows);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      getAllSellersList();
    }, 3000);
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

  // async function countProductBySellerApiCall(sellerID) {
  //   const res = await SellerProductList(sellerID);

  //   return await res?.data?.data?.SellerProductData?.length;
  // }

  // function countProductBySeller(sellerID) {
  //   if (!sellerID) return 0;

  //   countProductBySellerApiCall(sellerID).then((res) => {
  //     return res;
  //   });

  //   return 0;
  //   // const res = await SellerProductList(sellerID);

  //   // return await res?.data?.data?.SellerProductData?.length;
  // }

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
              <h4>Seller Report</h4>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="justify-content-md-center mt-4">
            <Col>
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <td>Registered By</td>
                    <th>Shop Name</th>
                    <th>Shop Image</th>
                    <th>Seller Name</th>
                    <th>Selling Products</th>
                    <th>Seller Details</th>
                    <th>View Selling</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 &&
                    data.map((row) => {
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
                                navigate(`/Seller/ProductList/${row?._id}`)
                              }
                            >
                              <IoIosEye />
                            </Button>
                          </td>
                          <td>
                            <Button
                              size="sm"
                              variant="dark"
                              onClick={() =>
                                navigate(`/SellerDetails/${row?._id}`)
                              }
                            >
                              <IoIosEye />
                            </Button>
                          </td>
                          <td onClick={() =>
                            navigate(`/Seller/SalesReport/${row?._id}`)
                          }>view sellings</td>
                        </tr>
                      );
                    })}
                  {data.length === 0 && (
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
