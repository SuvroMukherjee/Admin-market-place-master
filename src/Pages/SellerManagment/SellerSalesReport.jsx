/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { CSVLink } from "react-csv";
import { MdDownload } from "react-icons/md";
import { TfiReload } from "react-icons/tfi";
import { Link, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getReportListBySellerId,
  getReportListBySellerIdWithDate,
} from "../../API/api";
import { formatDateRemoveTime } from "../../common/DateFormat";

const SellerSalesReport = () => {
  const { id: sellerId } = useParams();

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [reportDate, setReportDate] = useState({
    start: "",
    end: "",
  });
  const [allorders, setAllorders] = useState([]);
  const [type, setType] = useState("1");
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    getReportListFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getReportListFunc = async () => {
    try {
      setLoading(true);
      let res = await getReportListBySellerId(sellerId);
      console.log(res?.data?.data, "reports");
      setReports(res?.data);
      let d = [];
      res?.data?.data.forEach((ele) => {
        ele?.order_details?.forEach((item, index) => {
          if (item?.order_status == "delivered") {
            console.log(item, index);
            d.push({
              order_id: item?._id,
              sales: item?.price * item?.qty,
              income: item?.proId?.comission_price * item?.qty,
              Quantiy: item?.qty,
              date: item?.order_delivery
                ? formatDateRemoveTime(item?.order_delivery)
                : formatDateRemoveTime(new Date()),
              product: item?.proId?.name,
              spec: item?.proId?.specId,
            });
          }
        });
      });

      setAllorders(d);
      setCsvData(d);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      resetDate();
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setReportDate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handledateOperation = async () => {
    try {
      setLoading(true);
      console.log(reportDate?.start, reportDate?.end);

      let res = await getReportListBySellerIdWithDate(
        sellerId,
        reportDate?.start,
        reportDate?.end
      );
      let d = [];
      res?.data?.data.forEach((ele) => {
        ele?.order_details?.forEach((item, index) => {
          if (item?.order_status == "delivered") {
            console.log(item, index);
            d.push({
              order_id: item?._id,
              sales: item?.price * item?.qty,
              income: item?.proId?.comission_price * item?.qty,
              Quantiy: item?.qty,
              date: item?.order_delivery
                ? formatDateRemoveTime(item?.order_delivery)
                : formatDateRemoveTime(new Date()),
              product: item?.proId?.name,
              spec: item?.proId?.specId,
            });
          }
        });
      });

      setAllorders(d);
      setCsvData(d);
      setReports(res?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeView = (value) => {
    console.log(value);
    setType(value);
  };

  const resetDate = () => {
    setReportDate({
      start: "",
      end: "",
    });
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
          {/* back */}
          <Row>
            <Col>
              <Link to={"/SellerReport"}>Back</Link>
            </Col>
          </Row>
          {/* heading of the page */}
          <Row className="justify-content-md-center">
            <Col md="auto">
              <h4>Seller Sales Report</h4>
            </Col>
          </Row>
          {/* sales dashboard */}
          <Row className="mt-2 flex justify-content-end">
            <Col>
              <p
                onClick={() => getReportListFunc()}
                className="not-select-view"
              >
                <span>
                  <TfiReload />{" "}
                </span>{" "}
                Refresh
              </p>
            </Col>
            <Col>
              {csvData?.length > 0 && (
                <CSVLink
                  size="sm"
                  data={csvData}
                  filename={`report.csv`}
                  style={{ textDecoration: "none" }}
                >
                  <p className="select-view">
                    <span>
                      <MdDownload />
                    </span>{" "}
                    Download
                  </p>
                </CSVLink>
              )}
            </Col>
          </Row>
          {/* Sales Snapshot */}
          <Row className="p-4 mt-4 mx-2 cont">
            <Row className="cont">
              <Col xs={4}>
                <Form.Group controlId="date-to">
                  <Form.Label className="customDatelable">
                    Start Date:
                  </Form.Label>
                  <Form.Control
                    type="date"
                    className="tapG"
                    name="start"
                    value={reportDate?.start}
                    onChange={(e) => handleDateChange(e)}
                  />
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group controlId="date-form">
                  <Form.Label className="customDatelable">End Date:</Form.Label>
                  <Form.Control
                    type="date"
                    className="tapG"
                    name="end"
                    value={reportDate?.end}
                    onChange={(e) => handleDateChange(e)}
                  />
                </Form.Group>
              </Col>
              <Col className="d-flex justify-content-start align-items-end cursor">
                <Button
                  variant="secondary"
                  onClick={() => handledateOperation()}
                >
                  APPLY
                </Button>
              </Col>
            </Row>
          </Row>
          {/* Sales Report */}
          <div className="mt-4 reptContainer">
            <Row className="reptContainerBtn mx-1 p-2">
              <Col className="retext">Sales Snapshot</Col>
            </Row>
            <Row>
              <Col className="p-2 mx-4">
                <Row>
                  <Col className="retext2">Total orders</Col>
                  <Col className="retext2">Unit Orders</Col>
                  <Col className="retext2">Delivered Orders</Col>
                  <Col className="retext2">Total Sales</Col>
                  <Col className="retext2">Revenue</Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col className="p-2 mx-4">
                <Row>
                  <Col className="retext3">{reports?.totalOrder}</Col>
                  <Col className="retext3">{reports?.totalQuantity}</Col>
                  <Col className="retext3">{reports?.totalDeliver}</Col>
                  <Col className="retext3">
                    ₹ {reports?.totalsell?.toLocaleString()}
                  </Col>
                  <Col className="retext3">
                    ₹ {reports?.totalProfit?.toLocaleString()}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <Row className="mt-4 p-2">
            <Col className="d-flex align-items-center retext">
              Campare Sales
            </Col>
            <Col xs={6}></Col>
            <Col xs={3}>
              <Row>
                <Col
                  className={type == "1" ? "select-view" : "not-select-view"}
                  onClick={() => handleChangeView("1")}
                >
                  Graph View
                </Col>
                <Col
                  className={type == "2" ? "select-view" : "not-select-view"}
                  onClick={() => handleChangeView("2")}
                >
                  Table View
                </Col>
              </Row>
            </Col>
          </Row>
          {type == 1 && (
            <Row className="mt-4">
              <Col className="text-center ght">
                Ordered Product Sale's Graph
              </Col>
              <Col className="text-center ght">Units Ordere's Graph</Col>
            </Row>
          )}
          {type == 1 && (
            <Row style={{ height: "100vh" }} className="mt-2">
              <Col>
                <ResponsiveContainer width="100%" height="60%">
                  <BarChart
                    width={1600}
                    height={600}
                    data={allorders}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="sales"
                      fill="#31363F"
                      activeBar={<Rectangle fill="orange" stroke="blue" />}
                    />
                    <Bar
                      dataKey="income"
                      fill="#43ae00"
                      activeBar={<Rectangle fill="gold" stroke="purple" />}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Col>

              <Col>
                <ResponsiveContainer width="100%" height="60%">
                  <BarChart
                    width={1600}
                    height={600}
                    data={allorders}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="Quantiy"
                      fill="#007F73"
                      activeBar={<Rectangle fill="pink" stroke="blue" />}
                    />
                    <Bar
                      dataKey="product"
                      fill="#43ae00"
                      activeBar={<Rectangle fill="gold" stroke="purple" />}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Col>
            </Row>
          )}
          {type == "2" && (
            <Row className="mt-4">
              <Col>
                <Table responsive striped bordered hover>
                  <thead>
                    <tr>
                      <th>Order Id</th>
                      <th>Product Name</th>
                      <th>Order date</th>
                      <th>Qunatity</th>
                      <th>Sales</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allorders.map((ele, index) => (
                      <tr key={index}>
                        <td>{ele?.order_id}</td>
                        <td>
                          {" "}
                          <span>
                            <img
                              src={ele?.spec?.image?.[0]?.image_path}
                              width={25}
                              height={25}
                              style={{ objectFit: "contain" }}
                              alt="product_image"
                            />
                          </span>{" "}
                          {ele?.product}{" "}
                          {ele?.spec?.spec_det?.length > 0 && (
                            <span>
                              (
                              {ele?.spec?.spec_det?.map((ele, index, array) => (
                                <span key={index}>
                                  {ele?.value}
                                  {index < array.length - 1 ? ", " : ""}
                                </span>
                              ))}
                              )
                            </span>
                          )}
                        </td>
                        <td>{ele?.date}</td>
                        <td>{ele?.Quantiy}</td>
                        <td>₹ {ele?.sales?.toLocaleString()}</td>
                        <td>₹ {ele?.income?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </>
  );
};

export default SellerSalesReport;
