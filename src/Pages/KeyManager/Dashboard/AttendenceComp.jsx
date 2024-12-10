import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { Toaster } from "react-hot-toast";
import { attendenceList } from "../../../API/api";
import {
  calculateTimeDifference,
  formateDateTimeUsingMomentTimezoneAsiaKolkata,
  getDayOfWeek,
  splitDateTime,
} from "../../../common/DateFormat";
import "../Seller/listStyle.css";

export default function AttendenceComp() {
  const [attendenceadata, setAttendencedata] = useState();
  const [loading, setLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("auth"))?.userId;

  const getAttendenceList = async (userId) => {
    const response = await attendenceList(userId);
    console.log(response, "getAttendenceList");
    const dataWithUniqueIds = response?.data?.data?.map((item, index) => ({
      ...item,
      id: index + 1,
    }));
    setAttendencedata(dataWithUniqueIds);
    setLoading(false);
  };

  useEffect(() => {
    getAttendenceList(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
        <div className="productList mt-2 p-4">
          <Container>
            <Row className="justify-content-md-center">
              <Col md="auto">
                <h3>Attendance Report</h3>
              </Col>
            </Row>
            <Row className="justify-content-md-center">
              <Col>
                <div
                  style={{
                    maxHeight: "500px",
                    overflow: "auto",
                  }}
                >
                  <table
                    style={{
                      width: "100%",

                      borderCollapse: "collapse",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#007BFF",
                          color: "#fff",
                          textAlign: "center",
                          fontSize: "16px",
                        }}
                      >
                        <th
                          style={{ padding: "12px", border: "1px solid #ddd" }}
                        >
                          ID
                        </th>
                        <th
                          style={{ padding: "12px", border: "1px solid #ddd" }}
                        >
                          Day
                        </th>
                        <th
                          style={{ padding: "12px", border: "1px solid #ddd" }}
                        >
                          Login Date Time
                        </th>
                        <th
                          style={{ padding: "12px", border: "1px solid #ddd" }}
                        >
                          Login Location
                        </th>
                        <th
                          style={{ padding: "12px", border: "1px solid #ddd" }}
                        >
                          Logout Date Time
                        </th>
                        <th
                          style={{ padding: "12px", border: "1px solid #ddd" }}
                        >
                          Logout Location
                        </th>
                        <th
                          style={{ padding: "12px", border: "1px solid #ddd" }}
                        >
                          Work Log
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendenceadata?.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            style={{
                              textAlign: "center",
                              padding: "20px",
                              fontStyle: "italic",
                              color: "#888",
                            }}
                          >
                            No Data Found
                          </td>
                        </tr>
                      ) : (
                        attendenceadata?.map((row) => (
                          <tr
                            key={row.id}
                            style={{
                              textAlign: "center",
                              borderBottom: "1px solid #ddd",
                              transition: "background-color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#f1f1f1";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#fff";
                            }}
                          >
                            <td
                              style={{
                                padding: "12px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {row.id}
                            </td>
                            <td
                              style={{
                                padding: "12px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {row.log_in_time && (
                                <span className="loglocation">
                                  {getDayOfWeek(
                                    splitDateTime(row.log_in_time)?.date
                                  )}
                                </span>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "12px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {row.log_in_time && (
                                <span className="loginT">
                                  {formateDateTimeUsingMomentTimezoneAsiaKolkata(
                                    row.log_in_time
                                  )}
                                </span>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "12px",
                                border: "1px solid #ddd",
                              }}
                            >
                              <span className="loglocation">
                                {row.log_in_loc?.location},{" "}
                                {row.log_in_loc?.city}, {row.log_in_loc?.state}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "12px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {row.log_out_time && (
                                <span className="logoutT">
                                  {formateDateTimeUsingMomentTimezoneAsiaKolkata(
                                    row.log_out_time
                                  )}
                                </span>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "12px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {row.log_out_time && (
                                <span className="loglocation">
                                  {row.log_out_loc?.location},{" "}
                                  {row.log_out_loc?.city},{" "}
                                  {row.log_out_loc?.state}
                                </span>
                              )}
                            </td>
                            <td
                              style={{
                                padding: "12px",
                                border: "1px solid #ddd",
                              }}
                            >
                              {row.log_out_time && (
                                <span className="duraT">
                                  {calculateTimeDifference(
                                    row.log_out_time,
                                    row.log_in_time
                                  )}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Col>
            </Row>
          </Container>
          <Toaster position="top-right" />
        </div>
      )}
    </>
  );
}
