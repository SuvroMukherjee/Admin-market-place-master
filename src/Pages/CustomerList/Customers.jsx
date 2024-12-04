import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { allCustomersList } from "../../API/api";

const Customers = () => {
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const filters = {
        page: page,
        limit: 10,
      };
      const res = await allCustomersList(filters);
      setFilterData(res?.data?.data?.CustomerData);
      setTotalPages(res?.data?.data?.paginate?.totalPages);
      setTotalCount(res?.data?.data?.paginate?.total);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentPage(1); // Trigger a reset to page 1
  };

  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected + 1; // Convert 0-based index to 1-based
    setCurrentPage(newPage); // Update the current page
  };

  return (
    <div className="productList mt-2 p-4">
      <Container className="mt-2 mb-4">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h3>Customers List</h3>
          </Col>
        </Row>
      </Container>
      <div style={{ height: 1000, overflowY: "auto" }}>
        <div className="d-flex justify-content-center mt-2 mb-4 gap-4">
          <Button variant="dark" size="sm" onClick={handleReset}>
            Reset & Refresh
          </Button>
          <Button variant="dark" size="sm">
            {totalCount} Customers
          </Button>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-end mt-2 mb-4">
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              containerClassName="pagination"
              activeClassName="active"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              previousClassName="page-item"
              nextClassName="page-item"
              previousLinkClassName="page-link"
              nextLinkClassName="page-link"
              forcePage={currentPage - 1} // Force the current page for proper sync
            />
          </div>
        )}

        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Phone Verified</th>
              <th>Email Verified</th>
              <th>Joined with Zoofi</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              filterData?.length > 0 &&
              filterData?.map((row, index) => (
                <tr key={row.id}>
                  <td>{(currentPage - 1) * 10 + (index + 1)}</td>{" "}
                  {/* Correct indexing */}
                  <td>{row?.name}</td>
                  <td>{row?.email}</td>
                  <td className="orderPrice">{row?.phone_no}</td>
                  <td
                    className={`${
                      row?.isPhoneVerified ? "text-success fw-bold" : ""
                    }`}
                  >
                    {row?.isPhoneVerified ? "Yes" : "No"}
                  </td>
                  <td
                    className={`${
                      row?.isEmailVerified ? "text-success fw-bold" : ""
                    }`}
                  >
                    {row?.isEmailVerified ? "Yes" : "No"}
                  </td>
                  <td>{moment(row?.createdAt).format("DD-MM-YYYY")}</td>
                </tr>
              ))}
            {!loading && filterData?.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center">
                  No Customers Found
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={8} className="text-center font-weight-bold">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;
